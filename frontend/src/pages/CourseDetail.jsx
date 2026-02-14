import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const CourseDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [moduleForm, setModuleForm] = useState({ title: '', description: '' });
  const [materialForm, setMaterialForm] = useState({ title: '', type: 'pdf', url: '' });
  const [announcementForm, setAnnouncementForm] = useState({ title: '', content: '' });
  const [assignmentForm, setAssignmentForm] = useState({ title: '', description: '', dueDate: '' });

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const response = await axios.get(`/api/courses/${id}`);
      setCourse(response.data);
    } catch (error) {
      console.error('Error fetching course:', error);
      alert('Course not found');
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const isTutor = course?.tutor?._id === user?._id || user?.role === 'admin';
  const isEnrolled = course?.enrolledStudents?.some(s => s._id === user?._id);

  const handleAddModule = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/courses/${id}/modules`, moduleForm);
      setShowModuleModal(false);
      setModuleForm({ title: '', description: '' });
      fetchCourse();
    } catch (error) {
      alert(error.response?.data?.message || 'Error adding module');
    }
  };

  const handleAddMaterial = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/courses/${id}/materials`, materialForm);
      setShowMaterialModal(false);
      setMaterialForm({ title: '', type: 'pdf', url: '' });
      fetchCourse();
    } catch (error) {
      alert(error.response?.data?.message || 'Error adding material');
    }
  };

  const handleAddAnnouncement = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/courses/${id}/announcements`, announcementForm);
      setShowAnnouncementModal(false);
      setAnnouncementForm({ title: '', content: '' });
      fetchCourse();
    } catch (error) {
      alert(error.response?.data?.message || 'Error adding announcement');
    }
  };

  const handleAddAssignment = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/courses/${id}/assignments`, assignmentForm);
      setShowAssignmentModal(false);
      setAssignmentForm({ title: '', description: '', dueDate: '' });
      fetchCourse();
    } catch (error) {
      alert(error.response?.data?.message || 'Error adding assignment');
    }
  };

  const handleEnroll = async () => {
    try {
      await axios.post('/api/enrollments', { courseId: id });
      alert('Enrollment request sent! Wait for tutor approval.');
      fetchCourse();
    } catch (error) {
      alert(error.response?.data?.message || 'Error enrolling');
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

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  if (!course) {
    return <div className="container mt-5">Course not found</div>;
  }

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark">
        <div className="container-fluid">
          <Link className="navbar-brand fw-bold" to="/courses">SmartMind</Link>
          <div className="d-flex align-items-center">
            <Link to={getDashboardLink()} className="btn btn-outline-light btn-sm me-3">
              Dashboard
            </Link>
            <span className="text-white me-3">{user?.name}</span>
          </div>
        </div>
      </nav>

      {/* Course Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        padding: '40px 0',
        color: 'white'
      }}>
        <div className="container">
          <div className="row">
            <div className="col-md-8">
              <span className="badge bg-light text-dark mb-2">{course.category}</span>
              <h1>{course.title}</h1>
              <p className="lead">{course.description}</p>
              <p><i className="bi bi-person me-2"></i> {course.tutor?.name}</p>
              <p><i className="bi bi-people me-2"></i> {course.enrolledStudents?.length || 0} enrolled</p>
            </div>
            <div className="col-md-4 text-md-end">
              {user?.role === 'learner' && !isEnrolled && (
                <button className="btn btn-light btn-lg" onClick={handleEnroll}>
                  Enroll Now
                </button>
              )}
              {isEnrolled && (
                <span className="badge bg-success btn-lg">Enrolled</span>
              )}
              {user?.role === 'learner' && isEnrolled === false && (
                <span className="badge bg-warning btn-lg">Enrollment Pending</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-4">
        <div className="row">
          {/* Tabs */}
          <div className="col-12 mb-4">
            <ul className="nav nav-tabs">
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                  onClick={() => setActiveTab('overview')}
                >
                  Overview
                </button>
              </li>
              {isEnrolled && (
                <>
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${activeTab === 'modules' ? 'active' : ''}`}
                      onClick={() => setActiveTab('modules')}
                    >
                      Modules
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${activeTab === 'materials' ? 'active' : ''}`}
                      onClick={() => setActiveTab('materials')}
                    >
                      Materials
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${activeTab === 'assignments' ? 'active' : ''}`}
                      onClick={() => setActiveTab('assignments')}
                    >
                      Assignments
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${activeTab === 'announcements' ? 'active' : ''}`}
                      onClick={() => setActiveTab('announcements')}
                    >
                      Announcements
                    </button>
                  </li>
                </>
              )}
              {isTutor && (
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeTab === 'manage' ? 'active' : ''}`}
                    onClick={() => setActiveTab('manage')}
                  >
                    Manage
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Tab Content */}
          <div className="col-12">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="card">
                <div className="card-body">
                  <h4>Course Overview</h4>
                  <p>{course.description}</p>
                  <hr />
                  <div className="row">
                    <div className="col-md-4">
                      <p><strong>Category:</strong> {course.category}</p>
                    </div>
                    <div className="col-md-4">
                      <p><strong>Tutor:</strong> {course.tutor?.name}</p>
                    </div>
                    <div className="col-md-4">
                      <p><strong>Students:</strong> {course.enrolledStudents?.length || 0}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Modules Tab */}
            {activeTab === 'modules' && isEnrolled && (
              <div className="card">
                <div className="card-header bg-white d-flex justify-content-between">
                  <h4>Course Modules</h4>
                  {isTutor && (
                    <button className="btn btn-primary btn-sm" onClick={() => setShowModuleModal(true)}>
                      Add Module
                    </button>
                  )}
                </div>
                <div className="card-body">
                  {course.modules?.length === 0 ? (
                    <p className="text-muted">No modules yet</p>
                  ) : (
                    <div className="accordion" id="moduleAccordion">
                      {course.modules?.map((module, index) => (
                        <div className="accordion-item" key={module._id}>
                          <h2 className="accordion-header">
                            <button 
                              className="accordion-button collapsed" 
                              type="button" 
                              data-bs-toggle="collapse" 
                              data-bs-target={`#module${index}`}
                            >
                              <strong>{module.order}. {module.title}</strong>
                            </button>
                          </h2>
                          <div id={`module${index}`} className="accordion-collapse collapse" data-bs-parent="#moduleAccordion">
                            <div className="accordion-body">
                              {module.description || 'No description'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Materials Tab */}
            {activeTab === 'materials' && isEnrolled && (
              <div className="card">
                <div className="card-header bg-white d-flex justify-content-between">
                  <h4>Course Materials</h4>
                  {isTutor && (
                    <button className="btn btn-primary btn-sm" onClick={() => setShowMaterialModal(true)}>
                      Add Material
                    </button>
                  )}
                </div>
                <div className="card-body">
                  {course.materials?.length === 0 ? (
                    <p className="text-muted">No materials yet</p>
                  ) : (
                    <div className="list-group">
                      {course.materials?.map((material, index) => (
                        <a 
                          key={index} 
                          href={material.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="list-group-item list-group-item-action"
                        >
                          <i className={`bi ${material.type === 'pdf' ? 'bi-file-pdf' : material.type === 'image' ? 'bi-image' : 'bi-link'} me-2`}></i>
                          {material.title}
                          <span className="badge bg-secondary ms-2">{material.type}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Assignments Tab */}
            {activeTab === 'assignments' && isEnrolled && (
              <div className="card">
                <div className="card-header bg-white d-flex justify-content-between">
                  <h4>Assignments</h4>
                  {isTutor && (
                    <button className="btn btn-primary btn-sm" onClick={() => setShowAssignmentModal(true)}>
                      Add Assignment
                    </button>
                  )}
                </div>
                <div className="card-body">
                  {course.assignments?.length === 0 ? (
                    <p className="text-muted">No assignments yet</p>
                  ) : (
                    <div className="list-group">
                      {course.assignments?.map((assignment, index) => (
                        <div key={index} className="list-group-item">
                          <h5>{assignment.title}</h5>
                          <p>{assignment.description}</p>
                          {assignment.dueDate && (
                            <p className="small text-muted">
                              <i className="bi bi-calendar me-1"></i>
                              Due: {new Date(assignment.dueDate).toLocaleDateString()}
                            </p>
                          )}
                          <button className="btn btn-sm btn-primary">Submit Assignment</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Announcements Tab */}
            {activeTab === 'announcements' && isEnrolled && (
              <div className="card">
                <div className="card-header bg-white d-flex justify-content-between">
                  <h4>Announcements</h4>
                  {isTutor && (
                    <button className="btn btn-primary btn-sm" onClick={() => setShowAnnouncementModal(true)}>
                      Post Announcement
                    </button>
                  )}
                </div>
                <div className="card-body">
                  {course.announcements?.length === 0 ? (
                    <p className="text-muted">No announcements yet</p>
                  ) : (
                    <div className="list-group">
                      {course.announcements?.map((announcement, index) => (
                        <div key={index} className="list-group-item">
                          <h5>{announcement.title}</h5>
                          <p>{announcement.content}</p>
                          <small className="text-muted">
                            Posted: {new Date(announcement.createdAt).toLocaleDateString()}
                          </small>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Manage Tab (Tutor Only) */}
            {activeTab === 'manage' && isTutor && (
              <div className="card">
                <div className="card-body">
                  <h4>Manage Course</h4>
                  <p>This section allows you to manage your course content.</p>
                  <div className="row mt-4">
                    <div className="col-md-6">
                      <div className="card bg-light">
                        <div className="card-body">
                          <h5>Modules</h5>
                          <p>{course.modules?.length || 0} modules</p>
                          <button className="btn btn-primary btn-sm" onClick={() => setShowModuleModal(true)}>
                            Add Module
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="card bg-light">
                        <div className="card-body">
                          <h5>Materials</h5>
                          <p>{course.materials?.length || 0} materials</p>
                          <button className="btn btn-primary btn-sm" onClick={() => setShowMaterialModal(true)}>
                            Add Material
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-md-6">
                      <div className="card bg-light">
                        <div className="card-body">
                          <h5>Assignments</h5>
                          <p>{course.assignments?.length || 0} assignments</p>
                          <button className="btn btn-primary btn-sm" onClick={() => setShowAssignmentModal(true)}>
                            Add Assignment
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="card bg-light">
                        <div className="card-body">
                          <h5>Announcements</h5>
                          <p>{course.announcements?.length || 0} announcements</p>
                          <button className="btn btn-primary btn-sm" onClick={() => setShowAnnouncementModal(true)}>
                            Post Announcement
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Module Modal */}
      {showModuleModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Module</h5>
                <button type="button" className="btn-close" onClick={() => setShowModuleModal(false)}></button>
              </div>
              <form onSubmit={handleAddModule}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input type="text" className="form-control" value={moduleForm.title}
                      onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea className="form-control" value={moduleForm.description}
                      onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })} />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModuleModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Add</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Material Modal */}
      {showMaterialModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Material</h5>
                <button type="button" className="btn-close" onClick={() => setShowMaterialModal(false)}></button>
              </div>
              <form onSubmit={handleAddMaterial}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input type="text" className="form-control" value={materialForm.title}
                      onChange={(e) => setMaterialForm({ ...materialForm, title: e.target.value })} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Type</label>
                    <select className="form-select" value={materialForm.type}
                      onChange={(e) => setMaterialForm({ ...materialForm, type: e.target.value })}>
                      <option value="pdf">PDF</option>
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                      <option value="link">Link</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">URL</label>
                    <input type="url" className="form-control" value={materialForm.url}
                      onChange={(e) => setMaterialForm({ ...materialForm, url: e.target.value })} required />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowMaterialModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Add</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Announcement Modal */}
      {showAnnouncementModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Post Announcement</h5>
                <button type="button" className="btn-close" onClick={() => setShowAnnouncementModal(false)}></button>
              </div>
              <form onSubmit={handleAddAnnouncement}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input type="text" className="form-control" value={announcementForm.title}
                      onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Content</label>
                    <textarea className="form-control" rows="4" value={announcementForm.content}
                      onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e.target.value })} required />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowAnnouncementModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Post</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Assignment Modal */}
      {showAssignmentModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Assignment</h5>
                <button type="button" className="btn-close" onClick={() => setShowAssignmentModal(false)}></button>
              </div>
              <form onSubmit={handleAddAssignment}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input type="text" className="form-control" value={assignmentForm.title}
                      onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea className="form-control" rows="3" value={assignmentForm.description}
                      onChange={(e) => setAssignmentForm({ ...assignmentForm, description: e.target.value })} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Due Date</label>
                    <input type="date" className="form-control" value={assignmentForm.dueDate}
                      onChange={(e) => setAssignmentForm({ ...assignmentForm, dueDate: e.target.value })} />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowAssignmentModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Add</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetail;

