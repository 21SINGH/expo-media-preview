"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DisplayMediaArea = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var styles = _reactNative.StyleSheet.create({
  clippingArea: {
    position: "absolute"
  }
});
var DisplayMediaArea = exports.DisplayMediaArea = function DisplayMediaArea(_ref) {
  var animatedFrame = _ref.animatedFrame,
    children = _ref.children;
  // When parentLayout is not passed in the props,
  // clipping is not needed, so clipping area should be full screen.
  var _Dimensions$get = _reactNative.Dimensions.get("window"),
    windowWidth = _Dimensions$get.width,
    windowHeight = _Dimensions$get.height;

  // On Android, the status bar height should be added to the top position of the clipping area.

  var animationStyle = {
    left: animatedFrame.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0]
    }),
    top: animatedFrame.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0]
    }),
    width: animatedFrame.interpolate({
      inputRange: [0, 1],
      outputRange: [windowWidth, windowWidth]
    }),
    height: animatedFrame.interpolate({
      inputRange: [0, 1],
      outputRange: [windowHeight, windowHeight]
    })
  };
  return /*#__PURE__*/_react["default"].createElement(_reactNative.Animated.View, {
    style: [styles.clippingArea, animationStyle]
  }, children);
};