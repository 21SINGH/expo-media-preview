import React from 'react'
import { Animated, StyleSheet } from 'react-native'
import { BlurView } from "expo-blur";
import type { ColorValue } from 'react-native'

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
})

interface Props {
  readonly animatedOpacity: Animated.Value
}

const Background = ({
  animatedOpacity,
  
}: Props) => {
  return (
    <Animated.View style={[styles.background, { opacity: animatedOpacity }]}>
      <BlurView
        style={{ flex: 1 }}
        intensity={100}
        tint="systemChromeMaterialDark"
        experimentalBlurMethod="dimezisBlurView"
      />
    </Animated.View>
  )
}

export { Background }
