import { useEffect, useRef, useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import { SafeAreaView } from "react-native-safe-area-context";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
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
  const progress = useRef(new Animated.Value(0)).current;
  const rotation = useRef(new Animated.Value(0)).current;
  const themeOpacity = useRef(new Animated.Value(1)).current;
  const changingTheme = useRef(false);
  const turns = useRef(0);
  const selectedDemo = demos[selectedIndex];
  const Demo = selectedDemo.Component;

  useEffect(() => {
    return () => {
      progress.stopAnimation();
      rotation.stopAnimation();
      themeOpacity.stopAnimation();
    };
  }, [progress, rotation, themeOpacity]);

  useEffect(() => {
    Animated.timing(themeOpacity, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) changingTheme.current = false;
    });
  }, [isDark, themeOpacity]);

  function toggleTheme() {
    if (changingTheme.current) return;
    changingTheme.current = true;
    turns.current += 1;
    Animated.timing(rotation, {
      toValue: turns.current,
      duration: 500,
      useNativeDriver: true,
    }).start();
    Animated.timing(themeOpacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) onToggleTheme();
    });
  }

  function playAnimation() {
    progress.stopAnimation();
    Animated.timing(progress, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();
  }

  function resetAnimation() {
    progress.stopAnimation();
    progress.setValue(0);
  }

  function selectDemo(index: number) {
    progress.stopAnimation();
    progress.setValue(0);
    setSelectedIndex(index);
  }

  return (
    <View style={styles.backdrop}>
      <Animated.View style={[styles.screen, { opacity: themeOpacity }]}>
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
              <Animated.View
                style={{
                  transform: [
                    {
                      rotate: rotation.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["0deg", "360deg"],
                      }),
                    },
                  ],
                }}
              >
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
