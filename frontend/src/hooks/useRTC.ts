import { useCallback, useRef, useState } from "react";
import io from 'socket.io-client';

interface CandidateMessage {
	type: "candidate";
	label: number | null;
	id: string | null;
	candidate: string;
}

type TextMessage = "got user media" | "bye";

type Message = TextMessage | RTCSessionDescriptionInit | CandidateMessage;

export const useRTC = () => {
	const localVideoRef = useRef<HTMLVideoElement>(null);
	const remoteVideoRef = useRef<HTMLVideoElement>(null);
	const socketRef = useRef<SocketIOClient.Socket>();
	const messageEventTargetRef = useRef<EventTarget>();
	const localStreamRef = useRef<MediaStream>();
	const remoteStreamRef = useRef<MediaStream>();
	const peerConnectionRef = useRef<RTCPeerConnection>();
	const [isInitiator, setIsInitiator] = useState(false);
	const [isStarted, setIsStarted] = useState(false);
	const [isChannelReady, setIsChannelReady] = useState(false);

	const getSocket = () => {
		if (!socketRef.current) {
			socketRef.current = io.connect(
				import.meta.env.VITE_SIGNALING_SERVER_URL || "http://localhost:8000",
			);
		}
		return socketRef.current;
	};

	const getMessageEventTarget = () => {
		if (!messageEventTargetRef.current) {
			messageEventTargetRef.current = new EventTarget();
		}
		return messageEventTargetRef.current;
	};

	const sendMessage = useCallback((message: Message) => {
		console.log("Client sending message: ", message);
		getSocket().emit("message", message);
	}, []);

	const setLocalAndSendMessage = useCallback(
		(description: RTCSessionDescriptionInit) => {
			if (!peerConnectionRef.current) return;
			peerConnectionRef.current.setLocalDescription(description);
			sendMessage(description);
		},
		[sendMessage],
	);

	const onicecandidate = useCallback(
		(event: RTCPeerConnectionIceEvent) => {
			console.log("icecandidate event: ", event);
			if (event.candidate) {
				sendMessage({
					type: "candidate",
					label: event.candidate.sdpMLineIndex,
					id: event.candidate.sdpMid,
					candidate: event.candidate.candidate,
				});
			} else {
				console.log("End of candidates.");
			}
		},
		[sendMessage],
	);

	const ontrack = (event: RTCTrackEvent) => {
		console.log("ontrack");
		if (!remoteVideoRef.current) return;
		if (event.streams?.[0]) return;
		remoteStreamRef.current = new MediaStream();
		remoteStreamRef.current.addTrack(event.track);
		remoteVideoRef.current.srcObject = remoteStreamRef.current;
	};

	const createPeer = useCallback(() => {
		console.log(">>>>>> creating peer connection");
		if (!localStreamRef.current) return;
		peerConnectionRef.current = new RTCPeerConnection();
		peerConnectionRef.current.addEventListener("icecandidate", onicecandidate);
		peerConnectionRef.current.addEventListener("track", ontrack);
		peerConnectionRef.current.addTrack(
			localStreamRef.current.getVideoTracks()[0],
		);
		setIsStarted(true);
	}, [onicecandidate]);

	const initiatorStart = useCallback(async () => {
		console.log(">>>>>>> initiatorStart() ", isStarted, isChannelReady);
		if (!isStarted) {
			createPeer();
			if (!peerConnectionRef.current) return;
			console.log("Sending offer to peer");
			const description = await peerConnectionRef.current.createOffer();
			setLocalAndSendMessage(description);
			return true;
		}
		return false;
	}, [isStarted, isChannelReady, createPeer, setLocalAndSendMessage]);

	const receiverStart = useCallback(async () => {
		console.log(">>>>>>> receiverStart() ", isStarted, isChannelReady);
		if (!isStarted && isChannelReady) {
			createPeer();
		}
	}, [createPeer, isChannelReady, isStarted]);

	return {
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
	};
};
