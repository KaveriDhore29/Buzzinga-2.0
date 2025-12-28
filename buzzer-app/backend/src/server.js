const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// In-memory room store
const rooms = {};

io.on('connection', socket => {
  console.log('Client connected:', socket.id);

  socket.on('join-room', ({ roomId, name, role }) => {
    socket.join(roomId);

    if (!rooms[roomId]) {
      rooms[roomId] = {
        members: [],
        buzzes: []
      };
    }

    rooms[roomId].members.push({
      id: socket.id,
      name,
      role
    });

    io.to(roomId).emit('members-updated', rooms[roomId].members);
  });

  socket.on('buzz', ({ roomId, name }) => {
    const time = new Date().toLocaleTimeString();

    const buzzData = { name, time };
    rooms[roomId].buzzes.push(buzzData);

    io.to(roomId).emit('buzzed', buzzData);
  });

  socket.on('disconnecting', () => {
    for (const roomId of socket.rooms) {
      if (rooms[roomId]) {
        rooms[roomId].members =
          rooms[roomId].members.filter(m => m.id !== socket.id);

        io.to(roomId).emit('members-updated', rooms[roomId].members);
      }
    }
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`🚀 Socket server running on http://localhost:${PORT}`);
});
