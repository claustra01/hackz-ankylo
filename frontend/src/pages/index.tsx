import { OrbitControls } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { useState } from "react";
import { Physics } from "@react-three/rapier";
import * as THREE from "three";
import DebugCubeProducer from "../features/debug/components/DebugCubeProducer";
import GameMap from "../features/game-future/components/GameMap";
import TargetPuttingCollider from "../features/game-future/components/TargetPuttingCollider";
import useTargetPutting from "../features/game-future/hooks/useTargetPutting";
import type TargetInfo from "../features/game-future/utils/TargetInfo";
interface TargetPuttingManagerProps {
  targetInfos: (TargetInfo & { banishThis: () => void })[];
  setTargetInfos: (
    targetInfos: (TargetInfo & { banishThis: () => void })[]
  ) => void;
}

const TargetPuttingManager = ({
  targetInfos,
  setTargetInfos,
}: TargetPuttingManagerProps) => {
  const { camera, scene } = useThree();
  const addTargetInfo = (targetInfo: TargetInfo) => {
    setTargetInfos([
      ...targetInfos,
      {
        ...targetInfo,
        banishThis: () => {
          setTargetInfos(
            targetInfos.filter((target) => target.id !== targetInfo.id)
          );
        },
      },
    ]);
  };
  useTargetPutting(camera, scene, targetInfos, addTargetInfo);
  return null;
};

function App() {
  const [targetInfos, setTargetInfos] = useState<
    (TargetInfo & { banishThis: () => void })[]
  >([]);

  return (
    <Canvas style={{ width: "100vw", height: "100vh" }}>
      <TargetPuttingManager
        targetInfos={targetInfos}
        setTargetInfos={setTargetInfos}
      />
      <Physics>
        <GameMap targetInfos={targetInfos} />
        <OrbitControls />
        <TargetPuttingCollider center={[0, 0, 0]} radius={10} />
        <DebugCubeProducer
          timeSpan={1000}
          position={new THREE.Vector3(0, 10, 0)}
        />
      </Physics>
    </Canvas>
  );
}

export default App;
