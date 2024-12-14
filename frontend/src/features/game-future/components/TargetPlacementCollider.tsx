import { Sphere } from "@react-three/drei";

interface TargetPlacementColliderProps {
	center: [number, number, number];
	radius: number;
}

const TargetPlacementCollider = ({
	center,
	radius,
}: TargetPlacementColliderProps) => {
	return (
		<Sphere
			name="TargetPlacementCollider"
			args={[radius]}
			position={center}
			visible={false}
		/>
	);
};

export default TargetPlacementCollider;
