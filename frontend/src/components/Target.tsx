import { Cylinder } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import type { CollisionPayload } from "@react-three/rapier";
import * as THREE from "three";
import type TargetInfo from "../models/TargetInfo";

interface TargetProps {
	targetInfo: TargetInfo;
	onShoot: (id: number) => void;
}

/**
 * Target is a component that represents a target
 * @param targetInfo - The information of the target
 * @param onShoot - The function to be called when the target is shot
 * @returns
 */
const Target = ({ targetInfo, onShoot }: TargetProps) => {
	//衝突判定
	const collisionHandler = (event: CollisionPayload) => {
		if (event.colliderObject && event.colliderObject.name === "arrow") {
			onShoot(targetInfo.id);
		}
	};

	return (
		<RigidBody type="fixed" onCollisionEnter={collisionHandler}>
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
		</RigidBody>
	);
};

export default Target;
