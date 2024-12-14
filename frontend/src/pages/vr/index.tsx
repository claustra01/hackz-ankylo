import { Sky } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { createXRStore } from "@react-three/xr";
import GameMap from "../../components/GameMap";
import { VRPlayer } from "../../components/VRPlayer";
import { SignalingServer } from "../../components/webrtc/SignalingServer";

const store = createXRStore();

function App() {
	return (
		<>
			<SignalingServer />
			<Canvas style={{ width: "100vw", height: "100vh" }}>
				<Physics gravity={[0, -9.81, 0]}>
					<GameMap />
					<VRPlayer store={store} />
				</Physics>
				<Sky
					distance={450000}
					sunPosition={[100, 60, 100]}
					inclination={0}
					azimuth={0.25}
				/>
			</Canvas>
			<button type="button" onClick={() => store.enterVR()}>
				Enter VR
			</button>
		</>
	);
}

export default App;
