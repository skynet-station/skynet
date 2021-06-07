
const {startStreamRecognition, stopStreamRecognition, receiveAudioData} = require('./stt')


module.exports = function (http) {
	io = require('socket.io')(http);

	io.on('connection', (socket) => {
		console.log(new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" }), 'a user connected.', "connected clients", io.engine.clientsCount, socket.id);

		socket.on('startStream', function() {
			console.log('starting recognition')
			startStreamRecognition(socket);
		});

		// Receive audio data
		socket.on('getAudioData', function(data) {
			receiveAudioData(data);
		});

		// End the audio stream
		socket.on('endStream', function() {
			stopStreamRecognition();	
		});
	});

	return io;
}