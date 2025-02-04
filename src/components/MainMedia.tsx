import React from "react";
import {
  TouchableOpacity,
  View,
  Animated,
  ImageStyle,
  ImageSourcePropType,
} from "react-native";
import { Image as ExpoImage } from "expo-image";
import { useVideoPlayer, VideoView } from "expo-video";

const MainMedia = ({
  imgSrc,
  videoSrc,
  videoPlaceholderSrc,
  imageOpacity,
  style,
  onDialogOpen,
}) => {
  if (imgSrc || videoPlaceholderSrc) {
    return (
      <Animated.View style={[{ opacity: imageOpacity, flex: 1 }]}>
        <TouchableOpacity activeOpacity={1} onPress={onDialogOpen}>
          <ExpoImage
            source={imgSrc || videoPlaceholderSrc}
            style={style}
            contentFit="cover"
          />
        </TouchableOpacity>
      </Animated.View>
    );
  } else {
    const player = useVideoPlayer(videoSrc, (player) => {});
    return (
      <Animated.View style={[{ opacity: imageOpacity, flex: 1 }]}>
        <TouchableOpacity activeOpacity={1} onPress={onDialogOpen}>
          <VideoView
            style={style}
            player={player}
            nativeControls={false}
            contentFit="fill"
          />
        </TouchableOpacity>
      </Animated.View>
    );
  }
};

export default MainMedia;
