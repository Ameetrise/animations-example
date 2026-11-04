import { brandName } from "../../config/brand";
import { useState } from "react";
import Animated, {
  interpolate,
  useAnimatedReaction,
  useAnimatedStyle,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import type { DemoProps } from "../types";
import { MysteryBox } from "./MysteryBox";

export function MysteryBoxDemo({
  colors,
  availableHeight,
  progress,
  onReveal,
  hasPlayed,
  cartRef,
  onAddedToCart,
}: DemoProps) {
  const [won, setWon] = useState(false);
  useAnimatedReaction(
    () => progress.value >= 0.85,
    (revealed, previous) => {
      if (revealed !== previous) scheduleOnRN(setWon, revealed);
    },
  );
  const titleStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(progress.value, [0, 0.8, 0.88, 1], [1, 1, 1.08, 1]),
      },
    ],
  }));
  const { width } = useWindowDimensions();
  const scale = Math.min(
    1,
    (width - 64) / 280,
    Math.max(0.5, (availableHeight - 120) / 420),
  );

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.eyebrow,
          {
            color: colors.muted,
          },
        ]}
      >
        {brandName} · MYSTERY BOX
      </Text>
      <Animated.Text
        accessibilityLiveRegion="polite"
        style={[
          styles.title,
          titleStyle,
          {
            color: colors.text,
          },
        ]}
      >
        {won
          ? "You won AirPods Max!"
          : hasPlayed
            ? "Something special is inside…"
            : "Good things come boxed."}
      </Animated.Text>
      <View
        style={{
          width: 280 * scale,
          height: 420 * scale,
          marginVertical: 16,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            transform: [
              {
                scale,
              },
            ],
          }}
        >
          <MysteryBox
            progress={progress}
            cartRef={cartRef}
            onAddedToCart={onAddedToCart}
            scale={scale}
            onOpen={onReveal}
            opened={hasPlayed}
          />
        </View>
      </View>
      <Text
        style={[
          styles.caption,
          {
            color: colors.muted,
          },
        ]}
      >
        {won
          ? "Your winning pick. Tap to add to your cart."
          : hasPlayed
            ? "Wait for it…"
            : "Tap the box. Let the magic out."}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.7,
  },
  title: {
    fontSize: 25,
    fontWeight: "700",
    marginTop: 10,
    textAlign: "center",
  },
  caption: {
    fontSize: 14,
    textAlign: "center",
  },
});
