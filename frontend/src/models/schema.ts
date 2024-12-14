import type { Vector3 } from "@react-three/fiber";

export type SetTargetMessage = {
	type: "set-target";
	pos: Vector3;
};

export type ShootArrowMessage = {
	type: "shoot-arrow";
	pos: Vector3;
	dir: Vector3;
};

export type RTCMessage = SetTargetMessage | ShootArrowMessage;
