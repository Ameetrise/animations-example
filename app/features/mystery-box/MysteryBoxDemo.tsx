import Animated, { useAnimatedStyle } from "react-native-reanimated";
import type { DemoProps } from "../types";
import { DemoPlaceholder } from "../../components/DemoPlaceholder";

export function MysteryBoxDemo({ colors, progress }: DemoProps) {
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: 0.4 + progress.value * 0.6,
    transform: [{ scale: 0.8 + progress.value * 0.2 }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <DemoPlaceholder colors={colors} label="Mystery box" />
    </Animated.View>
  );
}
