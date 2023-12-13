const { Socket } = require('dgram');
const express = require('express');
const { createServer } = require('http');
const { join } = require('path');
const Server = require('socket.io');

const app = express();
const server = createServer(app);
const io = Server(server);
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/public/index.html');
});
const clients = {};
io.on('connection', (socket) => {
	console.log(socket.id);
	socket.emit('today', new Date().toUTCString());

	// console.log('User connected', socket.id);

	socket.on('clientmassage', (data) => {
		console.log(socket);
		io.emit('serverMessage', data);
	});
	socket.on('typing', (data) => {
		io.emit('typing', data);
	});
	socket.on('notTyping', (data) => {
		io.emit('notTyping', data);
	});
	socket.on('join', (username, phoneNum, roomId) => {
		if (clients[socket.id]) {
			socket.leave(clients[socket.id].roomId);
		}
		socket.join(roomId);
		clients[socket.id] = { username, phoneNum, roomId };
		io.to(roomId).emit('Message', `${username}, ${phoneNum} ,${roomId}`);
	});
	// socket.join('chatRoom');
	// clients[socket.id]= {}

	socket.on('disconnect', () => {
		console.log('User disconnect');
	});
});

server.listen(3000, () => {
	console.log('chatt started');
});
