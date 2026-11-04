import { useMemo, useRef } from "react";
import { AnimationMixer, Group, Quaternion, Vector3 } from "three";
import { useFrame, useThree } from "./renderer";
import { HeadphonesModel } from "./HeadphonesModel";

export type PrizePosition = {
  x: number;
  y: number;
  size: number;
  rotation: [number, number, number, number];
};

type Props = {
  mixer: AnimationMixer;
  duration: number;
  reduceMotion: boolean;
  claimed: boolean;
  onClaim: (position: PrizePosition) => void;
};

export function WinningPrize({
  mixer,
  duration,
  reduceMotion,
  claimed,
  onClaim,
}: Props) {
  const prize = useRef<Group>(null);
  const { camera, size } = useThree();
  const world = useMemo(() => new Vector3(), []);
  const top = useMemo(() => new Vector3(), []);
  const orientation = useMemo(() => new Quaternion(), []);
  const cameraRotation = useMemo(() => new Quaternion(), []);
  const worldScale = useMemo(() => new Vector3(), []);

  useFrame(() => {
    if (!prize.current) return;
    const elapsed = mixer.time - duration;
    const progress =
      reduceMotion && elapsed >= 0
        ? 1
        : Math.max(0, Math.min(1, elapsed / 2.2));
    const rise = 1 - Math.pow(1 - progress, 3);
    prize.current.visible = elapsed >= 0 && !claimed;
    prize.current.position.y = 0.7 + rise * 3.2;
    prize.current.rotation.y = reduceMotion ? 0.5 : (1 - rise) * -0.8 + 0.5;
  });

  function claim() {
    if (
      !prize.current ||
      claimed ||
      mixer.time < duration + (reduceMotion ? 0 : 2.2)
    )
      return;
    prize.current.getWorldPosition(world);
    prize.current.getWorldScale(worldScale);
    top
      .copy(camera.up)
      .applyQuaternion(camera.quaternion)
      .multiplyScalar(1.1 * worldScale.y)
      .add(world);
    prize.current.getWorldQuaternion(orientation);
    cameraRotation.copy(camera.quaternion).invert();
    orientation.premultiply(cameraRotation);
    world.project(camera);
    top.project(camera);
    onClaim({
      x: ((world.x + 1) * size.width) / 2,
      y: ((1 - world.y) * size.height) / 2,
      rotation: [orientation.x, orientation.y, orientation.z, orientation.w],
      size: Math.max(24, Math.abs(top.y - world.y) * size.height),
    });
  }

  return (
    <group
      ref={prize}
      visible={false}
      position={[0, 0.7, 0]}
      onClick={(event) => {
        event.stopPropagation();
        claim();
      }}
    >
      <HeadphonesModel />
    </group>
  );
}
