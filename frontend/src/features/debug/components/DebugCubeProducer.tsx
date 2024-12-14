import { RigidBody } from "@react-three/rapier";
import { Box } from "@react-three/drei";
import { useState } from "react";
import { useEffect } from "react";
import * as THREE from "three";

interface CubeData {
    id: number;
    position: THREE.Vector3;
}

interface DebugCubeProducerProps {
    timeSpan: number;
    position: THREE.Vector3;
}

const DebugCubeProducer = ({ timeSpan, position }: DebugCubeProducerProps) => {
    const [cubes, setCubes] = useState<CubeData[]>([]);

    const addCube = () => {
        const dropPosition = new THREE.Vector3(
            position.x,
            position.y + 10,
            position.z
        );
        
        setCubes(prevCubes => [...prevCubes, {
            id: prevCubes.length,
            position: dropPosition
        }]);
    }

    useEffect(() => {
        const interval = setInterval(addCube, timeSpan);
        return () => clearInterval(interval);
    }, [timeSpan, position]);

    return (
        <>
            {cubes.map((cube) => (
                <RigidBody 
                    key={cube.id}
                    position={cube.position}
                    colliders="cuboid"
                    mass={1}
                    name="arrow"
                >
                    <Box>
                        <meshStandardMaterial color="red" />
                    </Box>
                </RigidBody>
            ))}
        </>
    );
}

export default DebugCubeProducer;