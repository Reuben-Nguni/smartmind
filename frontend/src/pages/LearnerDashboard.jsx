import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const LearnerDashboard = () => {
  const { user, logout } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [activeTab, setActiveTab] = useState('my-courses');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [enrollmentsRes, coursesRes] = await Promise.all([
        axios.get('/api/enrollments/learner'),
        axios.get('/api/courses')
      ]);
      setEnrollments(enrollmentsRes.data);
      setAvailableCourses(coursesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      await axios.post('/api/enrollments', { courseId });
      alert('Enrollment request sent! Wait for tutor approval.');
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error enrolling in course');
    }
  };

  const isEnrolled = (courseId) => {
    return enrollments.some(e => e.courseId._id === courseId);
  };

  const getEnrollmentStatus = (courseId) => {
    const enrollment = enrollments.find(e => e.courseId._id === courseId);
    return enrollment ? enrollment.status : null;
  };

  const getStatusBadge = (status) => {
    return <span className={`status-badge status-${status}`}>{status}</span>;
  };

  const myApprovedCourses = enrollments.filter(e => e.status === 'approved');

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
              <Link to="/learner" onClick={() => setActiveTab('my-courses')} 
                 className={activeTab === 'my-courses' ? 'active' : ''}>
                <i className="bi bi-book me-2"></i> My Courses
              </Link>
              <Link to="/learner" onClick={() => setActiveTab('browse')} 
                 className={activeTab === 'browse' ? 'active' : ''}>
                <i className="bi bi-search me-2"></i> Browse Courses
              </Link>
            </div>

            {/* Main Content */}
            <div className="col-md-10 p-4">
              {/* Stats Cards */}
              <div className="row mb-4">
                <div className="col-md-4">
                <div className="stat-card">
                  <h3>{myApprovedCourses.length}</h3>
                  <p>Enrolled Courses</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="stat-card" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                  <h3>{enrollments.filter(e => e.status === 'pending').length}</h3>
                  <p>Pending Approvals</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="stat-card" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
                  <h3>{availableCourses.length}</h3>
                  <p>Available Courses</p>
                </div>
              </div>
            </div>

            {/* My Courses Tab */}
            {activeTab === 'my-courses' && (
              <div className="card">
                <div className="card-header bg-white">
                  <h4>My Enrolled Courses</h4>
                </div>
                <div className="card-body">
                  {myApprovedCourses.length === 0 ? (
                    <div className="text-center py-5">
                      <p className="text-muted">You haven't enrolled in any courses yet.</p>
                      <button className="btn btn-primary" onClick={() => setActiveTab('browse')}>
                        Browse Courses
                      </button>
                    </div>
                  ) : (
                    <div className="row">
                      {myApprovedCourses.map(enrollment => (
                        <div className="col-md-4 mb-3" key={enrollment._id}>
                          <div className="card h-100">
                            {enrollment.courseId.thumbnail && (
                              <img 
                                src={enrollment.courseId.thumbnail} 
                                className="course-thumbnail" 
                                alt={enrollment.courseId.title}
                              />
                            )}
                            <div className="card-body">
                              <h5>{enrollment.courseId.title}</h5>
                              <p className="text-muted small">{enrollment.courseId.category}</p>
                              <p className="small">{enrollment.courseId.description?.substring(0, 80)}...</p>
                              <Link to={`/courses/${enrollment.courseId._id}`} className="btn btn-sm btn-primary">
                                Go to Course
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Browse Courses Tab */}
            {activeTab === 'browse' && (
              <div className="card">
                <div className="card-header bg-white">
                  <h4>Available Courses</h4>
                </div>
                <div className="card-body">
                  {availableCourses.length === 0 ? (
                    <p className="text-muted">No courses available yet.</p>
                  ) : (
                    <div className="row">
                      {availableCourses.map(course => {
                        const enrolled = isEnrolled(course._id);
                        const status = getEnrollmentStatus(course._id);
                        
                        return (
                          <div className="col-md-4 mb-3" key={course._id}>
                            <div className="card h-100">
                              {course.thumbnail && (
                                <img 
                                  src={course.thumbnail} 
                                  className="course-thumbnail" 
                                  alt={course.title}
                                />
                              )}
                              <div className="card-body">
                                <h5>{course.title}</h5>
                                <p className="text-muted small">{course.category}</p>
                                <p className="small">{course.description?.substring(0, 80)}...</p>
                                <p className="small">
                                  <strong>Tutor:</strong> {course.tutor?.name}
                                </p>
                                
                                {enrolled ? (
                                  <div>
                                    {getStatusBadge(status)}
                                    {status === 'approved' && (
                                      <Link to={`/courses/${course._id}`} className="btn btn-sm btn-primary ms-2">
                                        Go to Course
                                      </Link>
                                    )}
                                  </div>
                                ) : (
                                  <button 
                                    className="btn btn-primary btn-sm"
                                    onClick={() => handleEnroll(course._id)}
                                  >
                                    Enroll Now
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
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

export default LearnerDashboard;

