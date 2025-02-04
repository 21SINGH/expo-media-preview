# Expo Media Preview

A lightweight and customizable media (image/video/GIF) viewer that allows tapping on a thumbnail to open a full-screen preview with **pinch to zoom**, **drag to dismiss**, and **cool animations**.

---

## Features

- **Single Tap** to open an image or video full-screen.  
- **Pinch to Zoom** and **Drag to Pan** with smooth animations.  
- **Drag to Dismiss** gesture when zoomed out.  
- **Supports Images, GIFs,** and **Videos** out of the box.  
- **Highly Customizable** – adjust styling and animation durations.

---

## Installation

**Using npm:**

```bash
npm install expo-media-preview

```

**Using yarn:**

```bash
yarn add expo-media-preview

```

**Additionally, install required peer dependencies:**

```bash

expo install expo-image expo-video expo-blur

```

> Note: This library is only compatible with <strong>Expo 52 and above


# Quick Start

- Install the package (and its peer dependencies).
- Import and use <ExpoMediaPreview /> with either an image or a video source.


```javascript
import React from 'react';
import { View } from 'react-native';
import ExpoMediaPreview from 'expo-media-preview';

export default function App() {
  const sampleImage = {
    uri: 'https://path-to-your-img-file.jpg', // Replace with your image URL
  };

  const sampleVideo = {
    uri: 'https://path-to-your-video-file.mp4', // Replace with your video URL
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {/* Usage with an image */}
      <ExpoMediaPreview
        imgSrc={sampleImage}
        style={{ width: 150, height: 150 }}
      />

      {/* Usage with a video */}
      <ExpoMediaPreview
        videoSrc={sampleVideo}
        videoPlaceholderSrc={{ uri: 'https://path-to-your-placeholder-image.jpg' }}
        style={{ width: 150, height: 150, marginTop: 20 }}
      />
    </View>
  );
}


```

### Behind the Scenes
-- expo-image is used for efficient image loading and caching.
-- expo-video powers the video playback.
-- Pinch, Zoom, and Drag logic is handled via React Native’s PanResponder.
-- expo-blur for background blurring during full-screen mode.
