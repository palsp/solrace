import { Reflector, useTexture } from "@react-three/drei";

const Ground = (props: any) => {
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
};

export default Ground;
