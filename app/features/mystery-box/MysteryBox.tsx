import Feather from "@expo/vector-icons/Feather";
import { StyleSheet, Text, View } from "react-native";

export function MysteryBox() {
  return (
    <View
      accessible
      accessibilityLabel="Closed Pack.com mystery gift box with a gold ribbon"
      style={styles.scene}
    >
      <View style={styles.shadow} />
      <View style={styles.body}>
        <View style={styles.side} />
        <View style={styles.bodyRibbon} />
        <View style={styles.bottomEdge} />
        <View style={styles.label}>
          <Feather name="package" size={18} color="#EACB8B" />
          <Text style={styles.brand}>Pack.com</Text>
          <Text style={styles.caption}>SOMETHING SPECIAL</Text>
        </View>
      </View>
      <View style={styles.lid}>
        <View style={styles.lidTop} />
        <View style={styles.topRibbon} />
        <View style={styles.lidFront}>
          <View style={styles.lidRibbon} />
          <View style={styles.lidHighlight} />
        </View>
        <View style={[styles.bowLoop, styles.bowLeft]} />
        <View style={[styles.bowLoop, styles.bowRight]} />
        <View style={styles.knot} />
      </View>
      <View style={styles.tagString} />
      <View style={styles.tag}>
        <View style={styles.tagHole} />
        <Text style={styles.question}>?</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scene: {
    width: 280,
    height: 260,
  },
  shadow: {
    position: "absolute",
    bottom: 2,
    left: 24,
    width: 236,
    height: 24,
    borderRadius: 120,
    backgroundColor: "#00000016",
  },
  body: {
    position: "absolute",
    top: 92,
    left: 35,
    width: 210,
    height: 142,
    backgroundColor: "#24384B",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#3D5267",
  },
  side: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 24,
    backgroundColor: "#172737",
    borderLeftWidth: 1,
    borderLeftColor: "#496073",
  },
  bodyRibbon: {
    position: "absolute",
    left: 86,
    top: 0,
    bottom: 0,
    width: 30,
    backgroundColor: "#D2AC61",
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: "#F0D18F",
  },
  bottomEdge: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 7,
    backgroundColor: "#00000018",
  },
  label: {
    position: "absolute",
    top: 35,
    left: 33,
    width: 124,
    height: 74,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D5B879",
    backgroundColor: "#1C2E3F",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  brand: {
    color: "#F5DFB0",
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: -0.4,
  },
  caption: {
    color: "#D5B879",
    fontSize: 6,
    letterSpacing: 1.4,
    fontWeight: "600",
  },
  lid: {
    position: "absolute",
    left: 25,
    top: 27,
    width: 230,
    height: 72,
  },
  lidTop: {
    position: "absolute",
    top: 0,
    width: 230,
    height: 0,
    borderLeftWidth: 18,
    borderRightWidth: 18,
    borderBottomWidth: 42,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#476077",
  },
  topRibbon: {
    position: "absolute",
    left: 98,
    top: 0,
    width: 32,
    height: 42,
    backgroundColor: "#E7C983",
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: "#F9E4AF",
  },
  lidFront: {
    position: "absolute",
    top: 42,
    width: 230,
    height: 30,
    borderRadius: 5,
    backgroundColor: "#304A61",
    borderBottomWidth: 5,
    borderBottomColor: "#122230",
    overflow: "hidden",
  },
  lidRibbon: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 98,
    width: 32,
    backgroundColor: "#CDA45A",
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: "#F0D18F",
  },
  lidHighlight: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "#FFFFFF30",
  },
  bowLoop: {
    position: "absolute",
    top: -6,
    width: 48,
    height: 27,
    borderWidth: 7,
    borderColor: "#E6C47E",
    backgroundColor: "#31495C",
    borderRadius: 20,
  },
  bowLeft: {
    left: 68,
    transform: [
      {
        rotate: "25deg",
      },
    ],
  },
  bowRight: {
    left: 111,
    transform: [
      {
        rotate: "-25deg",
      },
    ],
  },
  knot: {
    position: "absolute",
    top: 7,
    left: 104,
    width: 20,
    height: 17,
    borderRadius: 5,
    backgroundColor: "#EFD495",
    borderWidth: 1,
    borderColor: "#B78A43",
  },
  tagString: {
    position: "absolute",
    top: 69,
    left: 175,
    width: 1,
    height: 48,
    backgroundColor: "#E6C47E",
    transform: [
      {
        rotate: "-28deg",
      },
    ],
  },
  tag: {
    position: "absolute",
    top: 107,
    left: 177,
    width: 31,
    height: 43,
    borderRadius: 5,
    backgroundColor: "#F3DEAC",
    alignItems: "center",
    transform: [
      {
        rotate: "-12deg",
      },
    ],
  },
  tagHole: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 5,
    backgroundColor: "#7E6338",
  },
  question: {
    color: "#513C1F",
    fontSize: 24,
    fontWeight: "700",
  },
});
