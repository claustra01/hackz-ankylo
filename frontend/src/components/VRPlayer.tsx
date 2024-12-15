import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import {
	XR,
	type XRControllerState,
	XROrigin,
	type XRStore,
	useXRInputSourceState,
} from "@react-three/xr";
import { useEffect, useRef, useState } from "react";
import { Vector3 } from "three";
import type { Group, Mesh } from "three";
import { useRTC } from "../hook/useRTC";
import type TargetInfo from "../models/TargetInfo";
import { throwArrow } from "../utils/throwArrow";
import { Loading } from "./Loading";
import Target from "./Target";
interface VRPlayerProps {
	store: XRStore;
}

export const VRPlayer = ({ store }: VRPlayerProps) => {
	const [targetNum, setTargetNum] = useState(0);
	const [isReady, setIsReady] = useState(false);
	const [rightGrab, setRightGrab] = useState(false);
	const [targetInfo, setTargetInfo] = useState<TargetInfo[]>([]);
	const { isConnected, messages, connect, send } = useRTC();
	const leftMeshRef = useRef<Mesh>(null);
	const rightMeshRef = useRef<Mesh>(null);
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const arrowRigidRef = useRef<any>(null);

	// connect to signaling server
	useEffect(() => {
		if (isReady) {
			// generate room id with fragment hash
			if (!location.hash) {
				location.hash = Math.floor(Math.random() * 0xffffff).toString(16);
			}
			const roomHash = location.hash.substring(1);
			connect(roomHash);
		}
	}, [connect, isReady]);

	useEffect(() => {
		if (messages.length === 0) return;
		const message = messages[0];
		//jsonからmessageを取り出す
		const data = JSON.parse(message);
		if (data.type === "set-target") {
			const newTarget: TargetInfo = {
				id: targetNum,
				position: data.pos,
				facingDirection: new Vector3(0, 0, 0),
			};
			setTargetNum((prev) => prev + 1);
			setTargetInfo((prev) => [...prev, newTarget]);
		}
	}, [messages, targetNum]);

	const Locomotion = () => {
		const leftController = useXRInputSourceState("controller", "left");
		const rightController = useXRInputSourceState("controller", "right");
		const ref = useRef<Group>(null);
		useFrame(() => {
			if (!ref.current || !leftController || !rightController) return;

			const leftSqueezeState = leftController.gamepad["xr-standard-squeeze"];
			const rightSqueezeState = rightController.gamepad["xr-standard-squeeze"];
			const leftTriggerState = leftController.gamepad["xr-standard-trigger"];
			if (!leftSqueezeState || !rightSqueezeState || !leftTriggerState) return;

			if (leftTriggerState.state === "pressed") {
				if (!isConnected) {
					setIsReady(true);
				}
			}

			if (leftSqueezeState.state === "pressed") {
				const leftControllerPos = new Vector3();
				leftController.object?.getWorldPosition(leftControllerPos);
				if (leftMeshRef.current) {
					leftMeshRef.current.position.copy(leftControllerPos);
				}
			}
			if (rightSqueezeState.state === "pressed") {
				const rightControllerPos = new Vector3();
				rightController.object?.getWorldPosition(rightControllerPos);
				if (rightMeshRef.current) {
					rightMeshRef.current.position.copy(rightControllerPos);
				}
				setRightGrab(true);
			} else {
				if (rightGrab && leftMeshRef.current) {
					setupArrow(leftController);
					setRightGrab(false);
				}
			}
		});
		return <XROrigin ref={ref} />;
	};

	const setupArrow = (leftController: XRControllerState) => {
		if (!leftController) return;
		const leftControllerPos = new Vector3();
		leftController.object?.getWorldPosition(leftControllerPos);
		const rightControllerPos = new Vector3();
		rightMeshRef.current?.getWorldPosition(rightControllerPos);
		const rotateVector3 = leftControllerPos.sub(rightControllerPos);
		throwArrow(
			leftControllerPos,
			rotateVector3.multiplyScalar(5),
			arrowRigidRef,
		);
		//ShootArrowMessageのjsonにする
		const message = JSON.stringify({
			type: "shoot-arrow",
			pos: leftControllerPos,
			dir: rotateVector3,
		});
		if (isConnected) {
			send(message);
		} else {
			alert("You are not connected");
		}
	};

	const handleShoot = (id: number) => {
		setTargetInfo((prevTargetInfos: TargetInfo[]) =>
			prevTargetInfos.filter((targetInfo) => targetInfo.id !== id),
		);
	};

	if (isReady && !isConnected) {
		return <Loading />;
	}

	return (
		<>
			<XR store={store}>
				<mesh ref={leftMeshRef} scale={[0.01, 0.01, 0.01]}>
					<boxGeometry />
					<meshStandardMaterial color="yellow" metalness={0} roughness={0.2} />
				</mesh>

				<mesh ref={rightMeshRef} scale={[0.01, 0.01, 0.01]}>
					<boxGeometry />
					<meshStandardMaterial color="cyan" metalness={0} roughness={0.2} />
				</mesh>
				<RigidBody ref={arrowRigidRef}>
					<mesh scale={[0.25, 0.25, 0.25]} position={[0, 0, 0]}>
						<sphereGeometry />
						<meshStandardMaterial color="cyan" metalness={0} roughness={0.2} />
					</mesh>
				</RigidBody>
				{targetInfo.map((targetInfo) => (
					<Target
						key={targetInfo.id}
						targetInfo={targetInfo}
						onShoot={handleShoot}
					/>
				))}
				<Locomotion />
			</XR>
		</>
	);
};
