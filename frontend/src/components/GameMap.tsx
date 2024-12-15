import Ground from "./Ground";

const GameMap = () => {
	return (
		<>
			<directionalLight
				position={[100, 60, 100]}
				intensity={5}
				shadow-mapSize-width={2048}
				shadow-mapSize-height={2048}
				castShadow
			/>
			<ambientLight intensity={0.5} />
			<Ground position={[0, -2, 0]} scale={{ x: 100, z: 100 }} />
		</>
	);
};

export default GameMap;
