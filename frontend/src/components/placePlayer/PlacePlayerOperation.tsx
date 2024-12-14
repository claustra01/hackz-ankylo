import { useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import type TargetInfo from "../../models/TargetInfo";
import type { ShootArrowMessage } from "../../models/schema";
import { computePlacementPosition } from "../../utils/targetPlacement";
import { throwArrow } from "../../utils/throwArrow";
import Target from "../Target";
import { useRTC } from "./../../hook/useRTC";
import PlacePlayer from "./PlacePlayer";
import TargetPlacementCollider from "./TargetPlacementCollider";

const PlacePlayerOperation = () => {
	const [arrowNum, setArrowNum] = useState(0);
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const [arrowRigit, setArrowRigit] = useState<any[]>([]);
	const [isReady, setIsReady] = useState(false);
	const [targetInfos, setTargetInfos] = useState<TargetInfo[]>([]);
	const { camera, scene } = useThree();
	const { isConnected, messages, connect, send } = useRTC();

	// connect to signaling server
	useEffect(() => {
		if (isReady) return;
		// generate room id with fragment hash
		if (!location.hash) {
			location.hash = Math.floor(Math.random() * 0xffffff).toString(16);
		}
		const roomHash = location.hash.substring(1);
		connect(roomHash);
	}, [connect, isReady]);

	useEffect(() => {
		const message = JSON.parse(messages[messages.length - 1]);
		if (message.type === "shoot-arrow") {
			console.log("shoot-arrow", message);
		}
	}, [messages]);

	useEffect(() => {
		const handleClick = (event: MouseEvent) => {
			if (isReady) {
				const mappedMousePosition = new THREE.Vector2();
				mappedMousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
				mappedMousePosition.y = -((event.clientY / window.innerHeight) * 2 - 1);

				const placementPosition = computePlacementPosition(
					camera,
					mappedMousePosition,
					scene,
				);
				if (!placementPosition) {
					return;
				}

				const newTargetInfo: TargetInfo = {
					id: targetInfos.length,
					position: placementPosition,
					facingDirection: new THREE.Vector3(0, 0, 0),
				};

				setTargetInfos((prevTargetInfos: TargetInfo[]) => [
					...prevTargetInfos,
					newTargetInfo,
				]);

				if (isConnected) {
					send(
						JSON.stringify({
							type: "set-target",
							pos: placementPosition,
						}),
					);
				}
			} else {
				setIsReady(true);
			}
		};

		// マウス移動イベントを監視
		window.addEventListener("click", handleClick);

		// クリーンアップ処理
		return () => {
			window.removeEventListener("click", handleClick);
		};
	}, [scene, camera, targetInfos, isReady, isConnected, send]);

	useEffect(() => {
		if (messages.length === 0) return;
		const message = messages[messages.length - 1];
		//jsonからmessageを取り出す
		const data = JSON.parse(message) as { type: string };
		if (data.type === "shoot-arrow") {
			const shootArrowMessage = JSON.parse(message) as ShootArrowMessage;
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			const arrowRef = useRef<any>(null);
			setArrowRigit(() => [...arrowRigit, arrowRef]);
			throwArrow(
				shootArrowMessage.pos,
				shootArrowMessage.dir,
				arrowRigit[arrowNum],
			);
			setArrowNum((prev) => prev + 1);
		}
	}, [messages, arrowRigit, arrowNum]);

	const handleShoot = (id: number) => {
		setTargetInfos((prevTargetInfos: TargetInfo[]) =>
			prevTargetInfos.filter((targetInfo) => targetInfo.id !== id),
		);

		const shootedTarget = targetInfos.filter(
			(targetInfo) => targetInfo.id === id,
		)[0];
		send(
			JSON.stringify({
				type: "shoot-arrow",
				pos: shootedTarget.position,
				dir: shootedTarget.facingDirection,
			}),
		);
	};

	return (
		<>
			<PlacePlayer />
			<TargetPlacementCollider center={[0, 0, 0]} radius={10} />
			{targetInfos.map((targetInfo) => (
				<Target
					key={targetInfo.id}
					targetInfo={targetInfo}
					onShoot={handleShoot}
				/>
			))}
		</>
	);
};

export default PlacePlayerOperation;
