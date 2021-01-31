import express from 'express';
import http from 'http';
import socketIo from 'socket.io';

import initializeListeners from './listeners';

const app = express();
const server = new http.Server(app);
const io = new socketIo.Server(server, {
	cors: {
		origin: '*'
	}
});

io.on('connection', (socket: any) => initializeListeners(io, socket));
server
	.listen(process.env.PORT || 4000)
	.on('listening', () => console.log('Running'));
