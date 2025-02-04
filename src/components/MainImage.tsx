import React from "react";
import {
  TouchableOpacity,
  View,
  Animated,
  ImageStyle,
  ImageSourcePropType,
} from "react-native";
import { Image as ExpoImage } from "expo-image";

const MainImage=({
  source,
  imageOpacity,
  style,
  onDialogOpen,
})=>{
  return (
    <Animated.View style={[{ opacity: imageOpacity,flex:1}]}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onDialogOpen}
      >
        <ExpoImage
               source={source}
               style={[{ borderColor: "red",borderWidth:10 }, style]}
               contentFit="cover"
             />
       </TouchableOpacity>
    </Animated.View>
  );
};

export default MainImage;
