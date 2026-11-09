import { brandName } from "../../config/brand";
import { palette } from "../../theme/colors";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  FadeInDown,
  FadeOutUp,
  ReduceMotion,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import type { DemoProps } from "../types";
import { DeckStack } from "./DeckStack";
import { DepositAnimation } from "./DepositAnimation";
import { PlayingCard } from "./PlayingCard";
import { ShiningStar } from "./ShiningStar";

const products = [
  {
    name: "$500 cash reward",
    icon: "dollar-sign",
    suit: "♠",
  },
  {
    name: "AirPods Max",
    icon: "headphones",
    suit: "♥",
  },
  {
    name: "AirPods Max",
    icon: "headphones",
    suit: "♦",
  },
] as const;

export function SurpriseCardDemo({
  colors,
  availableHeight,
  cartRef,
  onAddedToCart,
  progress,
  selectedCard,
  onSelectCard,
  onReveal,
  hasPlayed,
}: DemoProps) {
  const [claimingMoney, setClaimingMoney] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  function finishAdding() {
    setAddedToCart(true);
    onAddedToCart();
  }

  const { width } = useWindowDimensions();
  const compact = availableHeight < 460;
  const tableHeight = Math.max(200, availableHeight - (compact ? 166 : 206));
  const cardWidth = Math.min(110, (width - 72) / 3.6, (tableHeight - 50) / 2.8);
  const float = useSharedValue(0);
  const reduceMotion = useReducedMotion();
  const shuffle = useSharedValue(reduceMotion ? 1 : 0);
  const [isShuffling, setIsShuffling] = useState(!reduceMotion);

  useEffect(() => {
    if (reduceMotion) {
      shuffle.value = 1;
      return;
    }
    shuffle.value = withSequence(
      withTiming(0.22, { duration: 950, easing: Easing.inOut(Easing.cubic) }),
      withTiming(0.36, { duration: 650, easing: Easing.inOut(Easing.cubic) }),
      withTiming(0.48, { duration: 600, easing: Easing.linear }),
      withTiming(0.58, { duration: 400, easing: Easing.inOut(Easing.sin) }),
      withTiming(0.75, { duration: 850, easing: Easing.inOut(Easing.cubic) }),
      withTiming(1, { duration: 850, easing: Easing.linear }, (finished) => {
        if (finished) scheduleOnRN(setIsShuffling, false);
      }),
    );
    return () => cancelAnimation(shuffle);
  }, [shuffle, reduceMotion]);

  useEffect(() => {
    if (!reduceMotion)
      float.value = withRepeat(
        withTiming(Math.PI * 2, {
          duration: 4800,
          easing: Easing.linear,
        }),
        -1,
        false,
      );
    return () => cancelAnimation(float);
  }, [float, reduceMotion]);

  const brandStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      (Math.sin(float.value) + 1) / 2,
      [0, 1],
      [colors.text, palette.surpriseCardDemoColor],
    ),
  }));
  const hintStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0.35, 0.5], [1, 0], "clamp"),
    transform: [
      {
        translateY: interpolate(progress.value, [0.35, 0.5], [0, -8], "clamp"),
      },
    ],
  }));
  const revealedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0.6, 0.8], [0, 1], "clamp"),
    transform: [
      {
        translateY: interpolate(progress.value, [0.6, 0.8], [12, 0], "clamp"),
      },
    ],
  }));
  const hint = isShuffling
    ? "Split. Riffle. A little magic."
    : selectedCard === null
      ? "Which one is calling your name?"
      : "Tap your card again, or press Reveal.";
  const message = addedToCart
    ? "In your cart. Nice pick!"
    : selectedCard === 0
      ? "Your reward is ready. Tap to collect."
      : "Tap the card. Make it yours.";

  return (
    <View style={styles.container}>
      <Animated.View
        entering={FadeInDown.duration(450).reduceMotion(ReduceMotion.System)}
        style={styles.brandRow}
      >
        <Animated.Text style={[styles.brand, brandStyle]}>
          {brandName}
        </Animated.Text>
        <View
          style={[
            styles.badge,
            {
              borderColor: colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.eyebrow,
              {
                color: colors.muted,
              },
            ]}
          >
            SURPRISE PICKS
          </Text>
        </View>
      </Animated.View>
      <Animated.Text
        accessibilityRole="header"
        entering={FadeInDown.delay(140)
          .duration(500)
          .reduceMotion(ReduceMotion.System)}
        style={[
          styles.title,
          {
            color: colors.text,
          },
          compact && styles.compactTitle,
        ]}
      >
        One pick.{compact ? " " : "\n"}
        <Text style={styles.accent}>A little magic.</Text>
      </Animated.Text>
      <View
        style={[
          styles.table,
          {
            height: tableHeight,
          },
        ]}
      >
        {claimingMoney ? (
          <View
            style={{
              width: "100%",
              height: 310,
              transform: [
                {
                  scale: Math.min(1, tableHeight / 310),
                },
              ],
            }}
          >
            <DepositAnimation colors={colors} />
          </View>
        ) : (
          <>
            <DeckStack
              width={cardWidth * 1.35}
              shuffle={shuffle}
              progress={progress}
            />
            {products.map((product, index) => (
              <PlayingCard
                key={index}
                index={index}
                product={product}
                cartRef={cartRef}
                onAddedToCart={finishAdding}
                onClaimMoney={() => setClaimingMoney(true)}
                width={cardWidth}
                selected={selectedCard === index}
                hasSelection={selectedCard !== null}
                progress={progress}
                float={float}
                shuffle={shuffle}
                disabled={isShuffling || (hasPlayed && selectedCard !== index)}
                onPress={() =>
                  selectedCard === index ? onReveal() : onSelectCard(index)
                }
              />
            ))}
            {Array.from(
              {
                length: 8,
              },
              (_, index) => (
                <ShiningStar
                  key={index}
                  index={index}
                  progress={progress}
                  float={float}
                />
              ),
            )}
          </>
        )}
      </View>
      <View style={styles.footer}>
        <Animated.View style={[styles.copy, hintStyle]}>
          <Animated.Text
            key={hint}
            entering={FadeInDown.duration(250).reduceMotion(
              ReduceMotion.System,
            )}
            exiting={FadeOutUp.duration(150).reduceMotion(ReduceMotion.System)}
            style={[
              styles.hint,
              {
                color: colors.text,
              },
            ]}
          >
            {hint}
          </Animated.Text>
          <Text
            style={[
              styles.sample,
              {
                color: colors.muted,
              },
            ]}
          >
            {isShuffling
              ? "Your surprise is getting ready"
              : selectedCard === null
                ? "Choose one of the three cards"
                : "Your choice. Your little lucky moment."}
          </Text>
        </Animated.View>
        <Animated.View style={[styles.copy, revealedStyle]}>
          <Text
            style={[
              styles.productName,
              {
                color: colors.text,
              },
            ]}
          >
            {claimingMoney
              ? "A little payday magic."
              : selectedCard === null
                ? ""
                : products[selectedCard].name}
          </Text>
          <Animated.Text
            key={message}
            entering={FadeInDown.duration(250).reduceMotion(
              ReduceMotion.System,
            )}
            style={[
              styles.sample,
              {
                color: colors.muted,
              },
            ]}
          >
            {claimingMoney ? "Printed. Approved. Collected." : message}
          </Animated.Text>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "100%",
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  brand: {
    fontSize: 23,
    fontWeight: "800",
    letterSpacing: -0.8,
  },
  badge: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  eyebrow: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.2,
  },
  accent: {
    color: palette.surpriseCardDemoColor,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 12,
    lineHeight: 33,
  },
  table: {
    width: "100%",
    marginVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  compactTitle: {
    fontSize: 23,
    lineHeight: 29,
    marginTop: 10,
  },
  footer: {
    height: 76,
    width: "100%",
  },
  copy: {
    position: "absolute",
    width: "100%",
    alignItems: "center",
    gap: 5,
  },
  productName: {
    fontSize: 21,
    fontWeight: "700",
  },
  hint: {
    textAlign: "center",
    fontSize: 15,
    lineHeight: 24,
  },
  sample: {
    fontSize: 12,
    textAlign: "center",
  },
});
