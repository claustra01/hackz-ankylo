import { VRPlayer } from "../../components/VRPlayer";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import * as THREE from "three";
import GameMap from "../../components/GameMap";
import DebugCubeProducer from "../../components/debug/DebugCubeProducer";
import { SignalingServer } from "../../components/webrtc/SignalingServer";

function App() {
  return (
    <>
      <SignalingServer />
      <Canvas style={{ width: "100vw", height: "100vh" }}>
        <Physics>
          <GameMap />
        </Physics>
        <VRPlayer />
      </Canvas>
    </>
  );
}

export default App;
