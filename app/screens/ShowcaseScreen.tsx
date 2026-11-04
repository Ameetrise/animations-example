import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { useEffect, useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import { SafeAreaView } from "react-native-safe-area-context";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { demos } from "../features/demos";
import { FpsCounter } from "../components/FpsCounter";
import { spacing, type ThemeColors } from "../theme/tokens";

type Props = {
  colors: ThemeColors;
  isDark: boolean;
  onToggleTheme: () => void;
};

export function ShowcaseScreen({ colors, isDark, onToggleTheme }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const progress = useSharedValue(0);
  const rotation = useSharedValue(0);
  const themeOpacity = useSharedValue(1);
  const changingTheme = useSharedValue(false);
  const selectedDemo = demos[selectedIndex];
  const Demo = selectedDemo.Component;

  const fadeStyle = useAnimatedStyle(() => ({ opacity: themeOpacity.value }));
  const spinStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  useEffect(() => {
    return () => {
      cancelAnimation(progress);
      cancelAnimation(rotation);
      cancelAnimation(themeOpacity);
    };
  }, [progress, rotation, themeOpacity]);

  useEffect(() => {
    themeOpacity.value = withTiming(1, { duration: 250 }, (finished) => {
      if (finished) changingTheme.value = false;
    });
  }, [isDark, themeOpacity, changingTheme]);

  function toggleTheme() {
    if (changingTheme.value) return;
    changingTheme.value = true;
    rotation.value = withTiming(rotation.value + 360, { duration: 500 });
    themeOpacity.value = withTiming(0, { duration: 200 }, (finished) => {
      if (finished) scheduleOnRN(onToggleTheme);
    });
  }

  function playAnimation() {
    progress.value = withTiming(1, { duration: 700 });
  }

  function resetAnimation() {
    cancelAnimation(progress);
    progress.value = 0;
  }

  function selectDemo(index: number) {
    resetAnimation();
    setSelectedIndex(index);
  }

  return (
    <View style={styles.backdrop}>
      <Animated.View style={[styles.screen, fadeStyle]}>
        <SafeAreaView
          style={[styles.screen, { backgroundColor: colors.background }]}
        >
          <View style={styles.header}>
            <FpsCounter colors={colors} />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={
                isDark ? "Switch to light mode" : "Switch to dark mode"
              }
              onPress={toggleTheme}
              style={[
                styles.themeButton,
                { backgroundColor: colors.surface, borderColor: colors.border },
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
          </View>
          <View style={styles.stage}>
            <View key={selectedDemo.id} style={styles.preview}>
              <Demo colors={colors} progress={progress} />
            </View>
          </View>

          <View style={[styles.controls, { backgroundColor: colors.surface }]}>
            <View style={styles.row}>
              {demos.map((demo, index) => (
                <Pressable
                  key={demo.id}
                  accessibilityRole="button"
                  accessibilityState={{ selected: selectedIndex === index }}
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
                style={[styles.button, { borderColor: colors.border }]}
              >
                <Feather name="play" size={20} color={colors.text} />
                <Text style={[styles.buttonText, { color: colors.text }]}>
                  Play
                </Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={resetAnimation}
                style={[styles.button, { borderColor: colors.border }]}
              >
                <Feather name="rotate-ccw" size={20} color={colors.text} />
                <Text style={[styles.buttonText, { color: colors.text }]}>
                  Reset
                </Text>
              </Pressable>
            </View>
          </View>
        </SafeAreaView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "#121212" },
  screen: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.large,
    paddingTop: spacing.small,
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
