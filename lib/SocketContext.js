import socketIOClient from 'socket.io-client';

let socket;

console.log(process.env.NODE_ENV )
let socketAddress = process.env.NODE_ENV === 'development' ?  'ws://localhost:3000' : 'wss://localhost:3000'

if (!socket) {
    socket = socketIOClient(socketAddress, { transports: ['websocket']});
    console.log('socket connect', socket)
}


export default socket;
