import { palette } from "../theme/colors";
import { Confetti } from "../features/surprise-card/Confetti";
import type { ComponentRef } from "react";
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSequence,
  withSpring,
  Easing,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { useEffect, useRef, useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import { SafeAreaView } from "react-native-safe-area-context";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { demos } from "../features/demos";
import { AnimatedBackdrop } from "../components/AnimatedBackdrop";
import { FpsCounter } from "../components/FpsCounter";
import { spacing, type ThemeColors } from "../theme/tokens";

type Props = {
  colors: ThemeColors;
  isDark: boolean;
  onToggleTheme: () => void;
};

export function ShowcaseScreen({ colors, isDark, onToggleTheme }: Props) {
  const [stageHeight, setStageHeight] = useState(500);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [round, setRound] = useState(0);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const cartRef = useRef<ComponentRef<typeof View>>(null);
  const cartScale = useSharedValue(1);
  const progress = useSharedValue(0);
  const rotation = useSharedValue(0);
  const themeOpacity = useSharedValue(1);
  const changingTheme = useSharedValue(false);
  const selectedDemo = demos[selectedIndex];
  const Demo = selectedDemo.Component;

  const cartStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: cartScale.value,
      },
    ],
  }));
  const fadeStyle = useAnimatedStyle(() => ({
    opacity: themeOpacity.value,
  }));
  const spinStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${rotation.value}deg`,
      },
    ],
  }));

  useEffect(() => {
    return () => {
      cancelAnimation(cartScale);
      cancelAnimation(progress);
      cancelAnimation(rotation);
      cancelAnimation(themeOpacity);
    };
  }, [progress, rotation, themeOpacity, cartScale]);

  useEffect(() => {
    themeOpacity.value = withTiming(
      1,
      {
        duration: 250,
      },
      (finished) => {
        if (finished) changingTheme.value = false;
      },
    );
  }, [isDark, themeOpacity, changingTheme]);

  function toggleTheme() {
    if (changingTheme.value) return;
    changingTheme.value = true;
    rotation.value = withTiming(rotation.value + 360, {
      duration: 500,
    });
    themeOpacity.value = withTiming(
      0,
      {
        duration: 200,
      },
      (finished) => {
        if (finished) scheduleOnRN(onToggleTheme);
      },
    );
  }

  const playDisabled =
    hasPlayed || (selectedIndex === 0 && selectedCard === null);

  function playAnimation() {
    if (playDisabled) return;
    setHasPlayed(true);
    if (selectedIndex === 2) return;
    progress.value =
      selectedIndex === 0
        ? withSequence(
            withTiming(0.3, {
              duration: 420,
              easing: Easing.out(Easing.cubic),
            }),
            withTiming(0.35, {
              duration: 180,
            }),
            withTiming(0.75, {
              duration: 620,
              easing: Easing.inOut(Easing.cubic),
            }),
            withTiming(1, {
              duration: 440,
              easing: Easing.out(Easing.quad),
            }),
          )
        : withSequence(
            withTiming(0.18, {
              duration: 900,
              easing: Easing.inOut(Easing.quad),
            }),
            withTiming(0.18, {
              duration: 350,
            }),
            withTiming(0.45, {
              duration: 900,
              easing: Easing.in(Easing.cubic),
            }),
            withTiming(1, {
              duration: 2600,
              easing: Easing.out(Easing.quad),
            }),
          );
  }

  function addToCart() {
    setCartCount((count) => count + 1);
    cartScale.value = withSequence(
      withTiming(1.2, {
        duration: 140,
      }),
      withSpring(1, {
        damping: 12,
        stiffness: 220,
      }),
    );
  }

  function pickCard(index: number) {
    if (!hasPlayed) setSelectedCard(index);
  }

  function resetAnimation() {
    cancelAnimation(progress);
    progress.value = 0;
    setSelectedCard(null);
    setHasPlayed(false);
    setRound((value) => value + 1);
  }

  function selectDemo(index: number) {
    resetAnimation();
    setSelectedIndex(index);
  }

  return (
    <View style={styles.backdrop}>
      <Animated.View style={[styles.screen, fadeStyle]}>
        <SafeAreaView
          style={[
            styles.screen,
            {
              backgroundColor: colors.background,
            },
          ]}
        >
          <AnimatedBackdrop isDark={isDark} progress={progress} />
          <View style={styles.header}>
            <FpsCounter colors={colors} />
            <View style={styles.headerActions}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={
                  isDark ? "Switch to light mode" : "Switch to dark mode"
                }
                onPress={toggleTheme}
                style={[
                  styles.themeButton,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Animated.View style={spinStyle}>
                  <Feather
                    name={isDark ? "sun" : "moon"}
                    size={24}
                    color={colors.text}
                  />
                </Animated.View>
              </Pressable>
              <Animated.View style={cartStyle}>
                <View ref={cartRef} collapsable={false}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Cart, ${cartCount} items`}
                    onPress={() =>
                      Alert.alert(
                        "Your cart",
                        cartCount
                          ? `${cartCount} × AirPods Max`
                          : "Reveal a card, then tap it to add your headphones.",
                      )
                    }
                    style={[
                      styles.themeButton,
                      {
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <Feather
                      name="shopping-cart"
                      size={24}
                      color={colors.text}
                    />
                    {cartCount > 0 && (
                      <View style={styles.cartBadge}>
                        <Text style={styles.cartCount}>{cartCount}</Text>
                      </View>
                    )}
                  </Pressable>
                </View>
              </Animated.View>
            </View>
          </View>
          <View
            style={styles.stage}
            onLayout={(event) =>
              setStageHeight(event.nativeEvent.layout.height)
            }
          >
            <View key={`${selectedDemo.id}-${round}`} style={styles.preview}>
              <Demo
                colors={colors}
                availableHeight={stageHeight - 48}
                cartRef={cartRef}
                onAddedToCart={addToCart}
                onReveal={playAnimation}
                hasPlayed={hasPlayed}
                progress={progress}
                selectedCard={selectedCard}
                onSelectCard={pickCard}
              />
            </View>
          </View>

          <View
            style={[
              styles.controls,
              {
                backgroundColor: colors.surface,
              },
            ]}
          >
            <View style={styles.row}>
              {demos.map((demo, index) => (
                <Pressable
                  key={demo.id}
                  accessibilityRole="button"
                  accessibilityState={{
                    selected: selectedIndex === index,
                  }}
                  onPress={() => selectDemo(index)}
                  style={[
                    styles.button,
                    {
                      backgroundColor:
                        selectedIndex === index ? colors.text : colors.surface,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      {
                        color:
                          selectedIndex === index
                            ? colors.surface
                            : colors.text,
                      },
                    ]}
                  >
                    {demo.title}
                  </Text>
                </Pressable>
              ))}
            </View>
            <View style={styles.row}>
              <Pressable
                accessibilityRole="button"
                onPress={playAnimation}
                disabled={playDisabled}
                accessibilityState={{
                  disabled: playDisabled,
                }}
                style={[
                  styles.button,
                  {
                    borderColor: colors.border,
                    opacity: playDisabled ? 0.4 : 1,
                  },
                ]}
              >
                <Feather name="play" size={20} color={colors.text} />
                <Text
                  style={[
                    styles.buttonText,
                    {
                      color: colors.text,
                    },
                  ]}
                >
                  Reveal
                </Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={resetAnimation}
                style={[
                  styles.button,
                  {
                    borderColor: colors.border,
                  },
                ]}
              >
                <Feather name="rotate-ccw" size={20} color={colors.text} />
                <Text
                  style={[
                    styles.buttonText,
                    {
                      color: colors.text,
                    },
                  ]}
                >
                  Reset
                </Text>
              </Pressable>
            </View>
          </View>
        </SafeAreaView>
        {(selectedIndex !== 0 || selectedCard === 0) && (
          <Confetti
            key={`${selectedIndex}-${round}`}
            progress={progress}
            triggerAt={
              selectedIndex === 2 ? 0.6 : selectedIndex === 1 ? 0.85 : 0.55
            }
          />
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    overflow: "hidden",
    backgroundColor: palette.showcaseScreenBackdropBackgroundColor,
  },
  screen: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.large,
    paddingTop: spacing.small,
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  cartBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 4,
    borderRadius: 10,
    backgroundColor: palette.showcaseScreenCartBadgeBackgroundColor,
    alignItems: "center",
    justifyContent: "center",
  },
  cartCount: {
    color: palette.white,
    fontSize: 11,
    fontWeight: "700",
  },
  themeButton: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 12,
  },
  stage: {
    zIndex: 2,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.large,
  },
  preview: {
    width: "100%",
    maxWidth: 360,
  },
  controls: {
    padding: spacing.medium,
    gap: spacing.medium,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  row: {
    flexDirection: "row",
    gap: spacing.small,
  },
  button: {
    flex: 1,
    minHeight: 48,
    padding: spacing.small,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.small,
    borderWidth: 1,
    borderRadius: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    flexShrink: 1,
    textAlign: "center",
  },
});
