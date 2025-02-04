"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _expoImage = require("expo-image");
var _utils = require("./utils");
var _expoVideo = require("expo-video");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); } // Utility functions to calculate pinch/zoom, swipe distances, etc.
// import { ResizeMode, Video } from "expo-av";

/**
 * Constants used to control zoom, swipe, tap time intervals, etc.
 */
var INITIAL_SCALE = 1;
var LONG_PRESS_TIME = 800;
var DOUBLE_CLICK_INTERVAL = 250; // Max gap between two taps to register as double-click
var CLICK_DISTANCE = 10; // Max movement to still consider an action as a "click"
var DRAG_DISMISS_THRESHOLD = 150;
var INITIAL_ZOOM_DISTANCE = -1;

/**
 * Basic React Native styles for the image container.
 */
var styles = _reactNative.StyleSheet.create({
  image: {
    width: "100%",
    height: "100%"
  }
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

var ImageArea = function ImageArea(_ref) {
  var renderToHardwareTextureAndroid = _ref.renderToHardwareTextureAndroid,
    videoSrc = _ref.videoSrc,
    windowWidth = _ref.windowWidth,
    windowHeight = _ref.windowHeight,
    imgSrc = _ref.imgSrc,
    swipeToDismiss = _ref.swipeToDismiss,
    isAnimated = _ref.isAnimated,
    animationDuration = _ref.animationDuration,
    animatedOpacity = _ref.animatedOpacity,
    animatedScale = _ref.animatedScale,
    animatedPosition = _ref.animatedPosition,
    animatedImagePosition = _ref.animatedImagePosition,
    animatedImageWidth = _ref.animatedImageWidth,
    animatedImageHeight = _ref.animatedImageHeight,
    isModalOpen = _ref.isModalOpen,
    onClose = _ref.onClose;
  /**
   * Internal Refs
   * Store data about the current zoom level, image offset, touch positions, etc.
   * These remain stable between re-renders of the component.
   */
  var _scale = (0, _react.useRef)(INITIAL_SCALE);
  var _position = (0, _react.useRef)({
    x: 0,
    y: 0
  });
  var _lastPosition = (0, _react.useRef)({
    x: 0,
    y: 0
  });
  var _centerPosition = (0, _react.useRef)({
    x: 0,
    y: 0
  });
  var _zoomCurrentDistance = (0, _react.useRef)(INITIAL_ZOOM_DISTANCE);
  var _zoomLastDistance = (0, _react.useRef)(INITIAL_ZOOM_DISTANCE);

  // For handling single/double click and long press.
  var _lastClickTime = (0, _react.useRef)(0);
  var _isDoubleClick = (0, _react.useRef)(false);
  var _isLongPress = (0, _react.useRef)(false);
  var _singleTapTimeout = (0, _react.useRef)(undefined);
  var _longPressTimeout = (0, _react.useRef)(undefined);

  /**
   * Utility to clear any pending long press timeouts.
   */
  var clearLongPressTimeout = function clearLongPressTimeout() {
    if (_longPressTimeout.current) {
      clearTimeout(_longPressTimeout.current);
      _longPressTimeout.current = undefined;
    }
  };

  /**
   * Utility to clear any single-tap timeouts (used for distinguishing single taps from double taps).
   */
  var clearSingleTapTimeout = function clearSingleTapTimeout() {
    if (_singleTapTimeout.current) {
      clearTimeout(_singleTapTimeout.current);
      _singleTapTimeout.current = undefined;
    }
  };

  /**
   * Updates the image’s position during a standard pan gesture (single touch).
   * Also adjusts background opacity if swipe-to-dismiss is enabled.
   */
  var moveImageToGesture = function moveImageToGesture(gestureState) {
    clearLongPressTimeout();
    var dx = gestureState.dx,
      dy = gestureState.dy;
    var newDistance = (0, _utils.getDistanceFromLastPosition)(_lastPosition.current, {
      dx: dx,
      dy: dy
    });
    // Keep track of cumulative movement.
    _lastPosition.current = {
      x: dx,
      y: dy
    };
    var scale = _scale.current;
    _position.current = (0, _utils.getImagePositionFromDistanceInScale)(scale, _position.current,
    // eslint-disable-next-line prettier/prettier
    newDistance);
    animatedPosition.setValue(_position.current);

    // If swiping to dismiss, fade out the background as user drags up/down.
    var opacity = (0, _utils.getOpacityFromSwipe)({
      swipeToDismiss: swipeToDismiss,
      scale: scale,
      dy: dy,
      windowHeight: windowHeight
    });
    animatedOpacity.setValue(opacity);
  };

  /**
   * Handles pinch-to-zoom gestures (two touches).
   * We measure the distance between touches, update the scale, and adjust the image position.
   */
  var pinchZoom = function pinchZoom(event) {
    clearLongPressTimeout();
    _zoomCurrentDistance.current = (0, _utils.getDistanceBetweenTouches)(event.nativeEvent.changedTouches[0],
    // eslint-disable-next-line prettier/prettier
    event.nativeEvent.changedTouches[1]);

    // If we already have a recorded distance, calculate the delta and update the zoom.
    if (_zoomLastDistance.current !== INITIAL_ZOOM_DISTANCE) {
      var distanceDiff = (_zoomCurrentDistance.current - _zoomLastDistance.current) / 200;
      var zoom = (0, _utils.getZoomFromDistance)(_scale.current, distanceDiff);

      // Update the global `_scale` ref and the Animated scale value.
      _scale.current = zoom;
      animatedScale.setValue(_scale.current);

      // Calculate the new offset based on pinch location.
      _position.current = (0, _utils.getPositionFromDistanceInScale)({
        currentPosition: _position.current,
        centerDiff: _centerPosition.current,
        distanceDiff: distanceDiff,
        zoom: zoom
      });
      animatedPosition.setValue(_position.current);
    }
    _zoomLastDistance.current = _zoomCurrentDistance.current;
  };

  /**
   * Animate the image to a specified position.
   */
  var animateToPosition = function animateToPosition(position) {
    _position.current = position;
    _reactNative.Animated.timing(animatedPosition, {
      toValue: _position.current,
      duration: animationDuration,
      useNativeDriver: false
    }).start();
  };

  /**
   * Animate to a specified scale factor.
   */
  var animateToScale = function animateToScale(scale) {
    _scale.current = scale;
    _reactNative.Animated.timing(animatedScale, {
      toValue: _scale.current,
      duration: animationDuration,
      useNativeDriver: false
    }).start();
  };

  /**
   * Handles logic upon releasing the pan gesture. Determines
   * whether to reset position/scale, dismiss modal, etc.
   */
  var handlePanResponderReleaseResolve = function handlePanResponderReleaseResolve(changedTouchesCount) {
    // 1. If the image is smaller than its original size, reset to center.
    if (_scale.current < INITIAL_SCALE) {
      animateToPosition({
        x: 0,
        y: 0
      });
      return;
    }

    // 2. If the image is larger than its original size, ensure it's within boundaries.
    if (_scale.current > INITIAL_SCALE) {
      var position = (0, _utils.getMaxPosition)(_scale.current, _position.current, {
        width: windowWidth,
        height: windowHeight
      });
      animateToPosition(position);
      return;
    }

    // 3. If swipe-to-dismiss is active and user swiped beyond threshold, close.
    if (swipeToDismiss && changedTouchesCount === 1 && Math.abs(_position.current.y) > DRAG_DISMISS_THRESHOLD) {
      onClose();
      return;
    }

    // 4. If none of the above, reset position to center and restore background opacity.
    animateToPosition({
      x: 0,
      y: 0
    });
    _reactNative.Animated.timing(animatedOpacity, {
      toValue: _utils.VISIBLE_OPACITY,
      duration: animationDuration,
      useNativeDriver: false
    }).start();
  };

  /**
   * Called when a gesture starts (finger touches down).
   * We reset stored positions, prepare for pinch or double-tap, etc.
   */
  var handlePanResponderGrant = function handlePanResponderGrant(event) {
    // If another animation is in progress, ignore gestures.
    if (isAnimated.current) return;
    _lastPosition.current = {
      x: 0,
      y: 0
    };
    _zoomLastDistance.current = INITIAL_ZOOM_DISTANCE;
    _isDoubleClick.current = false;
    _isLongPress.current = false;
    clearSingleTapTimeout();
    clearLongPressTimeout();

    // Set timeout to detect a long press
    _longPressTimeout.current = setTimeout(function () {
      _isLongPress.current = true;
    }, LONG_PRESS_TIME);

    // If there are two touches, compute the center for pinch-zoom calculations.
    if (event.nativeEvent.changedTouches.length > 1) {
      _centerPosition.current = (0, _utils.getCenterPositionBetweenTouches)(event.nativeEvent.changedTouches[0], event.nativeEvent.changedTouches[1],
      // eslint-disable-next-line prettier/prettier
      {
        width: windowWidth,
        height: windowHeight
      });
    }

    // Handle double-tap logic (if there's only one touch).
    if (event.nativeEvent.changedTouches.length <= 1) {
      var now = new Date().getTime();
      if (now - _lastClickTime.current < DOUBLE_CLICK_INTERVAL) {
        // Double-click detected
        _lastClickTime.current = 0;
        _isDoubleClick.current = true;
        var _getZoomAndPositionFr = (0, _utils.getZoomAndPositionFromDoubleTap)(_scale.current, event.nativeEvent.changedTouches[0],
          // eslint-disable-next-line prettier/prettier
          {
            width: windowWidth,
            height: windowHeight
          }),
          scale = _getZoomAndPositionFr.scale,
          position = _getZoomAndPositionFr.position;
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
  var handlePanResponderMove = function handlePanResponderMove(event, gestureState) {
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
  var handlePanResponderRelease = function handlePanResponderRelease(event, gestureState) {
    clearLongPressTimeout();
    if (_isDoubleClick.current || _isLongPress.current || isAnimated.current) {
      return;
    }

    // Determine if the finger moved a significant distance or just a click
    var moveDistance = Math.sqrt(
    // eslint-disable-next-line prettier/prettier
    gestureState.dx * gestureState.dx + gestureState.dy * gestureState.dy);

    // Single tap but not double-tap => do nothing or could handle a single tap action here
    if (event.nativeEvent.changedTouches.length === 1 && moveDistance < CLICK_DISTANCE) {
      _singleTapTimeout.current = setTimeout(function () {
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
  var _imagePanResponder = _reactNative.PanResponder.create({
    onStartShouldSetPanResponder: function onStartShouldSetPanResponder() {
      return true;
    },
    onPanResponderTerminationRequest: function onPanResponderTerminationRequest() {
      return false;
    },
    onPanResponderGrant: handlePanResponderGrant,
    onPanResponderMove: handlePanResponderMove,
    onPanResponderRelease: handlePanResponderRelease
  });
  var player = (0, _expoVideo.useVideoPlayer)(videoSrc, function (player) {
    player.play();
  });
  return /*#__PURE__*/_react["default"].createElement(_reactNative.View, _extends({
    style: {
      overflow: "hidden",
      flex: 1
    }
  }, _imagePanResponder.panHandlers), /*#__PURE__*/_react["default"].createElement(_reactNative.Animated.View, {
    style: {
      transform: [{
        scale: animatedScale
      }, {
        translateX: animatedPosition.x
      }, {
        translateY: _reactNative.Platform.OS === "ios" ? animatedPosition.y : _reactNative.Animated.subtract(animatedPosition.y, 50)
      }],
      left: animatedImagePosition.x,
      top: animatedImagePosition.y,
      width: animatedImageWidth,
      height: animatedImageHeight
    }
    // renderToHardwareTextureAndroid={true}
  }, !videoSrc ? /*#__PURE__*/_react["default"].createElement(_expoImage.Image, {
    style: styles.image,
    source: imgSrc,
    contentFit: "contain"
  }) : /*#__PURE__*/_react["default"].createElement(_expoVideo.VideoView, {
    style: styles.image,
    player: player,
    nativeControls: true,
    contentFit: "fill"
  })));
};
var _default = exports["default"] = ImageArea;