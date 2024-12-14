import Ground from './Ground';
import Target from './Target';
import { Sky } from '@react-three/drei';

const Map = () => {
    return (
      <>
        <directionalLight position={[0, 1, 1]} intensity={5} />
        <Ground position={[0, -2, 0]} scale={{ x: 100, z: 100 }} />
        <Sky 
            distance={450000}
            sunPosition={[0, 1, 0]}
            inclination={0}
            azimuth={0.25}
        />
      </>
    );
};

export default Map;
