import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import * as THREE from "three";
import GameMap from "../../components/GameMap";
import DebugCubeProducer from "../../components/debug/DebugCubeProducer";
import PlacePlayerOperation from "../../components/placePlayer/PlacePlayerOperation";

function App() {
  return (
    <Canvas style={{ width: "100vw", height: "100vh" }}>
      <Physics>
        <GameMap />
        <DebugCubeProducer
          timeSpan={1000}
          position={new THREE.Vector3(0, 10, 0)}
        />
        <PlacePlayerOperation />
      </Physics>
    </Canvas>
  );
}

export default App;
