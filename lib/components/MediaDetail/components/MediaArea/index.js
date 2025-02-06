"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MediaArea = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _expoImage = require("expo-image");
var _utils = require("./utils");
var _expoVideo = require("expo-video");
var _expo = require("expo");
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
var MediaArea = exports.MediaArea = function MediaArea(_ref) {
  var _ref$isVideo = _ref.isVideo,
    isVideo = _ref$isVideo === void 0 ? false : _ref$isVideo,
    windowWidth = _ref.windowWidth,
    windowHeight = _ref.windowHeight,
    source = _ref.source,
    imageStyle = _ref.imageStyle,
    swipeToDismiss = _ref.swipeToDismiss,
    isAnimated = _ref.isAnimated,
    animationDuration = _ref.animationDuration,
    animatedOpacity = _ref.animatedOpacity,
    animatedScale = _ref.animatedScale,
    animatedPosition = _ref.animatedPosition,
    animatedImagePosition = _ref.animatedImagePosition,
    animatedImageWidth = _ref.animatedImageWidth,
    animatedImageHeight = _ref.animatedImageHeight,
    onClose = _ref.onClose,
    onDoubleTap = _ref.onDoubleTap,
    onLongPress = _ref.onLongPress,
    onTap = _ref.onTap,
    onMove = _ref.onMove,
    responderRelease = _ref.responderRelease;
  var _scale = (0, _react.useRef)(INITIAL_SCALE);
  var height = _reactNative.StatusBar.currentHeight || 0;
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
  var moveMediaToGesture = function moveMediaToGesture(gestureState) {
    clearLongPressTimeout();
    var dx = gestureState.dx,
      dy = gestureState.dy;
    var newDistance = (0, _utils.getDistanceFromLastPosition)(_lastPosition.current, {
      dx: dx,
      dy: dy
    });
    _lastPosition.current = {
      x: dx,
      y: dy
    };
    var scale = _scale.current;
    _position.current = (0, _utils.getImagePositionFromDistanceInScale)(scale, _position.current, newDistance);
    animatedPosition.setValue(_position.current);
    var opacity = (0, _utils.getOpacityFromSwipe)({
      swipeToDismiss: swipeToDismiss,
      scale: scale,
      dy: dy,
      windowHeight: windowHeight
    });
    animatedOpacity.setValue(opacity);
  };
  var pinchZoom = function pinchZoom(event) {
    clearLongPressTimeout();
    // Pinch to zoom
    _zoomCurrentDistance.current = (0, _utils.getDistanceBetweenTouches)(event.nativeEvent.changedTouches[0], event.nativeEvent.changedTouches[1]);
    if (_zoomLastDistance.current !== INITIAL_ZOOM_DISTANCE) {
      // Update zoom
      var distanceDiff = (_zoomCurrentDistance.current - _zoomLastDistance.current) / 200;
      var zoom = (0, _utils.getZoomFromDistance)(_scale.current, distanceDiff);
      _scale.current = zoom;
      animatedScale.setValue(_scale.current);

      // Update image position
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
  var triggerOnMove = function triggerOnMove(type) {
    var _position$current = _position.current,
      positionX = _position$current.x,
      positionY = _position$current.y;
    onMove === null || onMove === void 0 || onMove({
      type: type,
      positionX: positionX,
      positionY: positionY,
      scale: _scale.current,
      zoomCurrentDistance: _zoomCurrentDistance.current
    });
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
    // 1. When image is zoomed out and finger is released,
    // Move image position to the center of the screen.
    if (_scale.current < INITIAL_SCALE) {
      animateToPosition({
        x: 0,
        y: 0
      });
      return;
    }

    // 2. When image is zoomed in and finger is released,
    // Move image position
    if (_scale.current > INITIAL_SCALE) {
      var _position2 = (0, _utils.getMaxPosition)(_scale.current, _position.current, {
        width: windowWidth,
        height: windowHeight
      });
      animateToPosition(_position2);
      return;
    }

    // 3. When image is normal and finger is released with swipe up or down,
    // Close image detail.
    if (swipeToDismiss && changedTouchesCount === 1 && Math.abs(_position.current.y) > DRAG_DISMISS_THRESHOLD) {
      onClose();
      return;
    }

    // 4. When finger is released in original size of image,
    // image should move to the center of the screen.
    animateToPosition({
      x: 0,
      y: 0
    });

    // And background should return to its normal opacity.
    _reactNative.Animated.timing(animatedOpacity, {
      toValue: _utils.VISIBLE_OPACITY,
      duration: animationDuration,
      useNativeDriver: false
    }).start();
    triggerOnMove('onPanResponderRelease');
  };
  var handlePanResponderGrant = function handlePanResponderGrant(event) {
    if (isAnimated.current) {
      return;
    }
    _lastPosition.current = {
      x: 0,
      y: 0
    };
    _zoomLastDistance.current = INITIAL_ZOOM_DISTANCE;
    _isDoubleClick.current = false;
    _isLongPress.current = false;

    // Clear single click timeout
    clearSingleTapTimeout();
    // Clear long press timeout
    clearLongPressTimeout();
    _longPressTimeout.current = setTimeout(function () {
      _isLongPress.current = true;
      onLongPress === null || onLongPress === void 0 || onLongPress();
    }, LONG_PRESS_TIME);

    // Calculate center diff for pinch to zoom
    if (event.nativeEvent.changedTouches.length > 1) {
      _centerPosition.current = (0, _utils.getCenterPositionBetweenTouches)(event.nativeEvent.changedTouches[0], event.nativeEvent.changedTouches[1], {
        width: windowWidth,
        height: windowHeight
      });
    }
    if (event.nativeEvent.changedTouches.length <= 1) {
      // Double tap to zoom
      if (new Date().getTime() - _lastClickTime.current < DOUBLE_CLICK_INTERVAL) {
        _lastClickTime.current = 0;
        _isDoubleClick.current = true;
        var _getZoomAndPositionFr = (0, _utils.getZoomAndPositionFromDoubleTap)(_scale.current, event.nativeEvent.changedTouches[0], {
            width: windowWidth,
            height: windowHeight
          }),
          _scale2 = _getZoomAndPositionFr.scale,
          _position3 = _getZoomAndPositionFr.position;
        animateToPosition(_position3);
        animateToScale(_scale2);
        triggerOnMove("centerOn");
        onDoubleTap === null || onDoubleTap === void 0 || onDoubleTap();
      } else {
        _lastClickTime.current = new Date().getTime();
      }
    }
  };

  // Trigger when finger is moving
  var handlePanResponderMove = function handlePanResponderMove(event, gestureState) {
    if (_isDoubleClick.current || isAnimated.current) {
      return;
    }

    // Single tap to move image
    if (event.nativeEvent.changedTouches.length <= 1) {
      moveMediaToGesture(gestureState);
    } else {
      pinchZoom(event);
    }
    triggerOnMove("onPanResponderMove");
  };

  // Trigger when finger is released
  var handlePanResponderRelease = function handlePanResponderRelease(event, gestureState) {
    clearLongPressTimeout();
    if (_isDoubleClick.current || _isLongPress.current || isAnimated.current) {
      return;
    }
    var moveDistance = Math.sqrt(gestureState.dx * gestureState.dx + gestureState.dy * gestureState.dy);
    // Single tap
    if (event.nativeEvent.changedTouches.length === 1 && moveDistance < CLICK_DISTANCE) {
      _singleTapTimeout.current = setTimeout(function () {
        onTap === null || onTap === void 0 || onTap(event.nativeEvent);
      }, DOUBLE_CLICK_INTERVAL);
    } else {
      // Finger is moved and released
      handlePanResponderReleaseResolve(event.nativeEvent.changedTouches.length);
      responderRelease === null || responderRelease === void 0 || responderRelease(gestureState.vx, _scale.current);
    }
  };
  var _mediaPanResponder = _reactNative.PanResponder.create({
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
  var content;
  if (!isVideo) {
    content = /*#__PURE__*/_react["default"].createElement(_expoImage.Image, {
      source: source,
      style: [imageStyle, styles.image],
      contentFit: "contain"
    });
  } else {
    var player = (0, _expoVideo.useVideoPlayer)(source, function (player) {
      player.play();
    });
    var _useEvent = (0, _expo.useEvent)(player, "statusChange", {
        status: player.status
      }),
      status = _useEvent.status,
      error = _useEvent.error;
    content = status === "loading" ? /*#__PURE__*/_react["default"].createElement(_reactNative.ActivityIndicator, null) : /*#__PURE__*/_react["default"].createElement(_expoVideo.VideoView, {
      style: styles.image,
      player: player,
      nativeControls: true
    });
  }
  return /*#__PURE__*/_react["default"].createElement(_reactNative.View, _extends({
    style: {
      overflow: "hidden",
      flex: 1
    }
  }, _mediaPanResponder.panHandlers), /*#__PURE__*/_react["default"].createElement(_reactNative.Animated.View, {
    style: {
      transform: [{
        scale: animatedScale
      }, {
        translateX: animatedPosition.x
      }, {
        translateY: _reactNative.Animated.subtract(animatedPosition.y, height)
      }],
      left: animatedImagePosition.x,
      top: animatedImagePosition.y,
      width: animatedImageWidth,
      height: animatedImageHeight,
      alignItems: "center",
      justifyContent: "center"
    }
  }, content));
};