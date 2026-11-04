import type { ComponentType } from "react";
import { MysteryBoxDemo } from "./mystery-box/MysteryBoxDemo";
import { SurpriseCardDemo } from "./surprise-card/SurpriseCardDemo";

import type { ThemeColors } from "../theme/tokens";

type Demo = {
  id: string;
  title: string;
  description: string;
  Component: ComponentType<{ colors: ThemeColors }>;
};

export const demos: readonly Demo[] = [
  {
    id: "surprise-card",
    title: "Surprise card",
    description: "A card reveal with anticipation and a reward.",
    Component: SurpriseCardDemo,
  },
  {
    id: "mystery-box",
    title: "Mystery box",
    description: "A box opening with a surprise inside.",
    Component: MysteryBoxDemo,
  },
];
