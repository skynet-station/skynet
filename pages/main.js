import React, { useState, useEffect, useRef } from "react";
import AudioStreamer from "../lib/AudioHandler";

import ScenarioContext from "../contexts/ScenarioContext";
import generateResponse from "../lib/ResponseGenerator";

import * as bodyPix from "@tensorflow-models/body-pix";
import * as tf from "@tensorflow/tfjs";

const resizeWidth = 220;
const resizeHeight = 227;

const Main = () => {
	let net;
	const camera = React.useRef();
	let webcamElement = camera.current;
	const video = React.useRef();
	let videoElement = video.current;

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

	const [videoLoop, setVideoLoop] = useState(false);
	const [recording, setRecording] = useState(false);
	const [videoUrl, setVideoUrl] = useState("");
	const [videoOpacity, setVideoOpacity] = useState(0);
	const [scenario, setScenario] = useState({});
	const [videoTransitionDuration, setVideoTransitionDuration] = useState(0);

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
		setTimeout(() => {
			setVideoOpacity(1);
			setVideoTransitionDuration("1s");
		}, 300);
		// setVideoOpacity(1);
	}

	function startRecording() {
		console.log("audio start recording...", scenario);
		setRecording(true);
		AudioStreamer.initRecording(
			(data) => {
				const video = generateResponse(data, scenario);
				stop();
				setVideoOpacity(0);
				setVideoTransitionDuration(0);
				setVideoUrl(video);
				setTimeout(() => {
					setVideoTransitionDuration("1s");
					setVideoOpacity(1);
					setVideoLoop(false);
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
		setTimeout(() => {
			setVideoUrl("./standing.webm");
			setTimeout(() => {
				setVideoOpacity(1);
				setVideoLoop(true);
				setVideoTransitionDuration("1s");
			}, 300);
		}, 1000);
	}

	return (
		<div style={{ height: "100vh" }}>
			<div
				style={{
					display: !!videoUrl ? "none" : "flex",
					height: "100vh",
					justifyContent: "center",
					alignItems: "center",
					flexDirection: "column",
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
						zIndex: 1,
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
					zIndex: 0,
					top: 0,
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
		</div>
	);
};

export default Main;
