import { StyleSheet } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  type SharedValue,
} from "react-native-reanimated";

type Props = {
  index: number;
  progress: SharedValue<number>;
  float: SharedValue<number>;
};

export function ShiningStar({ index, progress, float }: Props) {
  const angle = (index / 8) * Math.PI * 2;
  const animatedStyle = useAnimatedStyle(() => {
    const burst = interpolate(progress.value, [0.55, 0.95], [0, 1], "clamp");
    const idle = progress.value === 0;
    const twinkle = (Math.sin(float.value * 2 + index * 1.7) + 1) / 2;
    const orbit = angle + float.value;
    const radius = idle
      ? 118 + Math.sin(float.value + index) * 14
      : 50 + burst * 100;
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
        { translateX: Math.cos(idle ? orbit : angle) * radius },
        { translateY: Math.sin(idle ? orbit : angle) * radius * 0.8 },
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
