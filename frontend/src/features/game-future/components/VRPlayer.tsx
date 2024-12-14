import { useFrame } from "@react-three/fiber";
import { Physics, RigidBody } from "@react-three/rapier";
import {
  XR,
  XROrigin,
  createXRStore,
  useXRInputSourceState,
} from "@react-three/xr";
import { useEffect, useRef, useState } from "react";
import { Vector3 } from "three";
import type { Mesh, Group } from "three";
import { useThrowArrow } from "../hooks/useThrowArrow";
import { SignalingServer } from "../../../components/webrtc/SignalingServer";
import { useRTC } from "../../../hook/useRTC";
import type { SetTargetMessage } from "../../../models/schema";
import type TargetInfo from "../models/TargetInfo";
import Target from "./Target";
const store = createXRStore();

export const VRPlayer = () => {
  const [arrowNum, setArrowNum] = useState(0);
  const [targetNum, setTargetNum] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [rightGrab, setRightGrab] = useState(false);
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const [arrowRigit, setArrowRigit] = useState<any[]>([]);
  const [targetInfo, setTargetInfo] = useState<TargetInfo[]>([]);
  const { isConnected, messages, connect, send } = useRTC();
  const leftMeshRef = useRef<Mesh>(null);
  const rightMeshRef = useRef<Mesh>(null);

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
    if (messages.length === 0) return;
    const message = messages[messages.length - 1];
    //jsonからmessageを取り出す
    const data = JSON.parse(message) as { type: string };
    if (data.type === "set-target") {
      const targetInfo = JSON.parse(message) as SetTargetMessage;
      const newTarget: TargetInfo = {
        id: targetNum,
        position: targetInfo.pos,
        facingDirection: new Vector3(0, 0, 0),
      };
      setTargetNum((prev) => prev + 1);
      setTargetInfo((prev) => [...prev, newTarget]);
    }
  }, [messages, targetNum]);

  const Locomotion = () => {
    const leftController = useXRInputSourceState("controller", "left");
    const rightController = useXRInputSourceState("controller", "right");
    const ref = useRef<Group>(null);
    useFrame(() => {
      if (!ref.current || !leftController || !rightController) return;

      const leftSqueezeState = leftController.gamepad["xr-standard-squeeze"];
      const rightSqueezeState = rightController.gamepad["xr-standard-squeeze"];
      const leftTriggerState = leftController.gamepad["xr-standard-trigger"];
      if (!leftSqueezeState || !rightSqueezeState || !leftTriggerState) return;

      if (leftTriggerState.state === "pressed") {
        if (!isConnected) {
          setIsReady(true);
        }
      }

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
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          const arrowRef = useRef<any>(null);
          setArrowRigit(() => [...arrowRigit, arrowRef]);
          throwArrow();
          setArrowNum((prev) => prev + 1);
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
    useThrowArrow(leftControllerPos, rotateVector3, arrowRigit[arrowNum]);
    //ShootArrowMessageのjsonにする
    const message = JSON.stringify({
      type: "shoot-arrow",
      pos: leftControllerPos,
      dir: rotateVector3,
    });
    if (isConnected) {
      send(message);
    } else {
      alert("You are not connected");
    }

    const handleShoot = (id: number) => {
      setTargetInfo((prevTargetInfos: TargetInfo[]) =>
        prevTargetInfos.filter((targetInfo) => targetInfo.id !== id)
      );
    };

    return (
      <>
        <SignalingServer />
        <XR store={store}>
          <Physics gravity={[0, -9.81, 0]}>
            <mesh ref={leftMeshRef} scale={[0.01, 0.01, 0.01]}>
              <boxGeometry />
              <meshStandardMaterial
                color="yellow"
                metalness={0}
                roughness={0.2}
              />
            </mesh>

            <mesh ref={rightMeshRef} scale={[0.01, 0.01, 0.01]}>
              <boxGeometry />
              <meshStandardMaterial
                color="cyan"
                metalness={0}
                roughness={0.2}
              />
            </mesh>
            {arrowRigit.map((arrowRigidBody, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              <RigidBody key={index} ref={arrowRigidBody}>
                <mesh scale={[0.25, 0.25, 0.25]} position={[0, -3, 0]}>
                  <sphereGeometry />
                  <meshStandardMaterial
                    color="cyan"
                    metalness={0}
                    roughness={0.2}
                  />
                </mesh>
              </RigidBody>
            ))}
            {targetInfo.map((targetInfo) => (
              <Target
                key={targetInfo.id}
                targetInfo={targetInfo}
                onShoot={handleShoot}
              />
            ))}
            <Locomotion />
          </Physics>
        </XR>
      </>
    );
  };
};
