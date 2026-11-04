import { Animated } from "react-native";
import type { DemoProps } from "../types";
import { DemoPlaceholder } from "../../components/DemoPlaceholder";

export function MysteryBoxDemo({ colors, progress }: DemoProps) {
  return (
    <Animated.View
      style={{
        opacity: progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0.4, 1],
        }),
        transform: [
          {
            scale: progress.interpolate({
              inputRange: [0, 1],
              outputRange: [0.8, 1],
            }),
          },
        ],
      }}
    >
      <DemoPlaceholder colors={colors} label="Mystery box" />
    </Animated.View>
  );
}
