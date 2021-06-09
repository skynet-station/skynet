

const ResponseGenerator = (eventType) => {


    const EVENT_DRIVEN_RESPONSE = {
        onDriverArrive: getDriverArriveResponse,
        onGetGas: getGasResponse,
        onDriverLeave: getDriverLeaveResponse,
        onWeatherAsk: getWeatherAskResponse,
        onUnderstandFail: getUnderstandFailResponse,
        onEventAsk: getEventResponse, 

    }

    function getDriverArriveResponse (nthInteraction) {
        return ''
    }

    function getGasResponse (nthInteraction) {
        const options = {
            1: './video_assets/onGetGas_1.webm',
            2: './video_assets/onGetGas_2.mp4',
            3: './video_assets/onGetGas_3.mp4',

        }

        return options[nthInteraction]

    }

    function getDriverLeaveResponse(nthInteraction) {
        return ''
    }

    function getWeatherAskResponse (nthInteraction) {
        return ''
    }

    function getUnderstandFailResponse(nthInteraction) {
        return ''
    }

    function getEventResponse(nthInteraction) {
        return ''
    }


    function generateResponse (nthInteraction) {
        return EVENT_DRIVEN_RESPONSE[eventType](nthInteraction)
    }

    return {
        generateResponse
    }

}

module.exports = ResponseGenerator;