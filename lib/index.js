"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _components = require("./components");
var _hooks = require("./hooks");
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

/**
 * @typedef {object} Props
 * @property {ImageSourcePropType} source - Image source.
 * @property {StyleProp<ImageStyle>} [style] - Style for original image.
 * @property {ImageResizeMode} [resizeMode=contain] - Resize mode for original image.
 * @property {boolean} [isRTL=false] - Support for right-to-left layout.
 * @property {boolean} [renderToHardwareTextureAndroid=true] - (Android only) Use hardware texture for animation.
 * @property {boolean} [isTranslucent=false] - Determines whether image modal should go under the system statusbar.
 * @property {boolean} [swipeToDismiss=true] - Dismiss image modal by swiping up or down.
 * @property {boolean} [imageBackgroundColor=transparent] - Background color for original image.
 * @property {boolean} [overlayBackgroundColor=#000000] - Background color for modal image.
 * @property {boolean} [hideCloseButton=false] - Hide close button.
 * @property {boolean} modalRef - Deprecated: Ref for image modal. Use ref instead.
 * @property {boolean} [disabled=false] - Disable opening image modal.
 * @property {boolean} [modalImageStyle] - Style for modal image.
 * @property {boolean} [modalImageResizeMode=contain] - Resize mode for modal image.
 * @property {boolean} [parentLayout] - Parent component layout of ImageModal to limit displayed image modal area when closing image modal.
 * @property {number} [animationDuration=100] - Duration of animation.
 * @property {(close: () => void) => ReactNode} [renderHeader] - Render custom header component. You can close image modal by calling close function.
 * @property {(close: () => void) => ReactNode} [renderFooter] - Render custom footer component. You can close image modal by calling close function.
 * @property {(params: { source: ImageSourcePropType, style?: StyleProp<ImageStyle>, resizeMode?: ImageResizeMode }) => ReactNode} [renderImageComponent] - Render custom image component like expo-image or react-native-fast-image.
 * @property {() => void} [onLongPressOriginImage] - Callback when long press on original image.
 * @property {(eventParams: OnTap) => void} [onTap] - Callback when tap on modal image.
 * @property {() => void} [onDoubleTap] - Callback when double tap on modal image.
 * @property {() => void} [onLongPress] - Callback when long press on modal image.
 * @property {() => void} [onOpen] - Callback when image modal is opening.
 * @property {() => void} [didOpen] - Callback when image modal is opened.
 * @property {(position: OnMove) => void} [onMove] - Callback when modal image is moving.
 * @property {(vx: number, scale: number) => void} [responderRelease] - Callback when finger(s) is released on modal image.
 * @property {() => void} [willClose] - Callback when image modal is closing.
 * @property {() => void} [onClose] - Callback when image modal is closed.
 */

/**
 * ImageModal component
 * @param {Props} props - Props of ImageModal component
 * @returns {ReactNode} Image modal component
 */
