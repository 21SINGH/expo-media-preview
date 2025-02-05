"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DisplayImageArea = void 0;
var _reactNative = require("react-native");
var styles = _reactNative.StyleSheet.create({
  clippingArea: {
    position: "absolute"
  }
});
var DisplayImageArea = exports.DisplayImageArea = function DisplayImageArea(_ref) {
  var animatedFrame = _ref.animatedFrame,
    parentLayout = _ref.parentLayout,
    isTranslucent = _ref.isTranslucent,
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
  return /*#__PURE__*/React.createElement(_reactNative.Animated.View, {
    style: [styles.clippingArea, animationStyle]
  }, children);
};