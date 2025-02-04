import { ImageSourcePropType, ImageStyle } from "react-native";

export interface ExpoMediaPreviewProps {
   readonly imgSrc? : ImageSourcePropType;
    videoSrc?: string;
    readonly style?: ImageStyle
    readonly animationDuration?: number;
  }
  