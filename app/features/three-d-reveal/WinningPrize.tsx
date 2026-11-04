import { useEffect, useMemo, useRef } from "react";
import { Asset } from "expo-asset";
import { AnimationMixer, Sprite, TextureLoader, SRGBColorSpace } from "three";
import { useFrame, useLoader } from "./renderer";

const imageUri = Asset.fromModule(
  require("../../../assets/airpods-max.webp"),
).uri;

type Props = {
  mixer: AnimationMixer;
  duration: number;
  reduceMotion: boolean;
};

export function WinningPrize({ mixer, duration, reduceMotion }: Props) {
  const source = useLoader(TextureLoader, imageUri);
  const image = useMemo(() => {
    const texture = source.clone();
    texture.colorSpace = SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  }, [source]);
  const prize = useRef<Sprite>(null);

  useEffect(() => () => image.dispose(), [image]);

  useFrame(() => {
    if (!prize.current) return;
    const elapsed = mixer.time - duration;
    const progress =
      reduceMotion && elapsed >= 0
        ? 1
        : Math.max(0, Math.min(1, elapsed / 2.2));
    const rise = 1 - Math.pow(1 - progress, 3);
    prize.current.visible = elapsed >= 0;
    prize.current.position.y = 0.7 + rise * 3.2;
    prize.current.material.opacity = Math.min(1, progress * 5);
    prize.current.scale.set(2.05, 2.27, 1);
  });

  return (
    <sprite ref={prize} visible={false} position={[0, 0.7, 0]}>
      <spriteMaterial
        map={image}
        transparent
        alphaTest={0.05}
        depthWrite={false}
        toneMapped={false}
      />
    </sprite>
  );
}
