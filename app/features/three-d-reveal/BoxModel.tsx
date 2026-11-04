import { useEffect, useMemo } from "react";
import { AnimationMixer, Box3, LoopOnce, Vector3 } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Asset } from "expo-asset";
import { useReducedMotion } from "react-native-reanimated";
import { useFrame, useLoader } from "./renderer";

const modelUri = Asset.fromModule(
  require("../../../assets/pack-com-reveal.glb"),
).uri;

type Props = {
  playing: boolean;
  onReady: () => void;
  onComplete: () => void;
  onReveal: () => void;
};

export function BoxModel({ playing, onReady, onComplete, onReveal }: Props) {
  const gltf = useLoader(GLTFLoader, modelUri);
  const reduceMotion = useReducedMotion();
  const model = useMemo(() => {
    const scene = gltf.scene.clone(true);
    const bounds = new Box3().setFromObject(scene);
    const center = bounds.getCenter(new Vector3());
    const size = bounds.getSize(new Vector3());
    const scale = 2.4 / Math.max(size.x, size.y, size.z);
    const mixer = new AnimationMixer(scene);
    const action = mixer.clipAction(gltf.animations[0]);
    action.setLoop(LoopOnce, 1);
    action.clampWhenFinished = true;
    return {
      scene,
      mixer,
      action,
      scale,
      position: center.multiplyScalar(-scale),
    };
  }, [gltf]);

  useEffect(() => {
    onReady();
    const mixer = model.mixer;
    mixer.addEventListener("finished", onComplete);
    return () => {
      mixer.removeEventListener("finished", onComplete);
      mixer.stopAllAction();
      mixer.uncacheRoot(model.scene);
    };
  }, [model, onReady, onComplete]);

  useEffect(() => {
    model.action.reset().play();
    if (playing && reduceMotion) {
      model.mixer.update(model.action.getClip().duration);
    }
  }, [model, playing, reduceMotion]);

  useFrame((_, delta) => {
    if (playing && !reduceMotion) model.mixer.update(Math.min(delta, 0.05));
  });

  return (
    <group
      scale={model.scale}
      position={model.position}
      onClick={onReveal}
      dispose={null}
    >
      <primitive object={model.scene} />
    </group>
  );
}
