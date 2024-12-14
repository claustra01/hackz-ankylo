import { Sphere } from "@react-three/drei";

interface TargetPuttingColliderProps {
	center: [number, number, number];
	radius: number;
}

const TargetPuttingCollider = ({
	center,
	radius,
}: TargetPuttingColliderProps) => {
	return (
		<Sphere
			name="TargetPuttingCollider"
			args={[radius]}
			position={center}
			visible={false}
		/>
	);
};

export default TargetPuttingCollider;
