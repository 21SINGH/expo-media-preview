import { ImageSourcePropType, ImageStyle } from "react-native";

export interface ExpoMediaPreviewProps {
  readonly imgSrc?: ImageSourcePropType;
  readonly videoPlaceholderSrc?: string;
  readonly videoSrc?: string;
  readonly style?: ImageStyle;
  readonly animationDuration?: number;
}
