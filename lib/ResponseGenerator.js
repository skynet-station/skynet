import ScenarioContext from "../contexts/ScenarioContext";

const generateResponse = (response, scenario) => {
	const event = scenario.event;
	const depth = scenario.depth;

	if (event === "start" && depth === 0 && response === "gas") {
		ScenarioContext.setScenarioContext("gas", 1);
		ScenarioContext.render();
		return { video: "./gas_1.webm", image: "./car_sexy.jpg", choices: ["예", "아니요"] };
	}

	if (event === "start" && depth === 0 && response === "leave") {
		ScenarioContext.setScenarioContext("leave", 1);
		ScenarioContext.render();
		return { video: "./leave_1.webm", image: "./oilstation.png", choies: [] };
	}

	if (event === "start" && depth === 0 && response === "weather") {
		ScenarioContext.setScenarioContext("weather", 1);
		ScenarioContext.render();
		return { video: "./weather_1.webm", image: "./raining.png", choices: ["예", "아니요"] };
	}

	if (event === "start" && depth === 0 && response === "special") {
		ScenarioContext.setScenarioContext("special", 1);
		ScenarioContext.render();
		return { video: "./special_1.webm", image: "./oilstation.png", choices: ["예", "아니요"] };
	}

	if (event === "start" && depth === 0 && response === "start") {
		ScenarioContext.render();
		return {
			video: "./start.webm",
			image: "./oilstation.png",
			choices: ["기름 넣으러 왔어요", "출차 부탁드립니다", "오늘 날씨 알려주세요", "오늘 열리는 행사가 있나요?", "춤 춰줘"],
		};
	}

	if (event === "gas" && depth === 1 && response === "yes") {
		ScenarioContext.setScenarioContext("gas", 2);
		ScenarioContext.render();
		return { video: "./gas_2_yes.webm", image: "./inside_car.jpg", choices: ["가득 넣어주세요", "절반만 넣어주세요"] };
	}

	if (event === "gas" && depth === 1 && response === "no") {
		ScenarioContext.setScenarioContext("start", 0);
		ScenarioContext.render();
		return {
			video: "./start.webm",
			image: "./oilstation.png",
			choices: ["기름 넣으러 왔어요", "출차 부탁드립니다", "오늘 날씨 알려주세요", "오늘 열리는 행사가 있나요?", "춤 춰줘"],
		};
	}

	if (event === "gas" && depth === 2) {
		ScenarioContext.setScenarioContext("start", 0);
		ScenarioContext.render();
		return {
			video: "./start.webm",
			image: "./oilstation.png",
			choices: ["기름 넣으러 왔어요", "출차 부탁드립니다", "오늘 날씨 알려주세요", "오늘 열리는 행사가 있나요?", "춤 춰줘"],
		};
	}

	// if (event === "gas" && depth === 3) {
	// 	ScenarioContext.setScenarioContext("start", 0);
	// 	ScenarioContext.render();
	// 	return {
	// 		video: "./start.webm",
	// 		image: "./oilstation.png",
	// 		choices: ["기름 넣으러 왔어요", "출차 부탁드립니다", "오늘 날씨 알려주세요", "오늘 열리는 행사가 있나요?", "춤 춰줘"],
	// 	};
	// }

	if (event === "leave" && depth === 1 && response === true) {
		ScenarioContext.setScenarioContext("leave", 2);
		ScenarioContext.render();
		return { video: "./leave_2.webm", image: "./oilstation.png", choices: ["신용카드로 해주세요", "현금으로 할게요"] };
	}

	if (event === "leave" && depth === 2) {
		ScenarioContext.setScenarioContext(0, 0);
		ScenarioContext.render();
		return {
			video: "./start.webm",
			image: "./oilstation.png",
			choices: ["기름 넣으러 왔어요", "출차 부탁드립니다", "오늘 날씨 알려주세요", "오늘 열리는 행사가 있나요?", "춤 춰줘"],
		};
	}

	// if (event === "leave" && depth === 3) {
	// 	ScenarioContext.setScenarioContext(0, 0);
	// 	ScenarioContext.render();
	// 	return {
	// 		video: "./start.webm",
	// 		image: "./oilstation.png",
	// 		choices: ["기름 넣으러 왔어요", "출차 부탁드립니다", "오늘 날씨 알려주세요", "오늘 열리는 행사가 있나요?", "춤 춰줘"],
	// 	};
	// }

	if (event === "weather" && depth === 1 && response === "yes") {
		ScenarioContext.setScenarioContext("weather", 2);
		ScenarioContext.render();
		return { video: "./weather_2_yes.webm", image: "./oilstation.png", choices: ["예", "아니요"] };
	}

	if (event === "weather" && depth === 1 && response === "no") {
		ScenarioContext.setScenarioContext("weather", 2);
		ScenarioContext.render();
		return { video: "./weather_2_no.webm", image: "./oilstation.png", choices: ["고마워요~"] };
	}

	if (event === "weather" && depth === 2) {
		ScenarioContext.setScenarioContext("start", 0);
		ScenarioContext.render();
		return {
			video: "./start.webm",
			image: "./oilstation.png",
			choices: ["기름 넣으러 왔어요", "출차 부탁드립니다", "오늘 날씨 알려주세요", "오늘 열리는 행사가 있나요?", "춤 춰줘"],
		};
	}

	if (event === "special" && depth === 1 && response === "yes") {
		ScenarioContext.setScenarioContext("special", 2);
		ScenarioContext.render();
		return { video: "./special_2_yes.webm", image: "./oilstation.png", choices: ["고마워요~"] };
	}

	if (event === "special" && depth === 1 && response === "no") {
		ScenarioContext.setScenarioContext("start", 0);
		ScenarioContext.render();
		return {
			video: "./start.webm",
			image: "./oilstation.png",
			choices: ["기름 넣으러 왔어요", "출차 부탁드립니다", "오늘 날씨 알려주세요", "오늘 열리는 행사가 있나요?", "춤 춰줘"],
		};
	}

	if (event === "special" && depth === 2) {
		ScenarioContext.setScenarioContext("start", 0);
		ScenarioContext.render();
		return {
			video: "./start.webm",
			image: "./oilstation.png",
			choices: ["기름 넣으러 왔어요", "출차 부탁드립니다", "오늘 날씨 알려주세요", "오늘 열리는 행사가 있나요?", "춤 춰줘"],
		};
	}

	if (response === "sexy") {
		ScenarioContext.setScenarioContext("start", 0);
		ScenarioContext.render();
		return { video: "./sexy.webm", image: "./club.png", choices: ["혹시 아이돌이신가요?"], audio: "./boomshake.mp3" };
	} else {
		const array = ["fail1.webm", "fail2.webm"];
		const randomFail = array[Math.floor(Math.random() * array.length)];
		ScenarioContext.setScenarioContext("start", 0);
		ScenarioContext.render();
		return {
			video: randomFail,
			image: "./oilstation.png",
			choices: ["기름 넣으러 왔어요", "출차 부탁드립니다", "오늘 날씨 알려주세요", "오늘 열리는 행사가 있나요?", "춤 춰줘"],
		};
	}
};

export default generateResponse;
