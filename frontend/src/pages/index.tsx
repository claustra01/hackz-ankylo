import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import * as THREE from "three";
import DebugCubeProducer from "../features/debug/components/DebugCubeProducer";
import GameMap from "../features/game-future/components/GameMap";
import PlacePlayerOperation from "../features/game-future/components/PlacePlayerOperation";

function App() {
	return (
		<Canvas style={{ width: "100vw", height: "100vh" }}>
			<Physics>
				<GameMap />
				<DebugCubeProducer
					timeSpan={1000}
					position={new THREE.Vector3(0, 10, 0)}
				/>
				<PlacePlayerOperation/>
			</Physics>
		</Canvas>
	);
}

export default App;
