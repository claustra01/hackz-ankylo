import { useEffect, useRef } from "react";
import io from "socket.io-client";

/**
 * communicate to a signaling server
 */
const ServerTest = () => {
	const url =
		import.meta.env.VITE_SIGNALING_SERVER_URL || "http://localhost:8000";
	const socketRef = useRef<SocketIOClient.Socket>(io.connect(url));
	useEffect(() => {
		const room = prompt("Enter room name:");
		if (room !== "") {
			console.log(`Message from client: Asking to join room ${room}`);
			socketRef.current.emit("create or join", room);
		}
		socketRef.current.on("created", (room: string, clientId: string) => {
			console.log(room, clientId);
		});

		socketRef.current.on("full", (room: string) => {
			console.log(`Message from client: Room ${room} is full :^(`);
		});

		socketRef.current.on("ipaddr", (ipaddr: string) => {
			console.log(`Message from client: Server IP address is ${ipaddr}`);
		});

		socketRef.current.on("joined", (room: string, clientId: string) => {
			console.log(room, clientId);
		});

		socketRef.current.on("log", (text: string) => {
			console.log(text);
		});
	}, []);

	return (
		<div>
			<h2>Sample 4</h2>
			<p>
				communicate to a signaling server. run <b>yarn start:server</b>
			</p>
		</div>
	);
};

export default ServerTest;
