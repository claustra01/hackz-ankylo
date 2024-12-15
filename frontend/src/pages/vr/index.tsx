import { Sky } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { createXRStore } from "@react-three/xr";
import GameMap from "../../components/GameMap";
import { VRPlayer } from "../../components/VRPlayer";
import { SignalingServer } from "../../components/webrtc/SignalingServer";

const store = createXRStore();

function App() {
	const buttonHeight = 100;
	const buttonWidth = 200;

	return (
		<div
			style={{
				position: "relative",
				width: "100vw",
				height: "100vh",
			}}
		>
			<SignalingServer />
			<Canvas
				style={{
					width: "100%",
					height: "100%",
				}}
			>
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
			<button
				type="button"
				onClick={() => store.enterVR()}
				style={{
					position: "absolute",
					fontSize: "20px",
					top: `calc(50vh - ${buttonHeight / 2}px)`,
					left: `calc(50vw - ${buttonWidth / 2}px)`,
					zIndex: 10,
					width: `${buttonWidth}px`,
					height: `${buttonHeight}px`,
				}}
			>
				Enter VR
			</button>
		</div>
	);
}

export default App;
