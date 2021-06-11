import socketIOClient from 'socket.io-client';


let socket;
console.log(process.env.NODE_ENV )

if (!socket) {
    socket = socketIOClient('/', { transports: ['websocket']});
    console.log('socket connect', socket)
}


export default socket;
