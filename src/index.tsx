import React, { createRef, useRef, useState } from "react";
import { View, StyleSheet, Animated, ImageStyle } from "react-native";
import { ExpoMediaPreviewProps } from "./types";
import { useOriginImageLayout } from "./utils/useOriginImageLayout";
import { Image as ExpoImage } from "expo-image";
import MainMedia from "./components/MainMedia";
import MediaDetailsComponent from "./components/MediaDetailsComponent";

const VISIBLE_OPACITY = 1;
const INVISIBLE_OPACITY = 0;

interface ImageDetail {
  close(): void;
}

const ExpoMediaPreview: React.FC<ExpoMediaPreviewProps> = ({
  imgSrc,
  videoSrc,
  videoPlaceholderSrc,
  style,
  animationDuration = 100,
}) => {
  const mediaRef = createRef<View>();
  const imageDetailRef = createRef<ImageDetail>();

  const originImageOpacity = useRef(
    new Animated.Value(VISIBLE_OPACITY)
  ).current;
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Custom hook to measure and store the layout of the thumbnail.
  const { originImageLayout, updateOriginImageLayout } = useOriginImageLayout({
    mediaRef,
  });

  // Show the full-screen preview after measuring the thumbnail layout.
  const showModal = (): void => {
    updateOriginImageLayout();
    setTimeout(() => {
      setIsModalOpen(true);
    });
  };

  // Close the full-screen preview.
  const hideModal = (): void => {
    setTimeout(() => {
      setIsModalOpen(false);
    });
  };

  // Callback for when the user closes the preview.
  const handleClose = (): void => {
    originImageOpacity.setValue(VISIBLE_OPACITY);
    hideModal();
  };

  // Callback for when the user opens the preview.
  const handleOpen = (): void => {
    showModal();
    Animated.timing(originImageOpacity, {
      toValue: INVISIBLE_OPACITY,
      duration: animationDuration,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View ref={mediaRef} style={{ flex: 1 }}>
      <MainMedia
        imgSrc={imgSrc}
        videoSrc={videoSrc}
        videoPlaceholderSrc={videoPlaceholderSrc}
        imageOpacity={originImageOpacity}
        onDialogOpen={handleOpen}
        style={style}
      />
      {isModalOpen && (
        <MediaDetailsComponent
          imgSrc={imgSrc}
          videoSrc={videoSrc}
          isVideo={false}
          ref={imageDetailRef}
          isOpen={isModalOpen}
          origin={originImageLayout}
          animationDuration={animationDuration}
          onClose={handleClose}
        />
      )}
    </View>
  );
};

export default ExpoMediaPreview;
