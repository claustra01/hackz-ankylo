import type * as THREE from "three";
import type { Vector3 } from "three"; // threeから直接インポート

export const throwArrow = (
  startVector: Vector3,
  rotateVector3: Vector3,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  arrow: any,
  arrowRef: React.RefObject<THREE.Mesh>
) => {
  const rigidBody = arrow.current;
  if (rigidBody) {
    rigidBody.setTranslation(startVector, true); // 初期位置に戻す
    rigidBody.setLinvel({ x: 0, y: 0, z: 0 }, true); // 線形速度をリセット
    rigidBody.setAngvel({ x: 0, y: 0, z: 0 }, true); // 角速度をリセット
  }
  arrow.current.applyImpulse(rotateVector3, true);
  if (arrowRef.current) {
    arrowRef.current.lookAt(rotateVector3);
    //z軸を中心に90度回転
    arrowRef.current.rotateX(Math.PI / 2);
  }
};
