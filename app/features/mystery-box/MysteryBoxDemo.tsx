import type { ThemeColors } from "../../theme/tokens";
import { DemoPlaceholder } from "../../components/DemoPlaceholder";

export function MysteryBoxDemo({ colors }: { colors: ThemeColors }) {
  return <DemoPlaceholder colors={colors} label="Mystery box" />;
}
