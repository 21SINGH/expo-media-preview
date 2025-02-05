"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Footer = void 0;
var _reactNative = require("react-native");
var styles = _reactNative.StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    backgroundColor: 'transparent'
  }
});
var Footer = exports.Footer = function Footer(_ref) {
  var renderToHardwareTextureAndroid = _ref.renderToHardwareTextureAndroid,
    animatedOpacity = _ref.animatedOpacity,
    renderFooter = _ref.renderFooter,
    onClose = _ref.onClose;
  if (typeof renderFooter !== 'function') {
    return;
  }
  var animationStyle = {
    opacity: animatedOpacity
  };
  return /*#__PURE__*/React.createElement(_reactNative.Animated.View, {
    renderToHardwareTextureAndroid: renderToHardwareTextureAndroid,
    style: [styles['footer'], animationStyle]
  }, renderFooter(onClose));
};