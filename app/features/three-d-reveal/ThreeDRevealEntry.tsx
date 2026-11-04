import { Component, type ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import type { DemoProps } from "../types";

import { ThreeDRevealDemo } from "./ThreeDRevealDemo";

class RendererBoundary extends Component<
  { children: ReactNode; textColor: string },
  { error: Error | null }
> {
  state: { error: Error | null } = {
    error: null,
  };

  static getDerivedStateFromError(error: Error) {
    return {
      error,
    };
  }

  componentDidCatch(error: Error) {
    console.error(
      "3D renderer initialization failed:",
      error.stack ?? error.message,
    );
  }

  render() {
    if (this.state.error) {
      return (
        <View style={styles.message}>
          <Text
            style={[
              styles.text,
              {
                color: this.props.textColor,
              },
            ]}
          >
            The 3D renderer could not start. Restart the app and try again.
          </Text>
          <Text
            selectable
            style={[
              styles.text,
              {
                color: this.props.textColor,
              },
            ]}
          >
            {this.state.error.message}
          </Text>
        </View>
      );
    }
    return this.props.children;
  }
}

export function ThreeDRevealEntry(props: DemoProps) {
  return (
    <RendererBoundary textColor={props.colors.text}>
      <ThreeDRevealDemo {...props} />
    </RendererBoundary>
  );
}

const styles = StyleSheet.create({
  message: {
    padding: 24,
    gap: 12,
  },
  text: {
    textAlign: "center",
    fontSize: 14,
  },
});
