# SmartMind LMS - Developer Quick Reference

## Project Overview
- **Type**: Full-stack MERN Learning Management System
- **Status**: Development Ready
- **Frontend Port**: 3000 (Vite)
- **Backend Port**: 5000 (Express)
- **Database**: MongoDB Atlas

## Quick Commands

### Backend (from `backend/` directory)
```bash
npm install          # Install dependencies
npm run dev          # Start development server
npm run seed         # Populate with demo data
npm run admin        # Create admin user
```

### Frontend (from `frontend/` directory)
```bash
npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Project Root
```bash
chmod +x start.sh    # Make script executable (Linux/Mac)
./start.sh           # Start both servers (Linux/Mac)
start.bat            # Start both servers (Windows)
```

## File Structure Reference

### Backend
```
backend/
├── server.js                 # Express server entry point
├── package.json              # Dependencies & scripts
├── .env                      # Environment variables (create this)
├── seed.js                   # Demo data seeding
├── createAdmin.js            # Admin creation utility
├── config/
│   └── cloudinary.js         # Cloudinary setup
├── middleware/
│   └── auth.js               # JWT authentication middleware
├── models/
│   ├── User.js               # User schema with role-based permissions
│   ├── Course.js             # Course schema with tutor reference
│   └── Enrollment.js         # Enrollment schema tracking learner-course relationships
└── routes/
    ├── auth.js               # Login, register, me endpoints
    ├── users.js              # User management endpoints
    ├── courses.js            # Course CRUD endpoints
    └── enrollments.js        # Enrollment management endpoints
```

### Frontend
```
frontend/
├── index.html                # HTML entry point
├── vite.config.js            # Vite configuration
├── package.json              # Dependencies & scripts
└── src/
    ├── main.jsx              # React root with ThemeProvider & AuthProvider
    ├── App.jsx               # Route definitions
    ├── index.css             # Global styles & CSS variables
    ├── components/
    │   ├── Navbar.jsx        # Navigation with theme toggle
    │   ├── Modal.jsx         # Reusable confirmation modal
    │   └── Footer.jsx        # Footer component
    ├── context/
    │   ├── AuthContext.jsx   # Authentication state management
    │   └── ThemeContext.jsx  # Dark/light mode theme state
    └── pages/
        ├── Home.jsx          # Landing page
        ├── Login.jsx         # Login form
        ├── Register.jsx      # Registration form
        ├── AdminDashboard.jsx # Admin overview with metrics & charts
        ├── TutorDashboard.jsx # Tutor course management
        ├── LearnerDashboard.jsx # Learner enrollment management
        ├── Courses.jsx       # Browse all courses
        ├── CourseDetail.jsx  # Single course detail view
        ├── MyCourses.jsx     # Learner's enrolled courses
        ├── About.jsx         # About page
        ├── Contact.jsx       # Contact page
        ├── Services.jsx      # Services page
        └── admin/
            ├── AdminUsers.jsx # User management page
            ├── AdminCourses.jsx # Course management page
            └── AdminEnrollments.jsx # Enrollment management page
```

## API Endpoints Cheat Sheet

### Authentication
```
POST   /api/auth/register          # Register new user
POST   /api/auth/login             # Login (returns JWT token)
GET    /api/auth/me                # Get current user info
```

### Users
```
GET    /api/users                  # Get all users (admin only)
PUT    /api/users/:id/status       # Update user status (admin only)
DELETE /api/users/:id              # Delete user (admin only)
```

### Courses
```
GET    /api/courses                # Get all published courses
POST   /api/courses                # Create new course (tutor only)
PUT    /api/courses/:id            # Update course (tutor only)
DELETE /api/courses/:id            # Delete course (tutor only)
GET    /api/courses/tutor/my-courses # Get tutor's courses
```

### Enrollments
```
GET    /api/enrollments/admin      # Get all enrollments (admin)
POST   /api/enrollments            # Create enrollment (learner)
PUT    /api/enrollments/:id/status # Update enrollment status
GET    /api/enrollments/learner    # Get learner's enrollments
GET    /api/enrollments/tutor      # Get tutor's enrollments
```

## Environment Variables

### Backend `.env`
```env
PORT=5000
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/smartmind
JWT_SECRET=your_super_secret_key_12345
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Key Technologies

### Frontend Stack
- **React 18**: UI framework
- **Vite**: Build tool & dev server
- **React Router v6**: Routing
- **Axios**: HTTP client
- **Bootstrap 5**: CSS framework
- **Chart.js**: Data visualization

### Backend Stack
- **Express.js**: Web framework
- **Mongoose**: MongoDB ODM
- **JWT**: Authentication
- **bcryptjs**: Password hashing
- **Cloudinary**: File storage
- **CORS**: Cross-origin requests

## Authentication Flow

