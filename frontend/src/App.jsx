import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminCourses from './pages/admin/AdminCourses';
import AdminEnrollments from './pages/admin/AdminEnrollments';
import PasswordRecovery from './pages/admin/PasswordRecovery';
import TutorDashboard from './pages/TutorDashboard';
import LearnerDashboard from './pages/LearnerDashboard';
import NotificationCenter from './pages/NotificationCenter';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import MyCourses from './pages/MyCourses';
import ManageCourse from './pages/ManageCourse';
import Home from './pages/Home';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

const AppRoutes = () => {
  const { user } = useAuth();

  // Redirect to role-specific dashboard
  const getDashboard = () => {
    if (!user) return <Login />;
    switch (user.role) {
      case 'admin': return <AdminDashboard />;
      case 'tutor': return <TutorDashboard />;
      case 'learner': return <LearnerDashboard />;
      default: return <Login />;
    }
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/services" element={<Services />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={user ? <Navigate to={user.role === 'admin' ? '/' : user.role === 'tutor' ? '/tutor' : '/learner'} /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to={user.role === 'admin' ? '/' : user.role === 'tutor' ? '/tutor' : '/learner'} /> : <Register />} />
      <Route path="/forgot-password" element={user ? <Navigate to="/" /> : <ForgotPassword />} />
      <Route path="/courses" element={
        <ProtectedRoute allowedRoles={['admin', 'tutor', 'learner']}>
          <Courses />
        </ProtectedRoute>
      } />
      
      <Route path="/profile" element={
        <ProtectedRoute allowedRoles={['admin', 'tutor', 'learner']}>
          <Profile />
        </ProtectedRoute>
      } />
      
      {/* Protected Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          {getDashboard()}
        </ProtectedRoute>
      } />
      
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      
        <Route path="/admin/users" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminUsers />
          </ProtectedRoute>
        } />
      
        <Route path="/admin/courses" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminCourses />
          </ProtectedRoute>
        } />
      
        <Route path="/admin/enrollments" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminEnrollments />
          </ProtectedRoute>
        } />

        <Route path="/admin/password-recovery" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <PasswordRecovery />
          </ProtectedRoute>
        } />
      
      <Route path="/tutor" element={
        <ProtectedRoute allowedRoles={['tutor']}>
          <TutorDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/learner" element={
        <ProtectedRoute allowedRoles={['learner']}>
          <LearnerDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/notifications" element={
        <ProtectedRoute allowedRoles={['admin', 'tutor', 'learner']}>
          <NotificationCenter />
        </ProtectedRoute>
      } />
      
      <Route path="/courses/:id" element={
        <ProtectedRoute allowedRoles={['admin', 'tutor', 'learner']}>
          <CourseDetail />
        </ProtectedRoute>
      } />
      
      <Route path="/my-courses" element={
        <ProtectedRoute allowedRoles={['tutor']}>
          <MyCourses />
        </ProtectedRoute>
      } />

      <Route path="/courses/:courseId/manage" element={
        <ProtectedRoute allowedRoles={['tutor']}>
          <ManageCourse />
        </ProtectedRoute>
      } />
      
      <Route path="*" element={
        user ? (
          user.role === 'admin' ? <Navigate to="/admin" /> :
          user.role === 'tutor' ? <Navigate to="/tutor" /> :
          <Navigate to="/learner" />
        ) : <Navigate to="/" />
      } />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;

