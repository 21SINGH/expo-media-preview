# Expo Media Preview

A lightweight media viewer that allows full-screen (image/video/GIF).

You can pinch zoom-in/out, double-tap zoom-in/out, move and swipe-to-dismiss.


> Note: This library is only compatible with <strong>Expo 52 and above


 > Note: If media is of big quality it will take time to render hence spinner


## Features

- Single Tap to open an media full-screen.  
- Pinch to Zoom.  
- Drag to Dismiss.  
- Supports Images, GIFs, and Videos out of the box.  


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

## Demo

![open and close image modal](demo/preview.gif)



## Quick Start

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


### ExpoMediaPreview Component Props

| Prop | Type | Description |
|---|---|---|
| `source` | `Undefined` | Media source |
| `videoPlaceholder` | `ImageSourcePropType` | Image source for video placeholder |
| `isVideo` | `boolean` | Determines if the source is a video default false |
| `style` | `StyleProp` | Style for the original Media |
| `isRTL` | `boolean` | Support for right-to-left layout default false |
| `swipeToDismiss` | `boolean` | Enable swipe to dismiss functionality |
| `modalRef` | `RefObject<ImageDetail>` | Deprecated ref for image modal |
| `disabled` | `boolean` | Disable opening image modal |
| `parentLayout` | `{ x: number, y: number, width: number, height: number }` | Parent component layout for modal |
| `animationDuration` | `number` | Duration of animation default 150 |
| `onTap` | `(eventParams: OnTap) => void` | Callback when image is tapped |
| `onDoubleTap` | `() => void` | Callback when image is double tapped |
| `onLongPress` | `() => void` | Callback when image is long pressed |
| `onOpen` | `() => void` | Callback when image modal is opening |
| `didOpen` | `() => void` | Callback when image modal is opened |
| `onMove` | `(position: OnMove) => void` | Callback when modal image is moving |
| `responderRelease` | `(vx: number, scale: number) => void` | Callback when touch is released |
| `willClose` | `() => void` | Callback when image modal is closing |
| `onClose` | `() => void` | Callback when image modal is closed |

### ExpoMediaPreview Usage Notes
>
> *   **`imgSrc` or `videoSrc` Required (Not Both):** Provide *either* `imgSrc` *or* `videoSrc`, but *never both*.  Using both will cause issues.
> *   **Dynamic Styling:** The `style` prop applies to either the Image or Video component, depending on which source (`imgSrc` or `videoSrc`) you provide.
> *   **Video Placeholder (Highly Recommended):** Always include `videoPlaceholderSrc` for videos.  This uses `expo-image` for better quality and caching. Without it, videos render initially muted, paused, and without controls.
**Regarding Videos:**
>
> Providing a `videoPlaceholderSrc` is *strongly recommended* for all video previews.  When you include a `videoPlaceholderSrc`, the placeholder image will be rendered using `expo-image`, which generally offers superior image quality and caching compared to directly rendering a video frame.
>
> If you do *not* provide a `videoPlaceholderSrc`, the video will be rendered directly (initially without controls, muted, and paused). This default behavior is often not the desired user experience.
>


Made with ❤️ and Expo

>
> Credits: Inspired from react-native-image-modal
>



