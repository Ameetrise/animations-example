import { palette } from "../../theme/colors";
import Feather from "@expo/vector-icons/Feather";
import { useEffect } from "react";
import Animated, {
  cancelAnimation,
  Easing,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";
import type { DemoProps } from "../types";
import { BoxPrize } from "./BoxPrize";
import { ShootingStar } from "./ShootingStar";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

type Props = Pick<DemoProps, "cartRef" | "onAddedToCart"> & {
  progress: SharedValue<number>;
  onOpen: () => void;
  opened: boolean;
  scale: number;
};

export function MysteryBox({
  progress,
  onOpen,
  opened,
  scale,
  cartRef,
  onAddedToCart,
}: Props) {
  const { width } = useWindowDimensions();
  const throwDistance = (width + 300) / scale;
  const idle = useSharedValue(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!opened && !reduceMotion) {
      idle.set(
        withRepeat(
          withTiming(Math.PI * 2, {
            duration: 2600,
            easing: Easing.linear,
          }),
          -1,
        ),
      );
    } else {
      idle.set(
        withTiming(0, {
          duration: 200,
        }),
      );
    }
    return () => cancelAnimation(idle);
  }, [idle, opened, reduceMotion]);

  const boxStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: Math.sin(idle.value) * 5,
      },
      {
        rotate: `${Math.sin(idle.value * 2) * 1.5 + (reduceMotion ? 0 : Math.sin(progress.value * 150) * interpolate(progress.value, [0, 0.1, 0.22], [0, 3, 0], "clamp"))}deg`,
      },
    ],
  }));
  const lidStyle = useAnimatedStyle(() => ({
    opacity: reduceMotion
      ? interpolate(progress.value, [0, 0.4], [1, 0], "clamp")
      : progress.value < 0.8
        ? 1
        : 0,
    transform: [
      {
        translateY: reduceMotion
          ? 0
          : interpolate(
              progress.value,
              [0, 0.18, 0.45, 0.8],
              [0, 5, -110, -40],
              "clamp",
            ),
      },
      {
        translateX: reduceMotion
          ? 0
          : interpolate(
              progress.value,
              [0, 0.18, 0.8],
              [0, -8, throwDistance],
              "clamp",
            ),
      },
      {
        rotate: reduceMotion
          ? "0deg"
          : `${interpolate(progress.value, [0, 0.18, 0.8], [0, -4, 160], "clamp")}deg`,
      },
    ],
  }));
  const burstStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0.78, 0.86, 1], [0, 0.8, 0], "clamp"),
    transform: [
      {
        scale: interpolate(progress.value, [0.78, 1], [0.4, 1.8], "clamp"),
      },
    ],
  }));
  const glowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      progress.value,
      [0.2, 0.45, 0.8, 1],
      [0, 0.7, 0.4, 0.2],
      "clamp",
    ),
    transform: [
      {
        scale: interpolate(progress.value, [0.2, 1], [0.5, 1.2], "clamp"),
      },
    ],
  }));
  const insideStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.2, 0.4], [0, 0, 1], "clamp"),
  }));

  return (
    <View style={styles.stage}>
      {!opened &&
        !reduceMotion &&
        [0, 1, 2, 3, 4].map((index) => (
          <ShootingStar key={index} index={index} />
        ))}
      <Animated.View style={[styles.scene, boxStyle]}>
        <Animated.View pointerEvents="none" style={[styles.glow, glowStyle]} />
        <Animated.View
          pointerEvents="none"
          style={[styles.prizeBurst, burstStyle]}
        />
        <View style={styles.shadow} />
        <View style={styles.contactShadow} />
        <Animated.View style={[styles.interior, insideStyle]}>
          <View style={styles.innerFloor} />
          <View style={styles.innerFront} />
        </Animated.View>
        <BoxPrize
          progress={progress}
          scale={scale}
          cartRef={cartRef}
          onAddedToCart={onAddedToCart}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open mystery box"
          disabled={opened}
          onPress={onOpen}
          style={styles.body}
        >
          <View style={styles.frontLight} />
          <View style={styles.side} />
          <View style={styles.bodyRibbon}>
            <View style={styles.ribbonShine} />
          </View>
          <View style={styles.lidShadow} />
          <View style={styles.bottomEdge} />
          <View style={styles.label}>
            <Feather name="package" size={18} color={palette.boxGold} />
            <Text style={styles.brand}>Pack.com</Text>
            <Text style={styles.caption}>SOMETHING SPECIAL</Text>
          </View>
        </Pressable>
        <Animated.View pointerEvents="none" style={[styles.lid, lidStyle]}>
          <View style={styles.lidTop} />
          <View style={styles.topEdge} />
          <View style={styles.topRibbon}>
            <View style={styles.ribbonShine} />
          </View>
          <View style={styles.lidFront}>
            <View style={styles.lidRibbon} />
            <View style={styles.lidHighlight} />
            <View style={styles.lidSide} />
          </View>
          <View style={[styles.ribbonTail, styles.tailLeft]} />
          <View style={[styles.ribbonTail, styles.tailRight]} />
          <View style={[styles.bowLoop, styles.bowLeft]} />
          <View style={[styles.bowLoop, styles.bowRight]} />
          <View style={styles.knot} />
        </Animated.View>
        <View style={styles.tagString} />
        <View style={styles.tag}>
          <View style={styles.tagHole} />
          <Text style={styles.question}>?</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    width: 280,
    height: 420,
    justifyContent: "flex-end",
  },
  prizeBurst: {
    position: "absolute",
    top: -110,
    left: 40,
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: palette.sparkleGold,
  },
  glow: {
    position: "absolute",
    top: -120,
    left: 25,
    width: 230,
    height: 230,
    borderRadius: 115,
    backgroundColor: palette.mysteryBoxGlowBackgroundColor,
    boxShadow: palette.mysteryBoxGlowBoxShadow,
  },
  interior: {
    position: "absolute",
    left: 35,
    top: 49,
    width: 210,
    height: 47,
    backgroundColor: palette.mysteryBoxInteriorBackgroundColor,
    borderWidth: 5,
    borderTopColor: palette.mysteryBoxInteriorBorderTopColor,
    borderLeftColor: palette.mysteryBoxInteriorBorderLeftColor,
    borderRightColor: palette.mysteryBoxInteriorBorderRightColor,
    borderBottomColor: palette.mysteryBoxInteriorBorderBottomColor,
    borderRadius: 5,
    overflow: "hidden",
  },
  innerFloor: {
    position: "absolute",
    left: 14,
    right: 14,
    top: 13,
    bottom: 0,
    backgroundColor: palette.mysteryBoxInnerFloorBackgroundColor,
    borderTopWidth: 1,
    borderTopColor: palette.mysteryBoxInnerFloorBorderTopColor,
  },
  innerFront: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 5,
    backgroundColor: palette.mysteryBoxInnerFrontBackgroundColor,
  },
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
    backgroundColor: palette.mysteryBoxShadowBackgroundColor,
  },
  contactShadow: {
    position: "absolute",
    bottom: 15,
    left: 43,
    width: 196,
    height: 14,
    borderRadius: 100,
    backgroundColor: palette.mysteryBoxContactShadowBackgroundColor,
    boxShadow: palette.mysteryBoxContactShadowBoxShadow,
  },
  body: {
    position: "absolute",
    top: 92,
    left: 35,
    width: 210,
    height: 142,
    backgroundColor: palette.mysteryBoxBodyBackgroundColor,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: palette.mysteryBoxBodyBorderColor,
  },
  frontLight: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 7,
    width: 65,
    backgroundColor: palette.mysteryBoxFrontLightBackgroundColor,
    borderLeftWidth: 2,
    borderLeftColor: palette.mysteryBoxFrontLightBorderLeftColor,
  },
  lidShadow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 9,
    backgroundColor: palette.mysteryBoxLidShadowBackgroundColor,
    boxShadow: palette.mysteryBoxLidShadowBoxShadow,
  },
  side: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 24,
    backgroundColor: palette.mysteryBoxSideBackgroundColor,
    borderLeftWidth: 1,
    borderLeftColor: palette.mysteryBoxSideBorderLeftColor,
  },
  bodyRibbon: {
    position: "absolute",
    left: 86,
    top: 0,
    bottom: 0,
    width: 30,
    backgroundColor: palette.mysteryBoxBodyRibbonBackgroundColor,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: palette.mysteryBoxBodyRibbonBorderColor,
  },
  ribbonShine: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 5,
    width: 7,
    backgroundColor: palette.mysteryBoxRibbonShineBackgroundColor,
    borderRightWidth: 1,
    borderRightColor: palette.mysteryBoxRibbonShineBorderRightColor,
  },
  bottomEdge: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 7,
    backgroundColor: palette.mysteryBoxBottomEdgeBackgroundColor,
  },
  label: {
    position: "absolute",
    top: 35,
    left: 33,
    width: 124,
    height: 74,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: palette.mysteryBoxLabelBorderColor,
    backgroundColor: palette.mysteryBoxLabelBackgroundColor,
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    boxShadow: palette.mysteryBoxLabelBoxShadow,
  },
  brand: {
    color: palette.mysteryBoxBrandColor,
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: -0.4,
  },
  caption: {
    color: palette.mysteryBoxLabelBorderColor,
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
    borderLeftColor: palette.transparent,
    borderRightColor: palette.transparent,
    borderBottomColor: palette.mysteryBoxLidTopBorderBottomColor,
  },
  topRibbon: {
    position: "absolute",
    left: 98,
    top: 0,
    width: 32,
    height: 42,
    backgroundColor: palette.mysteryBoxTopRibbonBackgroundColor,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: palette.mysteryBoxTopRibbonBorderColor,
  },
  topEdge: {
    position: "absolute",
    top: 0,
    left: 18,
    right: 18,
    height: 1,
    backgroundColor: palette.mysteryBoxTopEdgeBackgroundColor,
  },
  lidFront: {
    position: "absolute",
    top: 42,
    width: 230,
    height: 30,
    borderRadius: 5,
    backgroundColor: palette.mysteryBoxLidFrontBackgroundColor,
    borderBottomWidth: 5,
    borderBottomColor: palette.mysteryBoxLidFrontBorderBottomColor,
    overflow: "hidden",
  },
  lidRibbon: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 98,
    width: 32,
    backgroundColor: palette.mysteryBoxLidRibbonBackgroundColor,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: palette.mysteryBoxBodyRibbonBorderColor,
  },
  lidHighlight: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: palette.mysteryBoxLidHighlightBackgroundColor,
  },
  lidSide: {
    position: "absolute",
    top: 2,
    right: 0,
    bottom: 0,
    width: 24,
    backgroundColor: palette.mysteryBoxLidSideBackgroundColor,
    borderLeftWidth: 1,
    borderLeftColor: palette.mysteryBoxLidSideBorderLeftColor,
  },
  ribbonTail: {
    position: "absolute",
    top: 14,
    width: 16,
    height: 30,
    backgroundColor: palette.mysteryBoxRibbonTailBackgroundColor,
    borderLeftWidth: 2,
    borderLeftColor: palette.mysteryBoxRibbonTailBorderLeftColor,
    borderBottomRightRadius: 7,
  },
  tailLeft: {
    left: 91,
    transform: [
      {
        rotate: "28deg",
      },
    ],
  },
  tailRight: {
    left: 121,
    transform: [
      {
        rotate: "-24deg",
      },
    ],
  },
  bowLoop: {
    position: "absolute",
    top: -6,
    width: 48,
    height: 27,
    borderWidth: 7,
    borderColor: palette.mysteryBoxBowLoopBorderColor,
    borderTopColor: palette.mysteryBoxBowLoopBorderTopColor,
    borderBottomColor: palette.mysteryBoxBowLoopBorderBottomColor,
    backgroundColor: palette.mysteryBoxBowLoopBackgroundColor,
    borderRadius: 20,
    boxShadow: palette.mysteryBoxBowLoopBoxShadow,
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
    backgroundColor: palette.mysteryBoxKnotBackgroundColor,
    borderWidth: 1,
    borderColor: palette.mysteryBoxKnotBorderColor,
    borderTopColor: palette.mysteryBoxKnotBorderTopColor,
    borderBottomWidth: 3,
    boxShadow: palette.mysteryBoxKnotBoxShadow,
  },
  tagString: {
    position: "absolute",
    top: 69,
    left: 175,
    width: 1,
    height: 48,
    backgroundColor: palette.mysteryBoxBowLoopBorderColor,
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
    backgroundColor: palette.mysteryBoxTagBackgroundColor,
    alignItems: "center",
    borderWidth: 1,
    borderColor: palette.mysteryBoxTagBorderColor,
    borderBottomColor: palette.mysteryBoxTagBorderBottomColor,
    boxShadow: palette.mysteryBoxTagBoxShadow,
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
    backgroundColor: palette.mysteryBoxTagHoleBackgroundColor,
  },
  question: {
    color: palette.mysteryBoxQuestionColor,
    fontSize: 24,
    fontWeight: "700",
  },
});
