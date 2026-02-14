# SmartMind LMS - Learning Management System

A full-featured Learning Management System built with the MERN Stack (MongoDB, Express, React, Node.js).

## Features

### User Roles
- **Admin**: Full system control, user approvals, course management, analytics dashboard
- **Tutor**: Create and manage courses after admin approval
- **Learner**: Browse and enroll in courses after admin approval

### Admin Dashboard Features
- **Metrics**: Real-time statistics (total users, tutors, learners, enrollments)
- **Analytics**: 7-day enrollment trend visualization with Chart.js
- **Pending Approvals**: Quick-action tile for user approvals
- **Dedicated Management Pages**:
  - Users management with sorting, pagination, and CSV export
  - Courses management with publish/unpublish toggle
  - Enrollments management with status tracking
- **Responsive UI**: Admin sidebar navigation with Bootstrap styling

### Authentication & Authorization
- JWT-based authentication
- Role-based access control
- User approval workflow (pending → approved/rejected)

### Course Management
- Create, edit, and delete courses
- Course modules and materials
- Assignments and announcements
- Enrollment management

### Cloud Storage
- Cloudinary integration for file uploads
- Profile pictures, course thumbnails, PDFs, videos

## Tech Stack

### Backend
- Node.js + Express
- MongoDB with Mongoose
- JWT Authentication
- Cloudinary for file storage
- bcryptjs for password hashing

### Frontend
- React 18 with Vite
- React Router for navigation
- Axios for API calls
- Bootstrap 5 for styling
- Chart.js for analytics and visualization
- Theme system with dark/light mode toggle

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- Cloudinary account

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Navigate to project directory
cd SmartMind

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables

#### Backend (.env)
Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### MongoDB Atlas Setup
1. Create a MongoDB Atlas account
2. Create a new cluster (free tier)
3. Create a database user
4. Get your connection string
5. Replace `your_mongodb_connection_string` in .env

#### Cloudinary Setup
1. Create a Cloudinary account
2. Get your cloud name, API key, and API secret
3. Replace the values in .env

### 3. Create Admin User

```bash
cd backend
node createAdmin.js
```

This creates an admin user:
- Email: admin@smartmind.com
- Password: admin123

### 4. Run the Application

#### Start Backend (Terminal 1)
```bash
cd backend
npm run dev
```

#### Start Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```

### 5. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Default Login Credentials

After running `node createAdmin.js`:

- **Admin**: admin@smartmind.com / admin123

## Workflow

### Registration Flow
1. New users register at `/register`
2. User status is set to "pending"
3. Admin logs in and approves the user
4. User can now login and access their dashboard

### Tutor Course Creation
1. Tutor registers and gets approved by admin
2. Tutor creates courses from their dashboard
3. Tutor can publish/unpublish courses
4. Tutor manages enrollments

### Learner Enrollment
1. Learner registers and gets approved by admin
2. Learner browses available courses
3. Learner enrolls in a course
4. Enrollment status is "pending"
5. Tutor approves the enrollment
6. Learner gains access to course content

## API Endpoints

### Auth
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me

### Users
- GET /api/users (Admin)
- GET /api/users/pending (Admin)
- PUT /api/users/:id/status (Admin)
- DELETE /api/users/:id (Admin)

### Courses
- GET /api/courses
- GET /api/courses/tutor/my-courses
- POST /api/courses (Tutor)
- PUT /api/courses/:id
- DELETE /api/courses/:id

### Enrollments
- POST /api/enrollments (Learner)
- GET /api/enrollments/learner
- GET /api/enrollments/tutor
- PUT /api/enrollments/:id/status

## Project Structure

```
SmartMind/
├── backend/
│   ├── config/
│   │   └── cloudinary.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Course.js
│   │   ├── Enrollment.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── courses.js
│   │   ├── enrollments.js
│   │   └── users.js
│   ├── createAdmin.js
│   ├── seed.js
│   ├── package.json
│   ├── server.js
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Footer.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── Navbar.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── AdminCourses.jsx
│   │   │   │   ├── AdminEnrollments.jsx
│   │   │   │   └── AdminUsers.jsx
│   │   │   ├── About.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── CourseDetail.jsx
│   │   │   ├── Courses.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── LearnerDashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── MyCourses.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Services.jsx
│   │   │   └── TutorDashboard.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── public/
│   │   └── logo.png
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── README.md
└── TODO.md
```

## License

MIT

