import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  interpolate,
  cancelAnimation,
  Easing,
  useSharedValue,
  useReducedMotion,
  withRepeat,
  withSequence,
  withTiming,
  useAnimatedStyle,
  type SharedValue,
} from "react-native-reanimated";

type Props = {
  index: number;
  progress: SharedValue<number>;
  float: SharedValue<number>;
};

export function ShiningStar({ index, progress, float }: Props) {
  const [path] = useState(() =>
    Array.from({ length: 4 }, () => ({
      x: Math.random() * 260 - 130,
      y: Math.random() * 190 - 95,
      duration: 1800 + Math.random() * 2000,
    })),
  );
  const x = useSharedValue(path[0].x);
  const y = useSharedValue(path[0].y);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!reduceMotion) {
      const config = (duration: number) => ({
        duration,
        easing: Easing.inOut(Easing.sin),
      });
      x.value = withRepeat(
        withSequence(
          ...[1, 2, 3, 0].map((i) =>
            withTiming(path[i].x, config(path[i].duration)),
          ),
        ),
        -1,
      );
      y.value = withRepeat(
        withSequence(
          ...[1, 2, 3, 0].map((i) =>
            withTiming(path[i].y, config(path[i].duration)),
          ),
        ),
        -1,
      );
    }
    return () => {
      cancelAnimation(x);
      cancelAnimation(y);
    };
  }, [path, reduceMotion, x, y]);
  const angle = (index / 8) * Math.PI * 2;
  const animatedStyle = useAnimatedStyle(() => {
    const burst = interpolate(progress.value, [0.55, 0.95], [0, 1], "clamp");
    const idle = progress.value === 0;
    const twinkle = (Math.sin(float.value * 2 + index * 1.7) + 1) / 2;
    const radius = 50 + burst * 100;
    return {
      opacity: idle
        ? 0.2 + twinkle * 0.8
        : interpolate(
            progress.value,
            [0, 0.55, 0.65, 0.9, 1],
            [0, 0, 1, 1, 0],
            "clamp",
          ),
      transform: [
        { translateX: idle ? x.value : Math.cos(angle) * radius },
        { translateY: idle ? y.value : Math.sin(angle) * radius * 0.8 },
        { rotate: `${float.value * 57 + index * 20 + burst * 90}deg` },
        {
          scale: idle ? 0.35 + twinkle * 0.65 : 0.4 + Math.sin(burst * Math.PI),
        },
      ],
    };
  });

  return (
    <Animated.Text
      pointerEvents="none"
      accessible={false}
      style={[styles.star, animatedStyle]}
    >
      ✦
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  star: { position: "absolute", color: "#E8AD32", fontSize: 26, zIndex: 3 },
});
