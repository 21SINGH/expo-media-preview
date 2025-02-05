import React from 'react'
import type { ReactNode } from 'react'

import { Animated, TouchableOpacity } from 'react-native'
import { Image } from 'expo-image'

import type { RenderImageComponentParams } from '../../types'
import type { ImageResizeMode, ImageSourcePropType, ImageStyle, StyleProp } from 'react-native'

interface Props {
  readonly source: ImageSourcePropType
  readonly resizeMode: ImageResizeMode
  readonly imageOpacity: Animated.Value
  readonly renderToHardwareTextureAndroid: boolean
  readonly disabled: boolean
  readonly style?: StyleProp<ImageStyle>
  readonly isModalOpen: boolean
  onDialogOpen(): void
  onLongPressOriginImage?(): void
  renderImageComponent?(params: RenderImageComponentParams): ReactNode
}

const OriginImage = ({
  source,
  resizeMode,
  imageOpacity,
  disabled,
  style,
  isModalOpen,
  onDialogOpen,
  onLongPressOriginImage,
  renderImageComponent,
}: Props) => {
  const handleOpen = (): void => {
    if (disabled) {
      return
    }
    onDialogOpen()
  }

  return (
    <Animated.View
      style={[{ opacity: imageOpacity }]}
    >
      <TouchableOpacity
        activeOpacity={1}
        style={{ alignSelf: 'baseline' }}
        onPress={handleOpen}
        onLongPress={onLongPressOriginImage}
      >
        {typeof renderImageComponent === 'function' ? (
          renderImageComponent({
            source,
            style,
            resizeMode,
            isModalOpen,
          })
        ) : (
          <Image
          source={source }
          style={style}
          contentFit="cover"
        />
        )}
      </TouchableOpacity>
    </Animated.View>
  )
}

export { OriginImage }
