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
	const rainImageRef = React.useRef();
	let rainImageElement = rainImageRef.current;
	const carImageRef = React.useRef();
	let carImageElement = carImageRef.current;
	const receiptImageRef = React.useRef();
	let receiptImageElement = receiptImageRef.current;
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
	const [showButton, setShowButton] = useState(true);
	const [faceRecFail, setFaceRecFail] = useState(0);

	function clearAI() {
		stop();
		setVideoLoop(false);
		setRecording(false);
		setVideoUrl("");
		setVideoOpacity(0);
		setScenario({});
		setVideoTransitionDuration(0);
		setBackgroundImage("/future_background1.jpg");
		setBackgroundOpacity(1);
		setChoices([]);
		setShowChoices(false);
		setIsInitialized(false);
		setVideoLoop(false);
		setRecording(false);
		setVideoOpacity(0);
		setMoveAI(true);
		setKeypoints();
		setAudio(null);
		setFaceRecFail(0);
		rainImageElement = rainImageRef.current;
		rainImageElement.style.display = "none";
		carImageElement = carImageRef.current;
		carImageElement.style.display = "none";
		receiptImageElement = receiptImageRef.current;
		receiptImageElement.style.display = "none";
		audioElement = audioRef.current;
		audioElement?.pause();
	}

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
			} else {
				setKeypoints({ size: null });
			}

			img.dispose();

			await tf.nextFrame();
		}
	};

	React.useEffect(() => {
		if (!keypoints?.size || keypoints.size <= 4) {
			console.log(faceRecFail);
			setFaceRecFail(faceRecFail + 1);
			if (faceRecFail > 30) {
				clearAI();
			}
		}
		if (!keypoints?.size || !moveAI) {
			return;
		}
		if (keypoints.size > 40 && !isInitialized) {
			initialize();
		}
		setFaceRecFail(0);

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
		setShowButton(false);
		const scenario = ScenarioContext.initialize();
		videoElement = videoRef.current;
		setScenario(scenario);
		setVideoUrl("./start.webm");
		setChoices(["?????? ????????? ?????????", "?????? ?????? ???????????????", "?????? ????????? ????????? ??????????", "??? ??????"]);
		setTimeout(() => {
			setVideoOpacity(1);
			setBackgroundOpacity(1);
			setVideoTransitionDuration("1.5s");
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

		if (video === "./gas_1.webm" || video === "./leave_1.webm" || video === "./weather_1.webm" || video === "./gas_3.webm") {
			setMoveAI(false);
			const deviceWidth = window.innerWidth > 0 ? window.innerWidth : screen.width;
			videoElement = videoRef.current;
			if (videoElement) {
				videoElement.style.transform = `translate3d(${deviceWidth * 0.4}px, 0, 0)`;
			}
			if (video === "./weather_1.webm") {
				rainImageElement = rainImageRef.current;
				rainImageElement.style.display = "block";
			} else if (video === "./gas_1.webm") {
				carImageElement = carImageRef.current;
				carImageElement.style.display = "block";
			} else if (video === "./gas_3.webm") {
				receiptImageElement = receiptImageRef.current;
				receiptImageElement.style.display = "block";
			}
		} else {
			setMoveAI(true);
		}

		setTimeout(() => {
			setVideoTransitionDuration("1.5s");
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
		rainImageElement = rainImageRef.current;
		rainImageElement.style.display = "none";
		carImageElement = carImageRef.current;
		carImageElement.style.display = "none";
		receiptImageElement = receiptImageRef.current;
		receiptImageElement.style.display = "none";
		if (scenario.event === "leave" && scenario.depth === 1) {
			/// do motion
			setVideoOpacity(0);
			setVideoTransitionDuration(0);
			setVideoUrl("./walking_left_cut.webm");
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
				setVideoTransitionDuration("6s");
				const deviceWidth = window.innerWidth > 0 ? window.innerWidth : screen.width;
				videoElement = videoRef.current;
				if (videoElement) {
					videoElement.style.transform = `translate3d(${deviceWidth * -0.2}px, 0, 0)`;
				}
				return;
			}, 300);
			setTimeout(() => {
				recordingCallback(true);
			}, 4 * 1000);
		} else if (
			videoUrl === "./sexy.webm" ||
			videoUrl === "./gas_3.webm" ||
			videoUrl === "./leave_3.webm" ||
			videoUrl === "./special_2_yes.webm" ||
			videoUrl === "./weather_2_yes.webm" ||
			videoUrl === "./weather_2_no.webm"
		) {
			setAudio(null);
			clearAI();
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
		rainImageElement = rainImageRef.current;
		rainImageElement.style.display = "none";
		videoElement = videoRef.current;
		setVideoTransitionDuration(0);
		setVideoOpacity(0);
		setVideoUrl("./standing.webm");
		setTimeout(() => {
			setVideoOpacity(1);
			setVideoLoop(true);
			setVideoTransitionDuration("1.5s");
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
					display: showButton ? "flex" : "none",
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
					????????????
				</button>
				<div style={{ textAlign: "center", color: "grey" }}>
					<p>???????????? ?????? ???????????? ????????? ????????? ??????????????? ??????????????????!</p>
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
				height="70%"
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
						left: "35vw",
						zIndex: 20,
						bottom: "20vh",
						width: "20vw",
						backgroundColor: "#ffffff8a",
						borderRadius: "30px",
						padding: 10,
						boxShadow: "0px 1px 10px 3px #1e90ff9e",
						fontSize: "1vw",
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

			<img
				src={"/weather_forecast.png"}
				style={{ position: "fixed", left: "20vw", top: "20vh", display: "none" }}
				width={"30%"}
				heigh={"30%"}
				zIndex={100}
				ref={rainImageRef}
			/>
			<img
				src={"/future_car.png"}
				style={{ position: "fixed", left: "20vw", top: "30vh", display: "none" }}
				width={"40%"}
				heigh={"40%"}
				zIndex={100}
				ref={carImageRef}
			/>
			<img
				src={"/45000.png"}
				style={{ position: "fixed", left: "20vw", top: "30vh", display: "none" }}
				width={"40%"}
				heigh={"40%"}
				zIndex={100}
				ref={receiptImageRef}
			/>
		</div>
	);
};

export default Main;
