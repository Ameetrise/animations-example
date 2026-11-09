import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  type SharedValue,
} from "react-native-reanimated";

type Props = {
  progress: SharedValue<number>;
  idle: SharedValue<number>;
  opened: boolean;
  onCast: () => void;
};

// The tip circles the lid; a small wrist movement guides a handle on the right.
// Derive rotation and reach from those two points so the grip never drifts.
function wandTip(t: number) {
  "worklet";
  const orbit = Math.max(0, Math.min(1, t / 0.15));
  const eased = orbit * orbit * (3 - 2 * orbit);
  const angle = eased * Math.PI * 2;
  const tap = Math.max(0, Math.min(1, (t - 0.15) / 0.05));
  const close = tap * tap * (3 - 2 * tap);
  const exit = Math.max(0, Math.min(1, (t - 0.22) / 0.12));
  const retreat = exit * exit * (3 - 2 * exit);
  return {
    x: 140 + Math.cos(angle) * 76 * (1 - close) + retreat * 170,
    y:
      182 +
      Math.sin(angle) * 27 * (1 - close) -
      Math.sin(close * Math.PI) * 18 -
      retreat * 55,
    gripX: 246 + Math.sin(angle) * 7 + retreat * 100,
    gripY: 278 + Math.cos(angle) * 5 - retreat * 30,
  };
}

export function MagicWand({ progress, idle, opened, onCast }: Props) {
  const reduced = useReducedMotion();
  const wand = useAnimatedStyle(() => {
    const tip = wandTip(reduced ? 0 : progress.value);
    const angle = Math.atan2(tip.x - tip.gripX, tip.gripY - tip.y);
    return {
      opacity: interpolate(progress.value, [0.25, 0.34], [1, 0], "clamp"),
      transform: [
        { translateX: tip.gripX },
        {
          translateY:
            tip.gripY + (reduced || opened ? 0 : Math.sin(idle.value) * 2),
        },
        { rotate: `${angle}rad` },
      ],
    };
  });
  const reach = useAnimatedStyle(() => {
    const tip = wandTip(reduced ? 0 : progress.value);
    return {
      transform: [
        { scaleY: Math.hypot(tip.x - tip.gripX, tip.y - tip.gripY) / 96 },
      ],
    };
  });
  const pulse = useAnimatedStyle(() => ({
    opacity: interpolate(
      progress.value,
      [0.185, 0.205, 0.34],
      [0, 0.9, 0],
      "clamp",
    ),
    transform: [
      {
        scale: reduced
          ? 1
          : interpolate(progress.value, [0.185, 0.34], [0.2, 2.1], "clamp"),
      },
    ],
  }));
  return (
    <View pointerEvents="box-none" style={styles.overlay}>
      {!reduced &&
        Array.from({ length: 18 }, (_, index) => (
          <Trail key={index} index={index} progress={progress} />
        ))}
      <Animated.View pointerEvents="none" style={[styles.spellRing, pulse]} />
      <Animated.View
        pointerEvents={opened ? "none" : "auto"}
        style={[styles.wand, wand]}
      >
        <Animated.View style={[styles.rod, reach]}>
          <Pressable
            onPress={onCast}
            disabled={opened}
            accessibilityRole="button"
            accessibilityLabel="Cast a spell to open the mystery box"
            style={styles.touch}
          >
            <View style={styles.tipHalo} />
            <View style={styles.shaft} />
            <View style={styles.handle} />
            <View style={styles.band} />
            <View style={styles.tip} />
            <View style={styles.starVertical} />
            <View style={styles.starHorizontal} />
          </Pressable>
        </Animated.View>
        <View pointerEvents="none" style={styles.glove}>
          <View style={styles.cuff} />
          <View style={styles.palm} />
          {[0, 1, 2].map((finger) => (
            <View
              key={finger}
              style={[styles.finger, { top: 1 + finger * 6 }]}
            />
          ))}
          <View style={styles.thumb} />
        </View>
      </Animated.View>
    </View>
  );
}

