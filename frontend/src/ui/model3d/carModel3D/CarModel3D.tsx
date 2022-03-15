import React from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

interface Props {
  model: string;
}

const carModel = {
  Cassini: {
    url: "0/Cassini.gltf",
    position: [-6, -0.75, 0],
  },
  Venera: {
    url: "1/Venera.gltf",
    position: [12, -0.75, 8],
  },
  Ariel: {
    url: "2/Ariel.gltf",
    position: [6, -0.75, 0],
  },
  Voyager: {
    url: "3/Voyager.gltf",
    position: [12, -0.75, -12],
  },
  Apollo: {
    url: "4/Apollo.gltf",
    position: [0, -0.75, 0],
  },
};

const CarModel3D: React.FC<Props> = ({ model }) => {
  const car = carModel[model as keyof typeof carModel];
  const modelGLTF = useLoader(
    GLTFLoader,
    `https://sol-race.s3.ap-southeast-1.amazonaws.com/kart/${car?.url}`
  );
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
