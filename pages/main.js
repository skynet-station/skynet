import React, {useState, useEffect, useRef} from 'react';
import AudioStreamer from '../lib/AudioHandler';

const Main = () => {

    const [recording, setRecording] = useState(false)
    const [videoUrl, setVideoUrl] = useState("")

    function startRecording () {
        setRecording(true)
        AudioStreamer.initRecording((data) => {
           setVideoUrl(data)
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
        <div>
            <video width="1000px" height="1000px" key={videoUrl} src={videoUrl} controls autoPlay/>

         </div> 
    </div>
  );
};

export default Main;

