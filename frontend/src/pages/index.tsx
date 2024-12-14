import { OrbitControls } from "@react-three/drei";
import { Sphere } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { useState } from "react";
import GameMap from "../features/game-future/components/GameMap";
import TargetPuttingCollider from "../features/game-future/components/TargetPuttingCollider";
import useTargetPutting from "../features/game-future/hooks/useTargetPutting";
import type TargetInfo from "../features/game-future/utils/TargetInfo";

interface TargetPuttingManagerProps {
	targetInfos: TargetInfo[];
	setTargetInfos: (targetInfos: TargetInfo[]) => void;
}

const TargetPuttingManager = ({
	targetInfos,
	setTargetInfos,
}: TargetPuttingManagerProps) => {
	const { camera, scene } = useThree();
	useTargetPutting(camera, scene, targetInfos, setTargetInfos);
	return null;
};

function App() {
	const [targetInfos, setTargetInfos] = useState<TargetInfo[]>([]);

	return (
		<Canvas style={{ width: "100vw", height: "100vh" }}>
			<TargetPuttingManager
				targetInfos={targetInfos}
				setTargetInfos={setTargetInfos}
			/>
			<GameMap targetInfos={targetInfos} />
			<OrbitControls />
			<Sphere position={[0, 0, 0]} scale={0.1}>
				<meshStandardMaterial color="blue" />
			</Sphere>
			<TargetPuttingCollider center={[0, 0, 0]} radius={10} />
		</Canvas>
	);
}

export default App;
