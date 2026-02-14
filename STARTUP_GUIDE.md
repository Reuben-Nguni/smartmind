# SmartMind LMS - Startup Guide

This guide will help you get the SmartMind Learning Management System up and running quickly.

## Prerequisites

Before you start, ensure you have:

- **Node.js** v14 or higher ([Download here](https://nodejs.org/))
- **MongoDB Atlas** account ([Sign up here](https://www.mongodb.com/cloud/atlas))
- **Cloudinary** account ([Sign up here](https://cloudinary.com/))

## Quick Start

### Option 1: Automated Startup (Recommended)

#### On Linux/Mac:
```bash
cd SmartMind
chmod +x start.sh
./start.sh
```

#### On Windows:
```bash
cd SmartMind
start.bat
```

This will automatically:
- Install dependencies (if needed)
- Start the backend server on port 5000
- Start the frontend server on port 3000

### Option 2: Manual Startup

#### Step 1: Backend Setup

```bash
cd backend
npm install
npm run dev
```

The backend will start on `http://localhost:5000`

#### Step 2: Frontend Setup (in a new terminal)

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:3000`

## Configuration

### 1. Create Backend `.env` File

Create a file named `.env` in the `backend` directory with the following content:

```env
PORT=5000
MONGODB_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret_key>
CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
CLOUDINARY_API_KEY=<your_cloudinary_api_key>
CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>
```

### 2. Get MongoDB Connection String

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign in to your account
3. Create a new project and cluster (free tier available)
4. Create a database user
5. Click "Connect" on your cluster
6. Select "Connect your application"
7. Copy the connection string and replace `<password>` with your database user password
8. Paste it into the `.env` file as `MONGODB_URI`

### 3. Get Cloudinary Credentials

1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up for a free account
3. Dashboard will show your:
   - Cloud Name
   - API Key
4. To get API Secret:
   - Click "Settings" (gear icon)
   - Navigate to "API Keys" tab
   - View your API Secret
5. Add all three to your `.env` file

### 4. Create JWT Secret

Generate a random string for `JWT_SECRET`. You can use:

```bash
# Linux/Mac
openssl rand -base64 32

# Windows (PowerShell)
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((New-Guid).ToString()))
```

Or simply use any random string like: `your_super_secret_key_12345`

## Seed Demo Data

To populate the database with demo users:

```bash
cd backend
npm run seed
```

This creates test users with the following credentials:

### Admin Account
- Email: `admin@smartmind.com`
- Password: `admin123`
- Role: Admin

### Tutor Account
- Email: `tutor@smartmind.com`
- Password: `tutor123`
- Role: Tutor

### Learner Account
- Email: `john@smartmind.com`
- Password: `learner123`
- Role: Learner

## Access the Application

Once both servers are running:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

### First Time Admin Setup

If you haven't seeded data yet:

```bash
cd backend
node createAdmin.js
```

This creates an admin account:
- Email: `admin@smartmind.com`
- Password: `admin123`

## Troubleshooting

### Error: `ERR_CONNECTION_REFUSED`

**Problem**: Frontend can't connect to backend

**Solution**:
1. Ensure backend is running on port 5000
2. Check that `.env` file exists in the backend directory
3. Verify MongoDB connection string is correct
4. Check firewall settings

### Error: `EADDRINUSE: address already in use :::5000`

**Problem**: Port 5000 is already in use

**Solution**:
```bash
# Linux/Mac - Find and kill process
lsof -i :5000
kill -9 <PID>

# Windows - Find and kill process
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

Or change the port in `backend/.env`:
```env
PORT=5001
```

### Error: `MongoNetworkError`

**Problem**: Can't connect to MongoDB

**Solution**:
1. Check your MongoDB connection string
2. Verify network access is enabled in MongoDB Atlas
3. Check that your IP address is whitelisted in MongoDB Atlas security

### Port 3000 Already in Use

If port 3000 is already in use, Vite will automatically try the next available port (3001, 3002, etc.). Check the terminal output to see which port the frontend is running on.

## Project Architecture

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Bootstrap 5
- **API Client**: Axios
- **State Management**: React Context API
- **Routing**: React Router v6
- **Charts**: Chart.js (dynamically loaded)

### Backend
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Cloudinary
- **Password Hashing**: bcryptjs

## Key Features

### Admin Dashboard
- Real-time metrics (users, tutors, learners, enrollments)
- 7-day enrollment trend chart
- Pending user approvals management
- Dedicated pages for:
  - User management (with sorting, pagination, CSV export)
  - Course management (publish/unpublish)
  - Enrollment tracking

### User Management
- Role-based access control (Admin, Tutor, Learner)
- User approval workflow
- Profile management

### Course Management
- Create, edit, and publish courses
- Course categories and descriptions
- Enrollment tracking

### Theme System
- Light/Dark mode toggle
- Persistent theme preference
- Custom CSS variables

## Next Steps

After setup, you can:

1. **Log in** as admin at http://localhost:3000/login
2. **Register** new users (they'll be pending approval)
3. **Approve** users from the admin dashboard
4. **Create courses** as a tutor
5. **Manage** all platform content from the admin panel

## Development Commands

### Backend
```bash
cd backend
npm run dev      # Start development server
npm run seed     # Populate with demo data
npm run admin    # Create new admin user
```

### Frontend
```bash
cd frontend
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## Getting Help

If you encounter issues:

1. Check the console for error messages
2. Review the troubleshooting section above
3. Ensure all environment variables are set correctly
4. Check that both servers are running
5. Verify MongoDB and Cloudinary credentials

## Performance Tips

1. **Enable compression** in MongoDB queries
2. **Use pagination** for large datasets
3. **Cache frequently accessed data**
4. **Optimize images** before uploading to Cloudinary
5. **Use lazy loading** for components

## Security Reminders

⚠️ **Important Security Notes**:
- Never commit `.env` file to version control
- Use strong, unique JWT secrets
- Enable IP whitelisting in MongoDB Atlas
- Restrict Cloudinary API access
- Regularly update dependencies: `npm update`
- Use HTTPS in production environments

## Deployment

For production deployment, refer to:
- **Backend**: [Heroku](https://www.heroku.com/) or [Railway](https://railway.app/)
- **Frontend**: [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

## Support

For more information, check:
- README.md
- TODO.md
- Individual component files for inline documentation

Happy Learning! 🚀
