import Feather from "@expo/vector-icons/Feather";
import { StyleSheet, Text, View } from "react-native";

export function CardBackDesign({ width }: { width: number }) {
  return (
    <View pointerEvents="none" accessible={false} style={styles.design}>
      <View style={styles.satinBand} />
      <View style={[styles.satinBand, styles.secondBand]} />
      {Array.from({ length: 24 }, (_, index) => (
        <View
          key={index}
          style={[
            styles.pattern,
            {
              left: `${9 + (index % 4) * 25}%`,
              top: `${7 + Math.floor(index / 4) * 17}%`,
            },
          ]}
        />
      ))}
      <View style={styles.outerBorder} />
      <View style={styles.innerBorder} />
      {[0, 1, 2, 3].map((corner) => (
        <View
          key={corner}
          style={[
            styles.corner,
            {
              top: corner < 2 ? 14 : undefined,
              bottom: corner >= 2 ? 14 : undefined,
              left: corner % 2 === 0 ? 14 : undefined,
              right: corner % 2 === 1 ? 14 : undefined,
              transform: [{ rotate: `${[0, 90, 270, 180][corner]}deg` }],
            },
          ]}
        />
      ))}
      <Text style={[styles.flourish, styles.top]}>✦</Text>
      <View style={styles.center}>
        <View
          style={[styles.seal, { width: width * 0.68, height: width * 0.68 }]}
        >
          {[0, 45, 90, 135].map((angle) => (
            <View
              key={angle}
              style={[
                styles.petal,
                {
                  width: width * 0.64,
                  height: width * 0.3,
                  transform: [{ rotate: `${angle}deg` }],
                },
              ]}
            />
          ))}
        </View>
        <View
          style={[styles.emblem, { width: width * 0.44, height: width * 0.44 }]}
        >
          <View style={styles.emblemInset} />
          <View style={styles.upright}>
            <Feather name="package" size={width * 0.2} color="#EACB8B" />
          </View>
        </View>
        <Text style={[styles.brand, { fontSize: width * 0.105 }]}>
          Pack.com
        </Text>
        <View style={styles.divider} />
        <Text style={[styles.caption, { fontSize: width * 0.045 }]}>
          A LITTLE MAGIC
        </Text>
      </View>
      <Text style={[styles.flourish, styles.bottom]}>✦</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  design: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  satinBand: {
    position: "absolute",
    width: "160%",
    height: "24%",
    top: "8%",
    backgroundColor: "#73899C0D",
    transform: [{ rotate: "-35deg" }],
  },
  secondBand: { top: "65%", backgroundColor: "#00000018" },
  corner: {
    position: "absolute",
    width: 13,
    height: 13,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderColor: "#EACB8BA0",
    borderTopLeftRadius: 5,
  },
  seal: {
    position: "absolute",
    top: -12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#EACB8B40",
  },
  petal: {
    position: "absolute",
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#EACB8B45",
  },
  pattern: {
    position: "absolute",
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: "#EACB8B22",
    transform: [{ rotate: "45deg" }],
  },
  outerBorder: {
    position: "absolute",
    top: 6,
    right: 6,
    bottom: 6,
    left: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#EACB8B90",
  },
  innerBorder: {
    position: "absolute",
    top: 10,
    right: 10,
    bottom: 10,
    left: 10,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "#EACB8B30",
  },
  center: { alignItems: "center" },
  emblem: {
    backgroundColor: "#273A4A",
    borderWidth: 1.5,
    borderColor: "#EACB8B",
    borderRadius: 12,
    transform: [{ rotate: "45deg" }],
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  emblemInset: {
    position: "absolute",
    top: 4,
    right: 4,
    bottom: 4,
    left: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#EACB8B45",
  },
  upright: { transform: [{ rotate: "-45deg" }] },
  brand: { color: "#F5DFB0", fontWeight: "800", letterSpacing: -0.4 },
  divider: {
    width: 28,
    height: 1,
    backgroundColor: "#EACB8B60",
    marginVertical: 7,
  },
  caption: { color: "#D1B880", fontWeight: "600", letterSpacing: 1.3 },
  flourish: { position: "absolute", color: "#EACB8B", fontSize: 13 },
  top: { top: 14 },
  bottom: { bottom: 14, transform: [{ rotate: "180deg" }] },
});
