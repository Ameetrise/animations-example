import {
  Component,
  useEffect,
  Suspense,
  useCallback,
  useState,
  type ReactNode,
} from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { cancelAnimation, Easing, withTiming } from "react-native-reanimated";
import type { DemoProps } from "../types";
import { Canvas } from "./renderer";
import { BoxModel } from "./BoxModel";
import { palette } from "../../theme/colors";

class ModelBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = {
    failed: false,
  };

  static getDerivedStateFromError() {
    return {
      failed: true,
    };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export function ThreeDRevealDemo({
  colors,
  availableHeight,
  hasPlayed,
  onReveal,
  progress,
}: DemoProps) {
  const [ready, setReady] = useState(false);
  const [complete, setComplete] = useState(false);
  const onReady = useCallback(() => setReady(true), []);
  const onComplete = useCallback(() => {
    setComplete(true);
    progress.set(
      withTiming(1, {
        duration: 2200,
        easing: Easing.out(Easing.cubic),
      }),
    );
  }, [progress]);

  useEffect(() => () => cancelAnimation(progress), [progress]);

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.eyebrow,
          {
            color: colors.muted,
          },
        ]}
      >
        PACK.COM · 3D REVEAL
      </Text>
      <Text
        style={[
          styles.title,
          {
            color: colors.text,
          },
        ]}
      >
        {complete ? "You won AirPods Max!" : "A new dimension of surprise."}
      </Text>
      <View
        style={[
          styles.viewport,
          {
            height: Math.max(180, availableHeight - 110),
          },
        ]}
      >
        <ModelBoundary
          fallback={
            <Text
              style={[
                styles.message,
                {
                  color: colors.text,
                },
              ]}
            >
              The 3D view could not load. Press Reset to try again.
            </Text>
          }
        >
          <Canvas
            camera={{
              position: [4, 3.2, 5],
              fov: 50,
            }}
          >
            <ambientLight intensity={1.5} />
            <directionalLight
              position={[4, 6, 5]}
              intensity={3}
              color={palette.white}
            />
            <directionalLight
              position={[-4, 2, -3]}
              intensity={1.5}
              color={palette.planeIvory}
            />
            <Suspense fallback={null}>
              <BoxModel
                playing={hasPlayed}
                onReady={onReady}
                onComplete={onComplete}
                onReveal={onReveal}
              />
            </Suspense>
          </Canvas>
          {!ready && (
            <View pointerEvents="none" style={styles.loading}>
              <ActivityIndicator color={colors.text} />
            </View>
          )}
        </ModelBoundary>
      </View>
      <Text
        accessibilityLiveRegion="polite"
        style={[
          styles.caption,
          {
            color: colors.muted,
          },
        ]}
      >
        {!ready
          ? "Loading your box…"
          : complete
            ? "Your surprise has arrived. Celebrate!"
            : hasPlayed
              ? "Watch the flaps unfold…"
              : "Tap the box or press Reveal."}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.7,
  },
  title: {
    fontSize: 23,
    fontWeight: "700",
    marginTop: 10,
    textAlign: "center",
  },
  viewport: {
    width: "100%",
    marginVertical: 12,
  },
  loading: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  message: {
    textAlign: "center",
    padding: 24,
  },
  caption: {
    fontSize: 14,
    textAlign: "center",
  },
});
