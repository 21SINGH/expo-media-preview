"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _expoBlur = require("expo-blur");
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var styles = _reactNative.StyleSheet.create({
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%"
  }
});
var Background = function Background(_ref) {
  var animatedOpacity = _ref.animatedOpacity;
  return /*#__PURE__*/_react["default"].createElement(_reactNative.Animated.View, {
    style: [styles.background, {
      opacity: animatedOpacity
    }]
  }, /*#__PURE__*/_react["default"].createElement(_expoBlur.BlurView, {
    style: {
      flex: 1
    },
    intensity: 100,
    tint: "systemChromeMaterialDark",
    experimentalBlurMethod: "dimezisBlurView"
  }));
};
var _default = exports["default"] = Background;