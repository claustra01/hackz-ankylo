import { Cylinder } from "@react-three/drei";
import * as THREE from "three";
import type TargetInfo from "../utils/TargetInfo";
interface TargetProps {
	targetInfo: TargetInfo;
}

const Target = ({ targetInfo }: TargetProps) => {
	const baseRotation = new THREE.Euler(Math.PI / 2, 0, 0);
	//TODO: Apply facingDirection to baseRotation

	return (
		<Cylinder
			args={[1, 1, 1, 32]}
			position={targetInfo.position}
			scale={[1, 0.3, 1]}
			rotation={baseRotation}
		>
			<meshStandardMaterial color="red" />
		</Cylinder>
	);
};

export default Target;
