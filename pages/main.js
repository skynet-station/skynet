import React, {useState, useEffect, useRef} from 'react';
import AudioStreamer from '../lib/AudioHandler';

const Main = () => {

    const [recording, setRecording] = useState(false)
    const [text, setText] = useState("")

    function startRecording () {
        setRecording(true)
        AudioStreamer.initRecording((data) => {
           setText(data.results[0].alternatives[0].transcript)
        }, (error) => {
            console.error('Error when recording', error);
            setRecording(false)
        });
    }

    function stop() {
        setRecording(false)
        AudioStreamer.stopRecording();
    }
    
  return (
      <div> 
        <button onClick={() => startRecording()}> Start Recording </button>
        <button onClick={() => stop()}> End Recording </button>
        <h1> {text} </h1>
    </div>
  );
};

export default Main;

