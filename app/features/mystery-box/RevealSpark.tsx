import { StyleSheet, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  type SharedValue,
} from "react-native-reanimated";
import { palette } from "../../theme/colors";

type Props = {
  index: number;
  progress: SharedValue<number>;
};

export function RevealSpark({ index, progress }: Props) {
  const style = useAnimatedStyle(() => {
    const start = 0.44 + (index % 4) * 0.035;
    const t = interpolate(progress.value, [start, 1], [0, 1], "clamp");
    const direction = index % 2 === 0 ? -1 : 1;
    return {
      opacity: interpolate(t, [0, 0.12, 0.65, 1], [0, 1, 0.85, 0]),
      transform: [
        {
          translateX:
            direction * (25 + (index % 5) * 18) * Math.sin(t * Math.PI * 0.8),
        },
        {
          translateY: -t * (150 + (index % 4) * 25) + t * t * 30,
        },
        {
          rotate: `${t * direction * 180}deg`,
        },
        {
          scale: Math.sin(t * Math.PI) * (index % 3 === 0 ? 1.2 : 0.7),
        },
      ],
    };
  });

  return (
    <Animated.View pointerEvents="none" style={[styles.spark, style]}>
      <View style={styles.vertical} />
      <View style={styles.horizontal} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  spark: {
    position: "absolute",
    left: 132,
    top: 55,
    width: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 6,
  },
  vertical: {
    position: "absolute",
    width: 3,
    height: 16,
    borderRadius: 3,
    backgroundColor: palette.sparkleGold,
  },
  horizontal: {
    width: 16,
    height: 3,
    borderRadius: 3,
    backgroundColor: palette.sparkleGold,
  },
});
