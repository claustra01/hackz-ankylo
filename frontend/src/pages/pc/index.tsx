import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import * as THREE from "three";
import GameMap from "../../components/GameMap";
import DebugCubeProducer from "../../components/debug/DebugCubeProducer";
import PlacePlayerOperation from "../../components/placePlayer/PlacePlayerOperation";
import { SignalingServer } from "../../components/webrtc/SignalingServer";
import { Sky } from "@react-three/drei";

function App() {
  return (
    <>
      <SignalingServer />
      <Canvas style={{ width: "100vw", height: "100vh" }}>
        <Physics gravity={[0, -9.81, 0]}>
          <GameMap />
          <PlacePlayerOperation />
        </Physics>
        <Sky
          distance={450000}
          sunPosition={[100, 60, 100]}
          inclination={0}
          azimuth={0.25}
        />
      </Canvas>
    </>
  );
}

export default App;