var ImageModal = /*#__PURE__*/(0, _react.forwardRef)(function ImageModal(_ref, ref) {
  var source = _ref.source,
    style = _ref.style,
    _ref$resizeMode = _ref.resizeMode,
    resizeMode = _ref$resizeMode === void 0 ? 'contain' : _ref$resizeMode,
    _ref$isRTL = _ref.isRTL,
    isRTL = _ref$isRTL === void 0 ? false : _ref$isRTL,
    isTranslucent = _ref.isTranslucent,
    _ref$swipeToDismiss = _ref.swipeToDismiss,
    swipeToDismiss = _ref$swipeToDismiss === void 0 ? true : _ref$swipeToDismiss,
    _ref$imageBackgroundC = _ref.imageBackgroundColor,
    imageBackgroundColor = _ref$imageBackgroundC === void 0 ? 'transparent' : _ref$imageBackgroundC,
    overlayBackgroundColor = _ref.overlayBackgroundColor,
    hideCloseButton = _ref.hideCloseButton,
    modalRef = _ref.modalRef,
    _ref$disabled = _ref.disabled,
    disabled = _ref$disabled === void 0 ? false : _ref$disabled,
    modalImageStyle = _ref.modalImageStyle,
    modalImageResizeMode = _ref.modalImageResizeMode,
    parentLayout = _ref.parentLayout,
    _ref$animationDuratio = _ref.animationDuration,
    animationDuration = _ref$animationDuratio === void 0 ? 100 : _ref$animationDuratio,
    onLongPressOriginImage = _ref.onLongPressOriginImage,
    renderHeader = _ref.renderHeader,
    renderFooter = _ref.renderFooter,
    renderImageComponent = _ref.renderImageComponent,
    onTap = _ref.onTap,
    onDoubleTap = _ref.onDoubleTap,
    onLongPress = _ref.onLongPress,
    onOpen = _ref.onOpen,
    didOpen = _ref.didOpen,
    onMove = _ref.onMove,
    responderRelease = _ref.responderRelease,
    willClose = _ref.willClose,
    onClose = _ref.onClose;
  var imageRef = /*#__PURE__*/(0, _react.createRef)();
  var imageDetailRef = modalRef !== null && modalRef !== void 0 ? modalRef : /*#__PURE__*/(0, _react.createRef)();
  // If don't use useRef, animation will not work
  var originImageOpacity = (0, _react.useRef)(new _reactNative.Animated.Value(VISIBLE_OPACITY)).current;
  var _useState = (0, _react.useState)(false),
    _useState2 = _slicedToArray(_useState, 2),
    isModalOpen = _useState2[0],
    setIsModalOpen = _useState2[1];
  var _useOriginImageLayout = (0, _hooks.useOriginImageLayout)({
      imageRef: imageRef,
      isRTL: isRTL
    }),
    originImageLayout = _useOriginImageLayout.originImageLayout,
    updateOriginImageLayout = _useOriginImageLayout.updateOriginImageLayout;
  var showModal = function showModal() {
    onOpen === null || onOpen === void 0 || onOpen();
    // Before opening modal, updating origin image position is required.
    updateOriginImageLayout();
    setTimeout(function () {
      setIsModalOpen(true);
    });
  };
  var hideModal = function hideModal() {
    setTimeout(function () {
      setIsModalOpen(false);
      onClose === null || onClose === void 0 || onClose();
    });
  };
  var handleOpen = function handleOpen() {
    showModal();
    _reactNative.Animated.timing(originImageOpacity, {
      toValue: INVISIBLE_OPACITY,
      duration: animationDuration,
      useNativeDriver: false
    }).start();
  };
  var handleClose = function handleClose() {
    originImageOpacity.setValue(VISIBLE_OPACITY);
    hideModal();
  };
  (0, _react.useImperativeHandle)(ref, function () {
    return {
      isOpen: isModalOpen,
      open: handleOpen,
      close: function close() {
        imageDetailRef.current.close();
      }
    };
  });
  return /*#__PURE__*/_react["default"].createElement(_reactNative.View, {
    ref: imageRef,
    style: [{
      alignSelf: 'baseline',
      backgroundColor: imageBackgroundColor
    }]
  }, /*#__PURE__*/_react["default"].createElement(_components.OriginImage, {
    source: source,
    resizeMode: resizeMode,
    imageOpacity: originImageOpacity,
    disabled: disabled,
    style: style,
    isModalOpen: isModalOpen,
    onDialogOpen: handleOpen,
    onLongPressOriginImage: onLongPressOriginImage,
    renderImageComponent: renderImageComponent
  }), isModalOpen && /*#__PURE__*/_react["default"].createElement(_components.ImageDetailComponent, {
    source: source,
    resizeMode: modalImageResizeMode !== null && modalImageResizeMode !== void 0 ? modalImageResizeMode : resizeMode,
    imageStyle: modalImageStyle,
    ref: modalRef !== null && modalRef !== void 0 ? modalRef : imageDetailRef,
    isOpen: isModalOpen,
    isTranslucent: isTranslucent,
    origin: originImageLayout,
    backgroundColor: overlayBackgroundColor,
    swipeToDismiss: swipeToDismiss,
    hideCloseButton: hideCloseButton,
    parentLayout: parentLayout,
    animationDuration: animationDuration,
    renderHeader: renderHeader,
    renderFooter: renderFooter,
    renderImageComponent: renderImageComponent,
    onTap: onTap,
    onDoubleTap: onDoubleTap,
    onLongPress: onLongPress,
    didOpen: didOpen,
    onMove: onMove,
    responderRelease: responderRelease,
    willClose: willClose,
    onClose: handleClose
  }));
});
var _default = exports["default"] = ImageModal;