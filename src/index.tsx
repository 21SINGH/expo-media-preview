import React from 'react';
import { Image as ExpoImage } from 'expo-image';
import { ExpoMediaPreviewProps } from './types';

const ExpoMediaPreview: React.FC<ExpoMediaPreviewProps> = ({ imgSrc, videoSrc, styles }) => {
  if (imgSrc) {
    return <ExpoImage source={{ uri: imgSrc }} style={styles} />;
  }

  return null;
};

export default ExpoMediaPreview;

