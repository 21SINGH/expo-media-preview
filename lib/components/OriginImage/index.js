"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OriginImage = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _expoImage = require("expo-image");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var OriginImage = exports.OriginImage = function OriginImage(_ref) {
  var source = _ref.source,
    resizeMode = _ref.resizeMode,
    imageOpacity = _ref.imageOpacity,
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
  return /*#__PURE__*/_react["default"].createElement(_reactNative.Animated.View, {
    style: [{
      opacity: imageOpacity
    }]
  }, /*#__PURE__*/_react["default"].createElement(_reactNative.TouchableOpacity, {
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
  }) : /*#__PURE__*/_react["default"].createElement(_expoImage.Image, {
    source: source,
    style: style,
    contentFit: "cover"
  })));
};