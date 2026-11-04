import { isSpinQuest } from "../../config/brand";
import { useMemo } from "react";
import { Asset } from "expo-asset";
import { Box3, Vector3 } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { useLoader } from "./renderer";

const modelUri = Asset.fromModule(
  isSpinQuest
    ? require("../../../assets/headphones-spinquest.glb")
    : require("../../../assets/headphones-realistic.glb"),
).uri;

export function HeadphonesModel() {
  const model = useLoader(GLTFLoader, modelUri);
  const fitted = useMemo(() => {
    const scene = model.scene.clone(true);
    const bounds = new Box3().setFromObject(scene);
    const center = bounds.getCenter(new Vector3());
    const size = bounds.getSize(new Vector3());
    const scale = 2.2 / Math.max(size.x, size.y, size.z);
    return {
      scene,
      scale,
      position: center.multiplyScalar(-scale),
    };
  }, [model]);

  return (
    <group scale={fitted.scale} position={fitted.position} dispose={null}>
      <primitive object={fitted.scene} />
    </group>
  );
}
