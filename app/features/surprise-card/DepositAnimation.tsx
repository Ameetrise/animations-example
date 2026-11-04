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
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import type { ThemeColors } from "../../theme/tokens";

type Props = { colors: ThemeColors };

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

  const checkStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.85, 0.9, 1], [1, 1, 0, 0]),
    transform: [
      {
        translateY: interpolate(
          progress.value,
          [0, 0.35, 0.6, 0.9],
          [-115, 12, 12, 144],
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
          [0, 0.6, 0.9, 1],
          [1, 1, 0.15, 0.15],
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
        <View style={styles.indicator} />
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
          <Text style={[styles.balance, { color: colors.text }]}>
            ${balance.toFixed(2)}
          </Text>
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
