"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _expoImage = require("expo-image");
var _gesture = require("../utils/gesture");
var _expoVideo = require("expo-video");
var _reactNativeSafeAreaContext = require("react-native-safe-area-context");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
var INITIAL_SCALE = 1;
var LONG_PRESS_TIME = 800;
var DOUBLE_CLICK_INTERVAL = 250;
var CLICK_DISTANCE = 10;
var DRAG_DISMISS_THRESHOLD = 150;
var INITIAL_ZOOM_DISTANCE = -1;
var styles = _reactNative.StyleSheet.create({
  image: {
    width: "100%",
    height: "100%"
  }
});
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
  var insets = (0, _reactNativeSafeAreaContext.useSafeAreaInsets)();
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
  var _lastClickTime = (0, _react.useRef)(0);
  var _isDoubleClick = (0, _react.useRef)(false);
  var _isLongPress = (0, _react.useRef)(false);
  var _singleTapTimeout = (0, _react.useRef)(undefined);
  var _longPressTimeout = (0, _react.useRef)(undefined);
  var clearLongPressTimeout = function clearLongPressTimeout() {
    if (_longPressTimeout.current) {
      clearTimeout(_longPressTimeout.current);
      _longPressTimeout.current = undefined;
    }
  };
  var clearSingleTapTimeout = function clearSingleTapTimeout() {
    if (_singleTapTimeout.current) {
      clearTimeout(_singleTapTimeout.current);
      _singleTapTimeout.current = undefined;
    }
  };
  var moveImageToGesture = function moveImageToGesture(gestureState) {
    clearLongPressTimeout();
    var dx = gestureState.dx,
      dy = gestureState.dy;
    var newDistance = (0, _gesture.getDistanceFromLastPosition)(_lastPosition.current, {
      dx: dx,
      dy: dy
    });
    _lastPosition.current = {
      x: dx,
      y: dy
    };
    var scale = _scale.current;
    _position.current = (0, _gesture.getImagePositionFromDistanceInScale)(scale, _position.current,
    // eslint-disable-next-line prettier/prettier
    newDistance);
    animatedPosition.setValue(_position.current);
    var opacity = (0, _gesture.getOpacityFromSwipe)({
      swipeToDismiss: swipeToDismiss,
      scale: scale,
      dy: dy,
      windowHeight: windowHeight
    });
    animatedOpacity.setValue(opacity);
  };
  var pinchZoom = function pinchZoom(event) {
    clearLongPressTimeout();
    _zoomCurrentDistance.current = (0, _gesture.getDistanceBetweenTouches)(event.nativeEvent.changedTouches[0],
    // eslint-disable-next-line prettier/prettier
    event.nativeEvent.changedTouches[1]);
    if (_zoomLastDistance.current !== INITIAL_ZOOM_DISTANCE) {
      var distanceDiff = (_zoomCurrentDistance.current - _zoomLastDistance.current) / 200;
      var zoom = (0, _gesture.getZoomFromDistance)(_scale.current, distanceDiff);
      _scale.current = zoom;
      animatedScale.setValue(_scale.current);
      _position.current = (0, _gesture.getPositionFromDistanceInScale)({
        currentPosition: _position.current,
        centerDiff: _centerPosition.current,
        distanceDiff: distanceDiff,
        zoom: zoom
      });
      animatedPosition.setValue(_position.current);
    }
    _zoomLastDistance.current = _zoomCurrentDistance.current;
  };
  var animateToPosition = function animateToPosition(position) {
    _position.current = position;
    _reactNative.Animated.timing(animatedPosition, {
      toValue: _position.current,
      duration: animationDuration,
      useNativeDriver: false
    }).start();
  };
  var animateToScale = function animateToScale(scale) {
    _scale.current = scale;
    _reactNative.Animated.timing(animatedScale, {
      toValue: _scale.current,
      duration: animationDuration,
      useNativeDriver: false
    }).start();
  };
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
      var position = (0, _gesture.getMaxPosition)(_scale.current, _position.current, {
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
      toValue: _gesture.VISIBLE_OPACITY,
      duration: animationDuration,
      useNativeDriver: false
    }).start();
  };
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
      _centerPosition.current = (0, _gesture.getCenterPositionBetweenTouches)(event.nativeEvent.changedTouches[0], event.nativeEvent.changedTouches[1],
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
        var _getZoomAndPositionFr = (0, _gesture.getZoomAndPositionFromDoubleTap)(_scale.current, event.nativeEvent.changedTouches[0],
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
      height: animatedImageHeight,
      paddingVertical: insets.top,
      alignItems: 'center',
      justifyContent: 'center'
    }
    // renderToHardwareTextureAndroid={true}
  }, !videoSrc ? /*#__PURE__*/_react["default"].createElement(_expoImage.Image, {
    style: [styles.image],
    source: imgSrc,
    contentFit: "contain"
  }) : /*#__PURE__*/_react["default"].createElement(_expoVideo.VideoView, {
    style: [styles.image],
    player: player,
    nativeControls: true
  })));
};
var _default = exports["default"] = ImageArea;