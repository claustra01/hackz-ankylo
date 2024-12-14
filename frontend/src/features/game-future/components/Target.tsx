import { Cylinder } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import type { CollisionPayload } from "@react-three/rapier";
import * as THREE from "three";
import type TargetInfo from "../utils/TargetInfo";

interface TargetProps {
	targetInfo: TargetInfo;
	banishThis: () => void;
}

const Target = ({ targetInfo, banishThis }: TargetProps) => {
	const collisionHandler = (event: CollisionPayload) => {
		if (event.colliderObject && event.colliderObject.name === "arrow") {
			console.log("hit arrow");
			banishThis();
		} else {
			console.log("hit other");
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
