import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Courses = () => {
  const { user, logout } = useAuth();
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, [selectedCategory]);

  const fetchCourses = async () => {
    try {
      const query = selectedCategory ? `?category=${selectedCategory}` : '';
      const response = await axios.get(`/api/courses${query}`);
      setCourses(response.data);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(response.data.map(c => c.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDashboardLink = () => {
    switch (user?.role) {
      case 'admin': return '/';
      case 'tutor': return '/tutor';
      case 'learner': return '/learner';
      default: return '/';
    }
  };

  const getDashboardName = () => {
    switch (user?.role) {
      case 'admin': return 'Admin Dashboard';
      case 'tutor': return 'Tutor Dashboard';
      case 'learner': return 'Learner Dashboard';
      default: return 'Dashboard';
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
    <>
      <Navbar />
      <div style={{ minHeight: '85vh' }}>
      <div className="container-fluid">
        <div className="row">
          {/* Sidebar */}
          <div className="col-md-2 sidebar py-3">
            <Link to={getDashboardLink()}>
              <i className="bi bi-arrow-left me-2"></i> Back to Dashboard
            </Link>
          </div>

          {/* Main Content */}
          <div className="col-md-10 p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>All Courses</h2>
              <select 
                className="form-select w-auto"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {courses.length === 0 ? (
              <div className="text-center py-5">
                <p className="text-muted">No courses available</p>
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
                        <p className="small text-muted">{course.description?.substring(0, 100)}...</p>
                        <p className="small">
                          <i className="bi bi-person me-1"></i> {course.tutor?.name}
                        </p>
                        <p className="small">
                          <i className="bi bi-people me-1"></i> {course.enrolledStudents?.length || 0} students
                        </p>
                        <Link to={`/courses/${course._id}`} className="btn btn-primary btn-sm">
                          View Details
                        </Link>
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
      <Footer />
    </>
  );
};

export default Courses;