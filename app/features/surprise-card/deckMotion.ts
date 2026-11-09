import { interpolate } from "react-native-reanimated";

// Shared packet cuts, staggered riffle, bridge, and a floating ribbon flourish.
export function deckPose(progress: number, layer: number, width: number) {
  "worklet";
  const side = layer % 2 === 0 ? -1 : 1;
  const depth = 9 - layer;
  const cut = interpolate(
    progress,
    [0, 0.08, 0.16, 0.22],
    [0, 1, -0.7, 0],
    "clamp",
  );
  const split = interpolate(
    progress,
    [0.22, 0.29, 0.36, 0.48],
    [0, 1, 1, 0],
    "clamp",
  );
  const riffle = Math.max(
    0,
    Math.min(1, (progress - 0.35 - layer * 0.008) / 0.07),
  );
  const bridge = interpolate(progress, [0.48, 0.53, 0.58], [0, 1, 0], "clamp");
  const ribbon = interpolate(
    progress,
    [0.58, 0.64, 0.68, 0.75],
    [0, 1, 1, 0],
    "clamp",
  );
  const arc = Math.sin((layer / 9) * Math.PI);
  return {
    x:
      side * width * (0.48 * cut + 0.62 * split) +
      (layer - 4.5) * width * 0.19 * ribbon,
    y:
      depth * 2.1 -
      Math.abs(cut) * (side > 0 ? 28 : -10) -
      Math.sin(riffle * Math.PI) * (24 + layer * 2) -
      bridge * (12 + depth * 4) -
      ribbon * (18 + arc * 35),
    rotate: side * (cut * 16 + split * 13) + (layer - 4.5) * 7 * ribbon,
    tilt: 12 + split * 25 - bridge * 22 - ribbon * 12,
  };
}
