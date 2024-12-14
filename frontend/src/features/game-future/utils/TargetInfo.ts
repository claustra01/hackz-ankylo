import type * as THREE from "three";

interface TargetInfo {
	id: number;
	position: THREE.Vector3;
	facingDirection: THREE.Vector3;
}

export default TargetInfo;
