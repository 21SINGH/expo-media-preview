import React from "react";
import {
  Animated,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

const styles = StyleSheet.create({
  closeButton: {
    width: 40,
    height: 40,
  },
  label: {
    fontSize: 35,
    color: "white",
    lineHeight: 40,
    textAlign: "center",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 1.5,
    shadowColor: "black",
    shadowOpacity: 0.8,
  },
  safeArea: {
    flexDirection: "row", // Aligns children in a row
    justifyContent: "flex-end", // Aligns the button to the right
    right: 20,
  },
});

interface Props {
  readonly animatedOpacity: Animated.Value;
  onClose(): void;
}

const Header: React.FC<Props> = ({ animatedOpacity, onClose }: Props) => {
  const animationStyle = {
    opacity: animatedOpacity,
  };

  return (
    <Animated.View
      // renderToHardwareTextureAndroid={true}
      style={animationStyle}
    >
      <SafeAreaView style={styles.safeArea}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.label}>×</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </Animated.View>
  );
};

export { Header };
