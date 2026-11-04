import { palette } from "../../theme/colors";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

export function ShootingStar({ index }: { index: number }) {
  const flight = useSharedValue(0);

  useEffect(() => {
    flight.set(
      withDelay(
        index * 540,
        withRepeat(
          withTiming(1, {
            duration: 2400 + index * 210,
            easing: Easing.linear,
          }),
          -1,
        ),
      ),
    );
    return () => cancelAnimation(flight);
  }, [flight, index]);

  const starStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      flight.value,
      [0, 0.08, 0.32, 0.46, 1],
      [0, 1, 1, 0, 0],
    ),
    transform: [
      {
        translateX: 14 + index * 51 + Math.sin(flight.value * Math.PI) * 18,
      },
      {
        translateY: 150 + (index % 3) * 45 - flight.value * 100,
      },
      {
        rotate: `${flight.value * 90}deg`,
      },
      {
        scale: interpolate(
          flight.value,
          [0, 0.18, 0.46, 1],
          [0.3, 1, 0.3, 0.3],
        ),
      },
    ],
  }));

  return (
    <Animated.View pointerEvents="none" style={[styles.star, starStyle]}>
      <View style={styles.vertical} />
      <View style={styles.horizontal} />
      <View style={styles.center} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  star: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  vertical: {
    position: "absolute",
    width: 3,
    height: 18,
    borderRadius: 3,
    backgroundColor: palette.sparkleGold,
  },
  horizontal: {
    position: "absolute",
    width: 18,
    height: 3,
    borderRadius: 3,
    backgroundColor: palette.sparkleGold,
  },
  center: {
    width: 6,
    height: 6,
    borderRadius: 2,
    backgroundColor: palette.shootingStarCenterBackgroundColor,
    transform: [
      {
        rotate: "45deg",
      },
    ],
  },
});
