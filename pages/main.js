import React, {useState, useEffect, useRef} from 'react';
import AudioStreamer from '../lib/AudioHandler';

import ScenarioContext from '../contexts/ScenarioContext';
import generateResponse from '../lib/ResponseGenerator';

const Main = () => {

    const [recording, setRecording] = useState(false)
    const [videoUrl, setVideoUrl] = useState("")

    const [scenario, setScenario] = useState({})


    // useEffect( () => {
    //     const scenario = ScenarioContext.initialize()
    //     setScenario(scenario)
    //     setVideoUrl('./start.webm')
    // },[])

    ScenarioContext.render = () => {
        setScenario(ScenarioContext.getScenarioContext())
    }

    function initialize() {
        const scenario = ScenarioContext.initialize()
        setScenario(scenario)
        setVideoUrl('./start.webm')
    }

    function startRecording () {
        console.log('audio start recording...', scenario)
        setRecording(true)
        AudioStreamer.initRecording((data) => {
            const video = generateResponse(data, scenario)
            stop()
            setVideoUrl(video)
        }, (error) => {
            console.error('Error when recording', error);
            setRecording(false)
        });
    }

    function stop() {
        setRecording(false)
        AudioStreamer.stopRecording();
    }


    function getNextResponse() {
        console.log('getNextResponse')
        if (scenario.event === 'leave' && scenario.depth === 1) {
            /// do motion
        } else {
            startRecording()
        }
    }
    
  return (
      <div> 
        <button onClick={() => initialize()} >initialize </button>
    
        <div>
            <video width="1000px" height="1000px" key={videoUrl} src={videoUrl} onEnded={()=> getNextResponse()} controls autoPlay/>

         </div> 
    </div>
  );
};

export default Main;