function Trail({
  index,
  progress,
}: {
  index: number;
  progress: SharedValue<number>;
}) {
  const motion = useAnimatedStyle(() => {
    const lag = index * 0.0035;
    const t = Math.max(0, progress.value - lag);
    const tip = wandTip(t);
    const scatter = interpolate(progress.value, [0.21, 0.37], [0, 1], "clamp");
    const angle = index * 2.399;
    return {
      opacity: interpolate(
        progress.value,
        [0.015 + lag, 0.04 + lag, 0.23, 0.36],
        [0, 0.85, 0.7, 0],
        "clamp",
      ),
      transform: [
        { translateX: tip.x + Math.cos(angle) * scatter * 65 },
        { translateY: tip.y + Math.sin(angle) * scatter * 55 },
        { rotate: `${index * 30}deg` },
        { scale: 1 - scatter * 0.8 },
      ],
    };
  });
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.dust,
        {
          backgroundColor: index % 3 === 0 ? "#c9b4ff" : "#ffe3a3",
          width: index % 3 === 0 ? 5 : 3,
          height: index % 3 === 0 ? 5 : 3,
        },
        motion,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  rod: {
    position: "absolute",
    top: -96,
    left: 0,
    width: 44,
    height: 120,
    transformOrigin: "0px 96px",
  },
  glove: { position: "absolute", left: -15, top: -10, width: 34, height: 49 },
  cuff: {
    position: "absolute",
    top: 26,
    left: 7,
    width: 24,
    height: 28,
    backgroundColor: "#242036",
    borderTopWidth: 5,
    borderTopColor: "#d8b771",
    borderRadius: 4,
  },
  palm: {
    position: "absolute",
    top: 0,
    left: 6,
    width: 25,
    height: 32,
    backgroundColor: "#ece5dc",
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "#bdb1a5",
  },
  finger: {
    position: "absolute",
    left: 0,
    width: 20,
    height: 8,
    borderRadius: 5,
    backgroundColor: "#fff7ec",
    borderWidth: 1,
    borderColor: "#d3c7b9",
  },
  thumb: {
    position: "absolute",
    top: 7,
    left: 17,
    width: 12,
    height: 22,
    borderRadius: 7,
    backgroundColor: "#f8efe4",
    borderWidth: 1,
    borderColor: "#c9bdae",
    transform: [{ rotate: "-27deg" }],
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 12,
  },
  wand: {
    position: "absolute",
    width: 44,
    height: 120,
    transformOrigin: "0px 0px",
  },
  touch: {
    position: "absolute",
    left: -22,
    top: -16,
    width: 44,
    height: 136,
    alignItems: "center",
  },
  shaft: {
    position: "absolute",
    top: 16,
    width: 9,
    height: 96,
    borderRadius: 5,
    backgroundColor: "#17152c",
    borderWidth: 1,
    borderColor: "#9c84b9",
  },
  handle: {
    position: "absolute",
    top: 80,
    width: 11,
    height: 34,
    borderRadius: 4,
    backgroundColor: "#d9ae62",
    borderWidth: 1,
    borderColor: "#fff0c4",
  },
  band: {
    position: "absolute",
    top: 76,
    width: 13,
    height: 5,
    borderRadius: 2,
    backgroundColor: "#fff0c4",
  },
  tip: {
    position: "absolute",
    top: 9,
    width: 11,
    height: 23,
    borderRadius: 4,
    backgroundColor: "#fff5d5",
  },
  tipHalo: {
    position: "absolute",
    top: -4,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f9d58930",
    boxShadow: "0px 0px 18px #e6b5ff99",
  },
  starVertical: {
    position: "absolute",
    top: 4,
    width: 3,
    height: 24,
    borderRadius: 2,
    backgroundColor: "#fff9e8",
  },
  starHorizontal: {
    position: "absolute",
    top: 14,
    width: 24,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#fff9e8",
  },
  dust: { position: "absolute", left: -2, top: -2, borderRadius: 2 },
  spellRing: {
    position: "absolute",
    left: 92,
    top: 134,
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: "#edceff",
    backgroundColor: "#e5b8ff15",
    boxShadow: "0px 0px 24px #dfb2ff66",
  },
});
