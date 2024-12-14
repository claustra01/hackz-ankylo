import { useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";
import * as THREE from "three";
import type TargetInfo from "../models/TargetInfo";
import { computePlacementPosition } from "../utils/targetPlacement";
import PlacePlayer from "./PlacePlayer";
import Target from "./Target";
import TargetPlacementCollider from "./TargetPlacementCollider";

const PlacePlayerOperation = () => {
  const [arrowNum, setArrowNum] = useState(0);
  const [targetNum, setTargetNum] = useState(0);
  const [targetInfos, setTargetInfos] = useState<TargetInfo[]>([]);
  const { camera, scene } = useThree();

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const mappedMousePosition = new THREE.Vector2();
      mappedMousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
      mappedMousePosition.y = -((event.clientY / window.innerHeight) * 2 - 1);

      const placementPosition = computePlacementPosition(
        camera,
        mappedMousePosition,
        scene
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
      prevTargetInfos.filter((targetInfo) => targetInfo.id !== id)
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
