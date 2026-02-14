#!/bin/bash

# SmartMind LMS - Quick Start Script
# This script starts both backend and frontend servers

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "=========================================="
echo "SmartMind LMS - Starting Application"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install Node.js v14 or higher."
    exit 1
fi

echo "✓ Node.js version: $(node --version)"
echo "✓ npm version: $(npm --version)"
echo ""

# Backend startup
echo "Starting Backend Server..."
cd "$PROJECT_DIR/backend"

if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo ""
    echo "Warning: .env file not found in backend directory"
    echo "Please create .env file with the following variables:"
    echo "  PORT=5000"
    echo "  MONGODB_URI=<your_mongodb_connection_string>"
    echo "  JWT_SECRET=<your_jwt_secret>"
    echo "  CLOUDINARY_CLOUD_NAME=<your_cloud_name>"
    echo "  CLOUDINARY_API_KEY=<your_api_key>"
    echo "  CLOUDINARY_API_SECRET=<your_api_secret>"
    echo ""
    read -p "Press Enter to continue..."
fi

# Start backend in background
npm run dev &
BACKEND_PID=$!
echo "✓ Backend started (PID: $BACKEND_PID)"
echo "  Running on: http://localhost:5000"
echo ""

# Frontend startup
echo "Starting Frontend Server..."
cd "$PROJECT_DIR/frontend"

if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

# Start frontend in background
npm run dev &
FRONTEND_PID=$!
echo "✓ Frontend started (PID: $FRONTEND_PID)"
echo "  Running on: http://localhost:3000"
echo ""

echo "=========================================="
echo "Both servers are running!"
echo "=========================================="
echo ""
echo "Frontend:  http://localhost:3000"
echo "Backend:   http://localhost:5000"
echo ""
echo "Default Admin Credentials:"
echo "  Email: admin@smartmind.com"
echo "  Password: admin123"
echo ""
echo "To stop both servers, press Ctrl+C"
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
