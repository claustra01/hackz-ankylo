import { RigidBody } from "@react-three/rapier";

interface ArrowProps {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	arrowRigidBody: any;
}

export const Arrow = ({ arrowRigidBody }: ArrowProps) => {
	return (
		<RigidBody ref={arrowRigidBody}>
			<mesh scale={[0.25, 0.25, 0.25]} position={[0, -3, 0]}>
				<sphereGeometry />
				<meshStandardMaterial color="cyan" metalness={0} roughness={0.2} />
			</mesh>
		</RigidBody>
	);
};
