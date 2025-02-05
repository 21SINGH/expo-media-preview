import React from 'react'
import type { RefObject } from 'react'
import { createRef, forwardRef, useImperativeHandle, useRef, useState } from 'react'

import { Animated, View } from 'react-native'

import { MediaDetailComponent, OriginMedia } from './components'
import { useOriginImageLayout } from './hooks'

import type { ImageDetail } from './components'
import type { OnMove, OnTap} from './types'
import type {  ImageSourcePropType, ImageStyle, StyleProp } from 'react-native'

const VISIBLE_OPACITY = 1
const INVISIBLE_OPACITY = 0

interface ReactNativeImageModal {
  readonly isOpen: boolean
  open(): void
  close(): void
}

/**
 * @typedef {object} Props
 *  * @property {ImageSourcePropType} videoPlaceholder - Image source.
 * @property {StyleProp<ImageStyle>} [style] - Style for original image.
 * @property {boolean} [renderToHardwareTextureAndroid=true] - (Android only) Use hardware texture for animation.
 * @property {boolean} [swipeToDismiss=true] - Dismiss image modal by swiping up or down.
 * @property {boolean} [imageBackgroundColor=transparent] - Background color for original image.
 * @property {boolean} [disabled=false] - Disable opening image modal.
 * @property {boolean} [modalImageStyle] - Style for modal image.
 * @property {boolean} [parentLayout] - Parent component layout of ImageModal to limit displayed image modal area when closing image modal.
 * @property {number} [animationDuration=100] - Duration of animation.
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
interface Props {
  /**
   *  Image source.
   */
  readonly source;
   /**
   *  Video Placeholder source.
   */
   readonly videoPlaceholder?: ImageSourcePropType
  /**
   *  is video.
   */
  readonly isVideo?: boolean
  /**
   *  Style for original image.
   */
  readonly style?: StyleProp<ImageStyle>
  /**
   *  (Android only) Use hardware texture for animation.
   *  @default true
   */
  readonly renderToHardwareTextureAndroid?: boolean
  /**
   *  Dismiss image modal by swiping up or down.
   *  @default true
   */
  readonly swipeToDismiss?: boolean
  /**
   *  Background color for original image.
   *  @default 'transparent'
   */
  readonly imageBackgroundColor?: string
  /**
   *  Disable opening image modal.
   *  @default false
   */
  readonly disabled?: boolean
  /**
   *  Style for modal image.
   */
  readonly modalImageStyle?: ImageStyle
  /**
   *  Parent component layout of ImageModal to limit displayed image modal area when closing image modal.
   */
  readonly parentLayout?: {
    readonly x: number
    readonly y: number
    readonly width: number
    readonly height: number
  }
  /**
   *  Duration of animation.
   *  @default 150
   */
  readonly animationDuration?: number
  /**
   *  Callback when tap on modal image.
   */
  onTap?(eventParams: OnTap): void
  /**
   *  Callback when double tap on modal image.
   */
  onDoubleTap?(): void
  /**
   *  Callback when long press on modal image.
   */
  onLongPress?(): void
  /**
   *  Callback when image modal is opening.
   */
  onOpen?(): void
  /**
   *  Callback when image modal is opened.
   */
  didOpen?(): void
  /**
   *  Callback when modal image is moving.
   */
  onMove?(position: OnMove): void
  /**
   *  Callback when finger(s) is released on modal image.
   */
  responderRelease?(vx?: number, scale?: number): void
  /**
   *  Callback when image modal is closing.
   */
  willClose?(): void
  /**
   *  Callback when image modal is closed.
   */
  onClose?(): void
}

/**
 * ImageModal component
 * @param {Props} props - Props of ImageModal component
 * @returns {ReactNode} Image modal component
 */
const ExpoMediaPreview = forwardRef<ReactNativeImageModal, Props>(function ExpoMediaPreview(
  {
    source,
    videoPlaceholder,
    style,
    isVideo = false,
    swipeToDismiss = true,
    imageBackgroundColor = 'transparent',
    disabled = false,
    modalImageStyle,
    parentLayout,
    animationDuration = 150,
    onTap,
    onDoubleTap,
    onLongPress,
    onOpen,
    didOpen,
    onMove,
    responderRelease,
    willClose,
    onClose,
  }: Props,
  ref,
) {
  const imageRef = createRef<View>()
  const imageDetailRef =  createRef<ImageDetail>()
  // If don't use useRef, animation will not work
  const originImageOpacity = useRef(new Animated.Value(VISIBLE_OPACITY)).current
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { originImageLayout, updateOriginImageLayout } = useOriginImageLayout({
    imageRef,
  })

  const showModal = (): void => {
    onOpen?.()
    // Before opening modal, updating origin image position is required.
    updateOriginImageLayout()
    setTimeout(() => {
      setIsModalOpen(true)
    })
  }

  const hideModal = (): void => {
    setTimeout(() => {
      setIsModalOpen(false)
      onClose?.()
    })
  }

  const handleOpen = (): void => {
    showModal()
    Animated.timing(originImageOpacity, {
      toValue: INVISIBLE_OPACITY,
      duration: animationDuration,
      useNativeDriver: false,
    }).start()
  }

  const handleClose = (): void => {
    originImageOpacity.setValue(VISIBLE_OPACITY)
    hideModal()
  }

  useImperativeHandle(ref, () => ({
    isOpen: isModalOpen,
    open: handleOpen,
    close() {
      imageDetailRef.current!.close()
    },
  }))  

  return (
    <View ref={imageRef} style={[{ alignSelf: 'baseline', backgroundColor: imageBackgroundColor }]}>
      <OriginMedia
        source={source}
        isVideo={isVideo}
        videoPlaceholder={videoPlaceholder}
        imageOpacity={originImageOpacity}
        disabled={disabled}
        style={style}
        onDialogOpen={handleOpen}
      />
      {isModalOpen && (
        <MediaDetailComponent
          source={source}
          isVideo={isVideo}
          imageStyle={modalImageStyle}
          ref={ imageDetailRef}
          isOpen={isModalOpen}
          origin={originImageLayout}
          swipeToDismiss={swipeToDismiss}
          parentLayout={parentLayout}
          animationDuration={animationDuration}
          onTap={onTap}
          onDoubleTap={onDoubleTap}
          onLongPress={onLongPress}
          didOpen={didOpen}
          onMove={onMove}
          responderRelease={responderRelease}
          willClose={willClose}
          onClose={handleClose}
        />
      )}
    </View>
  )
})

export default ExpoMediaPreview
export type { ReactNativeImageModal, ImageDetail }
