import { useRef } from "react";
import {
  AnimationMixer,
  Group,
  Mesh,
  MeshBasicMaterial,
  PointLight,
} from "three";
import { useFrame } from "./renderer";
import { palette } from "../../theme/colors";

type Props = {
  mixer: AnimationMixer;
  duration: number;
  playing: boolean;
  reduceMotion: boolean;
};

export function RevealEffects({
  mixer,
  duration,
  playing,
  reduceMotion,
}: Props) {
  const sparks = useRef<Group>(null);
  const ring = useRef<Mesh>(null);
  const light = useRef<PointLight>(null);

  useFrame(() => {
    const progress = Math.min(mixer.time / duration, 1);
    const celebration = Math.max(0, Math.min(1, (mixer.time - duration) / 3));
    const celebrating = mixer.time >= duration && celebration < 1;
    const opening = Math.max(0, Math.min(1, (progress - 0.35) / 0.5));
    const active = playing && !reduceMotion;
    if (sparks.current) {
      sparks.current.visible = active && (progress < 0.98 || celebrating);
      sparks.current.children.forEach((spark, index) => {
        const angle = index * 2.4 + (progress + celebration) * Math.PI * 3;
        const radius = celebrating
          ? 0.3 + celebration * 2.2
          : 1.1 + opening * 1.3;
        const lift = celebrating
          ? celebration
          : (progress * 2 + index / 18) % 1;
        spark.position.set(
          Math.cos(angle) * radius,
          -0.8 + lift * (1.2 + opening * 1.5),
          Math.sin(angle) * radius,
        );
        spark.rotation.set(angle, angle * 0.5, angle);
        spark.scale.setScalar(
          Math.sin(lift * Math.PI) *
            (celebrating
              ? 1 - celebration
              : 1 - Math.max(0, progress - 0.8) * 5),
        );
      });
    }
    if (ring.current) {
      ring.current.visible = active && opening > 0 && opening < 1;
      ring.current.scale.setScalar(1 + opening * 1.8);
      (ring.current.material as MeshBasicMaterial).opacity =
        Math.sin(opening * Math.PI) * 0.65;
    }
    if (light.current) {
      light.current.intensity = active
        ? Math.sin((celebrating ? celebration : opening) * Math.PI) * 8
        : 0;
    }
  });

  return (
    <group>
      <pointLight
        ref={light}
        position={[0, 0.6, 0]}
        color={palette.gold}
        intensity={0}
        distance={7}
      />
      <mesh
        ref={ring}
        visible={false}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1, 0]}
      >
        <ringGeometry args={[0.94, 1, 64]} />
        <meshBasicMaterial
          color={palette.sparkleGold}
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>
      <group ref={sparks} visible={false}>
        {Array.from(
          {
            length: 18,
          },
          (_, index) => (
            <mesh key={index}>
              <octahedronGeometry args={[index % 3 === 0 ? 0.07 : 0.04]} />
              <meshBasicMaterial
                color={index % 2 === 0 ? palette.gold : palette.planeIvory}
              />
            </mesh>
          ),
        )}
      </group>
    </group>
  );
}
