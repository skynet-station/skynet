import socketIOClient from 'socket.io-client';

let socket;

let port = process.NODE_ENV === 'production' ? process.env.HTTPS_PORT : process.env.HTTP_PORT
if (!socket) {
    socket = socketIOClient(`ws://localhost:${port}`, { transports: ['websocket']});
    console.log('socket connect', socket)
}


export default socket;
