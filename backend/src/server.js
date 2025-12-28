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
  // console.log(socket);
  console.log('Client connected:', socket.id);

  socket.on('join-room', ({ roomId, name, role }) => {
    socket.join(roomId);

    if (!rooms[roomId]) {
      rooms[roomId] = {
        members: [],
        buzzes: []
      };
    }

    // Check if member already exists (prevent duplicate entries on rejoin)
    const existingMemberIndex = rooms[roomId].members.findIndex(m => m.id === socket.id);
    if (existingMemberIndex === -1) {
      rooms[roomId].members.push({
        id: socket.id,
        name,
        role
      });
    } else {
      // Update existing member info
      rooms[roomId].members[existingMemberIndex] = { id: socket.id, name, role };
    }

    // Send existing buzzes to the newly joined user
    socket.emit('buzz-history', rooms[roomId].buzzes);

    // Update members list for everyone
    io.to(roomId).emit('members-updated', rooms[roomId].members);
  });

  socket.on('buzz', ({ roomId, name }) => {
    if (!rooms[roomId]) {
      console.log(`Buzz rejected: Room ${roomId} does not exist`);
      return;
    }

    const time = new Date().toLocaleTimeString();
    const buzzData = { name, time };
    
    // Add buzz to room history
    rooms[roomId].buzzes.push(buzzData);

    // Emit single buzz update to all clients in room
    io.to(roomId).emit('buzz-update', buzzData);
    
    console.log(`Buzz from ${name} in room ${roomId} at ${time}`);
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
