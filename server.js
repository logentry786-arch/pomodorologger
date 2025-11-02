const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: { origin: "*" }
});

io.on('connection', socket => {
    console.log('A user connected:', socket.id);

    socket.on('join_room', (roomName) => {
        socket.join(roomName);
        console.log(`${socket.id} joined room: ${roomName}`);

        // Notify ALL in room (including self)
        io.to(roomName).emit('user_joined');
    });

    socket.on('message', (message, roomName) => {
        console.log(`RELAY [${message.type}] from ${socket.id} → ${roomName}`);
        socket.to(roomName).emit('message', message);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const port = process.env.PORT || 3000;
http.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});