import ScenarioContext from "../contexts/ScenarioContext";

const generateResponse = (response, scenario) => {
	const event = scenario.event;
	const depth = scenario.depth;

	if (event === "start" && depth === 0 && response === "gas") {
		ScenarioContext.setScenarioContext("gas", 1);
		ScenarioContext.render();
		return { video: "./gas_1.webm", image: "./tesla.png" };
	}

	if (event === "start" && depth === 0 && response === "leave") {
		ScenarioContext.setScenarioContext("leave", 1);
		ScenarioContext.render();
		return { video: "./leave_1.webm", image: "./oilstation2.png" };
	}

	if (event === "start" && depth === 0 && response === "weather") {
		ScenarioContext.setScenarioContext("weather", 1);
		ScenarioContext.render();
		return { video: "./weather_1.webm", image: "./raining.png" };
	}

	if (event === "start" && depth === 0 && response === "special") {
		ScenarioContext.setScenarioContext("special", 1);
		ScenarioContext.render();
		return { video: "./special_1.webm", image: "./oilstation2.png" };
	}

	if (event === "start" && depth === 0 && response === "start") {
		ScenarioContext.render();
		return { video: "./start.webm", image: "./oilstation2.png" };
	}

	if (event === "gas" && depth === 1 && response === "yes") {
		ScenarioContext.setScenarioContext("gas", 2);
		ScenarioContext.render();
		return { video: "./gas_2_yes.webm", image: "./oilstation2.png" };
	}

	if (event === "gas" && depth === 1 && response === "no") {
		ScenarioContext.setScenarioContext("start", 0);
		ScenarioContext.render();
		return { video: "./start.webm", image: "./oilstation2.png" };
	}

	if (event === "gas" && depth === 2) {
		ScenarioContext.setScenarioContext("gas", 3);
		ScenarioContext.render();
		return { video: "./gas_3.webm", image: "./oilstation2.png" };
	}

	if (event === "gas" && depth === 3) {
		ScenarioContext.setScenarioContext("start", 0);
		ScenarioContext.render();
		return { video: "./start.webm", image: "./oilstation2.png" };
	}

	if (event === "leave" && depth === 1 && response === true) {
		ScenarioContext.setScenarioContext("leave", 2);
		ScenarioContext.render();
		return { video: "./leave_2.webm", image: "./oilstation2.png" };
	}

	if (event === "leave" && depth === 2) {
		ScenarioContext.setScenarioContext("leave", 3);
		ScenarioContext.render();
		return { video: "./leave_3.webm", image: "./oilstation2.png" };
	}

	if (event === "leave" && depth === 3) {
		ScenarioContext.setScenarioContext(0, 0);
		ScenarioContext.render();
		return { video: "./start.webm", image: "./oilstation2.png" };
	}

	if (event === "weather" && depth === 1 && response === "yes") {
		ScenarioContext.setScenarioContext("weather", 2);
		ScenarioContext.render();
		return { video: "./weather_2_yes.webm", image: "./oilstation2.png" };
	}

	if (event === "weather" && depth === 1 && response === "no") {
		ScenarioContext.setScenarioContext("weather", 2);
		ScenarioContext.render();
		return { video: "./weather_2_no.webm", image: "./oilstation2.png" };
	}

	if (event === "weather" && depth === 2) {
		ScenarioContext.setScenarioContext("start", 0);
		ScenarioContext.render();
		return { video: "./start.webm", image: "./oilstation2.png" };
	}

	if (event === "special" && depth === 1 && response === "yes") {
		ScenarioContext.setScenarioContext("special", 2);
		ScenarioContext.render();
		return { video: "./special_2_yes.webm", image: "./oilstation2.png" };
	}

	if (event === "special" && depth === 1 && response === "no") {
		ScenarioContext.setScenarioContext("start", 0);
		ScenarioContext.render();
		return { video: "./start.webm", image: "./oilstation2.png" };
	}

	if (event === 4 && depth === 2) {
		ScenarioContext.setScenarioContext("start", 0);
		ScenarioContext.render();
		return { video: "./start.webm", image: "./oilstation2.png" };
	}

	if (response === "sexy") {
		ScenarioContext.setScenarioContext("start", 0);
		ScenarioContext.render();
		return { video: "./sexy.webm", image: "./club.png" };
	} else {
		const array = ["fail1.webm", "fail2.webm"];
		const randomFail = array[Math.floor(Math.random() * array.length)];
		ScenarioContext.setScenarioContext("start", 0);
		ScenarioContext.render();
		return { video: randomFail, image: "./oilstation2.png" };
	}
};

export default generateResponse;
