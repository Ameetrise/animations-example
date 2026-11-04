import {
  Component,
  useEffect,
  Suspense,
  useCallback,
  useState,
  useRef,
  type ComponentRef,
  type ReactNode,
} from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { cancelAnimation, Easing, withTiming } from "react-native-reanimated";
import type { DemoProps } from "../types";
import { Canvas } from "./renderer";
import { BoxModel } from "./BoxModel";
import { PrizeCartFlight, type CartFlight } from "./PrizeCartFlight";
import type { PrizePosition } from "./WinningPrize";
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
  cartRef,
  onAddedToCart,
}: DemoProps) {
  const viewportRef = useRef<ComponentRef<typeof View>>(null);
  const claiming = useRef(false);
  const [flight, setFlight] = useState<CartFlight | null>(null);
  const [added, setAdded] = useState(false);

  function claimPrize(position: PrizePosition) {
    if (claiming.current || !viewportRef.current || !cartRef.current) return;
    claiming.current = true;
    viewportRef.current.measureInWindow((x, y) => {
      if (!viewportRef.current || !cartRef.current) return;
      cartRef.current.measureInWindow((cartX, cartY, width, height) => {
        if (!viewportRef.current) return;
        setFlight({
          start: {
            x: x + position.x,
            y: y + position.y,
            size: position.size,
          },
          end: {
            x: cartX + width / 2,
            y: cartY + height / 2,
          },
        });
      });
    });
  }

  function finishFlight() {
    if (!claiming.current) return;
    claiming.current = false;
    setAdded(true);
    setFlight(null);
    onAddedToCart();
  }

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
        ref={viewportRef}
        collapsable={false}
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
                claimed={flight !== null || added}
                onClaim={claimPrize}
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
      {flight && <PrizeCartFlight flight={flight} onComplete={finishFlight} />}
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
          : added
            ? "AirPods Max added to your cart."
            : complete
              ? "Tap your headphones to add them to your cart."
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
