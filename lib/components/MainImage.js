"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _expoImage = require("expo-image");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var MainImage = function MainImage(_ref) {
  var source = _ref.source,
    imageOpacity = _ref.imageOpacity,
    style = _ref.style,
    onDialogOpen = _ref.onDialogOpen;
  return /*#__PURE__*/_react["default"].createElement(_reactNative.Animated.View, {
    style: [{
      opacity: imageOpacity,
      flex: 1
    }]
  }, /*#__PURE__*/_react["default"].createElement(_reactNative.TouchableOpacity, {
    activeOpacity: 1,
    onPress: onDialogOpen
  }, /*#__PURE__*/_react["default"].createElement(_expoImage.Image, {
    source: source,
    style: [{
      borderColor: "red",
      borderWidth: 10
    }, style],
    contentFit: "cover"
  })));
};
var _default = exports["default"] = MainImage;