import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import GameMap from "../features/game-future/components/GameMap";

function App() {
	return (
		<Canvas style={{ width: "100vw", height: "100vh" }}>
			<GameMap />
			<OrbitControls />
		</Canvas>
	);
}

export default App;
