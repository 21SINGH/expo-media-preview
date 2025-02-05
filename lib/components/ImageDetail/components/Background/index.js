"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Background = void 0;
var _reactNative = require("react-native");
var styles = _reactNative.StyleSheet.create({
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%'
  }
});
var Background = exports.Background = function Background(_ref) {
  var animatedOpacity = _ref.animatedOpacity,
    backgroundColor = _ref.backgroundColor,
    renderToHardwareTextureAndroid = _ref.renderToHardwareTextureAndroid;
  return /*#__PURE__*/React.createElement(_reactNative.Animated.View, {
    renderToHardwareTextureAndroid: renderToHardwareTextureAndroid,
    style: [styles.background, {
      backgroundColor: backgroundColor
    }, {
      opacity: animatedOpacity
    }]
  });
};