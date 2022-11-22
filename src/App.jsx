import { useState, useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

let elapsedTime = 0;

function Box(props) {
  //reference gives us direct access to the THREE.Mesh object
  const ref = useRef();
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false);
  const [clicked, click] = useState(false);
  // Subscribecomponent to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => {
    elapsedTime += delta;
    ref.current.rotation.x = elapsedTime * 0.05;
    /* ref.current.position.x = Math.cos(elapsedTime + props.position[0]) * 5;
    ref.current.position.z = Math.sin(elapsedTime + props.position[2]) * 5; */
    // ref.current.position.y = Math.sin(elapsedTime / 2) * 5;
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

function R3FIglooRenderer() {
  // Reactive state
  const { size, gl, scene, camera } = useThree();

  let pixel_ratio = gl.getPixelRatio();
  // calculate size of cubemap faces
  let view_width = gl.domElement.width / 6 / pixel_ratio;
  let view_height = gl.domElement.height / pixel_ratio;

  let fov = 90;
  let aspect = 1;
  let near = camera.near;
  let far = camera.far;

  let pointerX = 0;
  let pointerY = 0;
  let activeCamera = null;

  const cameraLeft = new THREE.PerspectiveCamera(fov, aspect, near, far);
  cameraLeft.lookAt(-1, 0, 0);
  cameraLeft.position.copy(camera.position);

  const cameraFront = new THREE.PerspectiveCamera(fov, aspect, near, far);
  cameraFront.lookAt(0, 0, -1);
  cameraFront.position.copy(camera.position);

  const cameraRight = new THREE.PerspectiveCamera(fov, aspect, near, far);
  cameraRight.lookAt(1, 0, 0);
  cameraRight.position.copy(camera.position);

  const cameraBack = new THREE.PerspectiveCamera(fov, aspect, near, far);
  cameraBack.lookAt(0, 0, 1);
  cameraBack.position.copy(camera.position);

  const cameraBottom = new THREE.PerspectiveCamera(fov, aspect, near, far);
  cameraBottom.lookAt(0, -1, 0);
  cameraBottom.position.copy(camera.position);

  const cameraTop = new THREE.PerspectiveCamera(fov, aspect, near, far);
  cameraTop.lookAt(0, 1, 0);
  cameraTop.position.copy(camera.position);

  const render = (glRenderer, currentScene) => {
    glRenderer.setScissorTest(true);
    glRenderer.setScissor(0, 0, view_width, view_height);
    glRenderer.setViewport(0, 0, view_width, view_height);
    // glRenderer.setClearColor(new THREE.Color("skyblue"));
    glRenderer.render(currentScene, cameraLeft);

    glRenderer.setScissor(view_width, 0, view_width, view_height);
    glRenderer.setViewport(view_width, 0, view_width, view_height);
    // glRenderer.setClearColor(new THREE.Color("red"));
    glRenderer.render(currentScene, cameraFront);

    glRenderer.setScissor(view_width * 2, 0, view_width, view_height);
    glRenderer.setViewport(view_width * 2, 0, view_width, view_height);
    // glRenderer.setClearColor(new THREE.Color("green"));
    glRenderer.render(currentScene, cameraRight);

    glRenderer.setScissor(view_width * 3, 0, view_width, view_height);
    glRenderer.setViewport(view_width * 3, 0, view_width, view_height);
    // glRenderer.setClearColor(new THREE.Color("yellow"));
    glRenderer.render(currentScene, cameraBack);

    // glRenderer.setScissor(view_width * 4, 0, view_width, view_height);
    // glRenderer.setViewport(view_width * 4, 0, view_width, view_height);
    // glRenderer.render(currentScene, cameraBottom);
    //
    // glRenderer.setScissor(view_width * 5, 0, view_width, view_height);
    // glRenderer.setViewport(view_width * 5, 0, view_width, view_height);
    // glRenderer.render(currentScene, cameraTop);

    glRenderer.setScissorTest(false);

    return true;
  };
  // Take over render-loop (that is what the index is for)
  useFrame(() => {
    render(gl, scene);
  }, 1);
}

function App() {
  const urlString = window.location.search;
  const urlParams = new URLSearchParams(urlString);
  const igloomode = urlParams.get("igloo");
  return (
    <Canvas camera={{ position: [0, 0, 0] }}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Box position={[5, 0, -5]} color="green" />
      <Box position={[5, 0, 0]} color="orange" />
      <Box position={[5, 0, 5]} color="blue" />
      <Box position={[0, 0, 5]} color="red" />
      <Box position={[-5, 0, 5]} color="ivory" />
      <Box position={[-5, 0, 0]} color="hotpink" />
      <Box position={[-5, 0, -5]} color="mediumvioletred" />
      <Box position={[0, 1.5, -5]} color="peachpuff" />
      <mesh position={[0, -4, 0]} rotation-x={0}>
        <cylinderGeometry args={[5, 5, 1, 32]}/>
        <meshStandardMaterial color="ivory"/>
      </mesh>
      <mesh position={[0, 4, 0]} rotation-x={0}>
        <cylinderGeometry args={[5, 5, 1, 32]}/>
        <meshStandardMaterial color="red"/>
      </mesh>
      <OrbitControls target={[0,0,-5]}/>
      {igloomode && <R3FIglooRenderer />}
    </Canvas>
  );
}

export default App;
