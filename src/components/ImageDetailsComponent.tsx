import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { Modal, Dimensions, Animated, ImageSourcePropType } from "react-native";
import Background from "./Background";
import DisplayImageArea from "./DisplayImageArea";
import { Header } from "./Header";
import ImageArea from "./ImageArea/ImageArea";


/**
 * A component that animates an image transition into a full-screen modal.
 * It uses React’s `forwardRef` and `useImperativeHandle` to expose a `close` method
 * so the parent component can programmatically close the modal.
 *
 * Key Points:
 * - Listens for `isOpen` to determine when to show or hide the modal.
 * - Performs parallel animations when opening or closing the modal, making the transition smooth.
 * - Uses multiple Animated.Value objects for position, size, and opacity,
 *   allowing fine-grained control over how the image transitions to full screen.
 * - Includes a header area with a close button (`Header`), a background overlay (`Background`),
 *   and the main image content area (`ImageArea`).
 */

const INITIAL_SCALE = 1;

interface Props {
  /**
   * The image source (could be a local or remote resource).
   */
  source: ImageSourcePropType;
  /**
   * Flag indicating if the modal is currently open.
   */
  readonly isOpen: boolean;
  /**
   * Coordinates and dimensions of the original (thumbnail) image for the transition animation.
   */
  readonly origin: {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
  };
  /**
   * Duration (in ms) for each animation step.
   */
  readonly animationDuration: number;

  readonly isVideo: boolean;
  /**
   * Callback triggered when the user requests the modal to close.
   */
  onClose(): void;
}

const ImageDetailsComponent = forwardRef<any, Props>(
  function ImageDetailsComponent(
    { source, isVideo, isOpen, origin, animationDuration, onClose }: Props,
    // eslint-disable-next-line prettier/prettier
    ref
  ) {
    // Obtain the current screen size to animate the image to full screen.
    const { width: windowWidth, height: windowHeight } =
      Dimensions.get("window");

    // De-structure the original image's position and dimensions.
    const {
      x: originX,
      y: originY,
      width: originImageWidth,
      height: originImageHeight,
    } = origin;
    const originImagePosition = { x: originX, y: originY };

    // Animated values controlling the zoom/transition states.
    const animatedScale = new Animated.Value(INITIAL_SCALE);
    const animatedPosition = new Animated.ValueXY({ x: 0, y: 0 });
    const animatedFrame = new Animated.Value(0);
    const animatedOpacity = new Animated.Value(0);
    const animatedImagePosition = new Animated.ValueXY(originImagePosition);
    const animatedImageWidth = new Animated.Value(originImageWidth);
    const animatedImageHeight = new Animated.Value(originImageHeight);

    // A ref to track the ongoing animation, preventing multiple triggers.
    const isAnimated = useRef(true);

    /**
     * Closes the modal by running parallel animations that revert
     * the image back to its initial size and position, then hides the modal.
     */
    const handleClose = (): void => {
      isAnimated.current = true;
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(animatedFrame, {
            toValue: 0,
            useNativeDriver: false,
            duration: animationDuration,
          }),
          Animated.timing(animatedScale, {
            toValue: INITIAL_SCALE,
            useNativeDriver: false,
            duration: animationDuration,
          }),
          Animated.timing(animatedPosition, {
            toValue: 0,
            useNativeDriver: false,
            duration: animationDuration,
          }),
          Animated.timing(animatedOpacity, {
            toValue: 0,
            useNativeDriver: false,
            duration: animationDuration,
          }),
          Animated.timing(animatedImagePosition, {
            toValue: originImagePosition,
            useNativeDriver: false,
            duration: animationDuration * 2,
          }),
          Animated.timing(animatedImageWidth, {
            toValue: originImageWidth,
            useNativeDriver: false,
            duration: animationDuration * 2,
          }),
          Animated.timing(animatedImageHeight, {
            toValue: originImageHeight,
            useNativeDriver: false,
            duration: animationDuration * 2,
          }),
        ]).start(() => {
          onClose();
          isAnimated.current = false;
        });
      });
    };

    /**
     * Opens the modal by animating the image from its original size and position
     * to fill the entire screen.
     */
    const handleOpen = () => {
      isAnimated.current = true;

      setTimeout(() => {
        Animated.parallel([
          Animated.timing(animatedFrame, {
            toValue: 1,
            useNativeDriver: false,
            duration: animationDuration,
          }),
          Animated.timing(animatedOpacity, {
            toValue: 1,
            useNativeDriver: false,
            duration: animationDuration,
          }),
          Animated.timing(animatedImagePosition, {
            toValue: {
              x: 0,
              y: 0,
            },
            useNativeDriver: false,
            duration: animationDuration * 2,
          }),
          Animated.timing(animatedImageWidth, {
            toValue: windowWidth,
            useNativeDriver: false,
            duration: animationDuration * 2,
          }),
          Animated.timing(animatedImageHeight, {
            toValue: windowHeight,
            useNativeDriver: false,
            duration: animationDuration * 2,
          }),
        ]).start(() => {
          isAnimated.current = false;
        });
      });
    };

    // Whenever the component mounts or updates (due to new refs/values), we trigger the open animation.
    useEffect(() => {
      handleOpen();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
      animatedOpacity,
      animatedImagePosition,
      animatedImageWidth,
      animatedImageHeight,
      animatedFrame,
    ]);

    /**
     * useImperativeHandle allows the parent to trigger the close animation
     * through a ref, e.g., ref.current.close().
     */
    useImperativeHandle(ref, () => ({
      close: handleClose,
    }));

    return (
      <Modal
        // hardwareAccelerated
        visible={isOpen}
        transparent
        onRequestClose={handleClose}
        supportedOrientations={[
          "portrait",
          "portrait-upside-down",
          "landscape",
          "landscape-left",
          "landscape-right",
        ]}
      >
        {/* Background overlay that dims the rest of the screen as the image expands */}
        <Background animatedOpacity={animatedOpacity} />

        {/* Display container area - animates the image area into view */}
        <DisplayImageArea animatedFrame={animatedFrame}>
          {/* The core image area, controlling gestures and the full view of the image */}
          <ImageArea
            isVideo={isVideo}
            renderToHardwareTextureAndroid={true}
            isAnimated={isAnimated}
            animatedOpacity={animatedOpacity}
            animatedScale={animatedScale}
            animatedPosition={animatedPosition}
            animatedImagePosition={animatedImagePosition}
            animatedImageWidth={animatedImageWidth}
            animatedImageHeight={animatedImageHeight}
            windowWidth={windowWidth}
            windowHeight={windowHeight}
            swipeToDismiss={true}
            source={source}
            animationDuration={animationDuration}
            isModalOpen={isOpen}
            onClose={handleClose}
          />
        </DisplayImageArea>

        {/* Top header bar with a close button */}
        <Header animatedOpacity={animatedOpacity} onClose={handleClose} />
      </Modal>
    );
    // eslint-disable-next-line prettier/prettier
  }
);

export default ImageDetailsComponent;
