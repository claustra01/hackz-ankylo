import { Text3D } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export const Loading = () => {
	const textRef = useRef<THREE.Mesh>(null);

	useEffect(() => {
		if (textRef.current) {
			const box = new THREE.Box3().setFromObject(textRef.current);
			const center = box.getCenter(new THREE.Vector3());
			const textPosition = textRef.current.position;
			textPosition.set(-center.x, -center.y, -center.z);
		}
	}, []);

	useFrame(() => {
		if (textRef.current) {
			textRef.current.rotation.x += 0.05; // x軸回転
		}
	});

	return (
		<RigidBody type="fixed">
			<Text3D
				ref={textRef}
				font={"/Roboto-Medium.json"}
				size={0.5}
				height={0.2}
				material={new THREE.MeshStandardMaterial({ color: "gray" })}
			>
				Loading...
			</Text3D>
		</RigidBody>
	);
};
