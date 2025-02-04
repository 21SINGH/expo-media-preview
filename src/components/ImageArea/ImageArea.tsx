import React, { useRef } from "react";
import type { RefObject } from "react";
import {
  Animated,
  PanResponder,
  StyleSheet,
  View,
  GestureResponderEvent,
  PanResponderGestureState,
  Platform,
} from "react-native";
import { Image as ExpoImage } from "expo-image";

// Utility functions to calculate pinch/zoom, swipe distances, etc.
import {
  getCenterPositionBetweenTouches,
  getDistanceBetweenTouches,
  getDistanceFromLastPosition,
  getImagePositionFromDistanceInScale,
  getMaxPosition,
  getOpacityFromSwipe,
  getPositionFromDistanceInScale,
  getZoomAndPositionFromDoubleTap,
  getZoomFromDistance,
  VISIBLE_OPACITY,
} from "./utils";

import type { ImageSourcePropType } from "react-native";
// import { ResizeMode, Video } from "expo-av";

/**
 * Constants used to control zoom, swipe, tap time intervals, etc.
 */
const INITIAL_SCALE = 1;
const LONG_PRESS_TIME = 800;
const DOUBLE_CLICK_INTERVAL = 250; // Max gap between two taps to register as double-click
const CLICK_DISTANCE = 10; // Max movement to still consider an action as a "click"
const DRAG_DISMISS_THRESHOLD = 150;
const INITIAL_ZOOM_DISTANCE = -1;

/**
 * Basic React Native styles for the image container.
 */
const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "100%",
  },
});

/**
 * ImageArea
 *
 * This component manages complex image gestures like:
 * - Pinch-to-zoom
 * - Double-tap to zoom in/out
 * - Panning around the zoomed image
 * - Swiping down or up to dismiss (if `swipeToDismiss` is true)
 *
 * Animated values from the parent (`ImageDetailsComponent`) are used to control
 * the image's position, size, and opacity. We also store internal states and
 * references (_scale, _position, etc.) to track gestures between re-renders.
 */
interface Props {
  readonly renderToHardwareTextureAndroid: boolean;
  readonly isVideo: boolean;
  readonly windowWidth: number;
  readonly windowHeight: number;
  readonly source;
  readonly swipeToDismiss: boolean;
  readonly isAnimated: RefObject<boolean>;
  readonly animationDuration: number;
  readonly animatedOpacity: Animated.Value;
  readonly animatedScale: Animated.Value;
  readonly animatedPosition: Animated.ValueXY;
  readonly animatedImagePosition: Animated.ValueXY;
  readonly animatedImageWidth: Animated.Value;
  readonly animatedImageHeight: Animated.Value;
  readonly isModalOpen: boolean;
  onClose(): void;
}

