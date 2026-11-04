import { SafeAreaProvider } from "react-native-safe-area-context";
import { useState } from "react";
import { useColorScheme } from "react-native";
import { StatusBar } from "expo-status-bar";
import { ShowcaseScreen } from "./screens/ShowcaseScreen";
import { darkColors, lightColors } from "./theme/tokens";

export default function App() {
  const systemTheme = useColorScheme();
  const [selectedTheme, setSelectedTheme] = useState<"light" | "dark" | null>(
    null,
  );

  const isDark = (selectedTheme ?? systemTheme) === "dark";
  const colors = isDark ? darkColors : lightColors;

  function toggleTheme() {
    setSelectedTheme(isDark ? "light" : "dark");
  }

  return (
    <SafeAreaProvider>
      <ShowcaseScreen
        colors={colors}
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />
      <StatusBar style={isDark ? "light" : "dark"} />
    </SafeAreaProvider>
  );
}
