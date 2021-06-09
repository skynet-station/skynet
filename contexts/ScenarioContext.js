

const scenario = {
    event: 'start',
    depth: 0
}

const initialize = () => {
    scenario.event = 'start'
    scenario.depth = 0
    return scenario
}

const getScenarioContext = () => {
    return scenario
}

const setScenarioContext = (event, depth) => {
    scenario.event = event
    scenario.depth = depth
}

const render = () => {}


export default {
    initialize, 
    getScenarioContext,
    setScenarioContext,
    render
}