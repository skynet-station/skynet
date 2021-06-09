import ScenarioContext from "../contexts/ScenarioContext"


const generateResponse = (response, scenario) => {
    const event = scenario.event
    const depth = scenario.depth

    if (event === 'start' && depth === 0 && response === 'gas') {
        ScenarioContext.setScenarioContext('gas', 1)
        ScenarioContext.render()
        return './gas_1.webm'
    }

    if (event === 'start' && depth === 0 && response === 'leave') {
        ScenarioContext.setScenarioContext('leave', 1)
        ScenarioContext.render()
        return './leave_1.webm'
    }

    if (event === 'start' && depth === 0 && response === 'weather') {
        ScenarioContext.setScenarioContext('weather', 1)
        ScenarioContext.render()
        return './weather_1.webm'
    }

    if (event === 'start' && depth === 0 && response === 'special') {
        ScenarioContext.setScenarioContext('special', 1)
        ScenarioContext.render()
        return './special_1.webm'
    }

    if (event === 'start' && depth === 0 && response === 'start') {
        ScenarioContext.render()
        return './start.webm'
    }


    if (event === 'gas' && depth === 1 && response === 'yes') {
        ScenarioContext.setScenarioContext('gas', 2)
        ScenarioContext.render()
        return './gas_2_yes.webm'
    }

    if (event === 'gas' && depth === 1 && response === 'no') {
        ScenarioContext.setScenarioContext('start', 0)
        ScenarioContext.render()
        return './start.webm'
    }

    if (event === 'gas' && depth === 2 ) {
        ScenarioContext.setScenarioContext('gas',3)
        ScenarioContext.render()
        return './gas_3.webm'
    }

    if (event === 'gas' && depth === 3) {
        ScenarioContext.setScenarioContext('start', 0)
        ScenarioContext.render()
        return './start.webm'
    }

    if (event === 'leave' && depth === 1 && response===true) {
        ScenarioContext.setScenarioContext('leave',2)
        ScenarioContext.render()
        return './leave_2.webm'
    }

    if (event === 'leave' && depth === 2) {
        ScenarioContext.setScenarioContext('leave',3)
        ScenarioContext.render()
        return './leave_3.webm'
    }

    if (event === 'leave' && depth === 3) {
        ScenarioContext.setScenarioContext(0,0)
        ScenarioContext.render()
        return './start.webm'
    }

    if (event === 'weather' && depth === 1 && response === 'yes') {
        ScenarioContext.setScenarioContext('weather',2)
        ScenarioContext.render()
        return './weather_2_yes.webm'
    }
    
    if (event === 'weather' && depth === 1 && response === 'no') {
        ScenarioContext.setScenarioContext('weather',2)
        ScenarioContext.render()
        return './weather_2_no.webm'
    }

    if (event === 'weather' && depth === 2) {
        ScenarioContext.setScenarioContext('start', 0)
        ScenarioContext.render()
        return './start.webm'
    }

    if (event === 'special' && depth === 1 && response === 'yes') {
        ScenarioContext.setScenarioContext('special', 2)
        ScenarioContext.render()
        return './special_2_yes.webm'
    }

    if (event === 'special' && depth === 1 && response === 'no') {
        ScenarioContext.setScenarioContext('start', 0)
        ScenarioContext.render()
        return './start.webm'
    }


    if (event === 4 && depth === 2) {
        ScenarioContext.setScenarioContext('start', 0)
        ScenarioContext.render()
        return './start.webm'
    }

    else {
        const array = ['fail1.webm', 'fail2.webm']
        const randomFail = array[Math.floor(Math.random() * array.length)];
        ScenarioContext.setScenarioContext('start', 0)
        ScenarioContext.render()
        return randomFail
    }


}

export default generateResponse;