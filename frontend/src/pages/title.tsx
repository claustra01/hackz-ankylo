const Title = () => {
	const TitleStyle = {
		fontSize: "4rem",
	};

	const TextInputStyle = {
		width: "24rem",
		height: "4rem",
		color: "black",
		border: "1px solid gray",
		borderRadius: "8px",
		fontSize: "1.5rem",
		margin: "3rem",
		padding: "1rem",
	};

	const buttonStyle = {
		width: "16rem",
		height: "4rem",
		color: "green",
		backgroundColor: "white",
		border: "1px solid green",
		borderRadius: "8px",
		fontSize: "1.5rem",
		margin: "1rem",
	};

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				padding: "5%",
			}}
		>
			<h1 style={TitleStyle}>弓DOOOOON</h1>
			<input type="text" placeholder="あいことば" style={TextInputStyle} />
			<button type="button" style={buttonStyle}>
				VRでプレイ
			</button>
			<button type="button" style={buttonStyle}>
				PCでプレイ
			</button>
		</div>
	);
};

export default Title;
