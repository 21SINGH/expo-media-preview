"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OriginMedia = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _expoImage = require("expo-image");
var _expoVideo = require("expo-video");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var OriginMedia = exports.OriginMedia = function OriginMedia(_ref) {
  var source = _ref.source,
    _ref$isVideo = _ref.isVideo,
    isVideo = _ref$isVideo === void 0 ? false : _ref$isVideo,
    videoPlaceholder = _ref.videoPlaceholder,
    imageOpacity = _ref.imageOpacity,
    disabled = _ref.disabled,
    style = _ref.style,
    onDialogOpen = _ref.onDialogOpen;
  var handleOpen = function handleOpen() {
    if (disabled) {
      return;
    }
    onDialogOpen();
  };
  if (isVideo && videoPlaceholder === undefined) {
    var player = (0, _expoVideo.useVideoPlayer)(source, function (player) {});
    return /*#__PURE__*/_react["default"].createElement(_reactNative.Animated.View, {
      style: [{
        opacity: imageOpacity
      }]
    }, /*#__PURE__*/_react["default"].createElement(_reactNative.TouchableOpacity, {
      activeOpacity: 1,
      style: {
        alignSelf: "baseline"
      },
      onPress: handleOpen
    }, /*#__PURE__*/_react["default"].createElement(_expoVideo.VideoView, {
      style: style,
      player: player,
      nativeControls: false,
      contentFit: "fill"
    })));
  } else return /*#__PURE__*/_react["default"].createElement(_reactNative.Animated.View, {
    style: [{
      opacity: imageOpacity
    }]
  }, /*#__PURE__*/_react["default"].createElement(_reactNative.TouchableOpacity, {
    activeOpacity: 1,
    style: {
      alignSelf: "baseline"
    },
    onPress: handleOpen
  }, /*#__PURE__*/_react["default"].createElement(_expoImage.Image, {
    source: isVideo ? videoPlaceholder : source,
    style: style,
    contentFit: "cover"
  })));
};