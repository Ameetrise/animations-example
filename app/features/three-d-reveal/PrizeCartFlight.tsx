import { Suspense, useMemo, useRef } from "react";
import {
  Modal,
  Platform,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { Group, MathUtils, Quaternion } from "three";
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
  onVisible: () => void;
};

function FlyingHeadphones({ flight, onComplete, onVisible }: Props) {
  const group = useRef<Group>(null);
  const startRotation = useMemo(
    () => new Quaternion(...flight.start.rotation),
    [flight],
  );
  const frontRotation = useMemo(() => new Quaternion(), []);
  const elapsed = useRef(0);
  const renderedFrames = useRef(0);
  const finished = useRef(false);
  const { width, height } = useWindowDimensions();
  const reduceMotion = useReducedMotion();

  useFrame((_, delta) => {
    if (!group.current || finished.current) return;
    renderedFrames.current += 1;
    if (renderedFrames.current < 3) return;
    if (renderedFrames.current === 3) onVisible();
    elapsed.current += Math.min(delta, 0.05);
    const t = Math.min(elapsed.current / (reduceMotion ? 0.25 : 4.6), 1);
    const zoom = Math.min(t / 0.18, 1);
    const zoomEase = 1 - Math.pow(1 - zoom, 3);
    const brandIn = MathUtils.clamp((t - 0.18) / 0.18, 0, 1);
    const brandOut = MathUtils.clamp((t - 0.64) / 0.16, 0, 1);
    const brandZoom =
      brandIn *
      brandIn *
      (3 - 2 * brandIn) *
      (1 - brandOut * brandOut * (3 - 2 * brandOut));
    const travel = Math.max(0, (t - 0.8) / 0.2);
    const ease = travel * travel * (3 - 2 * travel);
    const focusX = width / 2;
    const focusY = height * 0.42;
    const zoomX = MathUtils.lerp(flight.start.x, focusX, zoomEase);
    const zoomY = MathUtils.lerp(flight.start.y, focusY, zoomEase);
    const x = MathUtils.lerp(zoomX, flight.end.x, ease);
    const y = MathUtils.lerp(zoomY, flight.end.y, ease);
    const focusSize = Math.min(
      260 * (Platform.OS === "web" ? 1.5 : 1),
      width * 0.75,
      height * 0.4,
    );
    const displaySize =
      MathUtils.lerp(flight.start.size, focusSize, zoomEase) *
      (1 + brandZoom * 1.8);
    const brandOffsetY = reduceMotion
      ? 0
      : (0.56 * displaySize * brandZoom) / 2.2;
    group.current.position.set(
      (reduceMotion ? flight.start.x : x) - width / 2,
      height / 2 -
        (reduceMotion ? flight.start.y : y) +
        Math.sin(travel * Math.PI) * 55 +
        brandOffsetY,
      0,
    );
    group.current.quaternion.slerpQuaternions(
      startRotation,
      frontRotation,
      reduceMotion ? 1 : zoomEase,
    );
    if (travel > 0 && !reduceMotion) {
      group.current.rotation.y += ease * Math.PI * 2;
      group.current.rotation.z += Math.sin(travel * Math.PI) * -0.3;
    }
    group.current.scale.setScalar(
      ((reduceMotion ? flight.start.size : displaySize) / 2.2) *
        (1 - (reduceMotion ? t : ease) * 0.96),
    );
    if (t === 1) {
      finished.current = true;
      onComplete();
    }
  });

  return (
    <group
      ref={group}
      quaternion={startRotation}
      scale={flight.start.size / 2.2}
      position={[flight.start.x - width / 2, height / 2 - flight.start.y, 0]}
    >
      <HeadphonesModel />
    </group>
  );
}

export function PrizeCartFlight({ flight, onComplete, onVisible }: Props) {
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
            <FlyingHeadphones
              flight={flight}
              onComplete={onComplete}
              onVisible={onVisible}
            />
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
