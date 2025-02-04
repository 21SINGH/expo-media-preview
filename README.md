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
- expo-image is used for efficient image loading and caching.
- expo-video powers the video playback.
- Pinch, Zoom, and Drag logic is handled via React Native’s PanResponder.
- expo-blur for background blurring during full-screen mode.


## ExpoMediaPreview Component Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `imgSrc` | `ImageSourcePropType` (optional) | `undefined` | Image source (local or remote). If provided, this will show an image preview.  This prop can be an object with a `uri` property, or a number representing a local image (e.g., from `require('./my-image.png')`). |
| `videoPlaceholderSrc` | `ImageSourcePropType` \| `string` (optional) | `undefined` | Image to show as a placeholder *while a video is loading*. This is highly recommended for a good user experience.  This can be a URI string or an `ImageSourcePropType` object. |
| `videoSrc` | `string` \| `{ uri: string }` (optional) | `undefined` | Video URL or local video source. If provided without an `imgSrc`, this will load the video.  This prop should be a string representing the video URI, or an object with a `uri` property. |
| `style` | `ImageStyle` \| `ViewStyle` | `undefined` | Style applied to the underlying thumbnail (width, height, etc.).  Use this to control the size and appearance of the preview area. |
| `animationDuration` | `number` | `100` | Duration of the opening and closing animations (in milliseconds). |

**Explanation of Types:**

* **`ImageSourcePropType`:** This type represents the source of an image. It can be:
    * An object with a `uri` property: `{ uri: 'https://example.com/image.jpg' }` (for remote images)
    * A number: `require('./my-image.png')` (for local images)
* **`ImageStyle`:** This type is used for styling images.  It's similar to `ViewStyle` but includes properties specific to images (e.g., `resizeMode`).
* **`ViewStyle`:** This type is used for styling general views (like the container for the preview).  It includes properties like `width`, `height`, `backgroundColor`, etc.

**Key Points:**

* **`videoPlaceholderSrc` is crucial:**  Always use `videoPlaceholderSrc` when providing a `videoSrc`.  This provides a placeholder image while the video loads, significantly improving the user experience.
* **Flexibility of `imgSrc` and `videoSrc`:** These props can accept either a URI string or an object with a `uri` property, giving you flexibility for different image/video sources.
* **Styling:**  The `style` prop is essential for controlling the size and appearance of the preview.  Make sure to set `width` and `height` at a minimum.
* **`animationDuration`:**  This prop allows you to customize the animation speed when the preview opens or closes.


