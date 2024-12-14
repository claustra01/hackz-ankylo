import {
  XR,
  createXRStore,
  useXRInputSourceState,
  XROrigin,
} from "@react-three/xr";
import { Physics, RigidBody } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useState, useRef } from "react";
import { Mesh, Vector3 } from "three";
import { Group } from "three";
import { useThrowArrow } from "../hooks/useThrowArrow";
const store = createXRStore();

interface VRPlayerProps {
  arrowRigidBody: any;
}

export const VRPlayer = ({ arrowRigidBody }: VRPlayerProps) => {
  const [rightGrab, setRightGrab] = useState(false);
  const [isVR, setIsVR] = useState(false);
  const leftMeshRef = useRef<Mesh>(null);
  const rightMeshRef = useRef<Mesh>(null);
  const Locomotion = () => {
    const leftController = useXRInputSourceState("controller", "left");
    const rightController = useXRInputSourceState("controller", "right");
    const ref = useRef<Group>(null);
    useFrame(() => {
      if (!ref.current || !leftController || !rightController) return;

      const leftSqueezeState = leftController.gamepad["xr-standard-squeeze"];
      const rightSqueezeState = rightController.gamepad["xr-standard-squeeze"];
      if (!leftSqueezeState || !rightSqueezeState) return;

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
          throwArrow();
          setRightGrab(false);
        }
      }
    });
    return <XROrigin ref={ref} />;
  };

  const throwArrow = () => {
    const leftController = useXRInputSourceState("controller", "left");
    if (!leftController) return;
    const leftControllerPos = new Vector3();
    leftController.object?.getWorldPosition(leftControllerPos);
    const rightControllerPos = new Vector3();
    rightMeshRef.current?.getWorldPosition(rightControllerPos);
    const rotateVector3 = rightControllerPos.sub(leftControllerPos);
    useThrowArrow(leftControllerPos, rotateVector3, arrowRigidBody);
  };

  return (
    <XR store={store}>
      <Physics gravity={[0, -9.81, 0]}>
        <mesh ref={leftMeshRef} scale={[0.01, 0.01, 0.01]}>
          <boxGeometry />
          <meshStandardMaterial color="yellow" metalness={0} roughness={0.2} />
        </mesh>

        <mesh ref={rightMeshRef} scale={[0.01, 0.01, 0.01]}>
          <boxGeometry />
          <meshStandardMaterial color="cyan" metalness={0} roughness={0.2} />
        </mesh>

        <RigidBody ref={arrowRigidBody}>
          <mesh scale={[0.25, 0.25, 0.25]} position={[0, -3, 0]}>
            <sphereGeometry />
            <meshStandardMaterial color="cyan" metalness={0} roughness={0.2} />
          </mesh>
        </RigidBody>
        <Locomotion />
      </Physics>
    </XR>
  );
};
