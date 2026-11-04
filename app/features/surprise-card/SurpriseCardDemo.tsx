import type { ThemeColors } from "../../theme/tokens";
import { DemoPlaceholder } from "../../components/DemoPlaceholder";

export function SurpriseCardDemo({ colors }: { colors: ThemeColors }) {
  return <DemoPlaceholder colors={colors} label="Surprise card" />;
}
