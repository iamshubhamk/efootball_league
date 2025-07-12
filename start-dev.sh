 #!/bin/bash

echo "Starting eFootball League Tracker Development Environment..."
echo

echo "Installing frontend dependencies..."
npm install

echo "Installing backend dependencies..."
cd backend
npm install
cd ..

echo
echo "Starting development servers..."
echo "Frontend will be available at: http://localhost:3000"
echo "Backend API will be available at: http://localhost:5000"
echo

npm run dev