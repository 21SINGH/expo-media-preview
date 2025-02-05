import React from "react";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

import { Animated, Dimensions, Modal } from "react-native";

import { Background, DisplayMediaArea, MediaArea } from "./components";

import type { OnMove, OnTap } from "../../types";
import type {
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
} from "react-native";

const INITIAL_SCALE = 1;

interface ImageDetail {
  close(): void;
}

interface Props {
  readonly isOpen: boolean;
  readonly isVideo?: boolean;
  readonly origin: {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
  };
  readonly source: ImageSourcePropType;
  readonly swipeToDismiss: boolean;
  readonly imageStyle?: StyleProp<ImageStyle>;
  readonly parentLayout?: {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
  };
  readonly animationDuration: number;
  onTap?(eventParams: OnTap): void;
  onDoubleTap?(): void;
  onLongPress?(): void;
  didOpen?(): void;
  onMove?(position: OnMove): void;
  responderRelease?(vx?: number, scale?: number): void;
  willClose?(): void;
  onClose(): void;
}

const MediaDetailComponent = forwardRef<ImageDetail, Props>(
  function MediaDetailComponent(
    {
      isOpen,
      isVideo = false,
      origin,
      source,
      swipeToDismiss,
      imageStyle,
      parentLayout,
      animationDuration,
      onTap,
      onDoubleTap,
      onLongPress,
      didOpen,
      onMove,
      responderRelease,
      willClose,
      onClose,
    }: Props,
    ref
  ) {
    const { width: windowWidth, height: windowHeight } =
      Dimensions.get("window");
    const originImagePosition = {
      x: origin.x - (parentLayout?.x ?? 0) / 2,
      y: origin.y - (parentLayout?.y ?? 0),
    };
    const { width: originImageWidth, height: originImageHeight } = origin;

    const animatedScale = new Animated.Value(INITIAL_SCALE);
    const animatedPosition = new Animated.ValueXY({ x: 0, y: 0 });
    const animatedFrame = new Animated.Value(0);
    const animatedOpacity = new Animated.Value(0);
    const animatedImagePosition = new Animated.ValueXY(originImagePosition);
    const animatedImageWidth = new Animated.Value(originImageWidth);
    const animatedImageHeight = new Animated.Value(originImageHeight);

    const isAnimated = useRef(true);

    const handleClose = (): void => {
      isAnimated.current = true;
      willClose?.();

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
          if (isOpen) {
            didOpen?.();
          }
        });
      });
    };

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

    useImperativeHandle(ref, () => ({
      close: handleClose,
    }));

    return (
      <Modal
        hardwareAccelerated
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
        <Background animatedOpacity={animatedOpacity} />
        <DisplayMediaArea
          animatedFrame={animatedFrame}
        >
          <MediaArea
          isVideo={isVideo}
            isAnimated={isAnimated}
            animatedOpacity={animatedOpacity}
            animatedScale={animatedScale}
            animatedPosition={animatedPosition}
            animatedImagePosition={animatedImagePosition}
            animatedImageWidth={animatedImageWidth}
            animatedImageHeight={animatedImageHeight}
            windowWidth={windowWidth}
            windowHeight={windowHeight}
            swipeToDismiss={swipeToDismiss}
            source={source}
            imageStyle={imageStyle}
            animationDuration={animationDuration}
            onClose={handleClose}
            onMove={onMove}
            onTap={onTap}
            onDoubleTap={onDoubleTap}
            onLongPress={onLongPress}
            responderRelease={responderRelease}
          />
        </DisplayMediaArea>
      </Modal>
    );
  }
);

export { MediaDetailComponent };
export type { ImageDetail };
