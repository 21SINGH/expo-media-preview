"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _Background = _interopRequireDefault(require("./Background"));
var _DisplayImageArea = _interopRequireDefault(require("./DisplayImageArea"));
var _ImageArea = _interopRequireDefault(require("./ImageArea"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
var INITIAL_SCALE = 1;
var ImageDetailsComponent = /*#__PURE__*/(0, _react.forwardRef)(function ImageDetailsComponent(_ref,
// eslint-disable-next-line prettier/prettier
ref) {
  var imgSrc = _ref.imgSrc,
    videoSrc = _ref.videoSrc,
    isVideo = _ref.isVideo,
    isOpen = _ref.isOpen,
    origin = _ref.origin,
    animationDuration = _ref.animationDuration,
    onClose = _ref.onClose;
  // Obtain the current screen size to animate the image to full screen.
  var _Dimensions$get = _reactNative.Dimensions.get("window"),
    windowWidth = _Dimensions$get.width,
    windowHeight = _Dimensions$get.height;

  // De-structure the original image's position and dimensions.
  var originX = origin.x,
    originY = origin.y,
    originImageWidth = origin.width,
    originImageHeight = origin.height;
  var originImagePosition = {
    x: originX,
    y: originY
  };

  // Animated values controlling the zoom/transition states.
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

  // A ref to track the ongoing animation, preventing multiple triggers.
  var isAnimated = (0, _react.useRef)(true);

  /**
   * Closes the modal by running parallel animations that revert
   * the image back to its initial size and position, then hides the modal.
   */
  var handleClose = function handleClose() {
    isAnimated.current = true;
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

  /**
   * Opens the modal by animating the image from its original size and position
   * to fill the entire screen.
   */
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
      });
    });
  };

  // Whenever the component mounts or updates (due to new refs/values), we trigger the open animation.
  (0, _react.useEffect)(function () {
    handleOpen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animatedOpacity, animatedImagePosition, animatedImageWidth, animatedImageHeight, animatedFrame]);

  /**
   * useImperativeHandle allows the parent to trigger the close animation
   * through a ref, e.g., ref.current.close().
   */
  (0, _react.useImperativeHandle)(ref, function () {
    return {
      close: handleClose
    };
  });
  return /*#__PURE__*/_react["default"].createElement(_reactNative.Modal
  // hardwareAccelerated
  , {
    visible: isOpen,
    transparent: true,
    onRequestClose: handleClose,
    supportedOrientations: ["portrait", "portrait-upside-down", "landscape", "landscape-left", "landscape-right"]
  }, /*#__PURE__*/_react["default"].createElement(_Background["default"], {
    animatedOpacity: animatedOpacity
  }), /*#__PURE__*/_react["default"].createElement(_DisplayImageArea["default"], {
    animatedFrame: animatedFrame
  }, /*#__PURE__*/_react["default"].createElement(_ImageArea["default"], {
    videoSrc: videoSrc,
    renderToHardwareTextureAndroid: true,
    isAnimated: isAnimated,
    animatedOpacity: animatedOpacity,
    animatedScale: animatedScale,
    animatedPosition: animatedPosition,
    animatedImagePosition: animatedImagePosition,
    animatedImageWidth: animatedImageWidth,
    animatedImageHeight: animatedImageHeight,
    windowWidth: windowWidth,
    windowHeight: windowHeight,
    swipeToDismiss: true,
    imgSrc: imgSrc,
    animationDuration: animationDuration,
    isModalOpen: isOpen,
    onClose: handleClose
  })));
  // eslint-disable-next-line prettier/prettier
});
var _default = exports["default"] = ImageDetailsComponent;