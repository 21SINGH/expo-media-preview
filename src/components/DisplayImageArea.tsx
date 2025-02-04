import React from "react";
import { Animated, Dimensions, StyleSheet } from "react-native";

/**
 * DisplayImageArea
 *
 * This component is responsible for rendering a clipping area (an Animated.View) that can
 * display its children and control their position/size via animations. In this particular
 * implementation, we interpolate from `[0,1]` to the full window dimensions, effectively
 * toggling between no clipping area (full screen) and a full clipping area (still full screen).
 *
 * You could modify the output ranges to control how the clipping area changes during
 * an opening or closing transition (e.g., partial screen to full screen).
 */

interface Props {
  /**
   * An animated value used to interpolate the clipping area’s style
   * (e.g., positioning or sizing).
   */
  readonly animatedFrame: Animated.Value;

  /**
   * Any React children that should be rendered within the clipping area.
   */
  readonly children: React.ReactNode;
}

const DisplayImageArea: React.FC<Props> = ({
  animatedFrame,
  children,
}: Props) => {
  // Get the device's width and height from Dimensions.
  const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

  // If needed, adjust for the status bar height on Android or iOS here.
  // For now, the statusBarHeight is 0 in this example.
  const statusBarHeight = 0;

  // Define how we interpolate the animatedFrame to animate left, top, width, and height.
  const animationStyle = {
    left: animatedFrame.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0],
    }),
    top: animatedFrame.interpolate({
      inputRange: [0, 1],
      outputRange: [0 + statusBarHeight, 0],
    }),
    width: animatedFrame.interpolate({
      inputRange: [0, 1],
      outputRange: [windowWidth, windowWidth],
    }),
    height: animatedFrame.interpolate({
      inputRange: [0, 1],
      outputRange: [windowHeight, windowHeight],
    }),
  };

  return (
    <Animated.View style={[styles.clippingArea, animationStyle]}>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  clippingArea: {
    position: "absolute",
  },
});

export default DisplayImageArea;
