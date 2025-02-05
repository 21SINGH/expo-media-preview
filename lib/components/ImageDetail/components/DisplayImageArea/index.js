"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DisplayImageArea = void 0;
var _reactNative = require("react-native");
var styles = _reactNative.StyleSheet.create({
  clippingArea: {
    position: 'absolute'
  }
});
var DisplayImageArea = exports.DisplayImageArea = function DisplayImageArea(_ref) {
  var _StatusBar$currentHei, _parentLayout$x, _parentLayout$y, _parentLayout$width, _parentLayout$height;
  var animatedFrame = _ref.animatedFrame,
    parentLayout = _ref.parentLayout,
    isTranslucent = _ref.isTranslucent,
    renderToHardwareTextureAndroid = _ref.renderToHardwareTextureAndroid,
    children = _ref.children;
  // When parentLayout is not passed in the props,
  // clipping is not needed, so clipping area should be full screen.
  var _Dimensions$get = _reactNative.Dimensions.get('window'),
    windowWidth = _Dimensions$get.width,
    windowHeight = _Dimensions$get.height;

  // On Android, the status bar height should be added to the top position of the clipping area.
  var statusBarHeight = isTranslucent && _reactNative.Platform.OS === 'android' ? (_StatusBar$currentHei = _reactNative.StatusBar.currentHeight) !== null && _StatusBar$currentHei !== void 0 ? _StatusBar$currentHei : 0 : 0;
  var animationStyle = {
    left: animatedFrame.interpolate({
      inputRange: [0, 1],
      outputRange: [(_parentLayout$x = parentLayout === null || parentLayout === void 0 ? void 0 : parentLayout.x) !== null && _parentLayout$x !== void 0 ? _parentLayout$x : 0, 0]
    }),
    top: animatedFrame.interpolate({
      inputRange: [0, 1],
      outputRange: [((_parentLayout$y = parentLayout === null || parentLayout === void 0 ? void 0 : parentLayout.y) !== null && _parentLayout$y !== void 0 ? _parentLayout$y : 0) + statusBarHeight, 0]
    }),
    width: animatedFrame.interpolate({
      inputRange: [0, 1],
      outputRange: [(_parentLayout$width = parentLayout === null || parentLayout === void 0 ? void 0 : parentLayout.width) !== null && _parentLayout$width !== void 0 ? _parentLayout$width : windowWidth, windowWidth]
    }),
    height: animatedFrame.interpolate({
      inputRange: [0, 1],
      outputRange: [(_parentLayout$height = parentLayout === null || parentLayout === void 0 ? void 0 : parentLayout.height) !== null && _parentLayout$height !== void 0 ? _parentLayout$height : windowHeight, windowHeight]
    })
  };
  return /*#__PURE__*/React.createElement(_reactNative.Animated.View, {
    style: [styles.clippingArea, animationStyle],
    renderToHardwareTextureAndroid: renderToHardwareTextureAndroid
  }, children);
};