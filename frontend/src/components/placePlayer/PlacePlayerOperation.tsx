import { useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";
import * as THREE from "three";
import type TargetInfo from "../../models/TargetInfo";
import { computePlacementPosition } from "../../utils/targetPlacement";
import Target from "../Target";
import PlacePlayer from "./PlacePlayer";
import TargetPlacementCollider from "./TargetPlacementCollider";
import { useRTC } from "../../hook/useRTC";

interface PlacePlayerOperationProps {
	roomHash: string;
}

const PlacePlayerOperation = ({ roomHash }: PlacePlayerOperationProps) => {
	const [targetInfos, setTargetInfos] = useState<TargetInfo[]>([]);
	const { camera, scene } = useThree();

	const { connect, send } = useRTC();

	useEffect(() => {

		connect(roomHash);

		const handleClick = (event: MouseEvent) => {
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
		};

		// マウス移動イベントを監視
		window.addEventListener("click", handleClick);

		// クリーンアップ処理
		return () => {
			window.removeEventListener("click", handleClick);
		};
	}, [scene, camera, targetInfos]);

	const handleShoot = (id: number) => {
		setTargetInfos((prevTargetInfos: TargetInfo[]) =>
			prevTargetInfos.filter((targetInfo) => targetInfo.id !== id),
		);

		const shootedTarget = targetInfos.filter((targetInfo) => targetInfo.id === id)[0];

		send(JSON.stringify({
			type: "shoot-arrow",
			pos: shootedTarget.position,
			dir: shootedTarget.facingDirection,
		}));
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
