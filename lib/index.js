"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _useOriginImageLayout2 = require("./utils/useOriginImageLayout");
var _MainMedia = _interopRequireDefault(require("./components/MainMedia"));
var _ImageDetailsComponent = _interopRequireDefault(require("./components/ImageDetailsComponent"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
var VISIBLE_OPACITY = 1;
var INVISIBLE_OPACITY = 0;
var ExpoMediaPreview = function ExpoMediaPreview(_ref) {
  var imgSrc = _ref.imgSrc,
    videoSrc = _ref.videoSrc,
    videoPlaceholderSrc = _ref.videoPlaceholderSrc,
    style = _ref.style,
    _ref$animationDuratio = _ref.animationDuration,
    animationDuration = _ref$animationDuratio === void 0 ? 100 : _ref$animationDuratio;
  var mediaRef = /*#__PURE__*/(0, _react.createRef)();
  var imageDetailRef = /*#__PURE__*/(0, _react.createRef)();
  var originImageOpacity = (0, _react.useRef)(new _reactNative.Animated.Value(VISIBLE_OPACITY)).current;
  var _useState = (0, _react.useState)(false),
    _useState2 = _slicedToArray(_useState, 2),
    isModalOpen = _useState2[0],
    setIsModalOpen = _useState2[1];

  // Custom hook to measure and store the layout of the thumbnail.
  var _useOriginImageLayout = (0, _useOriginImageLayout2.useOriginImageLayout)({
      mediaRef: mediaRef
    }),
    originImageLayout = _useOriginImageLayout.originImageLayout,
    updateOriginImageLayout = _useOriginImageLayout.updateOriginImageLayout;

  // Show the full-screen preview after measuring the thumbnail layout.
  var showModal = function showModal() {
    updateOriginImageLayout();
    setTimeout(function () {
      setIsModalOpen(true);
    });
  };

  // Close the full-screen preview.
  var hideModal = function hideModal() {
    setTimeout(function () {
      setIsModalOpen(false);
    });
  };

  // Callback for when the user closes the preview.
  var handleClose = function handleClose() {
    originImageOpacity.setValue(VISIBLE_OPACITY);
    hideModal();
  };

  // Callback for when the user opens the preview.
  var handleOpen = function handleOpen() {
    showModal();
    _reactNative.Animated.timing(originImageOpacity, {
      toValue: INVISIBLE_OPACITY,
      duration: animationDuration,
      useNativeDriver: false
    }).start();
  };
  return /*#__PURE__*/_react["default"].createElement(_reactNative.View, {
    ref: mediaRef,
    style: {
      flex: 1
    }
  }, /*#__PURE__*/_react["default"].createElement(_MainMedia["default"], {
    imgSrc: imgSrc,
    videoSrc: videoSrc,
    videoPlaceholderSrc: videoPlaceholderSrc,
    imageOpacity: originImageOpacity,
    onDialogOpen: handleOpen,
    style: style
  }), isModalOpen && /*#__PURE__*/_react["default"].createElement(_ImageDetailsComponent["default"], {
    imgSrc: imgSrc,
    videoSrc: videoSrc,
    isVideo: false,
    ref: imageDetailRef,
    isOpen: isModalOpen,
    origin: originImageLayout,
    animationDuration: animationDuration,
    onClose: handleClose
  }));
};
var _default = exports["default"] = ExpoMediaPreview;