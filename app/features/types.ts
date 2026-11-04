import type { SharedValue } from "react-native-reanimated";
import type { ThemeColors } from "../theme/tokens";

export type DemoProps = {
  colors: ThemeColors;
  progress: SharedValue<number>;
};
