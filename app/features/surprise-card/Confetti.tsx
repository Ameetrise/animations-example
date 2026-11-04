import { useEffect, useState } from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  interpolate,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";

const colors = [
  "#E7BD62",
  "#69BB92",
  "#E58DB0",
  "#938BD8",
  "#64BDD0",
  "#FF985D",
];

function Piece({
  index,
  burst,
  width,
  height,
}: {
  index: number;
  burst: SharedValue<number>;
  width: number;
  height: number;
}) {
  const [seed] = useState(() => ({
    x: Math.random(),
    delay: Math.random() * 0.2,
    drift: Math.random() * 100 - 50,
    spin: Math.random() * 900 - 450,
    size: 5 + Math.random() * 5,
  }));
  const style = useAnimatedStyle(() => {
    const t = Math.max(
      0,
      Math.min(1, (burst.value - seed.delay) / (1 - seed.delay)),
    );
    return {
      opacity: interpolate(t, [0, 0.02, 0.85, 1], [0, 1, 1, 0]),
      transform: [
        {
          translateX:
            seed.x * width +
            Math.sin(t * Math.PI * 3 + index) * 22 +
            seed.drift * t,
        },
        { translateY: -30 + t * (height + 100) },
        { rotate: `${t * seed.spin}deg` },
        { rotateX: `${t * 720}deg` },
      ],
    };
  });
  return (
    <Animated.View
      style={[
        styles.piece,
        {
          width: seed.size,
          height: seed.size * (index % 3 === 0 ? 1 : 1.8),
          backgroundColor: colors[index % colors.length],
          borderRadius: index % 3 === 0 ? 6 : 1,
        },
        style,
      ]}
    />
  );
}

export function Confetti({ progress }: { progress: SharedValue<number> }) {
  const { width, height } = useWindowDimensions();
  const burst = useSharedValue(0);
  useAnimatedReaction(
    () => progress.value >= 0.55,
    (revealed, previous) => {
      if (revealed && !previous) {
        burst.value = 0;
        burst.value = withTiming(1, { duration: 4200, easing: Easing.linear });
      }
    },
  );
  useEffect(() => () => cancelAnimation(burst), [burst]);

  return (
    <View pointerEvents="none" accessible={false} style={styles.layer}>
      {Array.from({ length: 90 }, (_, index) => (
        <Piece
          key={index}
          index={index}
          burst={burst}
          width={width}
          height={height}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  layer: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    overflow: "hidden",
    zIndex: 20,
  },
  piece: { position: "absolute", top: 0, left: 0 },
});
