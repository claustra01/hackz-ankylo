import { useThree } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import type TargetInfo from "../../models/TargetInfo";
import { computePlacementPosition } from "../../utils/targetPlacement";
import { throwArrow } from "../../utils/throwArrow";
import ExplosionParticles from "../ExplosionParticles";
import { Loading } from "../Loading";
import Target from "../Target";
import { useRTC } from "./../../hook/useRTC";
import PlacePlayer from "./PlacePlayer";
import TargetPlacementCollider from "./TargetPlacementCollider";

const PlacePlayerOperation = () => {
	const [isReady, setIsReady] = useState(false);
	const [targetInfos, setTargetInfos] = useState<TargetInfo[]>([]);
	const { camera, scene } = useThree();
	const { isConnected, messages, connect, send } = useRTC();
	const [particlePosition, setParticlePosition] = useState<
		[number, number, number]
	>([0, -100, 0]);
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const arrowRigitRef = useRef<any>(null);

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
		if (data.type === "shoot-arrow") {
			console.log("shoot-arrow");
			throwArrow(data.pos, data.dir, arrowRigitRef);
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

	const handleShoot = (id: number) => {
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

		setTargetInfos((prevTargetInfos: TargetInfo[]) =>
			prevTargetInfos.filter((targetInfo) => targetInfo.id !== id),
		);

		setParticlePosition([
			shootedTarget.position.x,
			shootedTarget.position.y,
			shootedTarget.position.z,
		]);
	};

	if (isReady && !isConnected) {
		return <Loading />;
	}

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
			<ExplosionParticles pos={particlePosition} color={"red"} />
			<RigidBody ref={arrowRigitRef} name="arrow">
				<mesh scale={[0.25, 0.25, 0.25]} position={[0, 0, 0]}>
					<sphereGeometry />
					<meshStandardMaterial color="cyan" metalness={0} roughness={0.2} />
				</mesh>
			</RigidBody>
		</>
	);
};

export default PlacePlayerOperation;
