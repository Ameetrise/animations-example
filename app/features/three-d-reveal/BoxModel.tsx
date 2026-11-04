import { useEffect, useMemo } from "react";
import {
  AnimationMixer,
  Box3,
  LoopOnce,
  PerspectiveCamera,
  Sphere,
  Vector3,
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Asset } from "expo-asset";
import { useReducedMotion } from "react-native-reanimated";
import { useFrame, useLoader, useThree } from "./renderer";

import { WinningPrize } from "./WinningPrize";
import { RevealEffects } from "./RevealEffects";

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
  const { camera, size: viewport } = useThree();
  const reduceMotion = useReducedMotion();
  const model = useMemo(() => {
    const scene = gltf.scene.clone(true);
    const mixer = new AnimationMixer(scene);
    const action = mixer.clipAction(gltf.animations[0]);
    action.setLoop(LoopOnce, 1);
    action.clampWhenFinished = true;
    action.play();
    const bounds = new Box3();
    for (let frame = 0; frame <= 120; frame += 1) {
      mixer.setTime((frame / 120) * action.getClip().duration);
      bounds.union(new Box3().setFromObject(scene));
    }
    bounds.union(
      new Box3(new Vector3(-1.2, 0.5, -1.2), new Vector3(1.2, 5.2, 1.2)),
    );
    action.reset().play();
    mixer.setTime(0);
    const sphere = bounds.getBoundingSphere(new Sphere());
    const scale = 2.4 / sphere.radius;
    const center = sphere.center;
    return {
      scene,
      mixer,
      action,
      scale,
      position: center.multiplyScalar(-scale),
    };
  }, [gltf]);

  useEffect(() => {
    if (!(camera instanceof PerspectiveCamera)) return;
    const verticalAngle = (camera.fov * Math.PI) / 360;
    const horizontalAngle = Math.atan(
      (Math.tan(verticalAngle) * viewport.width) / viewport.height,
    );
    const distance =
      (2.4 * 1.2) / Math.sin(Math.min(verticalAngle, horizontalAngle));
    camera.position.set(4, 3.2, 5).normalize().multiplyScalar(distance);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera, viewport.width, viewport.height]);

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
    if (!playing || reduceMotion) return;
    const frameTime = Math.min(delta, 0.05);
    const remaining = model.action.getClip().duration - model.mixer.time;
    model.mixer.update(
      remaining > 0 ? Math.min(frameTime * 2.5, remaining) : frameTime,
    );
  });

  return (
    <group>
      <RevealEffects
        mixer={model.mixer}
        duration={model.action.getClip().duration}
        playing={playing}
        reduceMotion={reduceMotion}
      />
      <group
        scale={model.scale}
        position={model.position}
        onClick={onReveal}
        dispose={null}
      >
        <primitive object={model.scene} />
        <WinningPrize
          mixer={model.mixer}
          duration={model.action.getClip().duration}
          reduceMotion={reduceMotion}
        />
      </group>
    </group>
  );
}
