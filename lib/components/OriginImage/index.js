"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OriginImage = void 0;
var _reactNative = require("react-native");
var OriginImage = exports.OriginImage = function OriginImage(_ref) {
  var source = _ref.source,
    resizeMode = _ref.resizeMode,
    imageOpacity = _ref.imageOpacity,
    renderToHardwareTextureAndroid = _ref.renderToHardwareTextureAndroid,
    disabled = _ref.disabled,
    style = _ref.style,
    isModalOpen = _ref.isModalOpen,
    onDialogOpen = _ref.onDialogOpen,
    onLongPressOriginImage = _ref.onLongPressOriginImage,
    renderImageComponent = _ref.renderImageComponent;
  var handleOpen = function handleOpen() {
    if (disabled) {
      return;
    }
    onDialogOpen();
  };
  return /*#__PURE__*/React.createElement(_reactNative.Animated.View, {
    renderToHardwareTextureAndroid: renderToHardwareTextureAndroid,
    style: [{
      opacity: imageOpacity
    }]
  }, /*#__PURE__*/React.createElement(_reactNative.TouchableOpacity, {
    activeOpacity: 1,
    style: {
      alignSelf: 'baseline'
    },
    onPress: handleOpen,
    onLongPress: onLongPressOriginImage
  }, typeof renderImageComponent === 'function' ? renderImageComponent({
    source: source,
    style: style,
    resizeMode: resizeMode,
    isModalOpen: isModalOpen
  }) : /*#__PURE__*/React.createElement(_reactNative.Image, {
    source: source,
    style: style,
    resizeMode: resizeMode
  })));
};