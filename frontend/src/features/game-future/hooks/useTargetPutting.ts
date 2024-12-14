import * as THREE from "three";
import type TargetInfo from "../utils/TargetInfo";

const raycaster = new THREE.Raycaster();

const useTargetPutting = (
	camera: THREE.Camera,
	scene: THREE.Scene,
	targetInfos: TargetInfo[],
	setTargetInfos: (targetInfos: TargetInfo[]) => void,
) => {
	const mousePosition = new THREE.Vector2();
	window.addEventListener("click", (event) => {
		mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
		mousePosition.y = -((event.clientY / window.innerHeight) * 2 - 1);
		raycaster.setFromCamera(mousePosition, camera);
		const intersects = raycaster.intersectObjects(scene.children);
		if (intersects.length > 0) {
			const intersectionPoint = intersects[0].point;

			const targetInfo: TargetInfo = {
				position: intersectionPoint,
				facingDirection: new THREE.Vector3(0, 0, 0),
			};

			setTargetInfos([...targetInfos, targetInfo]);
		}
	});
};

export default useTargetPutting;
