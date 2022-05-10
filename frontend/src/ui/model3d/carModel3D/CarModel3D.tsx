import React from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

interface Props {
  model: string;
  modelUrl?: string;
}

const carModel = {
  Cassini: {
    url: "/Cassini.gltf",
    position: [-6, -0.75, 0],
  },
  // Venera: {
  //   url: "/Venera.gltf",
  //   position: [12, -0.75, 8],
  // },
  // Ariel: {
  //   url: "/Ariel.gltf",
  //   position: [6, -0.75, 0],
  // },
  Voyager: {
    url: "/Voyager.gltf",
    position: [12, -0.75, -12],
  },
  // Apollo: {
  //   url: "/Apollo.gltf",
  //   position: [0, -0.75, 0],
  // },
};

const CarModel3D: React.FC<Props> = ({ model, modelUrl }) => {
  const car = carModel[model as keyof typeof carModel];
  const modelGLTF = useLoader(GLTFLoader, car?.url);
  return (
    <mesh>
      <primitive
        object={modelGLTF.scene}
        scale={1}
        rotation={[0, 0, 0]}
        position={car?.position}
      />
    </mesh>
  );
};

export default CarModel3D;
