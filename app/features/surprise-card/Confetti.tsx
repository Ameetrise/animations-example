import { palette } from "../../theme/colors";
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
  palette.gold,
  palette.confettiGreen,
  palette.confettiPink,
  palette.confettiPurple,
  palette.confettiBlue,
  palette.confettiOrange,
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
    startY: -Math.random() * 0.4,
    duration: 0.55 + Math.random() * 0.25,
    fall: 1.2 + Math.random() * 0.65,
    sway: 20 + Math.random() * 65,
    frequency: 1.2 + Math.random() * 3,
    phase: Math.random() * Math.PI * 2,
    tumble: Math.random() * 900 - 450,
    delay: Math.random() * 0.2,
    drift: Math.random() * 100 - 50,
    spin: Math.random() * 900 - 450,
    size: 5 + Math.random() * 5,
  }));
  const style = useAnimatedStyle(() => {
    const t = Math.max(
      0,
      Math.min(1, (burst.value - seed.delay) / seed.duration),
    );
    return {
      opacity: interpolate(t, [0, 0.02, 0.85, 1], [0, 1, 1, 0]),
      transform: [
        {
          translateX:
            seed.x * width +
            Math.sin(t * Math.PI * seed.frequency + seed.phase) * seed.sway +
            seed.drift * t,
        },
        {
          translateY:
            seed.startY * height -
            20 +
            (t * 0.55 + t * t * 0.45) * height * seed.fall +
            Math.sin(t * Math.PI * 4 + seed.phase) * 14,
        },
        {
          rotate: `${t * seed.spin}deg`,
        },
        {
          rotateX: `${t * seed.tumble}deg`,
        },
        {
          rotateY: `${Math.sin(t * Math.PI * seed.frequency) * 65}deg`,
        },
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

export function Confetti({
  progress,
  triggerAt = 0.55,
}: {
  progress: SharedValue<number>;
  triggerAt?: number;
}) {
  const { width, height } = useWindowDimensions();
  const burst = useSharedValue(0);
  useAnimatedReaction(
    () => progress.value >= triggerAt,
    (revealed, previous) => {
      if (revealed && !previous) {
        burst.value = 0;
        burst.value = withTiming(1, {
          duration: 4200,
          easing: Easing.linear,
        });
      }
    },
  );
  useEffect(() => () => cancelAnimation(burst), [burst]);

  return (
    <View pointerEvents="none" accessible={false} style={styles.layer}>
      {Array.from(
        {
          length: 90,
        },
        (_, index) => (
          <Piece
            key={index}
            index={index}
            burst={burst}
            width={width}
            height={height}
          />
        ),
      )}
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
  piece: {
    position: "absolute",
    top: 0,
    left: 0,
  },
});
