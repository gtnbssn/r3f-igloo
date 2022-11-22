import { useState, useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

function Box(props) {
  //reference gives us direct access to the THREE.Mesh object
  const ref = useRef();
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false);
  const [clicked, click] = useState(false);
  // Subscribecomponent to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => {
    ref.current.rotation.x += 0.01;
  });
  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <mesh
      position={props.position}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? "hotpink" : props.color} />
    </mesh>
  );
}

function Test() {
  return (
    <Canvas camera={{ position: [0, 0, 0] }}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Box position={[1, 1.5, -5]} color="peachpuff" />
      <Box position={[-1, 1.5, -5]} color="peachpuff" />
      <OrbitControls />
    </Canvas>
  );
}

export default Test;
