"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Header = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var styles = _reactNative.StyleSheet.create({
  closeButton: {
    width: 40,
    height: 40
  },
  label: {
    fontSize: 35,
    color: "white",
    lineHeight: 40,
    textAlign: "center",
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowRadius: 1.5,
    shadowColor: "black",
    shadowOpacity: 0.8
  },
  safeArea: {
    flexDirection: "row",
    // Aligns children in a row
    justifyContent: "flex-end",
    // Aligns the button to the right
    right: 20
  }
});
var Header = exports.Header = function Header(_ref) {
  var animatedOpacity = _ref.animatedOpacity,
    onClose = _ref.onClose;
  var animationStyle = {
    opacity: animatedOpacity
  };
  return /*#__PURE__*/_react["default"].createElement(_reactNative.Animated.View, {
    // renderToHardwareTextureAndroid={true}
    style: animationStyle
  }, /*#__PURE__*/_react["default"].createElement(_reactNative.SafeAreaView, {
    style: styles.safeArea
  }, /*#__PURE__*/_react["default"].createElement(_reactNative.TouchableOpacity, {
    style: styles.closeButton,
    onPress: onClose
  }, /*#__PURE__*/_react["default"].createElement(_reactNative.Text, {
    style: styles.label
  }, "\xD7"))));
};