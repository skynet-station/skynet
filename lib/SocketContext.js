import socketIOClient from 'socket.io-client';

let socket;

console.log(process.env.NODE_ENV )
let socketAddress = process.env.NODE_ENV === 'development' ?  'ws://localhost:3000' : 'wss://localhost:8443'

let options = process.env.NODE_ENV === 'development' ? 
            {
                transports: ['websocket'],
                secure: true, 
                reconnect: true, 
                rejectUnauthorized : false
            } 
            : 
            {
                transports: ['websocket'],
                secure: true, 
                reconnect: true, 
                rejectUnauthorized : false, 
                ca: fs.readFileSync("../cert.pem")
            }

console.log('options', options)
if (!socket) {
    socket = socketIOClient(socketAddress, options);
    console.log('socket connect', socket)
}


export default socket;
