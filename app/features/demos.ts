import type { ComponentType } from "react";
import { MysteryBoxDemo } from "./mystery-box/MysteryBoxDemo";
import { SurpriseCardDemo } from "./surprise-card/SurpriseCardDemo";

import { ThreeDRevealEntry } from "./three-d-reveal/ThreeDRevealEntry";

import type { DemoProps } from "./types";

type Demo = {
  id: string;
  title: string;
  description: string;
  Component: ComponentType<DemoProps>;
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
  {
    id: "three-d-reveal",
    title: "3D reveal",
    description: "A real 3D box with animated folding flaps.",
    Component: ThreeDRevealEntry,
  },
];
