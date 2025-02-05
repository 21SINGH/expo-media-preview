"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ImageDetailComponent = void 0;
var _react = require("react");
var _reactNative = require("react-native");
var _components = require("./components");
var INITIAL_SCALE = 1;
var ImageDetailComponent = exports.ImageDetailComponent = /*#__PURE__*/(0, _react.forwardRef)(function ImageDetailComponent(_ref, ref) {
  var _parentLayout$x, _parentLayout$y;
  var renderToHardwareTextureAndroid = _ref.renderToHardwareTextureAndroid,
    _ref$isTranslucent = _ref.isTranslucent,
    isTranslucent = _ref$isTranslucent === void 0 ? false : _ref$isTranslucent,
    isOpen = _ref.isOpen,
    origin = _ref.origin,
    source = _ref.source,
    _ref$resizeMode = _ref.resizeMode,
    resizeMode = _ref$resizeMode === void 0 ? 'contain' : _ref$resizeMode,
    _ref$backgroundColor = _ref.backgroundColor,
    backgroundColor = _ref$backgroundColor === void 0 ? '#000000' : _ref$backgroundColor,
    swipeToDismiss = _ref.swipeToDismiss,
    _ref$hideCloseButton = _ref.hideCloseButton,
    hideCloseButton = _ref$hideCloseButton === void 0 ? false : _ref$hideCloseButton,
    imageStyle = _ref.imageStyle,
    parentLayout = _ref.parentLayout,
    animationDuration = _ref.animationDuration,
    renderHeader = _ref.renderHeader,
    renderFooter = _ref.renderFooter,
    renderImageComponent = _ref.renderImageComponent,
    onTap = _ref.onTap,
    onDoubleTap = _ref.onDoubleTap,
    onLongPress = _ref.onLongPress,
    didOpen = _ref.didOpen,
    onMove = _ref.onMove,
    responderRelease = _ref.responderRelease,
    willClose = _ref.willClose,
    onClose = _ref.onClose;
  var _Dimensions$get = _reactNative.Dimensions.get('window'),
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
  return /*#__PURE__*/React.createElement(_reactNative.Modal, {
    hardwareAccelerated: true,
    visible: isOpen,
    transparent: true,
    statusBarTranslucent: isTranslucent,
    onRequestClose: handleClose,
    supportedOrientations: ['portrait', 'portrait-upside-down', 'landscape', 'landscape-left', 'landscape-right']
  }, /*#__PURE__*/React.createElement(_components.Background, {
    animatedOpacity: animatedOpacity,
    backgroundColor: backgroundColor,
    renderToHardwareTextureAndroid: renderToHardwareTextureAndroid
  }), /*#__PURE__*/React.createElement(_components.DisplayImageArea, {
    animatedFrame: animatedFrame,
    parentLayout: parentLayout,
    isTranslucent: isTranslucent,
    renderToHardwareTextureAndroid: renderToHardwareTextureAndroid
  }, /*#__PURE__*/React.createElement(_components.ImageArea, {
    renderToHardwareTextureAndroid: renderToHardwareTextureAndroid,
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
    resizeMode: resizeMode,
    imageStyle: imageStyle,
    animationDuration: animationDuration,
    isModalOpen: isOpen,
    renderImageComponent: renderImageComponent,
    onClose: handleClose,
    onMove: onMove,
    onTap: onTap,
    onDoubleTap: onDoubleTap,
    onLongPress: onLongPress,
    responderRelease: responderRelease
  })), /*#__PURE__*/React.createElement(_components.Header, {
    isTranslucent: isTranslucent,
    hideCloseButton: hideCloseButton,
    renderToHardwareTextureAndroid: renderToHardwareTextureAndroid,
    animatedOpacity: animatedOpacity,
    renderHeader: renderHeader,
    onClose: handleClose
  }), /*#__PURE__*/React.createElement(_components.Footer, {
    renderToHardwareTextureAndroid: renderToHardwareTextureAndroid,
    animatedOpacity: animatedOpacity,
    renderFooter: renderFooter,
    onClose: handleClose
  }));
});