import type * as THREE from "three";

/**
 * TargetInfo is a model that contains the information of a target
 */
interface TargetInfo {
	id: number;
	position: THREE.Vector3;
	facingDirection: THREE.Vector3;
}

export default TargetInfo;
