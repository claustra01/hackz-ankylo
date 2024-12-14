import * as THREE from "three";
import type TargetInfo from "../utils/TargetInfo";

const raycaster = new THREE.Raycaster();

const getTargetPuttingCollider = (intersects: THREE.Intersection[]) => {
	if (intersects.length === 0) {
		return null;
	}
	for (const intersect of intersects) {
		if (intersect.object.name === "TargetPuttingCollider") {
			return intersect;
		}
	}
	return null;
};

const useTargetPutting = (
	camera: THREE.Camera,
	scene: THREE.Scene,
	targetInfos: (TargetInfo & { banishThis: () => void })[],
	addTargetInfo: (targetInfo: TargetInfo) => void,
) => {
	const mousePosition = new THREE.Vector2();
	window.addEventListener("click", (event) => {
		mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
		mousePosition.y = -((event.clientY / window.innerHeight) * 2 - 1);
		raycaster.setFromCamera(mousePosition, camera);
		const intersects = raycaster.intersectObjects(scene.children);

		const targetPuttingCollider = getTargetPuttingCollider(intersects);
		if (targetPuttingCollider) {
			const intersectionPoint = targetPuttingCollider.point;

			const targetInfo: TargetInfo = {
				id: targetInfos.length,
				position: intersectionPoint,
				facingDirection: new THREE.Vector3(0, 0, 0),
			};

			addTargetInfo(targetInfo);
		}
	});
};

export default useTargetPutting;
