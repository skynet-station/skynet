const speech = require('@google-cloud/speech');
const speechToEventMap = require('./chatbot/keywords/speechKeywords')


let speechClient = new speech.SpeechClient({
  credentials: require(process.env.GOOGLE_APPLICATION_CREDENTIALS)
});

console.log(Object.keys(speechToEventMap))
const speechContextsElement = {
  phrases: Object.entries(speechToEventMap),
  boost: 20.0,
};

let options = {
  config: {
      encoding: 'LINEAR16',
      sampleRateHertz: 16000,
      languageCode: 'ko',
      profanityFilter: false,
      enableWordTimeOffsets: false,
      speechContexts: [speechContextsElement],

  },
  interimResults: true, // If you want interim results, set this to true
  single_utterance : true,//indicates whether this request should automatically end after speech is no longer detected. If set, Speech-to-Text will detect pauses, silence, or non-speech audio to determine when to end recognition.
  silenceThreshold : 1000 //ms
}

let recognizeStream = null;

function startStreamRecognition (client) {
  recognizeStream = speechClient.streamingRecognize(options)
      .on('error', (err) => {
        console.log(err)
        console.error('Error when processing audio: ' + (err && err.code ? 'Code: ' + err.code + ' ' : '') + (err && err.details ? err.details : ''));
        client.emit('googleCloudStreamError', err);
        stopStreamRecognition();
      })
      .on('data', (data) => {
        console.log(data.results[0].alternatives[0].transcript)
        let detected = findKeyword(data.results[0].alternatives[0].transcript)
        console.log('detecetd', detected)
          if (detected.found) {
              const response  = detected.eventName
              console.log('immediately send to client as word detected', response, data.results[0].alternatives[0].transcript)
              client.emit('response', response);
          }
  
          // if end of utterance, let's restart stream
          // this is a small hack. After 65 seconds of silence, the stream will still throw an error for speech length limit
          else if (data.results[0] && data.results[0].isFinal) {
              console.log('hi')
              const response  = processSpeechData(data)
              client.emit('response', response)
              stopStreamRecognition();
              startStreamRecognition(client);
              // console.log('restarted stream serverside');
          }
      });
}

function stopStreamRecognition () {
  if (recognizeStream) {

    recognizeStream.end();
  }
  recognizeStream = null;
}

function receiveAudioData (data) {
  if (recognizeStream) {
    recognizeStream.write(data);
  }
}


module.exports = {
  startStreamRecognition, stopStreamRecognition, receiveAudioData
}

function findKeyword (speech) {
  const keywords = speechToEventMap
  let found = false
  let eventName = null

  for (const [key, value] of Object.entries(keywords)) {
      const regex = new RegExp(key,"g")
      found = speech.match(regex)
      if (found) {
        eventName = value
        found = true
        return {found,eventName}
      }
  }

  return {found,eventName}
}

function processSpeechData (speechData) {
  const speech = speechData.results[0].alternatives[0].transcript
  const keywords = speechToEventMap

  for (const [key, value] of Object.entries(keywords)) {
      const regex = new RegExp(key,"g")
      const found = speech.match(regex)
      if (found) {
          return value
      }
  }

  return 'fail'

}
