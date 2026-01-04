# Deployment Guide - Buzzinga 2.0

## Recommended: MongoDB Atlas (Cloud Database) ☁️

**Why MongoDB Atlas for deployment?**
- ✅ Works in both development and production
- ✅ No server management required
- ✅ Automatic backups and scaling
- ✅ Free tier available (512 MB storage)
- ✅ Secure cloud hosting
- ✅ Easy to configure for any hosting platform

---

## Step 1: Set Up MongoDB Atlas

### 1.1 Create Account and Cluster

1. **Sign up for MongoDB Atlas:**
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Sign up (free tier doesn't require credit card)

2. **Create a Free Cluster:**
   - Click "Build a Database"
   - Choose **FREE (M0)** tier
   - Select cloud provider (AWS, Google Cloud, or Azure)
   - Choose region closest to your users
   - Click "Create"

### 1.2 Configure Database Access

1. **Create Database User:**
   - Go to "Database Access" (left sidebar)
   - Click "Add New Database User"
   - Authentication Method: "Password"
   - Username: `buzzinga` (or your preferred username)
   - Password: Create a strong password (**save this!**)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

### 1.3 Configure Network Access

1. **Allow IP Addresses:**
   - Go to "Network Access" (left sidebar)
   - Click "Add IP Address"
   - For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
   - For production: Add your server's IP address (more secure)
   - Click "Confirm"

### 1.4 Get Connection String

1. **Get Connection String:**
   - Go to "Database" → Click "Connect"
   - Choose "Connect your application"
   - Driver: Node.js, Version: Latest
   - Copy the connection string
   - It looks like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

2. **Update Connection String:**
   - Replace `<username>` with your database username
   - Replace `<password>` with your database password (URL-encode special characters)
   - Add database name: Change `?retryWrites=true&w=majority` to `/buzzinga?retryWrites=true&w=majority`
   - Final format: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/buzzinga?retryWrites=true&w=majority`

---

## Step 2: Configure Environment Variables

### 2.1 Local Development Setup

1. **Create `.env` file in `backend/` directory:**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/buzzinga?retryWrites=true&w=majority
   PORT=3000
   ```

2. **The `.env` file is already in `.gitignore`** - it won't be committed to git.

3. **Start your server:**
   ```bash
   cd backend
   npm start
   ```

### 2.2 Production Deployment

Set the `MONGODB_URI` environment variable in your hosting platform:

**Common Platforms:**

#### Heroku
```bash
heroku config:set MONGODB_URI="mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/buzzinga?retryWrites=true&w=majority"
```

#### Railway
- Go to your project → Variables
- Add: `MONGODB_URI` = `mongodb+srv://...`

#### Vercel
- Go to project → Settings → Environment Variables
- Add: `MONGODB_URI` = `mongodb+srv://...`

#### Render
- Go to Environment → Environment Variables
- Add: `MONGODB_URI` = `mongodb+srv://...`

#### DigitalOcean App Platform
- Go to Settings → Environment Variables
- Add: `MONGODB_URI` = `mongodb+srv://...`

#### AWS/GCP/Azure
- Set environment variable in your deployment configuration
- Variable name: `MONGODB_URI`
- Value: Your MongoDB Atlas connection string

---

## Step 3: Deploy Your Backend

### 3.1 Prepare for Deployment

1. **Ensure your `package.json` has a start script:**
   ```json
   {
     "scripts": {
       "start": "node src/server.js"
     }
   }
   ```

2. **Make sure all dependencies are listed in `package.json`:**
   - dotenv (already installed ✅)
   - mongoose
   - express
   - socket.io
   - etc.

### 3.2 Deployment Platforms

#### Option A: Heroku

1. **Install Heroku CLI:**
   ```bash
   # Download from: https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Deploy:**
   ```bash
   cd backend
   heroku login
   heroku create buzzinga-backend
   heroku config:set MONGODB_URI="your-connection-string"
   git push heroku main
   ```

#### Option B: Railway

1. **Sign up:** https://railway.app
2. **New Project** → Deploy from GitHub
3. **Select your repository**
4. **Add Environment Variable:** `MONGODB_URI`
5. **Deploy automatically**

#### Option C: Render

1. **Sign up:** https://render.com
2. **New Web Service**
3. **Connect your GitHub repository**
4. **Settings:**
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
5. **Add Environment Variable:** `MONGODB_URI`
6. **Deploy**

#### Option D: Vercel (Serverless)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   cd backend
   vercel
   ```

---

## Step 4: Connect MongoDB Compass to Atlas

1. **Open MongoDB Compass**
2. **Paste your connection string** (with username and password)
3. **Click "Connect"**
4. ✅ You should see your `buzzinga` database

---

## Step 5: Verify Deployment

### Check Backend Logs

You should see:
```
✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
🚀 Socket server running on http://localhost:3000
```

### Test Connection

1. **Check if server is running:**
   ```bash
   curl https://your-backend-url.com/api/auth/login
   ```

2. **Test database connection:**
   - Register a user via API
   - Check MongoDB Atlas → Collections → users
   - You should see the new user document

---

## Security Best Practices

### Production Checklist

- ✅ Use environment variables (never commit `.env` files)
- ✅ Use strong database passwords
- ✅ Restrict network access in MongoDB Atlas (remove 0.0.0.0/0 if possible)
- ✅ Use HTTPS for your API
- ✅ Enable MongoDB Atlas authentication
- ✅ Regularly backup your database (Atlas has automatic backups)
- ✅ Monitor your database usage (stay within free tier limits)

### MongoDB Atlas Network Security

For production, update Network Access to only allow your server's IP:
1. Go to MongoDB Atlas → Network Access
2. Remove "Allow Access from Anywhere" (0.0.0.0/0)
3. Add your server's specific IP address
4. This prevents unauthorized access

---

## Troubleshooting

### Connection Timeout

- Check if your server's IP is allowed in MongoDB Atlas Network Access
- Verify connection string is correct
- Check if password has special characters (URL encode them)

### Authentication Failed

- Verify username and password in connection string
- Check if database user has proper privileges
- Ensure password doesn't have unencoded special characters

### Database Not Found

- The database `buzzinga` will be created automatically on first connection
- Or create it manually in MongoDB Atlas

### Port Issues

- Make sure your hosting platform allows port 3000
- Some platforms use `PORT` environment variable automatically
- Update your code to use `process.env.PORT || 3000`

---

## Quick Reference

### Connection String Format

**Local:**
```
mongodb://localhost:27017/buzzinga
```

**MongoDB Atlas:**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/buzzinga?retryWrites=true&w=majority
```

### Environment Variables

```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/buzzinga?retryWrites=true&w=majority
PORT=3000
```

### Files Structure

```
backend/
├── .env                 # Local environment variables (NOT in git)
├── .env.example         # Example file (in git)
├── .gitignore          # Excludes .env
├── src/
│   └── config/
│       └── database.js  # Uses process.env.MONGODB_URI
└── package.json
```

---

## Next Steps

1. ✅ Set up MongoDB Atlas cluster
2. ✅ Create `.env` file with connection string
3. ✅ Test locally
4. ✅ Deploy backend to your chosen platform
5. ✅ Set `MONGODB_URI` in hosting platform
6. ✅ Verify deployment

**Your app is now ready for production! 🚀**

