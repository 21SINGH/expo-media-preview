/**
 * Utility constants and functions for managing pinch-to-zoom, panning, and swipe-to-dismiss gestures.
 */

/**
 * The fully visible opacity level (1 means fully opaque).
 */
const VISIBLE_OPACITY = 1;

/**
 * The minimum scale factor for zoom-out.
 */
const MIN_SCALE = 0.6;

/**
 * The maximum scale factor for zoom-in.
 */
const MAX_SCALE = 10;

/**
 * The default (initial) scale factor.
 */
const INITIAL_SCALE = 1;

/**
 * Computes the difference in distance from the last known position.
 * Essentially returns how far the user moved from the last position.
 *
 * @param lastPosition - The previous position {x, y}.
 * @param distancePosition - The new distances {dx, dy}.
 * @returns { dx, dy } - The difference between the current and the last recorded position.
 */
const getDistanceFromLastPosition = (
  lastPosition: { readonly x: number; readonly y: number },
  // eslint-disable-next-line prettier/prettier
  distancePosition: { readonly dx: number; readonly dy: number }
) => {
  const { x, y } = lastPosition;
  const { dx, dy } = distancePosition;
  return { dx: dx - x, dy: dy - y };
};

/**
 * When the scale changes, this function calculates the new position of the image
 * based on how much the user has moved (dx, dy) relative to the current scale factor.
 *
 * @param scale - Current scale factor of the image.
 * @param position - Current position of the image { x, y }.
 * @param distancePosition - The distance the user has moved { dx, dy }.
 * @returns { x, y } - The updated position of the image.
 */
const getImagePositionFromDistanceInScale = (
  scale: number,
  position: { readonly x: number; readonly y: number },
  // eslint-disable-next-line prettier/prettier
  distancePosition: { readonly dx: number; readonly dy: number }
) => {
  const { dx, dy } = distancePosition;
  const { x, y } = position;
  return { x: x + dx / scale, y: y + dy / scale };
};

/**
 * Calculates the distance between two touch points (i.e., for pinch gestures).
 *
 * @param firstFinger - The touch object for the first finger.
 * @param secondFinger - The touch object for the second finger.
 * @returns The distance (in pixels) between the two fingers.
 */
const getDistanceBetweenTouches = (
  firstFinger: { readonly pageX: number; readonly pageY: number },
  // eslint-disable-next-line prettier/prettier
  secondFinger: { readonly pageX: number; readonly pageY: number }
) => {
  const { pageX: x0, pageY: y0 } = firstFinger;
  const { pageX: x1, pageY: y1 } = secondFinger;
  const xDistance = Math.abs(x0 - x1);
  const yDistance = Math.abs(y0 - y1);
  const diagonalDistance = Math.sqrt(
    xDistance * xDistance + yDistance * yDistance
  );
  return Number(diagonalDistance.toFixed(1));
};

/**
 * Adjusts the current zoom level based on the amount of pinching or spreading.
 * Enforces minimum and maximum zoom limits.
 *
 * @param scale - The current scale factor.
 * @param distanceDiff - The difference in finger spread distance.
 * @returns A new scale factor, clamped between MIN_SCALE and MAX_SCALE.
 */
const getZoomFromDistance = (scale: number, distanceDiff: number) => {
  const zoom = scale + distanceDiff;
  if (zoom < MIN_SCALE) {
    return MIN_SCALE;
  }
  if (zoom > MAX_SCALE) {
    return MAX_SCALE;
  }
  return zoom;
};

/**
 * Given the current position, the midpoint of the pinch (centerDiff), the distance difference,
 * and the new zoom level, returns an updated x,y position for the image.
 *
 * @param currentPosition - The current position { x, y } of the image.
 * @param centerDiff - The difference from screen center to the pinch center { x, y }.
 * @param distanceDiff - The change in pinch spread.
 * @param zoom - The current zoom level.
 * @returns { x, y } - The updated position, ensuring the image moves consistently with the pinch.
 */
const getPositionFromDistanceInScale = ({
  currentPosition,
  centerDiff,
  distanceDiff,
  zoom,
}: {
  readonly currentPosition: { readonly x: number; readonly y: number };
  readonly centerDiff: { readonly x: number; readonly y: number };
  readonly distanceDiff: number;
  readonly zoom: number;
}) => {
  return {
    x: currentPosition.x - (centerDiff.x * distanceDiff) / zoom,
    y: currentPosition.y - (centerDiff.y * distanceDiff) / zoom,
  };
};

/**
 * Calculates the maximum valid position (i.e., boundary constraints) for the image
 * based on the current scale and the device's window dimensions.
 * Prevents the image from panning beyond its scaled boundaries.
 *
 * @param scale - The current zoom level of the image.
 * @param position - The current position { x, y } of the image.
 * @param windowLayout - The width and height of the window { width, height }.
 * @returns { x, y } - A position clamped within the image’s boundary.
 */
