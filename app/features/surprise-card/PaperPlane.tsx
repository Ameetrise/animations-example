import { palette } from "../../theme/colors";
import { StyleSheet, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  type SharedValue,
} from "react-native-reanimated";

type Props = {
  flight: SharedValue<number>;
  flightX: SharedValue<number>;
  flightY: SharedValue<number>;
  size: number;
};

export function PaperPlane({ flight, flightX, flightY, size }: Props) {
  const planeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(flight.value, [0.22, 0.34], [0, 1], "clamp"),
    transform: [
      {
        rotate: `${(Math.atan2(flightY.value, flightX.value) * 180) / Math.PI + interpolate(flight.value, [0.22, 0.45, 0.7, 1], [-16, -8, 5, 0], "clamp")}deg`,
      },
      {
        perspective: 700,
      },
      {
        rotateX: `${interpolate(flight.value, [0.22, 0.45, 0.7, 1], [0, -18, 18, 0], "clamp")}deg`,
      },
    ],
  }));
  const trailStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      flight.value,
      [0.42, 0.55, 0.82, 1],
      [0, 0.55, 0.3, 0],
      "clamp",
    ),
    transform: [
      {
        scaleX: interpolate(
          flight.value,
          [0.42, 0.7, 1],
          [0.3, 1.2, 0.5],
          "clamp",
        ),
      },
    ],
  }));
  const upperStyle = useAnimatedStyle(() => ({
    transform: [
      {
        perspective: 700,
      },
      {
        rotateX: `${interpolate(flight.value, [0.22, 0.4], [70, 0], "clamp")}deg`,
      },
    ],
  }));
  const lowerStyle = useAnimatedStyle(() => ({
    transform: [
      {
        perspective: 700,
      },
      {
        rotateX: `${interpolate(flight.value, [0.22, 0.4], [-70, 0], "clamp")}deg`,
      },
    ],
  }));

  return (
    <View pointerEvents="none" style={styles.layer}>
      <Animated.View
        style={[
          {
            width: size,
            height: size * 0.62,
          },
          planeStyle,
        ]}
      >
        <Animated.View
          style={[
            styles.trails,
            {
              top: size * 0.25,
              left: -size * 0.65,
              width: size * 0.55,
            },
            trailStyle,
          ]}
        >
          <View style={styles.trailLong} />
          <View style={styles.trailShort} />
        </Animated.View>
        <Animated.View
          style={[
            styles.wing,
            {
              top: 0,
              borderLeftWidth: size,
              borderTopWidth: size * 0.34,
              borderLeftColor: palette.planeIvory,
            },
            upperStyle,
          ]}
        />
        <Animated.View
          style={[
            styles.wing,
            {
              top: size * 0.34,
              left: size * 0.16,
              borderLeftWidth: size * 0.84,
              borderBottomWidth: size * 0.26,
              borderLeftColor: palette.planeGold,
            },
            lowerStyle,
          ]}
        />
        <View
          style={[
            styles.wing,
            {
              top: size * 0.34,
              left: size * 0.16,
              borderLeftWidth: size * 0.84,
              borderBottomWidth: size * 0.095,
              borderLeftColor: palette.paperPlaneCreaseBackgroundColor,
            },
          ]}
        />
        <View
          style={[
            styles.wing,
            {
              top: size * 0.245,
              left: size * 0.16,
              borderLeftWidth: size * 0.84,
              borderTopWidth: size * 0.095,
              borderLeftColor: palette.white,
            },
          ]}
        />
        <View
          style={[
            styles.crease,
            {
              top: size * 0.34,
              left: size * 0.16,
              width: size * 0.84,
            },
          ]}
        />
      </Animated.View>
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
    alignItems: "center",
    justifyContent: "center",
  },
  trails: {
    position: "absolute",
    gap: 8,
    alignItems: "flex-end",
  },
  trailLong: {
    width: "100%",
    height: 2,
    borderRadius: 2,
    backgroundColor: palette.planeGold,
  },
  trailShort: {
    width: "65%",
    height: 1,
    borderRadius: 1,
    backgroundColor: palette.planeGold,
  },
  wing: {
    position: "absolute",
    width: 0,
    height: 0,
    borderTopColor: palette.transparent,
    borderBottomColor: palette.transparent,
  },
  crease: {
    position: "absolute",
    height: 1,
    backgroundColor: palette.paperPlaneCreaseBackgroundColor,
  },
});
