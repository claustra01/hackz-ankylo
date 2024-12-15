import { Box } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { Vector3 } from "three";

type ParticleStatus = {
	position: Vector3;
	velocity: Vector3;
	birthTime: number;
};

const PARTICLE_LIFETIME = 5;

const ExplosionParticles = () => {
	const [particles, setParticles] = useState<ParticleStatus[]>([]);

	useEffect(() => {
		const particleCount = 200; // パーティクルの個数
		const newParticles = [];

		for (let i = 0; i < particleCount; i++) {
			const angle = Math.random() * Math.PI * 2;
			const distance = Math.random() * 1.5;
			const x = Math.cos(angle) * distance;
			const y = Math.random() * 1.5;
			const z = Math.sin(angle) * distance;

			newParticles.push({
				position: new Vector3(x, y, z),
				velocity: new Vector3(
					Math.random() * 0.4 - 0.2,
					Math.random() * 0.4 - 0.2,
					Math.random() * 0.4 - 0.2,
				),
				// パーティクルが生成された時刻を記録
				birthTime: Date.now(),
			});
		}

		setParticles(newParticles);
	}, []);

	useFrame(() => {
		setParticles((prevParticles) =>
			prevParticles
				.map((particle) => ({
					...particle,
					position: new Vector3(
						particle.position.x + particle.velocity.x,
						particle.position.y + particle.velocity.y,
						particle.position.z + particle.velocity.z,
					),
				}))
				// 一定時間を超えたパーティクルを除外
				.filter(
					(particle) =>
						Date.now() - particle.birthTime < PARTICLE_LIFETIME * 1000,
				),
		);
	});

	return (
		<>
			{particles.map((particle, _) => (
				<Box
					key={Math.random.toString()}
					position={particle.position}
					args={[0.2, 0.2, 0.2]}
				>
					<meshBasicMaterial color="red" />
				</Box>
			))}
		</>
	);
};

export default ExplosionParticles;
