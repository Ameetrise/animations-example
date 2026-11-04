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
        rotate: `${(Math.atan2(flightY.value, flightX.value) * 180) / Math.PI}deg`,
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
            height: size * 0.68,
          },
          planeStyle,
        ]}
      >
        <Animated.View
          style={[
            styles.wing,
            {
              top: 0,
              borderLeftWidth: size,
              borderTopWidth: size * 0.34,
              borderLeftColor: "#FFF8E8",
            },
            upperStyle,
          ]}
        />
        <Animated.View
          style={[
            styles.wing,
            {
              top: size * 0.34,
              borderLeftWidth: size,
              borderBottomWidth: size * 0.34,
              borderLeftColor: "#D9BC7C",
            },
            lowerStyle,
          ]}
        />
        <View
          style={[
            styles.crease,
            {
              top: size * 0.34,
              width: size,
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
  wing: {
    position: "absolute",
    width: 0,
    height: 0,
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
  },
  crease: {
    position: "absolute",
    height: 1,
    backgroundColor: "#B28C48",
  },
});
