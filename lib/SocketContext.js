import socketIOClient from 'socket.io-client';

let socket;

console.log(process.env.NODE_ENV )
let socketAddress = process.env.NODE_ENV === 'development' ?  'ws://localhost:3000' : 'wss://localhost:8443'

if (!socket) {
    socket = socketIOClient(socketAddress, { transports: ['websocket'],secure: true, reconnect: true, rejectUnauthorized : false});
    console.log('socket connect', socket)
}


export default socket;
