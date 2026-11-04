import { Suspense, useRef } from "react";
import { Modal, StyleSheet, View, useWindowDimensions } from "react-native";
import { Group, MathUtils } from "three";
import { useReducedMotion } from "react-native-reanimated";
import { Canvas, useFrame } from "./renderer";
import { HeadphonesModel } from "./HeadphonesModel";
import { palette } from "../../theme/colors";
import type { PrizePosition } from "./WinningPrize";

export type CartFlight = {
  start: PrizePosition;
  end: {
    x: number;
    y: number;
  };
};

type Props = {
  flight: CartFlight;
  onComplete: () => void;
};

function FlyingHeadphones({ flight, onComplete }: Props) {
  const group = useRef<Group>(null);
  const elapsed = useRef(0);
  const finished = useRef(false);
  const { width, height } = useWindowDimensions();
  const reduceMotion = useReducedMotion();

  useFrame((_, delta) => {
    if (!group.current || finished.current) return;
    elapsed.current += Math.min(delta, 0.05);
    const t = Math.min(elapsed.current / (reduceMotion ? 0.25 : 1.4), 1);
    const travel = Math.max(0, (t - 0.4) / 0.6);
    const ease = travel * travel * (3 - 2 * travel);
    const x = MathUtils.lerp(flight.start.x, flight.end.x, ease);
    const y = MathUtils.lerp(flight.start.y, flight.end.y, ease);
    group.current.position.set(
      (reduceMotion ? flight.start.x : x) - width / 2,
      height / 2 -
        (reduceMotion ? flight.start.y : y) +
        Math.sin(travel * Math.PI) * 55,
      0,
    );
    group.current.rotation.y = reduceMotion
      ? 0.5
      : 0.5 + Math.min(t / 0.4, 1) * Math.PI * 2;
    group.current.rotation.z = reduceMotion
      ? 0
      : Math.sin(travel * Math.PI) * -0.3;
    group.current.scale.setScalar(
      (flight.start.size / 2.2) * (1 - (reduceMotion ? t : ease) * 0.94),
    );
    if (t === 1) {
      finished.current = true;
      onComplete();
    }
  });

  return (
    <group
      ref={group}
      scale={flight.start.size / 2.2}
      position={[flight.start.x - width / 2, height / 2 - flight.start.y, 0]}
    >
      <HeadphonesModel />
    </group>
  );
}

export function PrizeCartFlight({ flight, onComplete }: Props) {
  return (
    <Modal
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onComplete}
    >
      <View style={styles.overlay}>
        <Canvas
          orthographic
          camera={{
            position: [0, 0, 1000],
            zoom: 1,
            near: 0.1,
            far: 2000,
          }}
        >
          <ambientLight intensity={1.5} />
          <directionalLight
            position={[200, 400, 500]}
            intensity={3}
            color={palette.white}
          />
          <directionalLight
            position={[-200, 200, 300]}
            intensity={1.5}
            color={palette.planeIvory}
          />
          <Suspense fallback={null}>
            <FlyingHeadphones flight={flight} onComplete={onComplete} />
          </Suspense>
        </Canvas>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: palette.transparent,
  },
});
