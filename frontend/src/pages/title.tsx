import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateHash } from "../utils/functions";

const TitleStyle = {
	fontSize: "6rem",
	margin: "1rem",
};

const TextInputStyle = {
	width: "24rem",
	height: "4rem",
	color: "black",
	border: "1px solid gray",
	borderRadius: "8px",
	boxShadow: "0px 5px 15px 0px rgba(0, 0, 0, 0.35)",
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
	boxShadow: "0px 5px 15px 0px rgba(0, 0, 0, 0.35)",
	fontSize: "1.5rem",
	margin: "1rem",
};

const Title = () => {
	const navigate = useNavigate();
	const [roomPassword, setRoomPassword] = useState<string>("");

	const handleRoomPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setRoomPassword(e.target.value);
	};

	const handleRedirectToVR = async () => {
		if (roomPassword === "") {
			alert("あいことばを入力してください");
			return;
		}
		const hash = (await generateHash(roomPassword)).substring(0, 6);
		navigate(`/vr#${hash}`);
	};

	const handleRedirectToPC = async () => {
		if (roomPassword === "") {
			alert("あいことばを入力してください");
			return;
		}
		const hash = (await generateHash(roomPassword)).substring(0, 6);
		navigate(`/vr#${hash}`);
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
			<input
				type="text"
				placeholder="あいことば"
				style={TextInputStyle}
				onChange={handleRoomPasswordChange}
			/>
			<button type="button" style={buttonStyle} onClick={handleRedirectToVR}>
				VRでプレイ
			</button>
			<button type="button" style={buttonStyle} onClick={handleRedirectToPC}>
				PCでプレイ
			</button>
		</div>
	);
};

export default Title;
