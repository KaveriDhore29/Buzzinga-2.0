# MongoDB Setup Guide for Buzzinga 2.0

## Prerequisites
- MongoDB Compass installed
- MongoDB server running (default: `mongodb://localhost:27017`)

## Setup Steps

### 1. Start MongoDB Server

**Option A: Using MongoDB Compass**
- Open MongoDB Compass
- Connect to `mongodb://localhost:27017` (default connection)
- If you need to start MongoDB service, use the MongoDB service manager

**Option B: Using Command Line**
```bash
# Windows (if MongoDB is installed as a service)
net start MongoDB

# Or start MongoDB manually
mongod --dbpath "C:\data\db"
```

### 2. Create Database

The application will automatically create a database named `buzzinga` when you first run the server.

**Or manually in MongoDB Compass:**
1. Connect to your MongoDB instance
2. Click "Create Database"
3. Database Name: `buzzinga`
4. Collection Name: `users` (will be created automatically)

### 3. Update Connection String (Optional)

If your MongoDB is running on a different host/port, update `backend/src/config/database.js`:

```javascript
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/buzzinga';
```

Or set environment variable:
```bash
# Windows PowerShell
$env:MONGODB_URI="mongodb://your-host:27017/buzzinga"

# Windows CMD
set MONGODB_URI=mongodb://your-host:27017/buzzinga
```

### 4. Start the Backend Server

```bash
cd backend
npm start
```

You should see:
```
✅ MongoDB Connected: localhost
🚀 Socket server running on http://localhost:3000
```

### 5. Test the API

**Register a new user:**
```bash
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
```

**Login:**
```bash
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique, lowercase),
  password: String (required, hashed),
  createdAt: Date,
  updatedAt: Date
}
```

## Using MongoDB Shell (mongosh)

### Installation

**Option 1: Install MongoDB Community Server (includes mongosh)**
1. Download from: https://www.mongodb.com/try/download/community
2. Select: Windows, MSI installer
3. During installation, check "Install MongoDB as a Service"
4. `mongosh` will be included and added to PATH

**Option 2: Install MongoDB Shell Only**
1. Download MongoDB Shell: https://www.mongodb.com/try/download/shell
2. Extract to a folder (e.g., `C:\Program Files\MongoDB\Shell`)
3. Add to PATH:
   ```powershell
   # PowerShell (run as Administrator)
   [Environment]::SetEnvironmentVariable("Path", $env:Path + ";C:\Program Files\MongoDB\Shell\bin", "Machine")
   ```
4. Restart terminal and run: `mongosh`

### Using mongosh

Connect to local MongoDB:
```bash
mongosh mongodb://localhost:27017
```

Or connect to your database directly:
```bash
mongosh mongodb://localhost:27017/buzzinga
```

Common commands:
```javascript
// Show databases
show dbs

// Use a database
use buzzinga

// Show collections
show collections

// Query users
db.users.find()

// Count documents
db.users.countDocuments()
```

**Note:** If `mongosh` is not available, you can use MongoDB Compass (GUI) instead for all database operations.

## Troubleshooting

### Connection Error
- Make sure MongoDB server is running
- Check if port 27017 is not blocked
- Verify connection string in `database.js`

### mongosh: command not found
- MongoDB Shell is not installed or not in PATH
- Install MongoDB Community Server (includes mongosh)
- Or use MongoDB Compass GUI instead
- See "Using MongoDB Shell (mongosh)" section above

### Authentication Error
- Check if user exists in database
- Verify password is correct
- Check JWT secret in `routes/auth.js`

### Port Already in Use
- Change PORT in `server.js` if 3000 is taken
- Update frontend API URL in `auth.service.ts` accordingly

