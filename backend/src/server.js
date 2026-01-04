const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/database');

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/sessions', require('./routes/sessions'));

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

  socket.on('join-room', ({ roomId, name, role, maxPlayers, sessionTime, sessionName }) => {
    socket.join(roomId);

    if (!rooms[roomId]) {
      // Room doesn't exist, create it (owner creating room)
      const sessionTimeNum = sessionTime ? parseInt(sessionTime) : null;
      const sessionTimeMs = sessionTimeNum && !isNaN(sessionTimeNum) ? sessionTimeNum * 60 * 1000 : null; // Convert minutes to milliseconds
      rooms[roomId] = {
        members: [],
        buzzes: [],
        maxPlayers: maxPlayers ? parseInt(maxPlayers) : null,
        sessionTime: sessionTimeNum && !isNaN(sessionTimeNum) ? sessionTimeNum : null, // in minutes
        sessionStartTime: Date.now(),
        sessionEndTime: sessionTimeMs ? Date.now() + sessionTimeMs : null,
        ownerSocketId: socket.id,
        sessionName: sessionName || null
      };

      // Start session timer if sessionTime is provided
      if (sessionTimeMs) {
        setTimeout(() => {
          if (rooms[roomId]) {
            io.to(roomId).emit('session-ended');
            console.log(`Session ended for room ${roomId}`);
          }
        }, sessionTimeMs);
      }
    } else {
      // Room exists, check if it's full
      const currentMemberCount = rooms[roomId].members.length;
      const maxPlayersLimit = rooms[roomId].maxPlayers;
      
      // Check if user is already a member (rejoining)
      const existingMemberIndex = rooms[roomId].members.findIndex(m => m.id === socket.id);
      const isRejoining = existingMemberIndex !== -1;

      // If room is full and user is not rejoining, reject
      if (maxPlayersLimit && currentMemberCount >= maxPlayersLimit && !isRejoining) {
        socket.emit('room-full', { message: 'Room is full. Maximum players reached.' });
        socket.leave(roomId);
        console.log(`Join rejected: Room ${roomId} is full (${currentMemberCount}/${maxPlayersLimit})`);
        return;
      }
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

    // Send room info to the newly joined user
    socket.emit('buzz-history', rooms[roomId].buzzes);
    socket.emit('room-info', {
      maxPlayers: rooms[roomId].maxPlayers,
      sessionTime: rooms[roomId].sessionTime,
      sessionEndTime: rooms[roomId].sessionEndTime,
      currentMembers: rooms[roomId].members.length,
      sessionName: rooms[roomId].sessionName
    });

    // Update members list for everyone
    io.to(roomId).emit('members-updated', rooms[roomId].members);
  });

  socket.on('buzz', ({ roomId, name }) => {
    if (!rooms[roomId]) {
      console.log(`Buzz rejected: Room ${roomId} does not exist`);
      socket.emit('error', { message: 'Room does not exist' });
      return;
    }

    // Check if session has ended
    if (rooms[roomId].sessionEndTime && Date.now() > rooms[roomId].sessionEndTime) {
      socket.emit('error', { message: 'Session has ended' });
      console.log(`Buzz rejected: Session ended for room ${roomId}`);
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

  // Handle timer update requests
  socket.on('get-room-info', ({ roomId }) => {
    if (rooms[roomId]) {
      socket.emit('room-info', {
        maxPlayers: rooms[roomId].maxPlayers,
        sessionTime: rooms[roomId].sessionTime,
        sessionEndTime: rooms[roomId].sessionEndTime,
        currentMembers: rooms[roomId].members.length,
        sessionName: rooms[roomId].sessionName
      });
    }
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
