import type { ComponentRef, RefObject } from "react";
import type { View } from "react-native";
import type { SharedValue } from "react-native-reanimated";
import type { ThemeColors } from "../theme/tokens";

export type DemoProps = {
  colors: ThemeColors;
  availableHeight: number;
  cartRef: RefObject<ComponentRef<typeof View> | null>;
  onAddedToCart: () => void;
  selectedCard: number | null;
  onSelectCard: (index: number) => void;
  progress: SharedValue<number>;
};
