const keywords = require('./keywords')

const SpeechToEventMap = (speechData) => {
    
    let speech = speechData.results[0].alternatives[0].transcript
    let test = speechData.results[0].alternatives[0].words
    console.log('speech data', speech)
    let keywordDict = keywords

    function analyzeSpeech () {
        words = speech.split(" ")

        let event = 'onUnderstandFail';

        for (let word of words) {
            if (word in keywordDict) {
                event = keywordDict[word]
                break
            }
        }

        console.log('event', event)

        return event
    }

    return {
        analyzeSpeech
    }


}


module.exports = SpeechToEventMap