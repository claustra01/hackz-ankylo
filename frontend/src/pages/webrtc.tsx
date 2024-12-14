import { useEffect } from "react";
import { useRTC } from "../hooks/useRTC";

interface CandidateMessage {
	type: "candidate";
	label: number | null;
	id: string | null;
	candidate: string;
}

type TextMessage = "got user media" | "bye";

type Message = TextMessage | RTCSessionDescriptionInit | CandidateMessage;

const Sample5 = () => {
	const {
    localVideoRef,
    remoteVideoRef,
    peerConnectionRef,
		localStreamRef,
    isInitiator,
    isStarted,
    isChannelReady,
		getSocket,
		getMessageEventTarget,
		sendMessage,
		setLocalAndSendMessage,
		initiatorStart,
		receiverStart,
    setIsInitiator,
    setIsStarted,
    setIsChannelReady,
	} = useRTC();

	useEffect(() => {
		console.log(`hostname: ${location.hostname}`);
		const room = "foo" as string;
		if (room !== "") {
			console.log(`Asking to join room ${room}`);
			getSocket().emit("create or join", room);
		}
		getSocket().removeAllListeners();
		getSocket().on("created", (room: string, clientId: string) => {
			console.log(room, clientId);
			setIsInitiator(true);
		});

		getSocket().on("full", (room: string) => {
			console.log(`Room ${room} is full :^(`);
		});

		getSocket().on("ipaddr", (ipaddr: string) => {
			console.log(`Server IP address is ${ipaddr}`);
		});

		getSocket().on("join", (room: string) => {
			console.log(`Another peer made a request to join room ${room}`);
			console.log(`This peer is the initiator of room ${room}!`);
			setIsChannelReady(true);
		});

		getSocket().on("joined", (room: string, clientId: string) => {
			console.log(room, clientId);
			setIsChannelReady(true);
		});

		getSocket().on("log", (text: string) => {
			console.log(text);
		});
		const byeCallback = () => {
			console.log("Session terminated.");
			if (peerConnectionRef.current) peerConnectionRef.current.close();
			setIsInitiator(true);
			setIsStarted(false);
			setIsChannelReady(false);
		};
		getMessageEventTarget().addEventListener("bye", byeCallback);
		const answerCallback = async (e: any) => {
			const message = e.detail;
			if (!peerConnectionRef.current) return;
			peerConnectionRef.current.setRemoteDescription(
				new RTCSessionDescription(message),
			);
		};
		getMessageEventTarget().addEventListener("answer", answerCallback);
		getSocket().on("message", async (message: Message) => {
			if (typeof message === "string") {
				getMessageEventTarget().dispatchEvent(new Event(message));
			} else {
				getMessageEventTarget().dispatchEvent(
					new CustomEvent(message.type, { detail: message }),
				);
			}
		});
		(async () => {
			localStreamRef.current = await navigator.mediaDevices.getUserMedia({
				video: true,
			});
			if (localVideoRef.current) {
				localVideoRef.current.srcObject = localStreamRef.current;
				sendMessage("got user media");
			}
		})();

		window.addEventListener("beforeunload", () => {
			sendMessage("bye");
		});

		return () => {
			getMessageEventTarget().removeEventListener("bye", byeCallback);
			getMessageEventTarget().removeEventListener("answer", answerCallback);
			if (peerConnectionRef.current) peerConnectionRef.current.close();
			if (localStreamRef.current) localStreamRef.current.getTracks()[0].stop();
			sendMessage("bye");
			if (getSocket()) getSocket().close();
		};
	}, [sendMessage]);

	useEffect(() => {
		const callback = () => {
			console.log("got user media");
			if (isInitiator) initiatorStart();
		};
		getMessageEventTarget().addEventListener("got user media", callback);
		return () => {
			getMessageEventTarget().removeEventListener("got user media", callback);
		};
	}, [isInitiator, isChannelReady, initiatorStart]);

	useEffect(() => {
		const callback = async (e: any) => {
			const message = e.detail;
			if (!peerConnectionRef.current || !isStarted) return;
			const candidate = new RTCIceCandidate({
				sdpMLineIndex: message.label,
				candidate: message.candidate,
			});
			peerConnectionRef.current.addIceCandidate(candidate);
		};
		getMessageEventTarget().addEventListener("candidate", callback);
		return () => {
			getMessageEventTarget().removeEventListener("candidate", callback);
		};
	}, [isStarted]);

	useEffect(() => {
		const callback = async (e: any) => {
			const message = e.detail;
			if (!isInitiator && !isStarted) {
				await receiverStart();
			}
			if (!peerConnectionRef.current) return;
			peerConnectionRef.current.setRemoteDescription(
				new RTCSessionDescription(message),
			);
			console.log("Sending answer to peer.");
			const description = await peerConnectionRef.current.createAnswer();
			setLocalAndSendMessage(description);
		};
		getMessageEventTarget().addEventListener("offer", callback);
		return () => {
			getMessageEventTarget().removeEventListener("offer", callback);
		};
	}, [
		isInitiator,
		isStarted,
		isChannelReady,
		receiverStart,
		setLocalAndSendMessage,
	]);

	console.log("render end");
	return (
		<div>
			<h2>Sample 5</h2>
			<p>Signaling and video Peer Connection</p>
			<p>isStarted: {String(isStarted)},</p>
			<p>isChannelReady: {String(isChannelReady)}</p>
			<p>isInitiator: {String(isInitiator)}</p>
			<video
				ref={localVideoRef}
				style={{ width: "320px", maxWidth: "100%" }}
				autoPlay
				playsInline
			/>
			<video
				ref={remoteVideoRef}
				style={{ width: "320px", maxWidth: "100%" }}
				autoPlay
				playsInline
			/>
		</div>
	);
};

export default Sample5;
