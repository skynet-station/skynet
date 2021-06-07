const speech = require('@google-cloud/speech');


console.log(process.env.GOOGLE_APPLICATION_CREDENTIALS)

let speechClient = new speech.SpeechClient({
  credentials: require(process.env.GOOGLE_APPLICATION_CREDENTIALS)
});


let options = {
  config: {
      encoding: 'LINEAR16',
      sampleRateHertz: 16000,
      languageCode: 'ko',
      profanityFilter: false,
      enableWordTimeOffsets: true
  },
  interimResults: false // If you want interim results, set this to true
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
          client.emit('speechData', data);
          // if end of utterance, let's restart stream
          // this is a small hack. After 65 seconds of silence, the stream will still throw an error for speech length limit
          if (data.results[0] && data.results[0].isFinal) {
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