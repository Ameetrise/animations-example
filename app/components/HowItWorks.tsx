import Feather from "@expo/vector-icons/Feather";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { implementationNotes } from "../content/implementationNotes";
import type { ThemeColors } from "../theme/tokens";

type Props = {
  visible: boolean;
  onClose: () => void;
  colors: ThemeColors;
};

export function HowItWorks({ visible, onClose, colors }: Props) {
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView
        style={[
          styles.screen,
          {
            backgroundColor: colors.background,
          },
        ]}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text
              accessibilityRole="header"
              style={[
                styles.title,
                {
                  color: colors.text,
                },
              ]}
            >
              How it works
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close explanation"
              onPress={onClose}
              style={[
                styles.closeButton,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <Feather name="x" size={24} color={colors.text} />
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={styles.notes}>
            <Text
              selectable
              style={[
                styles.body,
                {
                  color: colors.text,
                },
              ]}
            >
              {implementationNotes || "Implementation notes coming soon."}
            </Text>
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    flex: 1,
    width: "100%",
    maxWidth: 680,
    alignSelf: "center",
  },
  header: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  title: {
    flex: 1,
    fontSize: 26,
    fontWeight: "700",
  },
  closeButton: {
    width: 48,
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  notes: {
    padding: 20,
    paddingTop: 8,
  },
  body: {
    fontSize: 16,
    lineHeight: 26,
  },
});