const ImageArea: React.FC<Props> = ({
  renderToHardwareTextureAndroid,
  isVideo,
  windowWidth,
  windowHeight,
  source,
  swipeToDismiss,
  isAnimated,
  animationDuration,
  animatedOpacity,
  animatedScale,
  animatedPosition,
  animatedImagePosition,
  animatedImageWidth,
  animatedImageHeight,
  isModalOpen,
  onClose,
}: Props) => {
  /**
   * Internal Refs
   * Store data about the current zoom level, image offset, touch positions, etc.
   * These remain stable between re-renders of the component.
   */
  const _scale = useRef(INITIAL_SCALE);
  const _position = useRef({ x: 0, y: 0 });
  const _lastPosition = useRef({ x: 0, y: 0 });
  const _centerPosition = useRef({ x: 0, y: 0 });
  const _zoomCurrentDistance = useRef(INITIAL_ZOOM_DISTANCE);
  const _zoomLastDistance = useRef(INITIAL_ZOOM_DISTANCE);

  // For handling single/double click and long press.
  const _lastClickTime = useRef(0);
  const _isDoubleClick = useRef(false);
  const _isLongPress = useRef(false);
  const _singleTapTimeout = useRef<NodeJS.Timeout | undefined>(undefined);
  const _longPressTimeout = useRef<NodeJS.Timeout | undefined>(undefined);

  /**
   * Utility to clear any pending long press timeouts.
   */
  const clearLongPressTimeout = () => {
    if (_longPressTimeout.current) {
      clearTimeout(_longPressTimeout.current);
      _longPressTimeout.current = undefined;
    }
  };

  /**
   * Utility to clear any single-tap timeouts (used for distinguishing single taps from double taps).
   */
  const clearSingleTapTimeout = () => {
    if (_singleTapTimeout.current) {
      clearTimeout(_singleTapTimeout.current);
      _singleTapTimeout.current = undefined;
    }
  };

  /**
   * Updates the image’s position during a standard pan gesture (single touch).
   * Also adjusts background opacity if swipe-to-dismiss is enabled.
   */
  const moveImageToGesture = (gestureState: PanResponderGestureState) => {
    clearLongPressTimeout();
    const { dx, dy } = gestureState;
    const newDistance = getDistanceFromLastPosition(_lastPosition.current, {
      dx,
      dy,
    });
    // Keep track of cumulative movement.
    _lastPosition.current = { x: dx, y: dy };

    const scale = _scale.current;
    _position.current = getImagePositionFromDistanceInScale(
      scale,
      _position.current,
      // eslint-disable-next-line prettier/prettier
      newDistance
    );
    animatedPosition.setValue(_position.current);

    // If swiping to dismiss, fade out the background as user drags up/down.
    const opacity = getOpacityFromSwipe({
      swipeToDismiss,
      scale,
      dy,
      windowHeight,
    });
    animatedOpacity.setValue(opacity);
  };

  /**
   * Handles pinch-to-zoom gestures (two touches).
   * We measure the distance between touches, update the scale, and adjust the image position.
   */
  const pinchZoom = (event: GestureResponderEvent) => {
    clearLongPressTimeout();

    _zoomCurrentDistance.current = getDistanceBetweenTouches(
      event.nativeEvent.changedTouches[0],
      // eslint-disable-next-line prettier/prettier
      event.nativeEvent.changedTouches[1]
    );

    // If we already have a recorded distance, calculate the delta and update the zoom.
    if (_zoomLastDistance.current !== INITIAL_ZOOM_DISTANCE) {
      const distanceDiff =
        (_zoomCurrentDistance.current - _zoomLastDistance.current) / 200;
      const zoom = getZoomFromDistance(_scale.current, distanceDiff);

      // Update the global `_scale` ref and the Animated scale value.
      _scale.current = zoom;
      animatedScale.setValue(_scale.current);

      // Calculate the new offset based on pinch location.
      _position.current = getPositionFromDistanceInScale({
        currentPosition: _position.current,
        centerDiff: _centerPosition.current,
        distanceDiff,
        zoom,
      });
      animatedPosition.setValue(_position.current);
    }
    _zoomLastDistance.current = _zoomCurrentDistance.current;
  };

  /**
   * Animate the image to a specified position.
   */
  const animateToPosition = (position: { x: number; y: number }) => {
    _position.current = position;
    Animated.timing(animatedPosition, {
      toValue: _position.current,
      duration: animationDuration,
      useNativeDriver: false,
    }).start();
  };

  /**
   * Animate to a specified scale factor.
   */
  const animateToScale = (scale: number) => {
    _scale.current = scale;
    Animated.timing(animatedScale, {
      toValue: _scale.current,
      duration: animationDuration,
      useNativeDriver: false,
    }).start();
  };

  /**
   * Handles logic upon releasing the pan gesture. Determines
   * whether to reset position/scale, dismiss modal, etc.
   */
  const handlePanResponderReleaseResolve = (
    // eslint-disable-next-line prettier/prettier
    changedTouchesCount: number
  ): void => {
    // 1. If the image is smaller than its original size, reset to center.
    if (_scale.current < INITIAL_SCALE) {
      animateToPosition({ x: 0, y: 0 });
      return;
    }

    // 2. If the image is larger than its original size, ensure it's within boundaries.
    if (_scale.current > INITIAL_SCALE) {
      const position = getMaxPosition(_scale.current, _position.current, {
        width: windowWidth,
        height: windowHeight,
      });
      animateToPosition(position);
      return;
    }

    // 3. If swipe-to-dismiss is active and user swiped beyond threshold, close.
    if (
      swipeToDismiss &&
      changedTouchesCount === 1 &&
      Math.abs(_position.current.y) > DRAG_DISMISS_THRESHOLD
    ) {
      onClose();
      return;
    }

    // 4. If none of the above, reset position to center and restore background opacity.
    animateToPosition({ x: 0, y: 0 });
    Animated.timing(animatedOpacity, {
      toValue: VISIBLE_OPACITY,
      duration: animationDuration,
      useNativeDriver: false,
    }).start();
  };

  /**
   * Called when a gesture starts (finger touches down).
   * We reset stored positions, prepare for pinch or double-tap, etc.
   */
  const handlePanResponderGrant = (event: GestureResponderEvent) => {
    // If another animation is in progress, ignore gestures.
    if (isAnimated.current) return;

    _lastPosition.current = { x: 0, y: 0 };
    _zoomLastDistance.current = INITIAL_ZOOM_DISTANCE;
    _isDoubleClick.current = false;
    _isLongPress.current = false;

    clearSingleTapTimeout();
    clearLongPressTimeout();

    // Set timeout to detect a long press
    _longPressTimeout.current = setTimeout(() => {
      _isLongPress.current = true;
    }, LONG_PRESS_TIME);

    // If there are two touches, compute the center for pinch-zoom calculations.
    if (event.nativeEvent.changedTouches.length > 1) {
      _centerPosition.current = getCenterPositionBetweenTouches(
        event.nativeEvent.changedTouches[0],
        event.nativeEvent.changedTouches[1],
        // eslint-disable-next-line prettier/prettier
        { width: windowWidth, height: windowHeight }
      );
    }

    // Handle double-tap logic (if there's only one touch).
    if (event.nativeEvent.changedTouches.length <= 1) {
      const now = new Date().getTime();
      if (now - _lastClickTime.current < DOUBLE_CLICK_INTERVAL) {
        // Double-click detected
        _lastClickTime.current = 0;
        _isDoubleClick.current = true;
        const { scale, position } = getZoomAndPositionFromDoubleTap(
          _scale.current,
          event.nativeEvent.changedTouches[0],
          // eslint-disable-next-line prettier/prettier
          { width: windowWidth, height: windowHeight }
        );
        animateToPosition(position);
        animateToScale(scale);
      } else {
        // Single click (could become double if another click happens soon)
        _lastClickTime.current = now;
      }
    }
  };

  /**
   * Called when the user moves their finger. We either move/drag (single touch)
   * or pinch-zoom (multiple touches).
   */
  const handlePanResponderMove = (
    event: GestureResponderEvent,
    // eslint-disable-next-line prettier/prettier
    gestureState: PanResponderGestureState
  ) => {
    if (_isDoubleClick.current || isAnimated.current) return;

    if (event.nativeEvent.changedTouches.length <= 1) {
      // Move/drag the image
      moveImageToGesture(gestureState);
    } else {
      // Pinch-zoom
      pinchZoom(event);
    }
  };

  /**
   * Called when the user lifts their finger off the screen.
   * We determine whether to reset, dismiss, or do nothing further.
   */
  const handlePanResponderRelease = (
    event: GestureResponderEvent,
    // eslint-disable-next-line prettier/prettier
    gestureState: PanResponderGestureState
  ) => {
    clearLongPressTimeout();
    if (_isDoubleClick.current || _isLongPress.current || isAnimated.current) {
      return;
    }

    // Determine if the finger moved a significant distance or just a click
    const moveDistance = Math.sqrt(
      // eslint-disable-next-line prettier/prettier
      gestureState.dx * gestureState.dx + gestureState.dy * gestureState.dy
    );

    // Single tap but not double-tap => do nothing or could handle a single tap action here
    if (
      event.nativeEvent.changedTouches.length === 1 &&
      moveDistance < CLICK_DISTANCE
    ) {
      _singleTapTimeout.current = setTimeout(() => {
        // If needed, you can add single-tap functionality here.
      }, DOUBLE_CLICK_INTERVAL);
    } else {
      // If it’s not just a single tap, figure out if we should snap or dismiss.
      handlePanResponderReleaseResolve(event.nativeEvent.changedTouches.length);
    }
  };

  /**
   * Create the PanResponder with all relevant callbacks to handle
   * various gestures.
   */
  const _imagePanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderTerminationRequest: () => false,
    onPanResponderGrant: handlePanResponderGrant,
    onPanResponderMove: handlePanResponderMove,
    onPanResponderRelease: handlePanResponderRelease,
  });

  return (
    <View
      style={{ overflow: "hidden", flex: 1 }}
      {..._imagePanResponder.panHandlers}
    >
      {/* 
        Animated container that transforms based on pinch, pan, and zoom gestures.
        We move/scale this container to implement all the gesture-based transformations.
      */}
      <Animated.View
        style={{
          transform: [
            {
              scale: animatedScale,
            },
            {
              translateX: animatedPosition.x,
            },
            {
              translateY:
                Platform.OS === "ios"
                  ? animatedPosition.y
                  : Animated.subtract(animatedPosition.y, 50),
            },
          ],
          left: animatedImagePosition.x,
          top: animatedImagePosition.y,
          width: animatedImageWidth,
          height: animatedImageHeight,
        }}
        // renderToHardwareTextureAndroid={true}
      >
        {/*
          The actual image, using expo-image for potential performance and caching benefits.
          `contentFit="contain"` ensures we respect the image’s aspect ratio within its container.
        */}
        {!isVideo ? (
          <ExpoImage
            style={styles.image}
            source={source}
            contentFit="contain"
          />
        ) : (
          <></>
          // <Video
          //   source={{ uri: source }}
          //   style={styles.image}
          //   shouldPlay={true}
          //   isLooping={true}
          //   resizeMode={ResizeMode.CONTAIN}
          // />
        )}
      </Animated.View>
    </View>
  );
};

export default ImageArea;
