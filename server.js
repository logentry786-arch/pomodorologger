const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app); // <-- Create the server here
const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: "*", // Allow all connections (you can restrict this later)
    methods: ["GET", "POST"]
  }
});

const roomName = 'posture_room';

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);

  socket.on('join_room', (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room ${room}`);
    // Notify others in the room
    socket.to(room).emit('user_joined');
  });

  socket.on('message', (msg, room) => {
    // Broadcast the message to everyone else in the room
    console.log(`Message from ${socket.id} in room ${room}`);
    socket.to(room).emit('message', msg);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected', socket.id);
  });
});

const port = process.env.PORT || 3000;

//
// ▼▼▼ THIS IS THE FIX ▼▼▼
//
server.listen(port, () => { // <-- It should be server.listen, not http.listen
  console.log(`Server listening on port ${port}`);
});
