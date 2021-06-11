import React, { useState, useEffect, useRef } from "react";
import AudioStreamer from "../lib/AudioHandler";

import ScenarioContext from "../contexts/ScenarioContext";
import generateResponse from "../lib/ResponseGenerator";

import * as bodyPix from "@tensorflow-models/body-pix";
import * as tf from "@tensorflow/tfjs";
import socket from '../lib/SocketContext'

const resizeWidth = 220;
const resizeHeight = 227;

const Main = () => {
	let net;
	const camera = React.useRef();
	let webcamElement = camera.current;
	const video = React.useRef();
	let videoElement = video.current;
	const choicesRef = React.useRef();
	let choicesElement = choicesRef.current;
	const audioRef = React.useRef();
	let audioElement = audioRef.current;

	const run = async () => {
		net = await bodyPix.load();
		const webcam = await tf.data.webcam(webcamElement, {
			resizeWidth,
			resizeHeight,
		});
		while (true) {
			const img = await webcam.capture();

			const segmentation = await net.segmentPerson(img);
			if (segmentation?.allPoses[0]) {
				// keypoint 0 = nose, 1 = lefteye 2 = righteye
				let posXReversed =
					(segmentation.allPoses[0].keypoints[1].position.x + segmentation.allPoses[0].keypoints[2].position.x) / 2;
				let posXPercentage = (resizeWidth / 2 - posXReversed) / resizeWidth;
				const deviceWidth = window.innerWidth > 0 ? window.innerWidth : screen.width;
				videoElement = video.current;
				videoElement.style.transform = `translate3d(${deviceWidth * posXPercentage}px, 0, 0)`;
				choicesElement = choicesRef.current;
				if (choicesElement) {
					choicesElement.style.transform = `translate3d(${deviceWidth * posXPercentage}px, 0, 0)`;
				}
			}

			img.dispose();

			await tf.nextFrame();
		}
	};

	React.useEffect(() => {
		webcamElement = camera.current;
		console.log("webcamElement:", webcamElement);
		run();
	}, [camera]);

	React.useEffect(() => {
		AudioStreamer.stopRecording();
	}, []);

	const [videoLoop, setVideoLoop] = useState(false);
	const [recording, setRecording] = useState(false);
	const [videoUrl, setVideoUrl] = useState("");
	const [videoOpacity, setVideoOpacity] = useState(0);
	const [scenario, setScenario] = useState({});
	const [videoTransitionDuration, setVideoTransitionDuration] = useState(0);
	const [backgroundImage, setBackgroundImage] = useState("/oilstation.png");
	const [backgroundOpacity, setBackgroundOpacity] = useState(0);
	const [choices, setChoices] = useState([]);
	const [showChoices, setShowChoices] = useState(false);
	const [audio, setAudio] = useState();

	// useEffect( () => {
	//     const scenario = ScenarioContext.initialize()
	//     setScenario(scenario)
	//     setVideoUrl('./start.webm')
	// },[])

	ScenarioContext.render = () => {
		setScenario(ScenarioContext.getScenarioContext());
	};

	function initialize() {
		const scenario = ScenarioContext.initialize();
		videoElement = video.current;
		setScenario(scenario);
		setVideoUrl("./start.webm");
		setChoices(["기름 넣으러 왔어요", "출차 부탁드립니다", "오늘 날씨 알려주세요", "오늘 열리는 행사가 있나요?", "춤 춰줘"]);
		setTimeout(() => {
			setVideoOpacity(1);
			setBackgroundOpacity(1);
			setVideoTransitionDuration("0.5s");
		}, 100);
	}

	function startRecording() {
		console.log("audio start recording...", scenario);
		setRecording(true);
		AudioStreamer.initRecording(
			(data) => {
				const { video, image, choices, audio } = generateResponse(data, scenario);
				stop();
				setShowChoices(false);
				setVideoOpacity(0);
				setVideoTransitionDuration(0);
				setVideoUrl(video);
				setBackgroundOpacity(0);
				setChoices(choices);
				if (audio) {
					setAudio(audio);
					audioElement = audioRef.current;
					audioElement.play();
				} else {
					audioElement = audioRef.current;
					audioElement.pause();
				}
				if (video === "./sexy.webm") {
					setVideoLoop(true);
				} else {
					setVideoLoop(false);
				}

				setTimeout(() => {
					setVideoTransitionDuration("0.5s");
					setVideoOpacity(1);
					setVideoLoop(false);
					setBackgroundImage(image);
					setBackgroundOpacity(1);
				}, 300);
			},
			(error) => {
				console.error("Error when recording", error);
				setRecording(false);
			}
		);
	}

	function stop() {
		setRecording(false);
		AudioStreamer.stopRecording();
	}

	function getNextResponse() {
		console.log("getNextResponse");
		loadStanding();
		setShowChoices(true);
		setAudio(null);
		if (scenario.event === "leave" && scenario.depth === 1) {
			/// do motion
		} else {
			startRecording();
		}
	}

	function loadStanding() {
		videoElement = video.current;
		setVideoTransitionDuration(0);
		setVideoOpacity(0);
		setVideoUrl("./standing.webm");
		setTimeout(() => {
			setVideoOpacity(1);
			setVideoLoop(true);
			setVideoTransitionDuration("0.5s");
		}, 200);
	}

	return (
		<div
			style={{
				height: "100vh",
			}}
		>
			<img
				src={backgroundImage}
				style={{
					position: "fixed",
					top: 0,
					left: 0,
					width: "100vw",
					height: "100vh",
					zIndex: 0,
					transitionProperty: "all",
					transitionDuration: "1s",
					opacity: backgroundOpacity,
				}}
			/>
			<div
				style={{
					display: !!videoUrl ? "none" : "flex",
					height: "100vh",
					justifyContent: "center",
					alignItems: "center",
					flexDirection: "column",
					zIndex: 10,
				}}
			>
				<button
					onClick={() => initialize()}
					style={{
						width: "10vw",
						height: "6vw",
						left: "45vw",
						top: "47vh",
						cursor: "pointer",
						backgroundColor: "dodgerblue",
						color: "white",
						fontWeight: "bold",
						border: "none",
						boxShadow: "0px 1px 10px 3px grey",
						borderRadius: "10px",
						zIndex: 10,
					}}
				>
					시작하기
				</button>
				<div style={{ textAlign: "center", color: "grey" }}>
					<p>시작하기 전에 마이크와 카메라 기능을 켜놓았는지 확인해주세요!</p>
				</div>
			</div>

			<video
				style={{
					opacity: videoOpacity,
					transitionProperty: "all",
					transitionDuration: videoTransitionDuration,
					position: "absolute",
					left: 0,
					zIndex: 1,
					bottom: 0,
				}}
				height="100%"
				key={videoUrl}
				src={videoUrl}
				ref={video}
				loop={videoLoop}
				onEnded={() => getNextResponse()}
				autoPlay
			/>

			<video
				autoPlay
				playsInline
				muted={true}
				ref={camera}
				width="870"
				height="534"
				style={{
					transform: "scaleX(-1)",
					WebkitTransform: "scaleX(-1)",
					display: "none",
				}}
			/>

			{showChoices && choices?.length > 0 && (
				<div
					style={{
						opacity: videoOpacity,
						transitionProperty: "all",
						transitionDuration: videoTransitionDuration,
						position: "absolute",
						left: "50vw",
						zIndex: 20,
						bottom: "50vh",
						width: "20vw",
						backgroundColor: "white",
						borderRadius: "30px",
						padding: 10,
					}}
					ref={choicesRef}
				>
					{choices?.map((x, idx) => (
						<p>{`${idx + 1} :  ${x}`}</p>
					))}
				</div>
			)}
			<audio src={audio} autoPlay ref={audioRef} />
		</div>
	);
};

export default Main;
