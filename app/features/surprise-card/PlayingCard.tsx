import { palette } from "../../theme/colors";
import { PaperPlane } from "./PaperPlane";
import { CardBackDesign } from "./CardBackDesign";
import { type ComponentRef, useEffect, useRef, type RefObject } from "react";
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
  onClaimMoney: () => void;
  index: number;
  width: number;
  selected: boolean;
  shuffle: SharedValue<number>;
  disabled: boolean;
  product: {
    name: string;
    icon: "headphones" | "watch" | "speaker" | "dollar-sign";
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
  onClaimMoney,
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
    if (selected && !sent.current && product.icon === "dollar-sign") {
      sent.current = true;
      onClaimMoney();
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
            withTiming(0.32, {
              duration: 430,
              easing: Easing.inOut(Easing.quad),
            }),
            withTiming(0.45, {
              duration: 180,
              easing: Easing.out(Easing.quad),
            }),
            withTiming(
              1,
              {
                duration: 550,
                easing: Easing.in(Easing.cubic),
              },
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
        [0, 0.32, 0.45, 1],
        [0, 0, -24 / distance, 1],
      );
      return {
        zIndex: 10,
        opacity: interpolate(flight.value, [0, 0.85, 1], [1, 1, 0]),
        transform: [
          {
            translateX: flightX.value * travel,
          },
          {
            translateY:
              -12 +
              flightY.value * travel -
              Math.sin(Math.max(0, travel) * Math.PI) * 35,
          },
          {
            rotate: `${interpolate(flight.value, [0, 0.32, 0.45, 0.75, 1], [0, -6, 5, -8, 0])}deg`,
          },
          {
            scale: interpolate(
              flight.value,
              [0, 0.32, 0.45, 1],
              [1, 1, 0.94, 0.12],
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
                [-0.9, 0.75, 0][index] * width,
                [0.75, 0, -0.9][index] * width,
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
          {
            scale: (1 + invitation * 0.025) / 1.75,
          },
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
      {
        perspective: 900,
      },
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
            {
              perspective: 900,
            },
            {
              rotateY: `${interpolate(progress.value, [0.35, 0.75], [180, 360], "clamp")}deg`,
            },
          ],
  }));
  const foldStyle = useAnimatedStyle(() => ({
    opacity: interpolate(flight.value, [0, 0.22, 0.32], [1, 1, 0], "clamp"),
    transform:
      flight.value === 0
        ? []
        : [
            {
              perspective: 900,
            },
            {
              rotateY: `${interpolate(flight.value, [0, 0.32], [0, 65], "clamp")}deg`,
            },
            {
              scaleX: interpolate(flight.value, [0, 0.32], [1, 0.08], "clamp"),
            },
            {
              scaleY: interpolate(flight.value, [0, 0.32], [1, 0.5], "clamp"),
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
      {
        rotate: "25deg",
      },
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
      {
        rotate: "25deg",
      },
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
            ? product.icon === "dollar-sign"
              ? "Selected card. After revealing, tap to collect your cash reward"
              : "Selected card. After revealing, tap to add to cart"
            : `Pick card ${index + 1}`
        }
        accessibilityState={{
          selected,
          disabled,
        }}
      >
        <Animated.View
          style={[
            styles.face,
            styles.front,
            {
              borderColor: selected
                ? palette.cardSelectedBorder
                : palette.cardBorder,
            },
            frontStyle,
          ]}
        >
          <CardBackDesign width={renderWidth} />
          <Animated.View
            pointerEvents="none"
            style={[styles.shine, idleShineStyle]}
          />
        </Animated.View>
        <Animated.View style={[styles.foldLayer, foldStyle]}>
          <Animated.View
            style={[
              styles.face,
              styles.back,
              product.icon === "headphones" && styles.photoBack,
              product.icon === "dollar-sign" && styles.cashBack,
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
            ) : product.icon === "dollar-sign" ? (
              <View style={styles.moneyPrize}>
                <View style={styles.rewardIcon}>
                  <Feather name="award" size={24} color={palette.gold} />
                </View>
                <Text style={styles.moneyLabel}>YOU WON</Text>
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.5}
                  style={styles.moneyAmount}
                >
                  $500
                </Text>
                <Text style={styles.moneyCaption}>A little lucky moment.</Text>
              </View>
            ) : (
              <Feather name={product.icon} size={64} color={palette.copper} />
            )}
            {product.icon === "dollar-sign" ? (
              <View style={styles.collect}>
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  style={styles.collectText}
                >
                  Collect reward
                </Text>
                <Feather
                  name="arrow-up-right"
                  size={13}
                  color={palette.rewardDarkGreen}
                />
              </View>
            ) : (
              <Text style={styles.reveal}>YOUR PICK</Text>
            )}
            <Animated.View
              pointerEvents="none"
              style={[styles.shine, shineStyle]}
            />
          </Animated.View>
        </Animated.View>
        {product.icon === "headphones" && (
          <PaperPlane
            flight={flight}
            flightX={flightX}
            flightY={flightY}
            size={renderWidth * 0.8}
          />
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  foldLayer: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  cashBack: {
    backgroundColor: palette.rewardDarkGreen,
    borderColor: palette.playingCardCashBackBorderColor,
    padding: 10,
  },
  moneyPrize: {
    width: "100%",
    alignItems: "center",
    gap: 6,
    paddingBottom: 20,
  },
  rewardIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: palette.playingCardRewardIconBackgroundColor,
    alignItems: "center",
    justifyContent: "center",
  },
  moneyCaption: {
    color: palette.playingCardMoneyCaptionColor,
    fontSize: 9,
    textAlign: "center",
  },
  collect: {
    position: "absolute",
    bottom: 14,
    left: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    backgroundColor: palette.gold,
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 5,
  },
  collectText: {
    color: palette.rewardDarkGreen,
    fontSize: 10,
    fontWeight: "700",
    flexShrink: 1,
  },
  moneyLabel: {
    color: palette.gold,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
  },
  moneyAmount: {
    width: "100%",
    textAlign: "center",
    color: palette.white,
    fontSize: 42,
    fontWeight: "800",
  },
  card: {
    position: "absolute",
  },
  touch: {
    flex: 1,
  },
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
  front: {
    backgroundColor: palette.playingCardFrontBackgroundColor,
  },
  back: {
    backgroundColor: palette.playingCardBackBackgroundColor,
    borderColor: palette.cardBorder,
    gap: 17,
    padding: 24,
  },
  photoBack: {
    backgroundColor: palette.white,
  },
  reveal: {
    position: "absolute",
    bottom: 24,
    color: palette.copper,
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
    backgroundColor: palette.white,
  },
});
