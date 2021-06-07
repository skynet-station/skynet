import socketIOClient from 'socket.io-client';

let socket;
if (!socket) {
    socket = socketIOClient('ws://localhost:3000', { transports: ['websocket']});
}
export default socket;
