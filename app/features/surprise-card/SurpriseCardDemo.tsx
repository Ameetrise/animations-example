import Animated, { useAnimatedStyle } from "react-native-reanimated";
import Feather from "@expo/vector-icons/Feather";
import { StyleSheet, Text, View } from "react-native";
import type { DemoProps } from "../types";

export function SurpriseCardDemo({ colors, progress }: DemoProps) {
  const frontStyle = useAnimatedStyle(() => ({
    opacity: progress.value < 0.5 ? 1 : 0,
    transform: [
      { perspective: 1000 },
      { rotateY: `${progress.value * 180}deg` },
    ],
  }));
  const backStyle = useAnimatedStyle(() => ({
    opacity: progress.value >= 0.5 ? 1 : 0,
    transform: [
      { perspective: 1000 },
      { rotateY: `${180 + progress.value * 180}deg` },
    ],
  }));

  return (
    <View style={styles.card}>
      <Animated.View style={[styles.face, styles.front, frontStyle]}>
        <Text style={styles.brand}>Pack.com</Text>
        <View style={styles.gift}>
          <Feather name="gift" size={64} color="#FFFFFF" />
        </View>
        <Text style={styles.frontTitle}>A little surprise.</Text>
        <Text style={styles.frontCaption}>Press Play to see what's inside</Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.face,
          { backgroundColor: colors.surface, borderColor: colors.border },
          backStyle,
        ]}
      >
        <Text style={[styles.brand, { color: colors.text }]}>Pack.com</Text>
        <View style={styles.product}>
          <Feather name="headphones" size={64} color="#C2410C" />
        </View>
        <Text style={styles.eyebrow}>SURPRISE REVEALED</Text>
        <Text style={[styles.productTitle, { color: colors.text }]}>
          Wireless headphones
        </Text>
        <Text style={[styles.caption, { color: colors.muted }]}>
          Your next everyday favorite.
        </Text>
        <Text style={[styles.sample, { color: colors.muted }]}>
          Sample product
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    maxWidth: 300,
    height: 360,
    alignSelf: "center",
  },
  face: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: 28,
    borderWidth: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backfaceVisibility: "hidden",
  },
  front: {
    backgroundColor: "#C2410C",
    borderColor: "#EA580C",
  },
  brand: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },
  gift: {
    padding: 20,
    borderRadius: 80,
    backgroundColor: "#FFFFFF20",
    marginVertical: 8,
  },
  frontTitle: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
  },
  frontCaption: {
    color: "#FFFFFF",
    fontSize: 14,
    textAlign: "center",
  },
  product: {
    width: 110,
    height: 100,
    borderRadius: 24,
    backgroundColor: "#FFF0E6",
    alignItems: "center",
    justifyContent: "center",
  },
  eyebrow: {
    color: "#C2410C",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  productTitle: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },
  caption: {
    fontSize: 14,
    textAlign: "center",
  },
  sample: {
    fontSize: 11,
  },
});
