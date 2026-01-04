const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  roomId: {
    type: String,
    required: true
  },
  sessionName: {
    type: String,
    required: true,
    trim: true
  },
  maxPlayers: {
    type: Number,
    default: null
  },
  sessionTime: {
    type: Number, // in minutes
    default: null
  },
  language: {
    type: String,
    default: 'English'
  },
  buzzes: [{
    name: String,
    time: String
  }],
  members: [{
    id: String,
    name: String,
    role: String
  }],
  startedAt: {
    type: Date,
    default: Date.now
  },
  endedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Index for faster queries
sessionSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Session', sessionSchema);

