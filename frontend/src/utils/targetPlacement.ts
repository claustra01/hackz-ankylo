import * as THREE from "three";

const getTargetPlacementCollider = (intersects: THREE.Intersection[]) => {
	if (intersects.length === 0) {
		return null;
	}
	for (const intersect of intersects) {
		if (intersect.object.name === "TargetPlacementCollider") {
			return intersect;
		}
	}
	return null;
};

const computePlacementPosition = (
	camera: THREE.Camera,
	mousePosition: THREE.Vector2,
	scene: THREE.Scene,
) => {
	let intersectionPoint: THREE.Vector3 | null = null;

	const raycaster = new THREE.Raycaster();
	raycaster.setFromCamera(mousePosition, camera);
	const intersects = raycaster.intersectObjects(scene.children);

	const targetPlacementCollider = getTargetPlacementCollider(intersects);
	if (targetPlacementCollider) {
		intersectionPoint = targetPlacementCollider.point;
	}

	return intersectionPoint;
};

export { computePlacementPosition };
