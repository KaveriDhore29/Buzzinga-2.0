# MongoDB Connection Issue - Quick Fix Guide

## Problem
MongoDB Compass cannot connect because **MongoDB server is not installed or not running**.

## Solution Options

### ✅ Option 1: Install MongoDB Community Server (Recommended for Local Development)

1. **Download MongoDB Community Server:**
   - Go to: https://www.mongodb.com/try/download/community
   - Select:
     - Version: Latest stable (e.g., 7.0.x)
     - Platform: Windows
     - Package: MSI

2. **Install MongoDB:**
   - Run the downloaded MSI installer
   - **IMPORTANT:** During installation, make sure to check:
     - ✅ "Install MongoDB as a Service"
     - ✅ "Run service as Network Service user"
     - ✅ "Install MongoDB Compass" (optional, you already have it)

3. **Verify Installation:**
   ```powershell
   # Check if MongoDB service is running
   Get-Service -Name "MongoDB"
   
   # If not running, start it (run PowerShell as Administrator)
   Start-Service -Name "MongoDB"
   ```

4. **Connect with MongoDB Compass:**
   - Open MongoDB Compass
   - Connection string: `mongodb://localhost:27017`
   - Click "Connect"
   - ✅ Should connect successfully!

5. **Test your backend:**
   ```bash
   cd backend
   npm start
   ```
   You should see: `✅ MongoDB Connected: localhost`

---

### ☁️ Option 2: Use MongoDB Atlas (Cloud - Easiest, No Installation)

This is the **fastest** solution and doesn't require installing anything locally.

1. **Create MongoDB Atlas Account:**
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Sign up for free (no credit card required for free tier)

2. **Create a Free Cluster:**
   - Click "Build a Database"
   - Choose "FREE" (M0) tier
   - Select a cloud provider and region (closest to you)
   - Click "Create"

3. **Set Up Database Access:**
   - Go to "Database Access" (left sidebar)
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `buzzinga` (or any username)
   - Password: Create a strong password (save it!)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

4. **Set Up Network Access:**
   - Go to "Network Access" (left sidebar)
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (or add your current IP)
   - Click "Confirm"

5. **Get Connection String:**
   - Go to "Database" → Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`)

6. **Update Your Connection String:**
   - Replace `<username>` with your database username
   - Replace `<password>` with your database password
   - Add database name at the end: `...mongodb.net/buzzinga?retryWrites=true&w=majority`

7. **Set Environment Variable:**
   ```powershell
   # In PowerShell (backend directory)
   $env:MONGODB_URI="mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/buzzinga?retryWrites=true&w=majority"
   ```

8. **Or create a .env file in backend folder:**
   Create `backend/.env`:
   ```
   MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/buzzinga?retryWrites=true&w=majority
   ```

9. **Update database.js to use .env:**
   You may need to install `dotenv`:
   ```bash
   cd backend
   npm install dotenv
   ```
   Then add to the top of `backend/src/config/database.js`:
   ```javascript
   require('dotenv').config();
   ```

10. **Connect with MongoDB Compass:**
    - Open MongoDB Compass
    - Paste your full connection string (with username and password)
    - Click "Connect"
    - ✅ Should connect successfully!

---

## Quick Diagnostic Commands

Run these in PowerShell to check MongoDB status:

```powershell
# Check if MongoDB service exists
Get-Service -Name "MongoDB"

# Check if port 27017 is accessible
Test-NetConnection -ComputerName localhost -Port 27017

# Check if mongod process is running
Get-Process -Name "mongod" -ErrorAction SilentlyContinue
```

---

## After Fixing Connection

Once MongoDB is connected, restart your backend server:

```bash
cd backend
npm start
```

You should see:
```
✅ MongoDB Connected: localhost
🚀 Socket server running on http://localhost:3000
```

---

## Need Help?

- **For local MongoDB:** See `MONGODB_SETUP.md`
- **For MongoDB Atlas:** See official docs at https://docs.atlas.mongodb.com/
- **Run diagnostic script:** `.\start-mongodb.ps1` (in project root)

