import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";

type Props = { isDark: boolean; progress: SharedValue<number> };

export function AnimatedBackdrop({ isDark, progress }: Props) {
  const drift = useSharedValue(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!reduceMotion) {
      drift.value = withRepeat(
        withTiming(Math.PI * 2, { duration: 22000, easing: Easing.linear }),
        -1,
        false,
      );
    }
    return () => cancelAnimation(drift);
  }, [drift, reduceMotion]);

  const warmStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: Math.sin(drift.value) * 24 },
      { translateY: Math.cos(drift.value) * 18 },
    ],
  }));
  const coolStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: -Math.sin(drift.value) * 22 },
      { translateY: -Math.cos(drift.value) * 26 },
    ],
  }));
  const orbitStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${Math.sin(drift.value) * 8 - 24}deg` }],
  }));
  const glowStyle = useAnimatedStyle(() => ({
    opacity: 0.05 + Math.sin(progress.value * Math.PI) * 0.1,
    transform: [{ scale: 0.9 + progress.value * 0.25 }],
  }));

  return (
    <View pointerEvents="none" accessible={false} style={styles.background}>
      <Animated.View
        style={[
          styles.orb,
          styles.warm,
          { backgroundColor: isDark ? "#B8742820" : "#F4C88335" },
          warmStyle,
        ]}
      >
        <View
          style={[
            styles.innerOrb,
            { backgroundColor: isDark ? "#B8742818" : "#F4C88325" },
          ]}
        />
      </Animated.View>
      <Animated.View
        style={[
          styles.orb,
          styles.cool,
          { backgroundColor: isDark ? "#7774C520" : "#B9B4DF30" },
          coolStyle,
        ]}
      />
      <Animated.View
        style={[
          styles.orbit,
          { borderColor: isDark ? "#F6DAA314" : "#B7833520" },
          orbitStyle,
        ]}
      />
      <Animated.View style={[styles.glow, glowStyle]} />
      {Array.from({ length: 12 }, (_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            {
              left: `${8 + ((index * 29) % 84)}%`,
              top: `${12 + ((index * 17) % 72)}%`,
              backgroundColor: isDark ? "#F7DCA345" : "#AD7C3540",
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    overflow: "hidden",
  },
  orb: {
    position: "absolute",
    width: 390,
    height: 390,
    borderRadius: 195,
    alignItems: "center",
    justifyContent: "center",
  },
  warm: { top: "12%", left: -170 },
  cool: { bottom: "12%", right: -210 },
  innerOrb: { width: 270, height: 270, borderRadius: 135 },
  orbit: {
    position: "absolute",
    width: 480,
    height: 330,
    borderRadius: 240,
    borderWidth: 1,
    top: "28%",
    left: -60,
  },
  glow: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    alignSelf: "center",
    top: "30%",
    backgroundColor: "#E8AD32",
  },
  dot: { position: "absolute", width: 3, height: 3, borderRadius: 2 },
});
