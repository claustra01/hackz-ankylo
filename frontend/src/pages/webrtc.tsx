import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { RTCConfig } from "../utils/const";

// scaledrone client
// biome-ignore lint: should be global
let drone: any;
// scaledrone room
// biome-ignore lint: should be global
let room: any;
// peer connection
// biome-ignore lint: should be global
let pc: any;
// data channel
// biome-ignore lint: should be global
let dataChannel: any;

const WebRTC = () => {
	const [messages, setMessages] = useState<string[]>([]);
	const [name, setName] = useState<string>("");
	const [text, setText] = useState<string>("");
	const [isConnected, setIsConnected] = useState<boolean>(false);

	// connect to signaling server
	useEffect(() => {
		if (name) {
			handleConnect();
		}
	}, [name]);

	// get name from prompt
	const handleInputName = () => {
		setName(prompt("enter your name:") || "");
	};

	const handleInputText = (event: React.ChangeEvent<HTMLInputElement>) => {
		setText(event.target.value);
	};

	const handleConnect = () => {
		// generate room id with fragment hash
		if (!location.hash) {
			location.hash = Math.floor(Math.random() * 0xffffff).toString(16);
		}
		const chatHash = location.hash.substring(1);
		const roomName = `observable-${chatHash}`;

		// signaling server (scaledrone)
		// @ts-ignore
		drone = new window.Scaledrone("yiS12Ts5RdNhebyM");
		drone.on("open", (error: unknown) => {
			if (error) {
				return console.error(error);
			}
			room = drone.subscribe(roomName);
			room.on("open", (error: unknown) => {
				if (error) {
					return console.error(error);
				}
				console.log("Connected to signaling server");
			});
			// @ts-ignore
			room.on("members", (members) => {
				if (members.length >= 3) {
					return alert("The room is full");
				}
				// 1st: waiter, 2nd: offerer
				const isOfferer = members.length === 2;
				startWebRTC(isOfferer);
			});
		});

		// singnaling message sender
		function sendSignalingMessage(message: unknown) {
			drone.publish({
				room: roomName,
				message,
			});
		}

		// peer connection
		function startWebRTC(isOfferer: boolean) {
			console.log("Starting WebRTC in as", isOfferer ? "offerer" : "waiter");
			pc = new RTCPeerConnection(RTCConfig);
			// send ICE candidate if needed
			// @ts-ignore
			pc.onicecandidate = (event) => {
				if (event.candidate) {
					sendSignalingMessage({ candidate: event.candidate });
				}
			};

			if (isOfferer) {
				// offerer: create negotiation offer
				pc.onnegotiationneeded = () => {
					pc.createOffer(localDescCreated, (error: unknown) =>
						console.error(error),
					);
				};
				dataChannel = pc.createDataChannel("chat");
				setupDataChannel();
			} else {
				// waiter: wait offerer
				// @ts-ignore
				pc.ondatachannel = (event) => {
					dataChannel = event.channel;
					setupDataChannel();
				};
			}

			startListentingToSignals();
		}

		// signaling message listener
		function startListentingToSignals() {
			// @ts-ignore
			room.on("data", (message, client) => {
				// own message
				if (client.id === drone.clientId) {
					return;
				}
				if (message.sdp) {
					// This is called after receiving an offer or answer from another peer
					pc.setRemoteDescription(
						new RTCSessionDescription(message.sdp),
						() => {
							console.log(
								"pc.remoteDescription.type",
								pc.remoteDescription.type,
							);
							// create answer
							if (pc.remoteDescription.type === "offer") {
								console.log("Answering offer");
								pc.createAnswer(localDescCreated, (error: unknown) =>
									console.error(error),
								);
							}
						},
						(error: unknown) => console.error(error),
					);
				} else if (message.candidate) {
					// add the new ICE candidate to our connections remote description
					pc.addIceCandidate(new RTCIceCandidate(message.candidate));
				}
			});
		}

		// local description
		function localDescCreated(desc: unknown) {
			pc.setLocalDescription(
				desc,
				() => sendSignalingMessage({ sdp: pc.localDescription }),
				(error: unknown) => console.error(error),
			);
		}

		// data channel
		function setupDataChannel() {
			checkDataChannelState();
			dataChannel.onopen = checkDataChannelState;
			dataChannel.onclose = checkDataChannelState;
			// @ts-ignore
			dataChannel.onmessage = (event) => {
				// receive message
				console.log("WebRTC data channel message:", event.data);
				setMessages((prev) => [event.data, ...prev]);
			};
		}

		// data channel state
		function checkDataChannelState() {
			console.log("WebRTC channel state is:", dataChannel.readyState);
			if (dataChannel.readyState === "open") {
				setIsConnected(true);
				setMessages(["WebRTC data channel is now open"]);
			}
		}
	};

	const handleSendText = () => {
		if (text === "") return;
		const message = JSON.stringify({
			user: name,
			message: text,
		});
		setMessages((prev) => [message, ...prev]);
		dataChannel.send(message);
		setText("");
	};

	return (
		<>
			<Helmet>
				<script
					type="text/javascript"
					src="https://cdn.scaledrone.com/scaledrone.min.js"
				/>
			</Helmet>
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