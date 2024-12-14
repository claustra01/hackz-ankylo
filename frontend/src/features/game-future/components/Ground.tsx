import { Plane } from "@react-three/drei";

interface GroundProps {
	position: [number, number, number];
	scale: {
		x: number;
		z: number;
	};
}

const Ground = ({ position, scale }: GroundProps) => {
	return (
		<Plane
			args={[1 * scale.x, 1 * scale.z, 128, 128]}
			position={position}
			rotation={[-Math.PI / 2, 0, 0]}
		>
			<meshStandardMaterial color="green" />
		</Plane>
	);
};

export default Ground;
