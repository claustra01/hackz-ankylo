import type { Vector3 } from "@react-three/fiber";

/**
 * TargetInfo is a model that contains the information of a target
 */
interface TargetInfo {
  id: number;
  position: Vector3;
  facingDirection: Vector3;
}

export default TargetInfo;
