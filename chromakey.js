const ffmpeg = require("ffmpeg");
const path = require("path");
const exec = require("child_process").exec;
const fs = require("fs");
const { createCanvas, loadImage, Image } = require("canvas");
const sizeOf = require("image-size");
const { rgb2hsv } = require("./rgb2hsv");
const { hsv2rgb } = require("./hsv2rgb");

const filename = process.argv[2];
const prefix = filename.split(".")[0];

let frame;

function mkdir() {
	return new Promise((resolve, reject) => {
		exec(`mkdir ${prefix}`, () => {
			resolve();
		});
	});
}

function extractFrames() {
	return new Promise((resolve, reject) => {
		exec(`ffmpeg -y -r 1 -i ${filename} -r 1 ./${prefix}/%05d.png`, () => {
			console.log("------------------------frame saved!-----------------------------");
			resolve();
		});
	});
}

function enumImages() {
	let dir = path.join(__dirname, prefix);
	let files = fs.readdirSync(dir);
	// files = [files[0]];
	for (let file of files) {
		console.log(file);
		let filePath = path.join(__dirname, prefix, file);
		const { width, height } = sizeOf(filePath);
		const canvas = createCanvas(width, height);
		const ctx = canvas.getContext("2d");
		const ctx2 = canvas.getContext("2d");
		loadImage(filePath).then((image) => {
			ctx.drawImage(image, 0, 0, width, height);
			frame = ctx.getImageData(0, 0, width, height);
			let p = [];
			for (let y = 0; y < height; y++) {
				for (let x = 0; x < width; x++) {
					p = pixel(width * y + x);
					let { h, s, v } = rgb2hsv(...p);
					wakandaForever(y, x, width, h, s, v);
				}
			}
			ctx2.putImageData(frame, 0, 0);
			canvas.toBuffer((err, buf) => {
				let target = path.join(dir, file);
				console.log("target:", target);
				fs.writeFileSync(target, buf);
			});
		});
	}
}

function wakandaForever(y, x, w, h, s, v) {
	if (clothGreen(h, s, v)) {
		//옷에 비친 초록색을 빼자
		if (v < 30) {
			// h = 205;
			//그림자
			s -= 5;
			v = Math.min(5, v - 15);
			const { r: newR, g: newG, b: newB } = hsv2rgb(h, s, v);
			frame.data[4 * w * y + 4 * x] = newR;
			frame.data[4 * w * y + 4 * x + 1] = newG;
			frame.data[4 * w * y + 4 * x + 2] = newB;
			frame.data[4 * w * y + 4 * x + 3] = 200;
		}
		return;
	}
	if (flashGreen(h, s, v)) {
		//살색 테두리
		// frame.data[4 * w * y + 4 * x + 3] = Math.min(255, (5 / 8) * Math.pow(s - 50, 2));
		h = Math.max(h - 60, 40);
		v += 3;
		s -= 7;
		const { r: newR, g: newG, b: newB } = hsv2rgb(h, s, v);
		frame.data[4 * w * y + 4 * x] = newR;
		frame.data[4 * w * y + 4 * x + 1] = newG;
		frame.data[4 * w * y + 4 * x + 2] = newB;
		frame.data[4 * w * y + 4 * x + 3] = 190;
		return;
	}
	if (isGreen(h, s, v)) {
		frame.data[4 * w * y + 4 * x + 3] = 0;
		return;
	}
}

function letsGoBaby() {
	mkdir().then(extractFrames).then(enumImages);
}

letsGoBaby();

//--------------------------------determine green color---------------------------------------//

/*************************************************************************************/
const hmin = 30;
const hmax = 170; // hue -> 초록색 범위를 70~170으로 잡음. 조정가능
const smin = 15; // saturation -> s가 낮으면 흰색임. 흰색을 지우지 않기 위해 하한 설정
const vmin = 20; // value -> v가 낮으면 검정색. 검정색을 지우지 않기 위해 하한 설정
/*************************************************************************************/

function isGreen(h, s, v) {
	//생초록색
	return hmin <= h && h <= hmax && smin <= s && vmin <= v;
}
function isHairGreen(h, s, v) {
	//머리쪽 초록색
	return hmin <= h && h <= 160 && smin <= s && v < vmin;
}
function flashGreen(h, s, v) {
	//살색쪽 초록색
	return 27 < h && h < 60 && 17 <= s && s < 50 && 35 <= v;
}
function clothGreen(h, s, v) {
	//옷에 비친 초록색
	return 80 < h && h < 150 && smin <= s && 15 <= v && v <= 25;
}
function skirtGreen(h, s, v) {
	//하얀치마 색을 빼자
	return 60 < h && h < 160 && s < 40 && v > 70;
}

function pixel(n) {
	//r,g,b,a 반환
	return frame.data.slice(4 * n, 4 * n + 4);
}

function blur(r, c, w) {
	let _pixel = [0, 0, 0, 0];
	let count = 0;
	for (let i = -1; i < 2; i++) {
		for (let j = -1; j < 2; j++) {
			let p = pixel(w * (r + i) + (c + j));
			let { h, s, v } = rgb2hsv(...p);
			if (isGreen(h, s, v)) {
				continue;
			}
			count++;
			_pixel[0] += p[0];
			_pixel[1] += p[1];
			_pixel[2] += p[2];
			_pixel[3] += p[3];
		}
	}
	_pixel[0] /= count;
	_pixel[1] /= count;
	_pixel[2] /= count;
	_pixel[3] /= count;
	frame.data[4 * w * r + 4 * c] = _pixel[0];
	frame.data[4 * w * r + 4 * c + 1] = _pixel[1];
	frame.data[4 * w * r + 4 * c + 2] = _pixel[2];
	frame.data[4 * w * r + 4 * c + 3] = _pixel[3];
}
