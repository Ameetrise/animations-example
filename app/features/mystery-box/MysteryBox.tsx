import { brandName } from "../../config/brand";
import { palette } from "../../theme/colors";
import Feather from "@expo/vector-icons/Feather";
import { useEffect } from "react";
import Animated, {
  cancelAnimation,
  Easing,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";
import type { DemoProps } from "../types";
import { MagicWand } from "./MagicWand";
import { BoxPrize } from "./BoxPrize";
import { RevealSpark } from "./RevealSpark";
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
  progress: revealProgress,
  onOpen,
  opened,
  scale,
  cartRef,
  onAddedToCart,
}: Props) {
  const progress = useDerivedValue(() =>
    interpolate(revealProgress.value, [0.2, 1], [0, 1], "clamp"),
  );
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

  const boxStyle = useAnimatedStyle(() => {
    const tension = interpolate(
      progress.value,
      [0, 0.12, 0.23, 0.38],
      [0, 1, 1, 0],
      "clamp",
    );
    const recoil = interpolate(
      progress.value,
      [0.34, 0.43, 0.5, 0.58],
      [0, 1, -0.35, 0],
      "clamp",
    );
    return {
      transform: [
        {
          translateY: reduceMotion ? 0 : Math.sin(idle.value) * 4 + recoil * 7,
        },
        {
          rotate: `${reduceMotion ? 0 : Math.sin(idle.value * 2) * 1.2 + Math.sin(progress.value * 190) * tension * 2.4}deg`,
        },
        { scaleX: reduceMotion ? 1 : 1 + recoil * 0.025 },
        { scaleY: reduceMotion ? 1 : 1 - recoil * 0.035 },
      ],
    };
  });
  const lidStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      progress.value,
      reduceMotion ? [0.25, 0.45] : [0.55, 0.68],
      [1, 0],
      "clamp",
    ),
    transform: [
      { perspective: 700 },
      {
        translateY: reduceMotion
          ? 0
          : interpolate(
              progress.value,
              [0, 0.12, 0.18, 0.23, 0.28, 0.34, 0.43, 0.55, 0.68],
              [0, -3, 1, -8, -5, -18, -105, -145, -80],
              "clamp",
            ),
      },
      {
        translateX: reduceMotion
          ? 0
          : interpolate(
              progress.value,
              [0, 0.34, 0.43, 0.55, 0.68],
              [0, 0, -14, 85, throwDistance * 0.65],
              "clamp",
            ),
      },
      {
        rotateZ: reduceMotion
          ? "0deg"
          : `${interpolate(
              progress.value,
              [0, 0.18, 0.23, 0.28, 0.34, 0.43, 0.68],
              [0, -2, 3, -3, 0, -16, 95],
              "clamp",
            )}deg`,
      },
      {
        rotateX: reduceMotion
          ? "0deg"
          : `${interpolate(progress.value, [0.34, 0.48, 0.68], [0, -28, 30], "clamp")}deg`,
      },
    ],
  }));
  const seamStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      progress.value,
      [0, 0.16, 0.34, 0.5, 0.85, 1],
      [0, 0.3, 1, 0.85, 0.4, 0.2],
      "clamp",
    ),
    transform: [
      {
        scaleX: interpolate(
          progress.value,
          [0, 0.34, 1],
          [0.65, 1, 1],
          "clamp",
        ),
      },
    ],
  }));
  const shadowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.4, 0.65, 1], [0.8, 1, 0.6, 0.7]),
    transform: [
      {
        scaleX: reduceMotion
          ? 1
          : interpolate(progress.value, [0, 0.4, 0.55, 1], [1, 1.08, 0.96, 1]),
      },
    ],
  }));
  const tagStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${reduceMotion ? 0 : Math.sin(progress.value * 48) * interpolate(progress.value, [0, 0.35, 0.65, 1], [0, 14, 8, 0], "clamp")}deg`,
      },
    ],
  }));
  const lightStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      progress.value,
      [0.18, 0.3, 0.45, 0.7, 1],
      [0, 0.3, 0.8, 0.45, 0],
      "clamp",
    ),
    transform: [
      {
        scaleY: interpolate(
          progress.value,
          [0.18, 0.6, 1],
          [0.1, 1, 1.1],
          "clamp",
        ),
      },
      {
        scaleX: interpolate(
          progress.value,
          [0.18, 0.6, 1],
          [0.6, 1, 1.15],
          "clamp",
        ),
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
    opacity: interpolate(progress.value, [0, 0.16, 0.3], [0, 0, 1], "clamp"),
  }));

  return (
    <View style={styles.stage}>
      {!opened &&
        !reduceMotion &&
        [0, 1, 2, 3, 4].map((index) => (
          <ShootingStar key={index} index={index} />
        ))}
      <Animated.View pointerEvents="box-none" style={[styles.scene, boxStyle]}>
        <Animated.View pointerEvents="none" style={[styles.glow, glowStyle]} />
        <Animated.View
          pointerEvents="none"
          style={[styles.prizeBurst, burstStyle]}
        />
        <Animated.View
          pointerEvents="none"
          style={[styles.lightBeam, lightStyle]}
        />
        <Animated.View style={[styles.shadow, shadowStyle]} />
        <View style={styles.contactShadow} />
        <Animated.View style={[styles.interior, insideStyle]}>
          <View style={styles.rimShape} />
          <View style={styles.cavityShape} />
          <View style={styles.backWall} />
          <View style={styles.innerFloor} />
          <View style={styles.leftInnerWall} />
          <View style={styles.rightInnerWall} />
          <View style={styles.innerFront} />
        </Animated.View>
        <BoxPrize
          progress={progress}
          scale={scale}
          cartRef={cartRef}
          onAddedToCart={onAddedToCart}
        />
        <Animated.View
          pointerEvents="none"
          style={[styles.openingRim, seamStyle]}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open mystery box"
          disabled={opened}
          onPress={onOpen}
          style={styles.body}
        >
          <View style={styles.frontLight} />
          <View pointerEvents="none" style={styles.foilFrame} />
          {[0, 1, 2, 3].map((corner) => (
            <View
              key={corner}
              style={[
                styles.cornerCap,
                {
                  left: corner % 2 === 0 ? 5 : undefined,
                  right: corner % 2 ? 5 : undefined,
                  top: corner < 2 ? 5 : undefined,
                  bottom: corner >= 2 ? 10 : undefined,
                },
              ]}
            />
          ))}
          {[0, 1, 2, 3, 4, 5].map((mark) => (
            <Text
              key={mark}
              style={[
                styles.constellation,
                {
                  left: 12 + (mark % 3) * 76,
                  top: 20 + Math.floor(mark / 3) * 87,
                },
              ]}
            >
              ✦
            </Text>
          ))}
          <View style={styles.side} />
          <View style={styles.bodyRibbon}>
            <View style={styles.ribbonShine} />
          </View>
          <View style={styles.lidShadow} />
          <View style={styles.bottomEdge} />
          <View style={styles.label}>
            <Feather name="moon" size={18} color={palette.boxGold} />
            <Text style={styles.brand}>{brandName}</Text>
            <Text style={styles.caption}>SEALED WITH MAGIC</Text>
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
        {!reduceMotion &&
          Array.from(
            {
              length: 14,
            },
            (_, index) => (
              <RevealSpark key={index} index={index} progress={progress} />
            ),
          )}
        <Animated.View
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, tagStyle]}
        >
          <View style={styles.tagString} />
          <View style={styles.tag}>
            <View style={styles.tagHole} />
            <Text style={styles.question}>?</Text>
          </View>
        </Animated.View>
      </Animated.View>
      <MagicWand
        progress={revealProgress}
        idle={idle}
        opened={opened}
        onCast={onOpen}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  foilFrame: {
    position: "absolute",
    top: 7,
    left: 7,
    right: 7,
    bottom: 12,
    borderWidth: 1,
    borderColor: "#d9b77b66",
    borderRadius: 4,
  },
  cornerCap: {
    position: "absolute",
    width: 13,
    height: 13,
    borderWidth: 2,
    borderColor: "#eacb8b",
    borderRadius: 3,
    backgroundColor: "#ba925333",
  },
  constellation: { position: "absolute", fontSize: 11, color: "#eacb8b99" },
  openingRim: {
    position: "absolute",
    top: 87,
    left: 37,
    width: 206,
    height: 6,
    borderRadius: 2,
    backgroundColor: palette.sparkleGold,
    boxShadow: "0px -4px 16px rgba(255, 211, 128, 0.8)",
  },
  stage: {
    width: 280,
    height: 420,
    justifyContent: "flex-end",
  },
  lightBeam: {
    position: "absolute",
    top: -120,
    left: 55,
    width: 170,
    height: 200,
    borderTopLeftRadius: 80,
    borderTopRightRadius: 80,
    backgroundColor: palette.mysteryBoxGlowBackgroundColor,
    borderBottomWidth: 3,
    borderBottomColor: palette.sparkleGold,
    boxShadow: palette.mysteryBoxGlowBoxShadow,
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
    top: 27,
    width: 210,
    height: 65,
  },
  rimShape: {
    position: "absolute",
    width: 210,
    height: 0,
    borderLeftWidth: 18,
    borderRightWidth: 18,
    borderBottomWidth: 65,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#a18467",
  },
  cavityShape: {
    position: "absolute",
    left: 6,
    top: 5,
    width: 198,
    height: 0,
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderBottomWidth: 56,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#100e1d",
  },
  backWall: {
    position: "absolute",
    left: 22,
    right: 22,
    top: 5,
    height: 24,
    backgroundColor: "#362b46",
    borderTopWidth: 2,
    borderTopColor: "#dcc3a0",
    borderBottomWidth: 1,
    borderBottomColor: "#594666",
  },
  innerFloor: {
    position: "absolute",
    left: 22,
    right: 22,
    top: 29,
    height: 25,
    backgroundColor: "#161222",
    borderTopWidth: 1,
    borderTopColor: "#08070e",
  },
  leftInnerWall: {
    position: "absolute",
    left: 8,
    top: 7,
    width: 0,
    height: 0,
    borderTopWidth: 48,
    borderRightWidth: 15,
    borderTopColor: "transparent",
    borderRightColor: "#55405e",
  },
  rightInnerWall: {
    position: "absolute",
    right: 8,
    top: 7,
    width: 0,
    height: 0,
    borderTopWidth: 48,
    borderLeftWidth: 15,
    borderTopColor: "transparent",
    borderLeftColor: "#2c223b",
  },
  innerFront: {
    position: "absolute",
    left: 4,
    right: 4,
    bottom: 0,
    height: 5,
    backgroundColor: "#c3a578",
    borderTopWidth: 1,
    borderTopColor: "#ffe0a5",
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
    backgroundColor: "#29243f",
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
    backgroundColor: "#18152b",
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
    backgroundColor: "#201b33",
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
    borderBottomColor: "#51415f",
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
    backgroundColor: "#392e4c",
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
