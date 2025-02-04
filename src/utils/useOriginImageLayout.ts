import type { RefObject } from "react";
import { useState } from "react";
import { Dimensions, View } from "react-native";

/**
 * A custom hook that retrieves and stores the layout (position and size) of a View.
 * Useful for animating transitions to a full-screen modal or overlay based on the
 * View’s original size/position on the screen.
 *
 * @param mediaRef - A RefObject attached to the View whose layout we want to measure.
 *
 * @returns An object with:
 *  - originImageLayout: The measured layout (x, y, width, height).
 *  - updateOriginImageLayout: A function to manually trigger the measurement of the View.
 */
interface Params {
  readonly mediaRef: RefObject<View | null>;
}

const useOriginImageLayout = ({ mediaRef }: Params) => {
  const [originImageLayout, setOriginImageLayout] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  /**
   * This function can be used to adjust the x-coordinate
   * of the measured layout if necessary. For example, if you
   * want to center or offset the modal. Currently it just returns
   * the original x.
   */
  const getModalPositionX = (x: number, width: number): number => {
    return x;
  };

  /**
   * Measures the position and size of the referenced View in the window,
   * then updates local state with the measured layout.
   * The layout can be used for animating transitions.
   */
  const updateOriginImageLayout = (): void => {
    mediaRef.current?.measureInWindow((x, y, width, height) => {
      setOriginImageLayout({
        width,
        height,
        x: getModalPositionX(x, width),
        y,
      });
    });
  };

  // Re-measure the View whenever screen dimensions change (e.g., rotation).
  Dimensions.addEventListener("change", updateOriginImageLayout);

  return { originImageLayout, updateOriginImageLayout };
};

export { useOriginImageLayout };
