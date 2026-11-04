import { useEffect, useRef, useState } from "react";
import {
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
} from "expo-audio";
import { useAnimatedReaction, type SharedValue } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

type Props = {
  progress: SharedValue<number>;
  triggerAt: number;
};

export function WinningSound({ progress, triggerAt }: Props) {
  const player = useAudioPlayer(require("../../assets/sounds/win.wav"), {
    downloadFirst: true,
  });
  const status = useAudioPlayerStatus(player);
  const [revealed, setRevealed] = useState(false);
  const played = useRef(false);

  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: false,
      interruptionMode: "mixWithOthers",
    }).catch((error) =>
      console.warn("Could not configure winning sound:", error),
    );
  }, [player]);

  useAnimatedReaction(
    () => progress.value >= triggerAt,
    (visible, previous) => {
      if (visible && !previous) scheduleOnRN(setRevealed, true);
    },
  );

  useEffect(() => {
    if (!revealed || !status.isLoaded || played.current) return;
    played.current = true;
    player.play();
  }, [player, revealed, status.isLoaded]);

  return null;
}
