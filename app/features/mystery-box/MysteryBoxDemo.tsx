import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import type { DemoProps } from "../types";
import { MysteryBox } from "./MysteryBox";

export function MysteryBoxDemo({ colors, availableHeight }: DemoProps) {
  const { width } = useWindowDimensions();
  const scale = Math.min(
    1,
    (width - 64) / 280,
    Math.max(0.5, (availableHeight - 120) / 260),
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
        PACK.COM · MYSTERY BOX
      </Text>
      <Text
        style={[
          styles.title,
          {
            color: colors.text,
          },
        ]}
      >
        Good things come boxed.
      </Text>
      <View
        style={{
          width: 280 * scale,
          height: 260 * scale,
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
          <MysteryBox />
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
        A little mystery. A lot to discover.
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
