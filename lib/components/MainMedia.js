"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _expoImage = require("expo-image");
var _expoVideo = require("expo-video");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var MainMedia = function MainMedia(_ref) {
  var imgSrc = _ref.imgSrc,
    videoSrc = _ref.videoSrc,
    videoPlaceholderSrc = _ref.videoPlaceholderSrc,
    imageOpacity = _ref.imageOpacity,
    style = _ref.style,
    onDialogOpen = _ref.onDialogOpen;
  if (imgSrc || videoPlaceholderSrc) {
    return /*#__PURE__*/_react["default"].createElement(_reactNative.Animated.View, {
      style: [{
        opacity: imageOpacity,
        flex: 1
      }]
    }, /*#__PURE__*/_react["default"].createElement(_reactNative.TouchableOpacity, {
      activeOpacity: 1,
      onPress: onDialogOpen
    }, /*#__PURE__*/_react["default"].createElement(_expoImage.Image, {
      source: imgSrc || videoPlaceholderSrc,
      style: [{
        borderColor: "red",
        borderWidth: 10
      }, style],
      contentFit: "cover"
    })));
  } else {
    var player = (0, _expoVideo.useVideoPlayer)(videoSrc, function (player) {});
    return /*#__PURE__*/_react["default"].createElement(_reactNative.Animated.View, {
      style: [{
        opacity: imageOpacity,
        flex: 1
      }]
    }, /*#__PURE__*/_react["default"].createElement(_reactNative.TouchableOpacity, {
      activeOpacity: 1,
      onPress: onDialogOpen
    }, /*#__PURE__*/_react["default"].createElement(_expoVideo.VideoView, {
      style: style,
      player: player,
      nativeControls: false,
      contentFit: "fill"
    })));
  }
};
var _default = exports["default"] = MainMedia;