import { useEffect, useRef, useState, type ComponentRef } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  interpolate,
  useAnimatedReaction,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import type { DemoProps } from "../types";

type Props = Pick<DemoProps, "progress" | "cartRef" | "onAddedToCart"> & {
  scale: number;
};

export function BoxPrize({ progress, cartRef, onAddedToCart, scale }: Props) {
  const prizeRef = useRef<ComponentRef<typeof View>>(null);
  const sent = useRef(false);
  const [ready, setReady] = useState(false);
  const [added, setAdded] = useState(false);
  const flight = useSharedValue(0);
  const targetX = useSharedValue(0);
  const targetY = useSharedValue(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    sent.current = false;
    return () => {
      sent.current = true;
      cancelAnimation(flight);
    };
  }, [flight]);

  useAnimatedReaction(
    () => progress.value >= 1,
    (complete, previous) => {
      if (complete !== previous) scheduleOnRN(setReady, complete);
    },
  );

  function finishFlight() {
    setAdded(true);
    onAddedToCart();
  }

  function addToCart() {
    if (!ready || sent.current || !prizeRef.current || !cartRef.current) return;
    sent.current = true;
    prizeRef.current.measureInWindow((x, y, width, height) => {
      if (!prizeRef.current || !cartRef.current) return;
      cartRef.current.measureInWindow((cartX, cartY, cartWidth, cartHeight) => {
        if (!prizeRef.current) return;
        targetX.set((cartX + cartWidth / 2 - x - width / 2) / scale);
        targetY.set((cartY + cartHeight / 2 - y - height / 2) / scale);
        flight.set(
          withSequence(
            withTiming(0.2, {
              duration: 240,
              easing: Easing.out(Easing.quad),
            }),
            withTiming(
              1,
              {
                duration: 760,
                easing: Easing.inOut(Easing.cubic),
              },
              (finished) => {
                if (finished) scheduleOnRN(finishFlight);
              },
            ),
          ),
        );
      });
    });
  }

  const prizeStyle = useAnimatedStyle(() => {
    const travel = interpolate(flight.value, [0, 0.2, 1], [0, -0.06, 1]);
    return {
      opacity:
        interpolate(progress.value, [0.45, 0.52], [0, 1], "clamp") *
        interpolate(flight.value, [0, 0.92, 1], [1, 1, 0]),
      transform: [
        {
          translateX: reduceMotion ? 0 : targetX.value * travel,
        },
        {
          translateY:
            (reduceMotion
              ? 0
              : interpolate(
                  progress.value,
                  [0.45, 0.95, 1],
                  [252, 0, 0],
                  "clamp",
                )) +
            (reduceMotion
              ? 0
              : targetY.value * travel -
                Math.sin(Math.max(0, travel) * Math.PI) * 45),
        },
        {
          scale: interpolate(flight.value, [0, 0.2, 1], [1, 1.06, 0.12]),
        },
      ],
    };
  });

  const turnStyle = useAnimatedStyle(() => ({
    transform: [
      {
        perspective: 700,
      },
      {
        rotateY: reduceMotion
          ? "0deg"
          : `${interpolate(progress.value, [0.5, 0.92, 1], [-65, 12, 0], "clamp")}deg`,
      },
      {
        rotateZ: reduceMotion
          ? "0deg"
          : `${interpolate(progress.value, [0.5, 0.9, 1], [-12, 4, 0], "clamp")}deg`,
      },
    ],
  }));

  return (
    <View
      pointerEvents={ready && !added ? "auto" : "none"}
      style={[
        styles.window,
        {
          overflow: ready ? "visible" : "hidden",
          zIndex: ready ? 5 : 0,
        },
      ]}
    >
      <Animated.View style={[styles.prizeContainer, prizeStyle]}>
        <Pressable
          ref={prizeRef}
          collapsable={false}
          accessibilityRole="button"
          accessibilityLabel={
            added ? "AirPods Max added to cart" : "Add AirPods Max to cart"
          }
          disabled={!ready || added}
          onPress={addToCart}
          style={styles.prize}
        >
          <Animated.View style={turnStyle}>
            <Image
              source={require("../../../assets/airpods-max.webp")}
              resizeMode="contain"
              style={styles.image}
            />
          </Animated.View>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  window: {
    position: "absolute",
    top: 0,
    left: 35,
    width: 210,
    height: 252,
  },
  prizeContainer: {
    width: 210,
    height: 198,
  },
  prize: {
    paddingTop: 10,
    alignItems: "center",
  },
  image: {
    width: 170,
    height: 188,
  },
});
