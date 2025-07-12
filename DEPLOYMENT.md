 # 🚀 Deployment Guide for eFootball League Tracker

This guide will help you deploy the eFootball League Tracker application with a MongoDB database.

## 📋 Prerequisites

1. **MongoDB Database** (MongoDB Atlas recommended)
2. **GitHub Account**
3. **Deployment Platform Account** (Render, Railway, or Heroku)

## 🗄️ Step 1: Set Up MongoDB Database

### Option A: MongoDB Atlas (Recommended)

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account

2. **Create a Cluster**
   - Click "Build a Database"
   - Choose "FREE" tier (M0)
   - Select your preferred cloud provider and region
   - Click "Create"

3. **Set Up Database Access**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Create a username and password (save these!)
   - Select "Read and write to any database"
   - Click "Add User"

4. **Set Up Network Access**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" in the left sidebar
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password
   - Replace `<dbname>` with `efootball_league`

## 🚀 Step 2: Deploy to Render (Recommended)

### Backend Deployment

1. **Fork/Clone Repository**
   ```bash
   git clone <your-repo-url>
   cd efootball_league
   ```

2. **Create Render Account**
   - Go to [Render](https://render.com)
   - Sign up with your GitHub account

3. **Deploy Backend**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure the service:
     - **Name**: `efootball-league-backend`
     - **Root Directory**: `backend`
     - **Environment**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
   - Add Environment Variables:
     - `MONGODB_URI`: Your MongoDB connection string
     - `NODE_ENV`: `production`
   - Click "Create Web Service"

4. **Get Backend URL**
   - Copy the URL provided by Render (e.g., `https://efootball-league-backend.onrender.com`)

### Frontend Deployment

1. **Deploy Frontend**
   - Click "New +" → "Static Site"
   - Connect your GitHub repository
   - Configure the service:
     - **Name**: `efootball-league-frontend`
     - **Root Directory**: Leave empty
     - **Build Command**: `npm install && npm run build`
     - **Publish Directory**: `build`
   - Add Environment Variables:
     - `REACT_APP_API_URL`: Your backend URL + `/api` (e.g., `https://efootball-league-backend.onrender.com/api`)
   - Click "Create Static Site"

## 🚀 Step 3: Alternative Deployment Options

### Option B: Railway

1. **Create Railway Account**
   - Go to [Railway](https://railway.app)
   - Sign up with GitHub

2. **Deploy Backend**
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Set root directory to `backend`
   - Add environment variable `MONGODB_URI`
   - Railway will auto-deploy

3. **Deploy Frontend**
   - Create another service for the frontend
   - Set root directory to `.` (root)
   - Add environment variable `REACT_APP_API_URL`
   - Build command: `npm install && npm run build`

### Option C: Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Deploy Backend**
   ```bash
   cd backend
   heroku create efootball-league-backend
   heroku config:set MONGODB_URI="your-mongodb-connection-string"
   heroku config:set NODE_ENV=production
   git add .
   git commit -m "Deploy backend"
   git push heroku main
   ```

3. **Deploy Frontend**
   ```bash
   cd ..
   heroku create efootball-league-frontend
   heroku config:set REACT_APP_API_URL="https://efootball-league-backend.herokuapp.com/api"
   git add .
   git commit -m "Deploy frontend"
   git push heroku main
   ```

## 🔧 Step 3: Local Development Setup

1. **Install Dependencies**
   ```bash
   npm run install-all
   ```

2. **Set Up Environment Variables**
   - Create `backend/.env` file:
   ```
   MONGODB_URI=your-mongodb-connection-string
   PORT=5000
   NODE_ENV=development
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Access Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🔍 Step 4: Testing Deployment

1. **Test Backend API**
   - Visit: `https://your-backend-url/api/health`
   - Should return: `{"status":"OK","message":"eFootball League API is running"}`

2. **Test Frontend**
   - Visit your frontend URL
   - Create a new league
   - Add some matches
   - Verify data persists

## 🛠️ Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure backend CORS is configured properly
   - Check that frontend API URL is correct

2. **Database Connection Issues**
   - Verify MongoDB connection string
   - Check network access settings in MongoDB Atlas
   - Ensure database user has proper permissions

3. **Build Failures**
   - Check that all dependencies are installed
   - Verify Node.js version compatibility
   - Check build logs for specific errors

### Environment Variables Checklist

**Backend (.env)**
- `MONGODB_URI`: MongoDB connection string
- `PORT`: Server port (usually 5000 or auto-assigned)
- `NODE_ENV`: Environment (development/production)

**Frontend (.env)**
- `REACT_APP_API_URL`: Backend API URL

## 📞 Support

If you encounter issues:
1. Check the deployment platform logs
2. Verify environment variables are set correctly
3. Test the API endpoints directly
4. Check MongoDB Atlas connection status

## 🎉 Success!

Once deployed, your eFootball League Tracker will be:
- ✅ Connected to a persistent MongoDB database
- ✅ Accessible from anywhere in the world
- ✅ Ready to track multiple leagues and seasons
- ✅ Fully functional with all features working