import React from "react";
import * as mobilenet from "@tensorflow-models/mobilenet";
import * as handpose from "@tensorflow-models/handpose";
import * as bodyPix from "@tensorflow-models/body-pix";
import * as tf from "@tensorflow/tfjs";

const resizeWidth = 220;
const resizeHeight = 227;

const ImageClassifier = () => {
	let net;
	const camera = React.useRef();
	const figures = React.useRef();
	let webcamElement = camera.current;

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
				// console.log(segmentation.allPoses[0]);
				let posXReversed =
					(segmentation.allPoses[0].keypoints[1].position.x + segmentation.allPoses[0].keypoints[2].position.x) / 2;
				let posXPercentage = (resizeWidth / 2 - posXReversed) / resizeWidth;
				// figures.current.innerText = posXPercentage.toFixed(2) + "%";
				let model = document.getElementById("model");
				const deviceWidth = window.innerWidth > 0 ? window.innerWidth : screen.width;
				// model.setAttribute("style", `position: absolute; left:${deviceWidth * posXPercentage}px; height: 600px`);
				model.style.transform = `translate3d(${deviceWidth * posXPercentage}px, 0, 0)`;
			}

			img.dispose();

			await tf.nextFrame();
		}
	};

	React.useEffect(() => {
		webcamElement = camera.current;
		run();
	}, [camera]);

	return (
		<div style={{ display: "flex", flexDirection: "column" }}>
			{/* <video
				autoPlay
				muted
				loop
				id="background"
				style={{ position: "fixed", left: 0, top: 0, minWidth: "100vw", minHeight: "100vh" }}
			>
				<source src="rain.mp4" type="video/mp4"></source>
			</video> */}
			{/* <img src="/oilstation2.png" style={{ width: "100vw", height: "100vh" }} /> */}
			<img src="/club.png" style={{ width: "100vw", height: "100vh" }} />
			{/* <div ref={figures} style={{ fontSize: 30 }}></div> */}
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
			<video
				autoPlay
				loop
				src="/sexy.webm"
				muted={true}
				height="100%"
				style={{ position: "absolute", left: 0, transitionProperty: "transform", transitionDuration: "1s", bottom: 0 }}
				id="model"
			/>
		</div>
	);
};

export default ImageClassifier;
