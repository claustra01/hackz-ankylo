import { useEffect, useState } from "react";
import { SignalingServer } from "../components/webrtc/SignalingServer";
import { useRTC } from "../hook/useRTC";

const WebRTC = () => {
	const [name, setName] = useState<string>("");
	const [text, setText] = useState<string>("");

	const { isConnected, error, messages, connect, send } = useRTC();

	// connect to signaling server
	useEffect(() => {
		if (name) {
			// generate room id with fragment hash
			if (!location.hash) {
				location.hash = Math.floor(Math.random() * 0xffffff).toString(16);
			}
			const roomHash = location.hash.substring(1);
			connect(roomHash);
		}
	}, [name, connect]);

	useEffect(() => {
		if (error) {
			alert(error);
		}
	}, [error]);

	// get name from prompt
	const handleInputName = () => {
		setName(prompt("enter your name:") || "");
	};

	const handleInputText = (event: React.ChangeEvent<HTMLInputElement>) => {
		setText(event.target.value);
	};

	const handleSendText = () => {
		if (text === "") return;
		const message = JSON.stringify({
			user: name,
			message: text,
		});
		if (isConnected) {
			send(message);
		} else {
			alert("You are not connected");
		}
		setText("");
	};

	return (
		<>
			<SignalingServer />
			<div>
				<h1>WebRTC Chat</h1>
				<button type="button" onClick={handleInputName}>
					Connect
				</button>
				<p>isConnected: {isConnected ? "true" : "false"}</p>
				<input type="text" value={text} onChange={handleInputText} />
				<button type="button" onClick={handleSendText}>
					Send
				</button>
				<div>
					{messages.map((message, _) => (
						<div key={message}>{message}</div>
					))}
				</div>
			</div>
		</>
	);
};

export default WebRTC;
