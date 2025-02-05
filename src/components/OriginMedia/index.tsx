import React from "react";
import { Animated, TouchableOpacity } from "react-native";
import { Image } from "expo-image";

import type { ImageSourcePropType, ImageStyle, StyleProp } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";

interface Props {
  readonly source;
  readonly videoPlaceholder?: ImageSourcePropType;
  readonly imageOpacity: Animated.Value;
  readonly disabled: boolean;
  readonly isVideo?: boolean;
  readonly style?: StyleProp<ImageStyle>;
  onDialogOpen(): void;
}

const OriginMedia = ({
  source,
  isVideo = false,
  videoPlaceholder,
  imageOpacity,
  disabled,
  style,
  onDialogOpen,
}: Props) => {
  const handleOpen = (): void => {
    if (disabled) {
      return;
    }
    onDialogOpen();
  };

  if (isVideo && videoPlaceholder === undefined) {
    const player = useVideoPlayer(source, (player) => {});
    return (
      <Animated.View style={[{ opacity: imageOpacity }]}>
        <TouchableOpacity
          activeOpacity={1}
          style={{ alignSelf: "baseline" }}
          onPress={handleOpen}
        >
          <VideoView
            style={style}
            player={player}
            nativeControls={false}
            contentFit="fill"
          />
        </TouchableOpacity>
      </Animated.View>
    );
  } else
    return (
      <Animated.View style={[{ opacity: imageOpacity }]}>
        <TouchableOpacity
          activeOpacity={1}
          style={{ alignSelf: "baseline" }}
          onPress={handleOpen}
        >
          <Image
            source={isVideo ? videoPlaceholder : source}
            style={style}
            contentFit="cover"
          />
        </TouchableOpacity>
      </Animated.View>
    );
};

export { OriginMedia };