const getMaxPosition = (
  scale: number,
  position: { readonly x: number; readonly y: number },
  // eslint-disable-next-line prettier/prettier
  windowLayout: { readonly width: number; readonly height: number }
): { x: number; y: number } => {
  const { width, height } = windowLayout;
  let { x, y } = position;

  // Calculate how far the image can move horizontally before edges show.
  const horizontalMax = (width * scale - width) / 2 / scale;
  x = Math.max(-horizontalMax, Math.min(horizontalMax, x));

  // Calculate how far the image can move vertically.
  const verticalMax = (height * scale - height) / 2 / scale;
  y = Math.max(-verticalMax, Math.min(verticalMax, y));

  return { x, y };
};

/**
 * Computes the center position between two touch points, relative to the screen center.
 *
 * @param firstTouch - The touch object for the first finger.
 * @param secondTouch - The touch object for the second finger.
 * @param windowLayout - The width and height of the device window { width, height }.
 * @returns { x, y } - The midpoint of the two fingers, measured from the center of the screen.
 */
const getCenterPositionBetweenTouches = (
  firstTouch: { readonly pageX: number; readonly pageY: number },
  secondTouch: { readonly pageX: number; readonly pageY: number },
  // eslint-disable-next-line prettier/prettier
  windowLayout: { readonly width: number; readonly height: number }
) => {
  const { width, height } = windowLayout;
  const centerX = (firstTouch.pageX + secondTouch.pageX) / 2;
  const centerY = (firstTouch.pageY + secondTouch.pageY) / 2;

  return {
    x: centerX - width / 2,
    y: centerY - height / 2,
  };
};

/**
 * Determines how to handle double-tap behavior:
 * - If already zoomed in, we reset the scale to the original size.
 * - If at the original size, we zoom in to a predefined factor (2x) and
 *   position the image around the tap point.
 *
 * @param scale - The current scale factor.
 * @param position - The double-tap coordinates { pageX, pageY }.
 * @param windowLayout - The device's window dimensions.
 * @returns An object { scale, position } representing the updated zoom and x,y offset.
 */
const getZoomAndPositionFromDoubleTap = (
  scale: number,
  position: { readonly pageX: number; readonly pageY: number },
  // eslint-disable-next-line prettier/prettier
  windowLayout: { readonly width: number; readonly height: number }
) => {
  // If the image is already zoomed in, reset to initial scale and center position.
  if (scale !== INITIAL_SCALE) {
    return {
      scale: INITIAL_SCALE,
      position: { x: 0, y: 0 },
    };
  }

  const { width, height } = windowLayout;
  // If the image is at the initial scale, zoom in by a factor of 2.
  const { pageX: doubleClickX, pageY: doubleClickY } = position;
  const beforeScale = scale;
  const newScale = 2;
  const diffScale = newScale - beforeScale;

  // Calculate the new x, y offsets so that the double-tapped point is "zoomed into".
  const x = ((width / 2 - doubleClickX) * diffScale) / scale;
  const y = ((height / 2 - doubleClickY) * diffScale) / scale;

  return {
    scale: newScale,
    // Ensure the new position doesn't let the image go out of bounds:
    position: getMaxPosition(newScale, { x, y }, { width, height }),
  };
};

/**
 * Computes the opacity of the background overlay during a vertical swipe
 * when scale is at its initial factor and swipe-to-dismiss is enabled.
 * As the user drags up/down, the background fades.
 *
 * @param swipeToDismiss - Whether swipe-to-dismiss is enabled.
 * @param scale - Current scale factor of the image.
 * @param dy - The vertical distance dragged.
 * @param windowHeight - The height of the device window.
 * @returns A floating opacity value between 0 and 1.
 */
const getOpacityFromSwipe = ({
  swipeToDismiss,
  scale,
  dy,
  windowHeight,
}: {
  readonly swipeToDismiss: boolean;
  readonly scale: number;
  readonly dy: number;
  readonly windowHeight: number;
}) => {
  // Only adjust opacity if fully zoomed out and swipe-to-dismiss is true.
  if (swipeToDismiss && scale === INITIAL_SCALE) {
    return (windowHeight - Math.abs(dy)) / windowHeight;
  }
  return VISIBLE_OPACITY;
};

export {
  VISIBLE_OPACITY,
  MIN_SCALE,
  MAX_SCALE,
  INITIAL_SCALE,
  getDistanceFromLastPosition,
  getImagePositionFromDistanceInScale,
  getDistanceBetweenTouches,
  getZoomFromDistance,
  getPositionFromDistanceInScale,
  getMaxPosition,
  getCenterPositionBetweenTouches,
  getZoomAndPositionFromDoubleTap,
  getOpacityFromSwipe,
};
