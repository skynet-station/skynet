 import React, {useState, useEffect, useRef} from 'react';
 import socketIOClient from 'socket.io-client';


const Main = () => {
    let socket;

    const [audio, setAudio] = useState(null)
    const audioRef = useRef()


    useEffect(() => {
        socket = socketIOClient('ws://localhost:3000', { transports: ['websocket']});
    },[])

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({video: false, audio: true}).then(stream => {
            const recorder = new MediaRecorder(stream);

        // fires every one second and passes an BlobEvent
            recorder.ondataavailable = event => {

                // get the Blob from the event
                const blob = event.data;
                socket.emit('stt', blob)

                // and send that blob to the server...
            };

            // make data available event fire every one second
            recorder.start(1000);
        }).catch(e => console.log(e));
    }, [])

        


  return (
      <div> 
        <audio style={{position: 'absolute', right: 0, bottom:'20%',transform:"scale(-1,1)"}}
            width={'120px'}
            height={'120px'}
            ref={audioRef}
            id={"audio"}
            autoPlay
        />
    </div>
  );
};

export default Main;