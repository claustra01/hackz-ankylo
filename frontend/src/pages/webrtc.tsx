import { useState } from "react";
import { Helmet } from "react-helmet";

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
	const [name, setName] = useState<string>("");
	const [messages, setMessages] = useState<string[]>([]);
	const [text, setText] = useState<string>("");

	const configuration = {
		iceServers: [
			{
				urls: ["stun:stun.l.google.com:19302"],
			},
		],
	};

	const handleInputName = (event: React.ChangeEvent<HTMLInputElement>) => {
		setName(event.target.value);
	};

	const handleInputText = (event: React.ChangeEvent<HTMLInputElement>) => {
		setText(event.target.value);
	};

	const handleConnect = () => {
		if (!location.hash) {
			location.hash = Math.floor(Math.random() * 0xffffff).toString(16);
		}
		const chatHash = location.hash.substring(1);
		const roomName = `observable-${chatHash}`;
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
			// We're connected to the room and received an array of 'members'
			// connected to the room (including us). Signaling server is ready.
      // @ts-ignore
			room.on("members", (members) => {
				if (members.length >= 3) {
					return alert("The room is full");
				}
				// If we are the second user to connect to the room we will be creating the offer
				const isOfferer = members.length === 2;
				startWebRTC(isOfferer);
			});
		});

		// Send signaling data via Scaledrone
		function sendSignalingMessage(message: unknown) {
			drone.publish({
				room: roomName,
				message,
			});
		}

		function startWebRTC(isOfferer: boolean) {
			console.log("Starting WebRTC in as", isOfferer ? "offerer" : "waiter");
			pc = new RTCPeerConnection(configuration);

			// 'onicecandidate' notifies us whenever an ICE agent needs to deliver a
			// message to the other peer through the signaling server
      // @ts-ignore
			pc.onicecandidate = (event) => {
				if (event.candidate) {
					sendSignalingMessage({ candidate: event.candidate });
				}
			};

			if (isOfferer) {
				// If user is offerer let them create a negotiation offer and set up the data channel
				pc.onnegotiationneeded = () => {
					pc.createOffer(localDescCreated, (error: unknown) => console.error(error));
				};
				dataChannel = pc.createDataChannel("chat");
				setupDataChannel();
			} else {
				// If user is not the offerer let wait for a data channel
        // @ts-ignore
				pc.ondatachannel = (event) => {
					dataChannel = event.channel;
					setupDataChannel();
				};
			}

			startListentingToSignals();
		}

		function startListentingToSignals() {
			// Listen to signaling data from Scaledrone
      // @ts-ignore
			room.on("data", (message, client) => {
				// Message was sent by us
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
							// When receiving an offer lets answer it
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
					// Add the new ICE candidate to our connections remote description
					pc.addIceCandidate(new RTCIceCandidate(message.candidate));
				}
			});
		}

		function localDescCreated(desc: unknown) {
			pc.setLocalDescription(
				desc,
				() => sendSignalingMessage({ sdp: pc.localDescription }),
				(error: unknown) => console.error(error),
			);
		}

		// Hook up data channel event handlers
		function setupDataChannel() {
			checkDataChannelState();
			dataChannel.onopen = checkDataChannelState;
			dataChannel.onclose = checkDataChannelState;
      // @ts-ignore
			dataChannel.onmessage = (event) => {
				console.log("WebRTC data channel message:", event.data);
				setMessages([JSON.parse(event.data), ...messages]);
			};
		}

		function checkDataChannelState() {
			console.log("WebRTC channel state is:", dataChannel.readyState);
			if (dataChannel.readyState === "open") {
				setMessages(["WebRTC data channel is now open", ...messages]);
			}
		}
	};

	const handleSend = () => {
		if (text === "") return;
		console.log(dataChannel.readyState);
		dataChannel.send(JSON.stringify(text));
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
				<input type="text" value={name} onChange={handleInputName} />
				<button type="button" onClick={handleConnect}>
					Connect
				</button>
				<div>
					{messages.map((message, _) => (
						<div key={message}>{message}</div>
					))}
				</div>
				<input type="text" value={text} onChange={handleInputText} />
				<button type="button" onClick={handleSend}>
					Send
				</button>
			</div>
		</>
	);
};

export default WebRTC;
