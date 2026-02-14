import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const MyCourses = () => {
  const { user, logout } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('/api/courses/tutor/my-courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      await axios.delete(`/api/courses/${courseId}`);
      fetchCourses();
    } catch (error) {
      alert(error.response?.data?.message || 'Error deleting course');
    }
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark">
        <div className="container-fluid">
          <Link className="navbar-brand fw-bold" to="/tutor">SmartMind Tutor</Link>
          <div className="d-flex align-items-center">
            <Link to="/tutor" className="btn btn-outline-light btn-sm me-3">
              Dashboard
            </Link>
            <span className="text-white me-3">{user?.name}</span>
            <button className="btn btn-outline-light btn-sm" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container-fluid">
        <div className="row">
          {/* Sidebar */}
          <div className="col-md-2 sidebar py-3">
            <Link to="/tutor">
              <i className="bi bi-arrow-left me-2"></i> Back to Dashboard
            </Link>
          </div>

          {/* Main Content */}
          <div className="col-md-10 p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>My Courses</h2>
              <Link to="/tutor" className="btn btn-primary">
                <i className="bi bi-plus-circle me-2"></i> Create New Course
              </Link>
            </div>

            {courses.length === 0 ? (
              <div className="text-center py-5">
                <p className="text-muted">You haven't created any courses yet.</p>
                <Link to="/tutor" className="btn btn-primary">
                  Create Your First Course
                </Link>
              </div>
            ) : (
              <div className="row">
                {courses.map(course => (
                  <div className="col-md-4 mb-4" key={course._id}>
                    <div className="card h-100">
                      {course.thumbnail ? (
                        <img 
                          src={course.thumbnail} 
                          className="course-thumbnail" 
                          alt={course.title}
                        />
                      ) : (
                        <div 
                          className="course-thumbnail d-flex align-items-center justify-content-center"
                          style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                        >
                          <i className="bi bi-book text-white" style={{ fontSize: '3rem' }}></i>
                        </div>
                      )}
                      <div className="card-body">
                        <span className="badge bg-secondary mb-2">{course.category}</span>
                        <h5>{course.title}</h5>
                        <p className="small">{course.description?.substring(0, 100)}...</p>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <span className={`badge ${course.isPublished ? 'bg-success' : 'bg-warning'}`}>
                            {course.isPublished ? 'Published' : 'Draft'}
                          </span>
                          <span className="text-muted small">
                            {course.enrolledStudents?.length || 0} students
                          </span>
                        </div>
                        <Link to={`/courses/${course._id}`} className="btn btn-primary btn-sm">
                          Manage Course
                        </Link>
                        <button 
                          className="btn btn-danger btn-sm ms-2"
                          onClick={() => handleDeleteCourse(course._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCourses;

