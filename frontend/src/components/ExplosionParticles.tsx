import { Box } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { Vector3 } from "three";

type ParticleStatus = {
	position: Vector3;
	velocity: Vector3;
	birthTime: number;
};

type Props = {
	pos: [number, number, number];
	color?: string;
};

const PARTICLE_LIFETIME = 5;

const ExplosionParticles = ({ pos, color }: Props) => {
	const [particles, setParticles] = useState<ParticleStatus[]>([]);

	useEffect(() => {
		const particleCount = 20; // パーティクルの個数
		const newParticles = [];

		for (let i = 0; i < particleCount; i++) {
			const angle = Math.random() * Math.PI * 2;
			const distance = Math.random() * 1.5;
			const x = Math.cos(angle) * distance;
			const y = Math.random() * 1.5;
			const z = Math.sin(angle) * distance;

			newParticles.push({
				position: new Vector3(pos[0] + x, pos[1] + y, pos[2] + z),
				velocity: new Vector3(
					Math.random() * 0.2 - 0.1,
					Math.random() * 0.2 - 0.1,
					Math.random() * 0.2 - 0.1,
				),
				// パーティクルが生成された時刻を記録
				birthTime: Date.now(),
			});
		}

		setParticles(newParticles);
	}, [pos]);

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
					key={Math.random().toString()}
					position={particle.position}
					args={[0.3, 0.3, 0.3]}
				>
					<meshBasicMaterial color={color} />
				</Box>
			))}
		</>
	);
};

export default ExplosionParticles;
