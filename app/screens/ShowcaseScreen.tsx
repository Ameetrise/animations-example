import { useEffect, useRef, useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import { SafeAreaView } from "react-native-safe-area-context";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { demos } from "../features/demos";
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
  const turns = useRef(0);
  const selectedDemo = demos[selectedIndex];
  const Demo = selectedDemo.Component;

  useEffect(() => {
    return () => {
      progress.stopAnimation();
      rotation.stopAnimation();
    };
  }, [progress, rotation]);

  function toggleTheme() {
    turns.current += 1;
    Animated.timing(rotation, {
      toValue: turns.current,
      duration: 350,
      useNativeDriver: true,
    }).start();
    onToggleTheme();
  }

  function playAnimation() {
    progress.stopAnimation();
    Animated.timing(progress, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();
  }

  function restartAnimation() {
    progress.stopAnimation();
    progress.setValue(0);
    playAnimation();
  }

  function selectDemo(index: number) {
    progress.stopAnimation();
    progress.setValue(0);
    setSelectedIndex(index);
  }

  return (
    <SafeAreaView
      style={[styles.screen, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
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
        <Animated.View
          key={selectedDemo.id}
          style={[
            styles.preview,
            {
              opacity: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0.4, 1],
              }),
              transform: [
                {
                  scale: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <Demo colors={colors} />
        </Animated.View>
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
                      selectedIndex === index ? colors.surface : colors.text,
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
            onPress={restartAnimation}
            style={[styles.button, { borderColor: colors.border }]}
          >
            <Feather name="rotate-ccw" size={20} color={colors.text} />
            <Text style={[styles.buttonText, { color: colors.text }]}>
              Restart
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    alignItems: "flex-end",
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
