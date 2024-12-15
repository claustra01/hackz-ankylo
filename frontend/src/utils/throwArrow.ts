import type { Vector3 } from "@react-three/fiber";

export const throwArrow = (
	startVector: Vector3,
	rotateVector3: Vector3,
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	arrow: any,
) => {
	const rigidBody = arrow.current;
	if (rigidBody) {
		rigidBody.setTranslation(startVector, true); // 初期位置に戻す
		rigidBody.setLinvel({ x: 0, y: 0, z: 0 }, true); // 線形速度をリセット
		rigidBody.setAngvel({ x: 0, y: 0, z: 0 }, true); // 角速度をリセット
	}
	arrow.current.applyImpulse(rotateVector3, true);
};
