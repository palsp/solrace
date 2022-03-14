import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { TGALoader } from "three/examples/jsm/loaders/TGALoader";

import * as THREE from "three";
import React, { Suspense } from "react";
import { OrbitControls, Reflector, useTexture } from "@react-three/drei";

function Ground(props: any) {
  const [floor, normal] = useTexture([
    "/SurfaceImperfections003_1K_var1.jpg",
    "/marble-surface.jpeg",
  ]);
  return (
    <Reflector resolution={256} args={[8, 8]} {...props}>
      {(Material: any, props: any) => (
        <Material
          color="white"
          metalness={0}
          roughnessMap={floor}
          normalMap={normal}
          normalScale={[2, 2]}
          {...props}
        />
      )}
    </Reflector>
  );
}

const Car = () => {
  const fbx = useLoader(
    GLTFLoader,
    "https://sol-race.s3.ap-southeast-1.amazonaws.com/kart/0/Cassini.gltf"
  );
  return (
    <mesh>
      <primitive
        object={fbx.scene}
        scale={1}
        rotation={[0, 0, 0]}
        position={[-6, -0.75, 0]}
      />
    </mesh>
  );
};

const Model3D = () => {
  return (
    <Canvas
      camera={{
        fov: 75,
        near: 0.01,
        far: 1000,
      }}
      style={{
        background: "var(--background-gradient-2)",
        height: `calc(100vh - 7rem)`,
        marginBlock: "1rem",
        border: "0.1rem solid var(--color-primary-dark)",
        borderRadius: "0.5rem",
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
        <Car />
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
