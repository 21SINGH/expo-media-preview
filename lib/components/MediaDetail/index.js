"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MediaDetailComponent = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _components = require("./components");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
var INITIAL_SCALE = 1;
var MediaDetailComponent = exports.MediaDetailComponent = /*#__PURE__*/(0, _react.forwardRef)(function MediaDetailComponent(_ref, ref) {
  var _parentLayout$x, _parentLayout$y;
  var isOpen = _ref.isOpen,
    _ref$isVideo = _ref.isVideo,
    isVideo = _ref$isVideo === void 0 ? false : _ref$isVideo,
    origin = _ref.origin,
    source = _ref.source,
    swipeToDismiss = _ref.swipeToDismiss,
    imageStyle = _ref.imageStyle,
    parentLayout = _ref.parentLayout,
    animationDuration = _ref.animationDuration,
    onTap = _ref.onTap,
    onDoubleTap = _ref.onDoubleTap,
    onLongPress = _ref.onLongPress,
    didOpen = _ref.didOpen,
    onMove = _ref.onMove,
    responderRelease = _ref.responderRelease,
    willClose = _ref.willClose,
    onClose = _ref.onClose;
  var _Dimensions$get = _reactNative.Dimensions.get("window"),
    windowWidth = _Dimensions$get.width,
    windowHeight = _Dimensions$get.height;
  var originImagePosition = {
    x: origin.x - ((_parentLayout$x = parentLayout === null || parentLayout === void 0 ? void 0 : parentLayout.x) !== null && _parentLayout$x !== void 0 ? _parentLayout$x : 0) / 2,
    y: origin.y - ((_parentLayout$y = parentLayout === null || parentLayout === void 0 ? void 0 : parentLayout.y) !== null && _parentLayout$y !== void 0 ? _parentLayout$y : 0)
  };
  var originImageWidth = origin.width,
    originImageHeight = origin.height;
  var animatedScale = new _reactNative.Animated.Value(INITIAL_SCALE);
  var animatedPosition = new _reactNative.Animated.ValueXY({
    x: 0,
    y: 0
  });
  var animatedFrame = new _reactNative.Animated.Value(0);
  var animatedOpacity = new _reactNative.Animated.Value(0);
  var animatedImagePosition = new _reactNative.Animated.ValueXY(originImagePosition);
  var animatedImageWidth = new _reactNative.Animated.Value(originImageWidth);
  var animatedImageHeight = new _reactNative.Animated.Value(originImageHeight);
  var isAnimated = (0, _react.useRef)(true);
  var handleClose = function handleClose() {
    isAnimated.current = true;
    willClose === null || willClose === void 0 || willClose();
    setTimeout(function () {
      _reactNative.Animated.parallel([_reactNative.Animated.timing(animatedFrame, {
        toValue: 0,
        useNativeDriver: false,
        duration: animationDuration
      }), _reactNative.Animated.timing(animatedScale, {
        toValue: INITIAL_SCALE,
        useNativeDriver: false,
        duration: animationDuration
      }), _reactNative.Animated.timing(animatedPosition, {
        toValue: 0,
        useNativeDriver: false,
        duration: animationDuration
      }), _reactNative.Animated.timing(animatedOpacity, {
        toValue: 0,
        useNativeDriver: false,
        duration: animationDuration
      }), _reactNative.Animated.timing(animatedImagePosition, {
        toValue: originImagePosition,
        useNativeDriver: false,
        duration: animationDuration * 2
      }), _reactNative.Animated.timing(animatedImageWidth, {
        toValue: originImageWidth,
        useNativeDriver: false,
        duration: animationDuration * 2
      }), _reactNative.Animated.timing(animatedImageHeight, {
        toValue: originImageHeight,
        useNativeDriver: false,
        duration: animationDuration * 2
      })]).start(function () {
        onClose();
        isAnimated.current = false;
      });
    });
  };
  var handleOpen = function handleOpen() {
    isAnimated.current = true;
    setTimeout(function () {
      _reactNative.Animated.parallel([_reactNative.Animated.timing(animatedFrame, {
        toValue: 1,
        useNativeDriver: false,
        duration: animationDuration
      }), _reactNative.Animated.timing(animatedOpacity, {
        toValue: 1,
        useNativeDriver: false,
        duration: animationDuration
      }), _reactNative.Animated.timing(animatedImagePosition, {
        toValue: {
          x: 0,
          y: 0
        },
        useNativeDriver: false,
        duration: animationDuration * 2
      }), _reactNative.Animated.timing(animatedImageWidth, {
        toValue: windowWidth,
        useNativeDriver: false,
        duration: animationDuration * 2
      }), _reactNative.Animated.timing(animatedImageHeight, {
        toValue: windowHeight,
        useNativeDriver: false,
        duration: animationDuration * 2
      })]).start(function () {
        isAnimated.current = false;
        if (isOpen) {
          didOpen === null || didOpen === void 0 || didOpen();
        }
      });
    });
  };
  (0, _react.useEffect)(function () {
    handleOpen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animatedOpacity, animatedImagePosition, animatedImageWidth, animatedImageHeight, animatedFrame]);
  (0, _react.useImperativeHandle)(ref, function () {
    return {
      close: handleClose
    };
  });
  return /*#__PURE__*/_react["default"].createElement(_reactNative.Modal, {
    hardwareAccelerated: true,
    visible: isOpen,
    transparent: true,
    onRequestClose: handleClose,
    supportedOrientations: ["portrait", "portrait-upside-down", "landscape", "landscape-left", "landscape-right"]
  }, /*#__PURE__*/_react["default"].createElement(_components.Background, {
    animatedOpacity: animatedOpacity
  }), /*#__PURE__*/_react["default"].createElement(_components.DisplayMediaArea, {
    animatedFrame: animatedFrame
  }, /*#__PURE__*/_react["default"].createElement(_components.MediaArea, {
    isVideo: isVideo,
    isAnimated: isAnimated,
    animatedOpacity: animatedOpacity,
    animatedScale: animatedScale,
    animatedPosition: animatedPosition,
    animatedImagePosition: animatedImagePosition,
    animatedImageWidth: animatedImageWidth,
    animatedImageHeight: animatedImageHeight,
    windowWidth: windowWidth,
    windowHeight: windowHeight,
    swipeToDismiss: swipeToDismiss,
    source: source,
    imageStyle: imageStyle,
    animationDuration: animationDuration,
    onClose: handleClose,
    onMove: onMove,
    onTap: onTap,
    onDoubleTap: onDoubleTap,
    onLongPress: onLongPress,
    responderRelease: responderRelease
  })));
});