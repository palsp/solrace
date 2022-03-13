import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import * as THREE from "three";
import React, { Suspense } from "react";
import { OrbitControls } from "@react-three/drei";

const Car = () => {
  const fbx = useLoader(FBXLoader, "/Voyager.FBX");
  return <primitive object={fbx} scale={0.02} />;
};

const Model3D = () => {
  return (
    <div>
      <Canvas
        camera={{
          fov: 75,
          near: 0.1,
          far: 100,
        }}
      >
        <Suspense fallback={null}>
          <OrbitControls />
          <pointLight intensity={3} />
          <Car />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Model3D;
