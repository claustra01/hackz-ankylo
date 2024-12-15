import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateHash } from "../utils/functions";

const containerStyle = {
	display: "flex",
	flexDirection: "column" as const,
	alignItems: "center",
	justifyContent: "center",
	height: "100vh",
	background: "linear-gradient(135deg, #1e3c72, #2a5298)",
	color: "#ffffff",
	fontFamily: "'Roboto', sans-serif",
};

const TitleStyle = {
	fontSize: "6rem",
	margin: "1rem",
	fontWeight: "bold",
	textShadow: "0 0 10px rgba(255, 255, 255, 0.8)",
};

const TextInputStyle = {
	width: "24rem",
	height: "4rem",
	color: "#333",
	backgroundColor: "#ffffff",
	border: "1px solid #aaa",
	borderRadius: "8px",
	boxShadow: "0px 5px 15px 0px rgba(0, 0, 0, 0.35)",
	fontSize: "1.5rem",
	margin: "3rem",
	padding: "1rem",
};

const buttonStyle = {
	width: "16rem",
	height: "4rem",
	color: "#ffffff",
	backgroundColor: "#4caf50",
	border: "none",
	borderRadius: "8px",
	boxShadow: "0px 5px 15px 0px rgba(0, 0, 0, 0.35)",
	fontSize: "1.5rem",
	margin: "1rem",
	cursor: "pointer",
	transition: "all 0.3s ease",
};

const buttonHoverStyle = {
	backgroundColor: "#45a049",
};

const Title = () => {
	const navigate = useNavigate();
	const [roomPassword, setRoomPassword] = useState<string>("");
	const [hoveredVR, setHoveredVR] = useState<boolean>(false);
	const [hoveredPC, setHoveredPC] = useState<boolean>(false);

	const handleRoomPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setRoomPassword(e.target.value);
	};

	const handleRedirectToVR = () => {
		if (roomPassword === "") {
			alert("あいことばを入力してください");
			return;
		}
		const hash = generateHash(roomPassword).substring(0, 6);
		navigate(`/vr#${hash}`);
	};

	const handleRedirectToPC = () => {
		if (roomPassword === "") {
			alert("あいことばを入力してください");
			return;
		}
		const hash = generateHash(roomPassword).substring(0, 6);
		navigate(`/pc#${hash}`);
	};

	return (
		<div style={containerStyle}>
			<h1 style={TitleStyle}>弓DOOOOON</h1>
			<input
				type="text"
				placeholder="あいことば"
				style={TextInputStyle}
				onChange={handleRoomPasswordChange}
			/>
			<button
				type="button"
				style={{
					...buttonStyle,
					...(hoveredVR ? buttonHoverStyle : {}),
				}}
				onMouseEnter={() => setHoveredVR(true)}
				onMouseLeave={() => setHoveredVR(false)}
				onClick={handleRedirectToVR}
			>
				VRでプレイ
			</button>
			<button
				type="button"
				style={{
					...buttonStyle,
					...(hoveredPC ? buttonHoverStyle : {}),
				}}
				onMouseEnter={() => setHoveredPC(true)}
				onMouseLeave={() => setHoveredPC(false)}
				onClick={handleRedirectToPC}
			>
				PCでプレイ
			</button>
		</div>
	);
};

export default Title;
