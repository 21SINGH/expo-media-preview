"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Header = void 0;
var _reactNative = require("react-native");
var styles = _reactNative.StyleSheet.create({
  closeButton: {
    width: 40,
    height: 40
  },
  label: {
    fontSize: 35,
    color: 'white',
    lineHeight: 40,
    textAlign: 'center',
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowRadius: 1.5,
    shadowColor: 'black',
    shadowOpacity: 0.8
  }
});
var Header = exports.Header = function Header(_ref) {
  var isTranslucent = _ref.isTranslucent,
    hideCloseButton = _ref.hideCloseButton,
    renderToHardwareTextureAndroid = _ref.renderToHardwareTextureAndroid,
    animatedOpacity = _ref.animatedOpacity,
    renderHeader = _ref.renderHeader,
    onClose = _ref.onClose;
  if (hideCloseButton) return;
  var animationStyle = {
    opacity: animatedOpacity
  };
  var marginTop = isTranslucent ? _reactNative.StatusBar.currentHeight : 0;
  return /*#__PURE__*/React.createElement(_reactNative.Animated.View, {
    renderToHardwareTextureAndroid: renderToHardwareTextureAndroid,
    style: animationStyle
  }, typeof renderHeader === 'function' ? renderHeader(onClose) : /*#__PURE__*/React.createElement(_reactNative.SafeAreaView, {
    style: {
      marginTop: marginTop
    }
  }, /*#__PURE__*/React.createElement(_reactNative.TouchableOpacity, {
    style: styles.closeButton,
    onPress: onClose
  }, /*#__PURE__*/React.createElement(_reactNative.Text, {
    style: styles.label
  }, "\xD7"))));
};