```
User Registration
    ↓
User → Register Form → Backend (POST /api/auth/register)
    ↓
User marked as "pending"
    ↓
Admin approves user
    ↓
User → Login Form → Backend (POST /api/auth/login)
    ↓
Backend returns JWT token
    ↓
Token stored in localStorage
    ↓
Subsequent requests include token in Authorization header
    ↓
AuthContext validates token & maintains session
```

## Role-Based Access Control

### Admin (`role === 'admin'`)
- Access admin dashboard (`/admin`)
- Manage all users (approve, reject, delete)
- Manage all courses (publish, unpublish, delete)
- View all enrollments
- Access analytics dashboard

### Tutor (`role === 'tutor'`)
- Access tutor dashboard (`/tutor`)
- Create and manage own courses
- View student enrollments in own courses
- Upload course materials via Cloudinary
- Cannot delete other tutors' courses

### Learner (`role === 'learner'`)
- Access learner dashboard (`/learner`)
- Browse and enroll in published courses
- View own enrollments
- Cannot create or manage courses
- Access enrolled course content

## Common Development Tasks

### Adding a New Page
1. Create component in `frontend/src/pages/`
2. Import in `App.jsx`
3. Add route in `<Routes>` section
4. Add navigation link in `Navbar.jsx`

### Adding a New API Endpoint
1. Create route handler in `backend/routes/`
2. Implement logic with Mongoose models
3. Export in routes file
4. Import and mount in `server.js` as `app.use('/api/path', routes)`

### Adding a Modal Confirm
1. Import Modal component: `import Modal from '../components/Modal'`
2. Create state: `const [showModal, setShowModal] = useState(false)`
3. Add Modal JSX with onConfirm handler
4. Trigger with button click: `onClick={() => setShowModal(true)}`

### Using Theme
1. Import: `import { useTheme } from '../context/ThemeContext'`
2. Use in component: `const { theme, toggleTheme } = useTheme()`
3. Access theme: `theme === 'dark' ? 'dark styles' : 'light styles'`

### Making API Calls
```javascript
import axios from 'axios';

// GET request
const data = await axios.get('/api/users');

// POST request with data
const result = await axios.post('/api/auth/login', { email, password });

// With authentication token
const config = {
  headers: { Authorization: `Bearer ${token}` }
};
const result = await axios.get('/api/users', config);

// Error handling
try {
  const data = await axios.get('/api/endpoint');
} catch (error) {
  console.error(error.response?.data?.message || error.message);
}
```

## Debugging Tips

### Frontend Issues
1. **Check browser console**: F12 → Console tab
2. **Network tab**: F12 → Network tab for API calls
3. **React DevTools**: Install extension to inspect components
4. **Vite server**: Check terminal for build errors
5. **localStorage**: Check auth token is saved

### Backend Issues
1. **Check terminal**: npm run dev output
2. **MongoDB connection**: Verify connection string in .env
3. **API testing**: Use curl or Postman
4. **Error logs**: Check backend console for stack traces
5. **Port conflicts**: Ensure port 5000 is available

### Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| `ERR_CONNECTION_REFUSED` | Backend not running | Start backend on port 5000 |
| `EADDRINUSE` | Port already in use | Kill process or use different port |
| `MongoNetworkError` | MongoDB connection failed | Check connection string & whitelist IP |
| `Invalid token` | JWT expired or invalid | Re-login to get new token |
| `CORS error` | API calls blocked | Verify CORS enabled in Express |
| `Unauthorized` | Role check failed | Verify user role matches route |

## Code Standards

### Naming Conventions
- **Components**: PascalCase (`AdminDashboard.jsx`)
- **Functions**: camelCase (`fetchUsers()`)
- **Variables**: camelCase (`userData`)
- **Constants**: UPPER_SNAKE_CASE (`API_URL`)
- **Files**: Match component name (`Modal.jsx` for Modal component)

### File Organization
- Keep components small and focused
- Related logic in same file
- Shared utilities in separate files
- Styles inline or in css file

### Error Handling
```javascript
try {
  // Action
} catch (error) {
  console.error('Context:', error);
  alert(error.response?.data?.message || 'Error occurred');
}
```

## Performance Notes

- **Polling Interval**: 10 seconds for real-time updates
- **Page Size**: 10 items per page for pagination
- **Lazy Loading**: Chart.js loaded dynamically
- **Caching**: Browser caches static assets
- **Compression**: CORS middleware enables compression

## Deployment Checklist

- [ ] All environment variables configured
- [ ] MongoDB Atlas IP whitelist updated
- [ ] Cloudinary credentials verified
- [ ] JWT secret is strong
- [ ] All dependencies installed
- [ ] Build runs without errors: `npm run build`
- [ ] API endpoints tested
- [ ] Admin account created
- [ ] Demo data seeded (optional)
- [ ] HTTPS enabled (production)

## Useful Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Vite Guide](https://vitejs.dev/)
- [Bootstrap Components](https://getbootstrap.com/docs/5.0/components/)
- [Chart.js Documentation](https://www.chartjs.org/)

---

**Last Updated**: 2024
**Version**: 1.0
