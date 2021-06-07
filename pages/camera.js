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
		// net = await mobilenet.load();
		// net = await handpose.load();
		net = await bodyPix.load();
		const webcam = await tf.data.webcam(webcamElement, {
			resizeWidth,
			resizeHeight,
		});
		while (true) {
			const img = await webcam.capture();
			// const result = await net.classify(img);

			// if (figures.current) {
			// 	figures.current.innerText = `prediction : ${result[0].className} \n probability : ${result[0].probability}`;
			// }
			// const predictions = await net.estimateHands(img);
			// if (predictions[0]) {
			// 	const keypoints = predictions[0].landmarks;
			// 	const [x, y, z] = keypoints[0];
			// 	console.log("Keypoint:", x, y, z);
			// }
			// for (let i = 0; i < predictions.length; i++) {
			// 	const keypoints = predictions[i].landmarks;

			// 	// Log hand keypoints.
			// 	for (let i = 0; i < keypoints.length; i++) {
			// 		const [x, y, z] = keypoints[i];
			// 		console.log(`Keypoint ${i}: [${x}, ${y}, ${z}]`);
			// 	}
			// }

			const segmentation = await net.segmentPerson(img);
			if (segmentation?.allPoses[0]) {
				let posXReversed = (figures.current.innerText = segmentation.allPoses[0].keypoints[0].position.x);
				let posXPercentage = ((resizeWidth - posXReversed) * 100) / resizeWidth;
				figures.current.innerText = posXPercentage.toFixed(2) + "%";
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
		<React.Fragment>
			<div ref={figures} style={{ fontSize: 30 }}></div>
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
				}}
			/>
		</React.Fragment>
	);
};

export default ImageClassifier;
