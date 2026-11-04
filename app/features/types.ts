import type { Animated } from "react-native";
import type { ThemeColors } from "../theme/tokens";

export type DemoProps = {
  colors: ThemeColors;
  progress: Animated.Value;
};
