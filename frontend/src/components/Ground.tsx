import { RigidBody } from "@react-three/rapier";

interface GroundProps {
	position: [number, number, number];
	scale: {
		x: number;
		z: number;
	};
}

const Ground = ({ position, scale }: GroundProps) => {
	return (
		<RigidBody type="fixed">
			<mesh position={position} scale={[scale.x, 1, scale.z]}>
				<boxGeometry />
				<meshStandardMaterial color="green" metalness={0} roughness={1} />
			</mesh>
		</RigidBody>
	);
};

export default Ground;
