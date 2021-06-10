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
      <div style={{height: '100vh'}}>
          <div style={{display: !!videoUrl ? 'none' : 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
            <button onClick={() => initialize()} 
            style={{width: '10vw', height: '6vw', left: '45vw', top: '47vh', cursor: 'pointer', backgroundColor: 'dodgerblue', color: 'white', fontWeight: 'bold', border: 'none', boxShadow: '0px 1px 10px 3px grey', borderRadius:'10px'}} >
                시작하기 
            </button>
            <div style={{textAlign: 'center', color: 'grey'}}>
                <p>시작하기 전에 마이크와 카메라 기능을 켜놓았는지 확인해주세요!</p>
            </div>
          </div>
    
        <video style={{display: !!videoUrl ? 'block' : 'none'}} height="100%" key={videoUrl} src={videoUrl} onEnded={()=> getNextResponse()} autoPlay/>
      </div>
  );
};

export default Main;

