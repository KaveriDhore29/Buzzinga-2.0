const express = require('express');
const router = express.Router();
const Session = require('../models/Session');
const jwt = require('jsonwebtoken');

// JWT Secret (should match auth.js)
const JWT_SECRET = process.env.JWT_SECRET || 'buzzinga_secret_key_change_in_production';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer token

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No token provided'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

// Save a session
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { roomId, sessionName, maxPlayers, sessionTime, language, buzzes, members } = req.body;

    // Validation
    if (!roomId || !sessionName) {
      return res.status(400).json({
        success: false,
        message: 'Room ID and session name are required'
      });
    }

    // Create new session
    const session = new Session({
      userId: req.userId,
      roomId,
      sessionName,
      maxPlayers: maxPlayers || null,
      sessionTime: sessionTime || null,
      language: language || 'English',
      buzzes: buzzes || [],
      members: members || [],
      startedAt: new Date(),
      endedAt: null
    });

    await session.save();

    res.status(201).json({
      success: true,
      message: 'Session saved successfully',
      session: {
        id: session._id,
        roomId: session.roomId,
        sessionName: session.sessionName,
        createdAt: session.createdAt
      }
    });
  } catch (error) {
    console.error('Save session error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while saving session',
      error: error.message
    });
  }
});

// Get all sessions for the authenticated user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.userId })
      .sort({ createdAt: -1 }) // Most recent first
      .select('-__v')
      .lean();

    res.json({
      success: true,
      sessions: sessions.map(session => ({
        id: session._id,
        roomId: session.roomId,
        sessionName: session.sessionName,
        maxPlayers: session.maxPlayers,
        sessionTime: session.sessionTime,
        language: session.language,
        buzzes: session.buzzes,
        members: session.members,
        startedAt: session.startedAt,
        endedAt: session.endedAt,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt
      }))
    });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching sessions',
      error: error.message
    });
  }
});

// Get a single session by ID (only if it belongs to the user)
router.get('/:sessionId', authenticateToken, async (req, res) => {
  try {
    const session = await Session.findOne({
      _id: req.params.sessionId,
      userId: req.userId
    }).lean();

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    res.json({
      success: true,
      session: {
        id: session._id,
        roomId: session.roomId,
        sessionName: session.sessionName,
        maxPlayers: session.maxPlayers,
        sessionTime: session.sessionTime,
        language: session.language,
        buzzes: session.buzzes,
        members: session.members,
        startedAt: session.startedAt,
        endedAt: session.endedAt,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt
      }
    });
  } catch (error) {
    console.error('Get session error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching session',
      error: error.message
    });
  }
});

module.exports = router;

