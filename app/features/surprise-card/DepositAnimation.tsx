import { useEffect, useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  interpolate,
  useAnimatedStyle,
  useAnimatedReaction,
  FadeInDown,
  ReduceMotion,
  useSharedValue,
  withSequence,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import type { ThemeColors } from "../../theme/tokens";

type Props = { colors: ThemeColors };

function TransferSpark({
  index,
  progress,
}: {
  index: number;
  progress: SharedValue<number>;
}) {
  const style = useAnimatedStyle(() => {
    const t = interpolate(
      progress.value,
      [0.62 + index * 0.02, 0.9 + index * 0.01],
      [0, 1],
      "clamp",
    );
    return {
      opacity: interpolate(t, [0, 0.15, 0.8, 1], [0, 0.8, 0.8, 0]),
      transform: [
        { translateX: Math.sin(t * Math.PI) * (index % 2 ? 30 : -30) },
        { translateY: t * 100 },
        { scale: 1 - t * 0.6 },
      ],
    };
  });
  return (
    <Animated.View pointerEvents="none" style={[styles.transferSpark, style]} />
  );
}

export function DepositAnimation({ colors }: Props) {
  const progress = useSharedValue(0);
  const [balance, setBalance] = useState(0);
  const [deposited, setDeposited] = useState(false);

  useEffect(() => {
    progress.value = withSequence(
      withTiming(0.35, { duration: 1100, easing: Easing.out(Easing.quad) }),
      withTiming(0.6, { duration: 900 }),
      withTiming(0.9, { duration: 800, easing: Easing.in(Easing.cubic) }),
      withTiming(
        1,
        { duration: 650, easing: Easing.out(Easing.cubic) },
        (finished) => {
          if (finished) scheduleOnRN(setDeposited, true);
        },
      ),
    );
    return () => cancelAnimation(progress);
  }, [progress]);

  useAnimatedReaction(
    () => Math.round(interpolate(progress.value, [0.9, 1], [0, 20], "clamp")),
    (step, previous) => {
      if (step !== previous) scheduleOnRN(setBalance, step * 25);
    },
  );
  const scanStyle = useAnimatedStyle(() => ({
    opacity: progress.value < 0.35 ? 0.5 : 0,
    transform: [
      { translateY: interpolate(progress.value, [0, 0.35], [0, 100], "clamp") },
    ],
  }));
  const haloStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0.88, 0.93, 1], [0, 0.5, 0], "clamp"),
    transform: [
      { scale: interpolate(progress.value, [0.88, 1], [0.8, 1.4], "clamp") },
    ],
  }));

  const printerStyle = useAnimatedStyle(() => ({
    opacity:
      progress.value < 0.35
        ? 0.4 + Math.abs(Math.sin(progress.value * 70)) * 0.6
        : 1,
  }));
  const stampToolStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      progress.value,
      [0.35, 0.38, 0.52, 0.58],
      [0, 1, 1, 0],
      "clamp",
    ),
    transform: [
      {
        translateY: interpolate(
          progress.value,
          [0.35, 0.46, 0.49, 0.58],
          [-45, 0, -3, -40],
          "clamp",
        ),
      },
      { rotate: "-12deg" },
      {
        scale: interpolate(
          progress.value,
          [0.35, 0.46, 0.49, 0.58],
          [1.2, 0.95, 1, 1.1],
          "clamp",
        ),
      },
    ],
  }));
  const impactStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      progress.value,
      [0.45, 0.47, 0.58],
      [0, 0.6, 0],
      "clamp",
    ),
    transform: [
      { scale: interpolate(progress.value, [0.45, 0.58], [0.3, 1.5], "clamp") },
    ],
  }));
  const balanceStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          progress.value,
          [0.9, 0.94, 1],
          [0, -5, 0],
          "clamp",
        ),
      },
    ],
  }));

  const checkStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.85, 0.9, 1], [1, 1, 0, 0]),
    transform: [
      {
        translateY: interpolate(
          progress.value,
          [0, 0.35, 0.6, 0.67, 0.9],
          [-115, 12, 12, -4, 144],
          "clamp",
        ),
      },
      {
        translateX: interpolate(
          progress.value,
          [0, 0.45, 0.48, 0.51, 0.55, 1],
          [0, 0, -3, 3, 0, 0],
        ),
      },
      {
        scale: interpolate(
          progress.value,
          [0, 0.6, 0.67, 0.9, 1],
          [1, 1, 1.02, 0.15, 0.15],
        ),
      },
      {
        rotate: `${interpolate(progress.value, [0, 0.6, 0.78, 0.9, 1], [0, 0, -10, 0, 0])}deg`,
      },
    ],
  }));
  const stampStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0.38, 0.45], [0, 1], "clamp"),
    transform: [
      {
        scale: interpolate(
          progress.value,
          [0.38, 0.48, 0.55],
          [2, 0.9, 1],
          "clamp",
        ),
      },
      { rotate: "-12deg" },
    ],
  }));
  const bankStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(progress.value, [0, 0.85, 0.94, 1], [1, 1, 1.08, 1]),
      },
    ],
  }));
  const printingStyle = useAnimatedStyle(() => ({
    opacity: progress.value < 0.35 ? 1 : 0,
  }));
  const stampingStyle = useAnimatedStyle(() => ({
    opacity: progress.value >= 0.35 && progress.value < 0.6 ? 1 : 0,
  }));
  const depositingStyle = useAnimatedStyle(() => ({
    opacity: progress.value >= 0.6 && progress.value < 1 ? 1 : 0,
  }));

  return (
    <View style={styles.scene}>
      <View style={styles.status}>
        <Animated.Text
          style={[styles.statusText, { color: colors.muted }, printingStyle]}
        >
          Printing your check…
        </Animated.Text>
        <Animated.Text
          style={[styles.statusText, { color: colors.muted }, stampingStyle]}
        >
          Giving it the stamp of approval…
        </Animated.Text>
        <Animated.Text
          style={[styles.statusText, { color: colors.muted }, depositingStyle]}
        >
          Sending your reward to your account…
        </Animated.Text>
        {deposited && (
          <Text
            accessibilityLiveRegion="polite"
            style={[styles.statusText, { color: colors.text }]}
          >
            Reward deposited ✓
          </Text>
        )}
      </View>
      <View
        style={[
          styles.printer,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <Feather name="printer" size={14} color={colors.muted} />
        <Text style={[styles.printerLabel, { color: colors.muted }]}>
          PACK REWARDS
        </Text>
        <Animated.View style={[styles.indicator, printerStyle]} />
      </View>
      <View style={[styles.slot, { backgroundColor: colors.text }]} />
      <View pointerEvents="none" style={styles.paperWindow}>
        <Animated.View style={[styles.check, checkStyle]}>
          <Animated.View style={[styles.scan, scanStyle]} />
          <Text style={styles.issuer}>PACK.COM REWARDS</Text>
          <View style={styles.checkRow}>
            <Text style={styles.payee}>Pay to: You</Text>
            <Text style={styles.amount}>$500.00</Text>
          </View>
          <Text style={styles.written}>Five hundred dollars</Text>
          <Text style={styles.void}>REWARD PAYMENT · 00500</Text>
          <Animated.View style={[styles.stamp, stampStyle]}>
            <Text style={styles.stampText}>APPROVED</Text>
          </Animated.View>
        </Animated.View>
      </View>
      <Animated.View
        pointerEvents="none"
        style={[styles.stampImpact, impactStyle]}
      />
      <Animated.View
        pointerEvents="none"
        style={[styles.stampTool, stampToolStyle]}
      >
        <View style={styles.stampHandle} />
        <View style={styles.stampBase}>
          <Text style={styles.stampToolText}>PACK</Text>
        </View>
      </Animated.View>
      {Array.from({ length: 6 }, (_, index) => (
        <TransferSpark key={index} index={index} progress={progress} />
      ))}
      <Animated.View
        pointerEvents="none"
        style={[styles.bankHalo, haloStyle]}
      />
      <Animated.View
        style={[
          styles.bank,
          { backgroundColor: colors.surface, borderColor: colors.border },
          bankStyle,
        ]}
      >
        <Feather
          name={deposited ? "check-circle" : "credit-card"}
          size={26}
          color="#31956A"
        />
        <View>
          <Text style={[styles.accountName, { color: colors.text }]}>
            Your account
          </Text>
          <Text style={[styles.bankLabel, { color: colors.muted }]}>
            AVAILABLE BALANCE
          </Text>
          <Animated.Text
            style={[styles.balance, { color: colors.text }, balanceStyle]}
          >
            ${balance.toFixed(2)}
          </Animated.Text>
        </View>
        {deposited && (
          <Animated.Text
            entering={FadeInDown.duration(350).reduceMotion(
              ReduceMotion.System,
            )}
            style={styles.credit}
          >
            +$500
          </Animated.Text>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  stampTool: {
    position: "absolute",
    top: 100,
    right: "15%",
    alignItems: "center",
    zIndex: 4,
  },
  stampHandle: {
    width: 26,
    height: 23,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: "#8D572F",
  },
  stampBase: {
    width: 85,
    height: 26,
    borderRadius: 5,
    backgroundColor: "#244A37",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 4,
    borderBottomColor: "#183626",
  },
  stampToolText: {
    color: "#E7BD62",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 2,
  },
  stampImpact: {
    position: "absolute",
    top: 102,
    right: "13%",
    width: 95,
    height: 70,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: "#65BB85",
    zIndex: 3,
  },
  transferSpark: {
    position: "absolute",
    top: 150,
    alignSelf: "center",
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#76C89A",
    zIndex: 3,
  },
  scene: { width: "100%", height: 310, alignItems: "center" },
  status: { height: 26, width: "100%" },
  statusText: {
    position: "absolute",
    width: "100%",
    textAlign: "center",
    fontSize: 12,
  },
  printer: {
    width: 250,
    height: 30,
    borderWidth: 1,
    borderRadius: 10,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    paddingHorizontal: 12,
  },
  printerLabel: { flex: 1, fontSize: 8, letterSpacing: 1, fontWeight: "700" },
  indicator: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#31956A",
  },
  slot: { width: 236, height: 7, borderRadius: 4, marginTop: -5 },
  scan: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: "#68C592",
  },
  bankHalo: {
    position: "absolute",
    bottom: 8,
    width: 250,
    height: 96,
    borderRadius: 22,
    backgroundColor: "#7CCBA0",
  },
  accountName: { fontSize: 12, fontWeight: "600" },
  credit: {
    position: "absolute",
    right: 12,
    top: -15,
    backgroundColor: "#D8F5E4",
    color: "#19663D",
    borderRadius: 10,
    padding: 5,
    fontWeight: "700",
    fontSize: 12,
  },
  paperWindow: {
    position: "absolute",
    top: 58,
    width: "100%",
    height: 240,
    overflow: "hidden",
    alignItems: "center",
    zIndex: 2,
  },
  check: {
    width: 224,
    height: 105,
    padding: 12,
    borderRadius: 5,
    backgroundColor: "#F2FAEE",
    borderWidth: 1,
    borderColor: "#AEC7A3",
    gap: 8,
  },
  issuer: {
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 1,
    color: "#315C40",
  },
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  payee: { fontSize: 12, color: "#315C40" },
  amount: { fontSize: 23, fontWeight: "800", color: "#195A39" },
  written: { fontSize: 10, color: "#315C40" },
  void: { fontSize: 7, color: "#58725D" },
  stamp: {
    position: "absolute",
    right: 18,
    bottom: 12,
    borderWidth: 2,
    borderColor: "#258353",
    paddingHorizontal: 7,
    paddingVertical: 3,
    backgroundColor: "#F2FAEEDD",
  },
  stampText: { fontSize: 14, fontWeight: "900", color: "#258353" },
  bank: {
    position: "absolute",
    bottom: 15,
    width: 236,
    height: 82,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
    paddingHorizontal: 18,
  },
  bankLabel: { fontSize: 9, letterSpacing: 1, fontWeight: "700" },
  balance: { fontSize: 24, fontWeight: "700" },
});
