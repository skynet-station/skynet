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
	const videoRef = React.useRef();
	let videoElement = videoRef.current;
	const choicesRef = React.useRef();
	let choicesElement = choicesRef.current;
	const audioRef = React.useRef();
	let audioElement = audioRef.current;
	const [videoLoop, setVideoLoop] = useState(false);
	const [recording, setRecording] = useState(false);
	const [videoUrl, setVideoUrl] = useState("");
	const [videoOpacity, setVideoOpacity] = useState(0);
	const [scenario, setScenario] = useState({});
	const [videoTransitionDuration, setVideoTransitionDuration] = useState(0);
	const [backgroundImage, setBackgroundImage] = useState("/future_background1.jpg");
	const [backgroundOpacity, setBackgroundOpacity] = useState(0);
	const [choices, setChoices] = useState([]);
	const [showChoices, setShowChoices] = useState(false);
	const [audio, setAudio] = useState();
	const [moveAI, setMoveAI] = useState(true);
	const [isInitialized, setIsInitialized] = useState(false);
	const [keypoints, setKeypoints] = useState();

	const run = async () => {
		console.log("run");
		net = await bodyPix.load();
		const webcam = await tf.data.webcam(webcamElement, {
			resizeWidth,
			resizeHeight,
		});
		while (true) {
			if (!moveAI) {
				continue;
			}
			const img = await webcam.capture();
			const segmentation = await net.segmentPerson(img);
			if (segmentation?.allPoses[0]) {
				let leftEyeY, leftShoulderY, keypoints, _size;
				let size = 0;
				for (let i = 0; i < segmentation.allPoses.length; i++) {
					leftEyeY = segmentation.allPoses[i].keypoints[1].position.y;
					leftShoulderY = segmentation.allPoses[i].keypoints[5].position.y;
					_size = leftShoulderY - leftEyeY;
					if (_size > size) {
						keypoints = segmentation.allPoses[i].keypoints;
						size = _size;
					}
				}
				if (keypoints) {
					setKeypoints({
						leftEyeX: keypoints[1].position.x,
						leftEyeY: keypoints[1].position.y,
						rightEyeX: keypoints[2].position.x,
						rightEyeY: keypoints[2].position.y,
						// leftShoulderY: keypoints[5].position.y,
						size: size,
					});
				}
			}

			img.dispose();

			await tf.nextFrame();
		}
	};

	React.useEffect(() => {
		if (!keypoints?.size || !moveAI) {
			return;
		}
		if (keypoints.size > 90 && !isInitialized) {
			initialize();
		}

		let posXReversed = (keypoints.leftEyeX + keypoints.rightEyeX) / 2;
		let posXPercentage = (resizeWidth / 2 - posXReversed) / resizeWidth;
		const deviceWidth = window.innerWidth > 0 ? window.innerWidth : screen.width;
		videoElement = videoRef.current;
		if (videoElement) {
			videoElement.style.transform = `translate3d(${deviceWidth * posXPercentage}px, 0, 0)`;
		}
		choicesElement = choicesRef.current;
		if (choicesElement) {
			choicesElement.style.transform = `translate3d(${deviceWidth * posXPercentage}px, 0, 0)`;
		}
	}, [keypoints]);

	React.useEffect(() => {
		webcamElement = camera.current;
		console.log("webcamElement:", webcamElement);
		run();
	}, [camera]);

	React.useEffect(() => {
		AudioStreamer.stopRecording();
	}, []);

	// useEffect( () => {
	//     const scenario = ScenarioContext.initialize()
	//     setScenario(scenario)
	//     setVideoUrl('./start.webm')
	// },[])

	ScenarioContext.render = () => {
		setScenario(ScenarioContext.getScenarioContext());
	};

	function initialize() {
		console.log("initialize");
		setIsInitialized(true);
		const scenario = ScenarioContext.initialize();
		videoElement = videoRef.current;
		setScenario(scenario);
		setVideoUrl("./start.webm");
		setChoices(["기름 넣으러 왔어요", "출차 부탁드립니다", "오늘 날씨 알려주세요", "오늘 열리는 행사가 있나요?", "춤 춰줘"]);
		setTimeout(() => {
			setVideoOpacity(1);
			setBackgroundOpacity(1);
			setVideoTransitionDuration("0.5s");
		}, 100);
	}

	const recordingCallback = (data) => {
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
			audioElement?.play();
		} else {
			audioElement = audioRef.current;
			audioElement?.pause();
		}
		if (video === "./sexy.webm") {
			setVideoLoop(true);
		} else {
			setVideoLoop(false);
		}

		if (video === "./gas_1.webm" || video === "./leave_1.webm") {
			setMoveAI(false);
			const deviceWidth = window.innerWidth > 0 ? window.innerWidth : screen.width;
			videoElement = videoRef.current;
			if (videoElement) {
				videoElement.style.transform = `translate3d(${deviceWidth * 0.4}px, 0, 0)`;
			}
			// choicesElement = choicesRef.current;
			// if (choicesElement) {
			// 	choicesElement.style.transform = `translate3d(${deviceWidth * 0.4}px, 0, 0)`;
			// }
		} else {
			setMoveAI(true);
		}

		setTimeout(() => {
			setVideoTransitionDuration("0.5s");
			setVideoOpacity(1);
			setVideoLoop(false);
			setBackgroundImage(image);
			setBackgroundOpacity(1);
		}, 300);
	};

	function startRecording() {
		console.log("audio start recording...", scenario);
		setRecording(true);
		AudioStreamer.initRecording(recordingCallback, (error) => {
			console.error("Error when recording", error);
			setRecording(false);
		});
	}

	function stop() {
		setRecording(false);
		AudioStreamer.stopRecording();
	}

	function getNextResponse() {
		console.log("getNextResponse");
		setAudio(null);
		if (scenario.event === "leave" && scenario.depth === 1) {
			/// do motion
			setVideoOpacity(0);
			setVideoTransitionDuration(0);
			setVideoUrl("./standing_left_2.webm");
			setTimeout(() => {
				const deviceWidth = window.innerWidth > 0 ? window.innerWidth : screen.width;
				videoElement = videoRef.current;
				if (videoElement) {
					videoElement.style.transform = `translate3d(${deviceWidth * 0.4}px, 0, 0)`;
				}
				setVideoOpacity(1);
				return;
			}, 100);
			setTimeout(() => {
				setVideoLoop(false);
				setMoveAI(false);
				setVideoTransitionDuration("10s");
				const deviceWidth = window.innerWidth > 0 ? window.innerWidth : screen.width;
				videoElement = videoRef.current;
				if (videoElement) {
					videoElement.style.transform = `translate3d(${deviceWidth * -0.3}px, 0, 0)`;
				}
				return;
			}, 300);
			setTimeout(() => {
				recordingCallback(true);
			}, 8 * 1000);
		} else {
			loadStanding();
			setMoveAI(true);
			startRecording();
			setShowChoices(true);
		}
	}

	React.useEffect(() => {
		console.log("scenario:", scenario);
	}, [scenario]);

	function loadStanding() {
		videoElement = videoRef.current;
		setVideoTransitionDuration(0);
		setVideoOpacity(0);
		setVideoUrl("./standing.webm");
		setTimeout(() => {
			setVideoOpacity(1);
			setVideoLoop(true);
			setVideoTransitionDuration("0.5s");
		}, 200);
	}

	function onButtonClick() {
		setBackgroundOpacity(1);
		document.getElementById("initializeButton").style.display = "none";
	}

	return (
		<div
			style={{
				height: "100vh",
				fontStyle: "fantasy",
				fontWeight: "600",
				// transitionProperty: 'all',
				// transitionDuration: '2s'
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
					height: "100vh",
					justifyContent: "center",
					alignItems: "center",
					flexDirection: "column",
					zIndex: 10,
					display: isInitialized ? "none" : "flex",
				}}
			>
				<button
					onClick={onButtonClick}
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
					id="initializeButton"
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
				ref={videoRef}
				loop={videoLoop}
				onEnded={() => getNextResponse()}
				autoPlay
			/>

			{React.useMemo(
				() => (
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
				),
				[]
			)}

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
						width: "230px",
						backgroundColor: "#ffffff8a",
						borderRadius: "30px",
						padding: 10,
						boxShadow: "0px 1px 10px 3px #1e90ff9e",
					}}
					ref={choicesRef}
				>
					{choices?.map((x, idx) => (
						<p style={{ textAlign: "center" }} key={idx}>
							{x}
						</p>
					))}
				</div>
			)}
			<audio src={audio} autoPlay ref={audioRef} />
		</div>
	);
};

function Container() {
	return React.useMemo(() => ((<Main />), []));
}

export default Main;
