import { StyleSheet, Text, View } from "react-native";
import { spacing, type ThemeColors } from "../theme/tokens";

type Props = { label: string; colors: ThemeColors };

export function DemoPlaceholder({ label, colors }: Props) {
  return (
    <View
      style={[
        styles.stage,
        {
          borderColor: colors.border,
        },
      ]}
    >
      <Text
        style={[
          styles.label,
          {
            color: colors.text,
          },
        ]}
      >
        {label}
      </Text>
      <Text
        style={{
          color: colors.muted,
        }}
      >
        Animation coming soon
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    minHeight: 180,
    padding: spacing.large,
    gap: spacing.small,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 16,
  },
  label: {
    fontSize: 20,
    fontWeight: "600",
  },
});
