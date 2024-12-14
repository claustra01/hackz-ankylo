import { Sky } from "@react-three/drei";
import type TargetInfo from "../utils/TargetInfo";
import Ground from "./Ground";
import Target from "./Target";

interface GameMapProps {
  targetInfos: TargetInfo[];
}

const GameMap = ({ targetInfos }: GameMapProps) => {
  return (
    <>
      <directionalLight position={[100, 60, 100]} intensity={15} />
      <Ground position={[0, -2, 0]} scale={{ x: 100, z: 100 }} />
      <Sky
        distance={450000}
        sunPosition={[100, 60, 100]}
        inclination={0}
        azimuth={0.25}
      />
      {targetInfos.map((targetInfo) => (
        <Target key={targetInfo.id} targetInfo={targetInfo} />
      ))}
    </>
  );
};

export default GameMap;
