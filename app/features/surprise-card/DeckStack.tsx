import { StyleSheet } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  type SharedValue,
} from "react-native-reanimated";
import { CardBackDesign } from "./CardBackDesign";
import { deckPose } from "./deckMotion";

export function DeckStack({
  width,
  shuffle,
  progress,
}: {
  width: number;
  shuffle: SharedValue<number>;
  progress: SharedValue<number>;
}) {
  return (
    <>
      {Array.from({ length: 7 }, (_, layer) => (
        <DeckLayer
          key={layer}
          layer={layer}
          width={width}
          shuffle={shuffle}
          progress={progress}
        />
      ))}
    </>
  );
}

function DeckLayer({
  layer,
  width,
  shuffle,
  progress,
}: {
  layer: number;
  width: number;
  shuffle: SharedValue<number>;
  progress: SharedValue<number>;
}) {
  const motion = useAnimatedStyle(() => {
    const pose = deckPose(shuffle.value, layer, width);
    return {
      opacity: interpolate(shuffle.value, [0.78, 0.92], [1, 0], "clamp"),
      transform: [
        { perspective: 900 },
        { translateX: pose.x },
        { translateY: pose.y + progress.value * 18 },
        { rotateZ: `${pose.rotate}deg` },
        { rotateX: `${pose.tilt}deg` },
      ],
    };
  });
  return (
    <Animated.View
      pointerEvents="none"
      accessible={false}
      style={[
        styles.card,
        { width, height: width * 1.6, zIndex: layer },
        motion,
      ]}
    >
      <CardBackDesign width={width} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    position: "absolute",
    borderRadius: 12,
    borderWidth: 3,
    borderColor: "#fff7e6",
    backgroundColor: "#b62c20",
    overflow: "hidden",
  },
});
