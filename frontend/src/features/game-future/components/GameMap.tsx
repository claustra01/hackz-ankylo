import Ground from "./Ground";

const GameMap = () => {
	return (
		<>
			<directionalLight position={[0, 1, 1]} intensity={5} />
			<Ground position={[0, -2, 0]} scale={{ x: 100, z: 100 }} />
		</>
	);
};

export default GameMap;
