import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import * as THREE from "three";
import React, { Suspense } from "react";
import { OrbitControls, Reflector, useTexture } from "@react-three/drei";
import CarModel3D from "./carModel3D/CarModel3D";
import Ground from "./ground/Ground";
interface Props {
  height?: string;
  marginBlock?: string;
  borderRadius?: string;
  model: string;
}
const Model3D: React.FC<Props> = ({
  height,
  model,
  marginBlock,
  borderRadius,
}) => {
  return (
    <Canvas
      camera={{
        fov: 75,
        near: 0.01,
        far: 1000,
      }}
      style={{
        background: "var(--background-gradient-2)",
        height: `${height ? height : "calc(100vh - 7rem)"}`,
        marginBlock: `${marginBlock ? marginBlock : ""}`,
        border: "0.1rem solid var(--color-primary-dark)",
        borderRadius: `${borderRadius ? borderRadius : "0 0 0.5rem 0.5rem"}`,
        boxShadow: "var(--shadow-elevation-medium-primary)",
      }}
    >
      <Suspense fallback={null}>
        <OrbitControls
          maxPolarAngle={Math.PI / 2}
          maxDistance={5}
          minDistance={3.5}
          autoRotate
        />
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <CarModel3D model={model} />
        <Ground
          mirror={0.99}
          blur={[500, 100]}
          mixBlur={12}
          mixStrength={1.5}
          rotation={[-Math.PI / 2, 0, Math.PI / 2]}
          position-y={-0.8}
        />
      </Suspense>
    </Canvas>
  );
};

export default Model3D;
