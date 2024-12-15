import { RigidBody } from "@react-three/rapier";

interface ArrowProps {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	arrowRigidBody: any;
}

export const Arrow = ({ arrowRigidBody }: ArrowProps) => {
	return (
		<RigidBody ref={arrowRigidBody}>
			<mesh position={[0, 0, 0]}>
				<cylinderGeometry args={[0.1, 0.1, 1, 32]} />
				<meshStandardMaterial color="cyan" metalness={0} roughness={0.2} />
			</mesh>
		</RigidBody>
	);
};
