require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // MongoDB connection string - default to localhost if not provided
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/buzzinga';
    
    const conn = await mongoose.connect(mongoURI, {
      // Remove deprecated options for newer mongoose versions
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;


