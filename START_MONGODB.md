# How to Start MongoDB and Connect

## Quick Fix - Start MongoDB

### Method 1: Using MongoDB Compass (Easiest) ⭐

1. **Open MongoDB Compass** (you already have it installed)
2. **Click the "Connect" button** at the bottom
3. It will automatically start MongoDB if it's installed as a service
4. If it connects successfully, you're done! ✅
5. **Restart your backend server** (`npm start` in backend folder)

### Method 2: Start MongoDB Windows Service

1. **Open Command Prompt as Administrator**
   - Press `Win + X` → Select "Windows PowerShell (Admin)" or "Command Prompt (Admin)"

2. **Start MongoDB Service:**
   ```cmd
   net start MongoDB
   ```

3. **If service doesn't exist**, MongoDB might not be installed as a service. Try Method 3.

### Method 3: Install MongoDB Community Server

If MongoDB Compass doesn't start MongoDB automatically:

1. **Download MongoDB Community Server:**
   - Go to: https://www.mongodb.com/try/download/community
   - Select: Windows, MSI installer
   - Download and install

2. **During installation:**
   - Check "Install MongoDB as a Service"
   - Check "Run service as Network Service user"
   - Check "Install MongoDB Compass"

3. **After installation:**
   - MongoDB service should start automatically
   - Open MongoDB Compass and click "Connect"

### Method 4: Manual Start (If MongoDB is installed but service isn't running)

1. **Find MongoDB installation:**
   - Usually at: `C:\Program Files\MongoDB\Server\<version>\bin\`

2. **Create data directory:**
   ```cmd
   mkdir C:\data\db
   ```

3. **Start MongoDB manually:**
   ```cmd
   cd "C:\Program Files\MongoDB\Server\<version>\bin"
   mongod --dbpath "C:\data\db"
   ```
   (Keep this window open - MongoDB will run here)

### Method 5: Use MongoDB Atlas (Cloud - Free) ☁️

If you can't get local MongoDB working:

1. **Go to:** https://www.mongodb.com/cloud/atlas
2. **Create a free account**
3. **Create a free cluster** (takes 3-5 minutes)
4. **Get connection string:**
   - Click "Connect" → "Connect your application"
   - Copy the connection string
5. **Set environment variable:**
   ```powershell
   $env:MONGODB_URI="your-connection-string-here"
   ```
6. **Restart backend server**

## Verify MongoDB is Running

### Check in MongoDB Compass:
1. Open MongoDB Compass
2. Connection string: `mongodb://localhost:27017` or `mongodb://127.0.0.1:27017`
3. Click "Connect"
4. If it connects → MongoDB is running ✅

### Check via Command:
```powershell
Test-NetConnection -ComputerName localhost -Port 27017
```
If "TcpTestSucceeded : True" → MongoDB is running ✅

## After Starting MongoDB

1. **Restart your backend server:**
   ```cmd
   cd backend
   npm start
   ```

2. **You should see:**
   ```
   ✅ MongoDB Connected Successfully!
   📊 Database: buzzinga
   🚀 Socket server running on http://localhost:3000
   ```

## Troubleshooting

### Error: "Service name is invalid"
- MongoDB service is not installed
- Install MongoDB Community Server (Method 3)

### Error: "Access is denied"
- Run Command Prompt as Administrator

### MongoDB Compass shows "Cannot connect"
- MongoDB service is not running
- Try Method 2 to start the service

### Port 27017 already in use
- MongoDB is already running
- You're good to go! Just restart your backend server

## Need Help?

If none of these work, you can:
1. **Use MongoDB Atlas** (cloud - free, no installation needed)
2. **The app will work without MongoDB** - just login/session saving won't work

