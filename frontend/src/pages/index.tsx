import { OrbitControls } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { useState, useRef } from "react";
import GameMap from "../features/game-future/components/GameMap";
import TargetPuttingCollider from "../features/game-future/components/TargetPuttingCollider";
import useTargetPutting from "../features/game-future/hooks/useTargetPutting";
import type TargetInfo from "../features/game-future/utils/TargetInfo";
import { VRPlayer } from "../features/game-future/components/VRPlayer";

interface TargetPuttingManagerProps {
  targetInfos: TargetInfo[];
  setTargetInfos: (targetInfos: TargetInfo[]) => void;
}

function App() {
  const [targetInfos, setTargetInfos] = useState<TargetInfo[]>([]);
  const arrowRef = useRef<any>(null);

  const TargetPuttingManager = ({
    targetInfos,
    setTargetInfos,
  }: TargetPuttingManagerProps) => {
    const { camera, scene } = useThree();
    useTargetPutting(camera, scene, targetInfos, setTargetInfos);
    return null;
  };

  return (
    <Canvas style={{ width: "100vw", height: "100vh" }}>
      <TargetPuttingManager
        targetInfos={targetInfos}
        setTargetInfos={setTargetInfos}
      />
      <GameMap targetInfos={targetInfos} />
      <OrbitControls />
      <TargetPuttingCollider center={[0, 0, 0]} radius={10} />
      <VRPlayer arrowRigidBody={arrowRef} />
    </Canvas>
  );
}

export default App;
