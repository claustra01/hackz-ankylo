import { Cylinder } from "@react-three/drei";
import * as THREE from "three";
import type TargetInfo from "../utils/TargetInfo";
interface TargetProps {
	targetInfo: TargetInfo;
}

const Target = ({ targetInfo }: TargetProps) => {
	return (
		<Cylinder
			onUpdate={(self) => {
				self.lookAt(new THREE.Vector3(0, 0, 0));
				self.rotateX(Math.PI / 2);
			}}
			args={[1, 1, 1, 32]}
			position={targetInfo.position}
			scale={[1, 0.3, 1]}
		>
			<meshStandardMaterial color="red" />
		</Cylinder>
	);
};

export default Target;
