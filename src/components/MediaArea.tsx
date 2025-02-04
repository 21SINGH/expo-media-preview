import React, { useRef, useState } from "react";
import type { RefObject } from "react";
import {
  Animated,
  PanResponder,
  StyleSheet,
  View,
  GestureResponderEvent,
  PanResponderGestureState,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Image as ExpoImage } from "expo-image";

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
} from "../utils/gesture";

import { useVideoPlayer, VideoView } from "expo-video";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEvent } from "expo";

const INITIAL_SCALE = 1;
const LONG_PRESS_TIME = 800;
const DOUBLE_CLICK_INTERVAL = 250;
const CLICK_DISTANCE = 10;
const DRAG_DISMISS_THRESHOLD = 150;
const INITIAL_ZOOM_DISTANCE = -1;

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "100%",
  },
});

interface Props {
  readonly renderToHardwareTextureAndroid: boolean;
  readonly windowWidth: number;
  readonly windowHeight: number;
  readonly imgSrc;
  readonly videoSrc;
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

const MediaArea: React.FC<Props> = ({
  renderToHardwareTextureAndroid,
  videoSrc,
  windowWidth,
  windowHeight,
  imgSrc,
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
  const insets = useSafeAreaInsets();
  const [playerStatus, setPlayerStatus] = useState();

  const _scale = useRef(INITIAL_SCALE);
  const _position = useRef({ x: 0, y: 0 });
  const _lastPosition = useRef({ x: 0, y: 0 });
  const _centerPosition = useRef({ x: 0, y: 0 });
  const _zoomCurrentDistance = useRef(INITIAL_ZOOM_DISTANCE);
  const _zoomLastDistance = useRef(INITIAL_ZOOM_DISTANCE);

  const _lastClickTime = useRef(0);
  const _isDoubleClick = useRef(false);
  const _isLongPress = useRef(false);
  const _singleTapTimeout = useRef<NodeJS.Timeout | undefined>(undefined);
  const _longPressTimeout = useRef<NodeJS.Timeout | undefined>(undefined);

  const clearLongPressTimeout = () => {
    if (_longPressTimeout.current) {
      clearTimeout(_longPressTimeout.current);
      _longPressTimeout.current = undefined;
    }
  };

  const clearSingleTapTimeout = () => {
    if (_singleTapTimeout.current) {
      clearTimeout(_singleTapTimeout.current);
      _singleTapTimeout.current = undefined;
    }
  };

  const moveImageToGesture = (gestureState: PanResponderGestureState) => {
    clearLongPressTimeout();
    const { dx, dy } = gestureState;
    const newDistance = getDistanceFromLastPosition(_lastPosition.current, {
      dx,
      dy,
    });
    _lastPosition.current = { x: dx, y: dy };

    const scale = _scale.current;
    _position.current = getImagePositionFromDistanceInScale(
      scale,
      _position.current,
      // eslint-disable-next-line prettier/prettier
      newDistance
    );
    animatedPosition.setValue(_position.current);

    const opacity = getOpacityFromSwipe({
      swipeToDismiss,
      scale,
      dy,
      windowHeight,
    });
    animatedOpacity.setValue(opacity);
  };

  const pinchZoom = (event: GestureResponderEvent) => {
    clearLongPressTimeout();

    _zoomCurrentDistance.current = getDistanceBetweenTouches(
      event.nativeEvent.changedTouches[0],
      // eslint-disable-next-line prettier/prettier
      event.nativeEvent.changedTouches[1]
    );

    if (_zoomLastDistance.current !== INITIAL_ZOOM_DISTANCE) {
      const distanceDiff =
        (_zoomCurrentDistance.current - _zoomLastDistance.current) / 200;
      const zoom = getZoomFromDistance(_scale.current, distanceDiff);

      _scale.current = zoom;
      animatedScale.setValue(_scale.current);
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

  const animateToPosition = (position: { x: number; y: number }) => {
    _position.current = position;
    Animated.timing(animatedPosition, {
      toValue: _position.current,
      duration: animationDuration,
      useNativeDriver: false,
    }).start();
  };

  const animateToScale = (scale: number) => {
    _scale.current = scale;
    Animated.timing(animatedScale, {
      toValue: _scale.current,
      duration: animationDuration,
      useNativeDriver: false,
    }).start();
  };

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

  const _imagePanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderTerminationRequest: () => false,
    onPanResponderGrant: handlePanResponderGrant,
    onPanResponderMove: handlePanResponderMove,
    onPanResponderRelease: handlePanResponderRelease,
  });

  const player = useVideoPlayer(videoSrc, (player) => {
    player.play();
  });

  const { status, error } = useEvent(player, "statusChange", {
    status: player.status,
  });

  return (
    <View
      style={{ overflow: "hidden", flex: 1 }}
      {..._imagePanResponder.panHandlers}
    >
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
          paddingVertical: insets.top,
          alignItems: "center",
          justifyContent: "center",
        }}
        // renderToHardwareTextureAndroid={true}
      >
        {!videoSrc ? (
          <ExpoImage
            style={[styles.image]}
            source={imgSrc}
            contentFit="contain"
          />
        ) : status === "loading" ? (
          <ActivityIndicator />
        ) : (
          <VideoView
            style={[styles.image]}
            player={player}
            nativeControls={true}
          />
        )}
      </Animated.View>
    </View>
  );
};

export default MediaArea;
