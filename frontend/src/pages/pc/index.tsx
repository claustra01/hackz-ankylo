import { Sky } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import GameMap from "../../components/GameMap";
import PlacePlayerOperation from "../../components/placePlayer/PlacePlayerOperation";
import { SignalingServer } from "../../components/webrtc/SignalingServer";

const canvasStyle = {
	width: "100vw",
	height: "100vh",
	overflow: "hidden",
};

function App() {
	return (
		<>
			<SignalingServer />
			<Canvas style={canvasStyle}>
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
