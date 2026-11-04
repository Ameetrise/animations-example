import { useCallback, useEffect, useState } from "react";
import { AppState, StyleSheet, Text, View } from "react-native";
import { useFrameCallback, useSharedValue } from "react-native-reanimated";
import type { FrameInfo } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import type { ThemeColors } from "../theme/tokens";

export function FpsCounter({ colors }: { colors: ThemeColors }) {
  const [fps, setFps] = useState<number | null>(null);
  const frames = useSharedValue(0);
  const elapsed = useSharedValue(0);

  const measureFrame = useCallback(
    (frame: FrameInfo) => {
      "worklet";
      const delta = frame.timeSincePreviousFrame;

      if (delta === null) {
        frames.value = 0;
        elapsed.value = 0;
        return;
      }

      frames.value += 1;
      elapsed.value += delta;

      if (elapsed.value >= 500) {
        scheduleOnRN(setFps, Math.round((frames.value * 1000) / elapsed.value));
        frames.value = 0;
        elapsed.value = 0;
      }
    },
    [frames, elapsed],
  );

  const callback = useFrameCallback(measureFrame);

  useEffect(() => {
    callback.setActive(AppState.currentState === "active");
    const subscription = AppState.addEventListener("change", (state) => {
      callback.setActive(state === "active");
      setFps(null);
    });

    return () => {
      subscription.remove();
    };
  }, [callback]);

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <Text style={[styles.label, { color: colors.text }]}>
        UI FPS {fps ?? "—"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    minHeight: 48,
    justifyContent: "center",
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
});
