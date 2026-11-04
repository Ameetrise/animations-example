import type { ComponentRef } from "react";
import { useEffect, useRef, type RefObject } from "react";
import { scheduleOnRN } from "react-native-worklets";
import Feather from "@expo/vector-icons/Feather";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  interpolate,
  cancelAnimation,
  Easing,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
  useAnimatedStyle,
  type SharedValue,
} from "react-native-reanimated";

type Props = {
  cartRef: RefObject<ComponentRef<typeof View> | null>;
  onAddedToCart: () => void;
  index: number;
  width: number;
  selected: boolean;
  shuffle: SharedValue<number>;
  disabled: boolean;
  product: {
    name: string;
    icon: "headphones" | "watch" | "speaker";
    suit: string;
  };
  progress: SharedValue<number>;
  float: SharedValue<number>;
  onPress: () => void;
};

export function PlayingCard({
  index,
  cartRef,
  onAddedToCart,
  width,
  selected,
  shuffle,
  disabled,
  product,
  progress,
  float,
  onPress,
}: Props) {
  const cardRef = useRef<ComponentRef<typeof View>>(null);
  const sent = useRef(false);
  const selection = useSharedValue(selected ? 1 : 0);

  useEffect(() => {
    selection.value = withSpring(selected ? 1 : 0, {
      damping: 18,
      stiffness: 180,
    });
    return () => cancelAnimation(selection);
  }, [selected, selection]);

  const flight = useSharedValue(0);
  const flightX = useSharedValue(0);
  const flightY = useSharedValue(0);

  useEffect(() => {
    sent.current = false;
    return () => {
      sent.current = true;
      cancelAnimation(flight);
    };
  }, [flight]);

  function handlePress() {
    if (progress.value < 1) {
      onPress();
      return;
    }
    if (!selected || sent.current || !cardRef.current || !cartRef.current)
      return;
    sent.current = true;
    cardRef.current.measureInWindow((x, y, width, height) => {
      cartRef.current?.measureInWindow(
        (cartX, cartY, cartWidth, cartHeight) => {
          if (!cardRef.current) return;
          flightX.value = cartX + cartWidth / 2 - x - width / 2;
          flightY.value = cartY + cartHeight / 2 - y - height / 2;
          flight.value = withSequence(
            withTiming(0.2, { duration: 260, easing: Easing.out(Easing.quad) }),
            withTiming(
              1,
              { duration: 430, easing: Easing.in(Easing.cubic) },
              (finished) => {
                if (finished) scheduleOnRN(onAddedToCart);
              },
            ),
          );
        },
      );
    });
  }

  const renderWidth = width * 1.75;
  const positionStyle = useAnimatedStyle(() => {
    if (flight.value > 0) {
      const distance = Math.max(Math.hypot(flightX.value, flightY.value), 1);
      const travel = interpolate(
        flight.value,
        [0, 0.2, 1],
        [0, -32 / distance, 1],
      );
      return {
        zIndex: 10,
        opacity: interpolate(flight.value, [0, 0.85, 1], [1, 1, 0]),
        transform: [
          { translateX: flightX.value * travel },
          {
            translateY:
              -12 +
              flightY.value * travel -
              Math.sin(Math.max(0, travel) * Math.PI) * 35,
          },
          {
            rotate: `${interpolate(flight.value, [0, 0.2, 0.55, 1], [0, 7, -12, 0])}deg`,
          },
          {
            scale: interpolate(
              flight.value,
              [0, 0.2, 0.45, 1],
              [1, 0.94, 1, 0.08],
            ),
          },
        ],
      };
    }
    const move = Math.min(progress.value / 0.3, 1);
    const wave = Math.sin(float.value + index * 2.1);
    const invitation = Math.max(0, wave);
    if (shuffle.value < 1) {
      const offset = (index - 1) * (width + 9);
      const side = index === 1 ? -1 : 1;
      return {
        opacity: 1,
        zIndex: index,
        transform: [
          {
            translateX: interpolate(
              shuffle.value,
              [0, 0.2, 0.4, 0.6, 0.8, 1],
              [
                offset,
                (index - 1) * 5,
                side * width * 0.7,
                -side * width * 0.7,
                (index - 1) * 5,
                offset,
              ],
            ),
          },
          {
            translateY: interpolate(
              shuffle.value,
              [0, 0.2, 0.4, 0.6, 0.8, 1],
              [
                Math.abs(index - 1) * 10,
                (index - 1) * 4,
                (index - 1) * -18,
                (index - 1) * 18,
                (index - 1) * 4,
                Math.abs(index - 1) * 10 - wave * 5 - invitation * 7,
              ],
            ),
          },
          {
            rotate: `${interpolate(shuffle.value, [0, 0.2, 0.4, 0.6, 0.8, 1], [(index - 1) * 9, 0, side * -8, side * 8, 0, (index - 1) * 9 + wave * 3])}deg`,
          },
          { scale: (1 + invitation * 0.025) / 1.75 },
        ],
      };
    }
    const wobble = interpolate(
      progress.value,
      [0, 0.16, 0.22, 0.28, 0.34, 1],
      [0, 0, -7, 7, 0, 0],
      "clamp",
    );
    return {
      opacity: selected ? 1 : 1 - move,
      zIndex: selected ? 2 : 1,
      transform: [
        {
          translateX:
            (index - 1) * (width + 9) * (selected ? 1 - move : 1 + move * 0.3),
        },
        {
          translateY:
            Math.abs(index - 1) * 10 * (1 - selection.value) -
            12 * selection.value -
            (wave * 5 + invitation * 7) * (1 - move),
        },
        {
          rotate: `${((index - 1) * 9 + wave * 3) * (1 - move) + (selected ? wobble : 0)}deg`,
        },
        {
          scale:
            (1 +
              selection.value * 0.06 +
              (selected ? move * 0.69 : invitation * 0.025)) /
            1.75,
        },
      ],
    };
  });
  const frontStyle = useAnimatedStyle(() => ({
    opacity: progress.value < 0.55 ? 1 : 0,
    transform: [
      { perspective: 900 },
      {
        rotateY: `${interpolate(progress.value, [0.35, 0.75], [0, 180], "clamp")}deg`,
      },
    ],
  }));
  const backStyle = useAnimatedStyle(() => ({
    opacity: progress.value >= 0.55 ? 1 : 0,
    transform:
      progress.value >= 0.75
        ? []
        : [
            { perspective: 900 },
            {
              rotateY: `${interpolate(progress.value, [0.35, 0.75], [180, 360], "clamp")}deg`,
            },
          ],
  }));
  const idleShineStyle = useAnimatedStyle(() => ({
    opacity: progress.value === 0 ? 0.16 : 0,
    transform: [
      {
        translateX:
          ((float.value / (Math.PI * 2) + index / 3) % 1) * renderWidth * 3 -
          renderWidth,
      },
      { rotate: "25deg" },
    ],
  }));

  const shineStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      progress.value,
      [0.72, 0.8, 0.95, 1],
      [0, 0.7, 0.7, 0],
      "clamp",
    ),
    transform: [
      {
        translateX: interpolate(
          progress.value,
          [0.72, 1],
          [-renderWidth, renderWidth * 2],
          "clamp",
        ),
      },
      { rotate: "25deg" },
    ],
  }));

  return (
    <Animated.View
      ref={cardRef}
      collapsable={false}
      style={[
        styles.card,
        {
          width: renderWidth,
          height: renderWidth * 1.6,
          zIndex: selected ? 2 : 1,
        },
        positionStyle,
      ]}
    >
      <Pressable
        style={styles.touch}
        onPress={handlePress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={
          selected
            ? "Selected card. After revealing, tap to add to cart"
            : `Pick card ${index + 1}`
        }
        accessibilityState={{ selected, disabled }}
      >
        <Animated.View
          style={[
            styles.face,
            styles.front,
            { borderColor: selected ? "#FCD34D" : "#E9C994" },
            frontStyle,
          ]}
        >
          <View style={styles.diamond}>
            <Text style={styles.question}>?</Text>
          </View>
          <Text style={styles.brand}>Pack.com</Text>
          <Animated.View
            pointerEvents="none"
            style={[styles.shine, idleShineStyle]}
          />
        </Animated.View>
        <Animated.View
          style={[
            styles.face,
            styles.back,
            product.icon === "headphones" && styles.photoBack,
            backStyle,
          ]}
        >
          {product.icon === "headphones" ? (
            <Image
              source={require("../../../assets/airpod-max.jpeg")}
              style={{
                width: Math.round(renderWidth * 0.82),
                height: Math.round(renderWidth * 0.82 * (636 / 752)),
              }}
              resizeMode="contain"
              accessibilityLabel="AirPods Max headphones"
            />
          ) : (
            <Feather name={product.icon} size={64} color="#9A3412" />
          )}
          <Text style={styles.reveal}>YOUR PICK</Text>
          <Animated.View
            pointerEvents="none"
            style={[styles.shine, shineStyle]}
          />
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: { position: "absolute" },
  touch: { flex: 1 },
  face: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 21,
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
    backfaceVisibility: "hidden",
    overflow: "hidden",
  },
  front: { backgroundColor: "#7C2D12" },
  back: {
    backgroundColor: "#FFF8E7",
    borderColor: "#E9C994",
    gap: 17,
    padding: 24,
  },
  photoBack: { backgroundColor: "#FFFFFF" },
  diamond: {
    width: 77,
    height: 101,
    borderWidth: 1,
    borderColor: "#E9C994",
    borderRadius: 38,
    alignItems: "center",
    justifyContent: "center",
  },
  question: { color: "#FDE6B8", fontSize: 59, fontWeight: "700" },
  brand: { color: "#FDE6B8", fontSize: 17, marginTop: 14, fontWeight: "700" },
  reveal: {
    position: "absolute",
    bottom: 24,
    color: "#9A3412",
    fontSize: 14,
    letterSpacing: 1,
    fontWeight: "700",
  },
  shine: {
    position: "absolute",
    top: -30,
    bottom: -30,
    left: 0,
    width: 45,
    backgroundColor: "#FFFFFF",
  },
});
