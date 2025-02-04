"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
/**
 * DisplayImageArea
 *
 * This component is responsible for rendering a clipping area (an Animated.View) that can
 * display its children and control their position/size via animations. In this particular
 * implementation, we interpolate from `[0,1]` to the full window dimensions, effectively
 * toggling between no clipping area (full screen) and a full clipping area (still full screen).
 *
 * You could modify the output ranges to control how the clipping area changes during
 * an opening or closing transition (e.g., partial screen to full screen).
 */

var DisplayImageArea = function DisplayImageArea(_ref) {
  var animatedFrame = _ref.animatedFrame,
    children = _ref.children;
  // Get the device's width and height from Dimensions.
  var _Dimensions$get = _reactNative.Dimensions.get("window"),
    windowWidth = _Dimensions$get.width,
    windowHeight = _Dimensions$get.height;

  // If needed, adjust for the status bar height on Android or iOS here.
  // For now, the statusBarHeight is 0 in this example.
  var statusBarHeight = 0;

  // Define how we interpolate the animatedFrame to animate left, top, width, and height.
  var animationStyle = {
    left: animatedFrame.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0]
    }),
    top: animatedFrame.interpolate({
      inputRange: [0, 1],
      outputRange: [0 + statusBarHeight, 0]
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
var styles = _reactNative.StyleSheet.create({
  clippingArea: {
    position: "absolute"
  }
});
var _default = exports["default"] = DisplayImageArea;