import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const TutorDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [myCourses, setMyCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [courseForm, setCourseForm] = useState({ title: '', description: '', category: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [coursesRes, enrollmentsRes] = await Promise.all([
        axios.get('/api/courses/tutor/my-courses'),
        axios.get('/api/enrollments/tutor')
      ]);
      setMyCourses(coursesRes.data);
      setEnrollments(enrollmentsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/courses', courseForm);
      setShowCourseModal(false);
      setCourseForm({ title: '', description: '', category: '' });
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating course');
    }
  };

  const handlePublishCourse = async (courseId, isPublished) => {
    try {
      await axios.put(`/api/courses/${courseId}`, { isPublished });
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating course');
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      await axios.delete(`/api/courses/${courseId}`);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error deleting course');
    }
  };

  const handleEnrollmentStatus = async (enrollmentId, status) => {
    try {
      await axios.put(`/api/enrollments/${enrollmentId}/status`, { status });
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating enrollment');
    }
  };

  const getStatusBadge = (status) => {
    return <span className={`status-badge status-${status}`}>{status}</span>;
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  const pendingEnrollments = enrollments.filter(e => e.status === 'pending');
  const approvedEnrollments = enrollments.filter(e => e.status === 'approved');

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '85vh' }}>
      <div className="container-fluid">
        <div className="row">
          {/* Sidebar */}
          <div className="col-md-2 sidebar py-3">
            <Link to="/tutor" className="active">
              <i className="bi bi-speedometer2 me-2"></i> Dashboard
            </Link>
            <Link to="/courses">
              <i className="bi bi-book me-2"></i> Browse Courses
            </Link>
          </div>

          {/* Main Content */}
          <div className="col-md-10 p-4">
            {/* Stats Cards */}
            <div className="row mb-4">
              <div className="col-md-4">
                <div className="stat-card">
                  <h3>{myCourses.length}</h3>
                  <p>My Courses</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="stat-card" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                  <h3>{pendingEnrollments.length}</h3>
                  <p>Pending Enrollments</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="stat-card" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
                  <h3>{approvedEnrollments.length}</h3>
                  <p>Enrolled Students</p>
                </div>
              </div>
            </div>

            {/* My Courses Section */}
            <div className="card mb-4">
              <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <h4>My Courses</h4>
                <button className="btn btn-primary" onClick={() => setShowCourseModal(true)}>
                  <i className="bi bi-plus-circle me-2"></i> Create Course
                </button>
              </div>
              <div className="card-body">
                {myCourses.length === 0 ? (
                  <p className="text-muted">No courses yet. Create your first course!</p>
                ) : (
                  <div className="row">
                    {myCourses.map(course => (
                      <div className="col-md-4 mb-3" key={course._id}>
                        <div className="card h-100">
                          <div className="card-body">
                            <h5>{course.title}</h5>
                            <p className="text-muted small">{course.category}</p>
                            <p className="small">{course.description?.substring(0, 100)}...</p>
                            <div className="d-flex justify-content-between align-items-center">
                              <span className={`badge ${course.isPublished ? 'bg-success' : 'bg-warning'}`}>
                                {course.isPublished ? 'Published' : 'Draft'}
                              </span>
                              <span className="text-muted small">
                                {course.enrolledStudents?.length || 0} students
                              </span>
                            </div>
                            <div className="mt-3">
                              <Link to={`/courses/${course._id}/manage`} className="btn btn-sm btn-primary me-2">
                                Manage
                              </Link>
                              <button 
                                className="btn btn-sm btn-outline-secondary me-2"
                                onClick={() => handlePublishCourse(course._id, !course.isPublished)}
                              >
                                {course.isPublished ? 'Unpublish' : 'Publish'}
                              </button>
                              <button 
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDeleteCourse(course._id)}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Pending Enrollments */}
            <div className="card">
              <div className="card-header bg-white">
                <h4>Enrollment Requests</h4>
              </div>
              <div className="card-body">
                {pendingEnrollments.length === 0 ? (
                  <p className="text-muted">No pending enrollment requests</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Learner</th>
                          <th>Course</th>
                          <th>Status</th>
                          <th>Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingEnrollments.map(e => (
                          <tr key={e._id}>
                            <td>{e.learnerId?.name}</td>
                            <td>{e.courseId?.title}</td>
                            <td>{getStatusBadge(e.status)}</td>
                            <td>{new Date(e.enrolledAt).toLocaleDateString()}</td>
                            <td>
                              <button 
                                className="btn btn-success btn-sm me-2"
                                onClick={() => handleEnrollmentStatus(e._id, 'approved')}
                              >
                                Approve
                              </button>
                              <button 
                                className="btn btn-danger btn-sm"
                                onClick={() => handleEnrollmentStatus(e._id, 'rejected')}
                              >
                                Reject
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Create Course Modal */}
      {showCourseModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create New Course</h5>
                <button type="button" className="btn-close" onClick={() => setShowCourseModal(false)}></button>
              </div>
              <form onSubmit={handleCreateCourse}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Course Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={courseForm.title}
                      onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Category</label>
                    <select
                      className="form-select"
                      value={courseForm.category}
                      onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="Programming">Programming</option>
                      <option value="Design">Design</option>
                      <option value="Business">Business</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Science">Science</option>
                      <option value="Language">Language</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      value={courseForm.description}
                      onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                      required
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowCourseModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Create Course
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default TutorDashboard;

