

module.exports = function (http) {
	io = require('socket.io')(http);

	io.on('connection', (socket) => {
		console.log(new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" }), 'a user connected.', "connected clients", io.engine.clientsCount, socket.id);

		socket.on('stt', async req => {
			console.log("mov_make", req);
			
		});
	});

	return io;
}