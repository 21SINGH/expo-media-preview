"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireDefault(require("react"));
var _expoImage = require("expo-image");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var ExpoMediaPreview = function ExpoMediaPreview(_ref) {
  var imgSrc = _ref.imgSrc,
    videoSrc = _ref.videoSrc,
    styles = _ref.styles;
  if (imgSrc) {
    return /*#__PURE__*/_react["default"].createElement(_expoImage.Image, {
      source: {
        uri: imgSrc
      },
      style: styles
    });
  }
  return null;
};
var _default = exports["default"] = ExpoMediaPreview;