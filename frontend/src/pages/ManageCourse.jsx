import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ManageCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('modules');
  const [uploading, setUploading] = useState(false);

  // Form states
  const [moduleForm, setModuleForm] = useState({ title: '', description: '', order: '' });
  const [materialForm, setMaterialForm] = useState({ title: '', type: 'pdf', file: null });
  const [assignmentForm, setAssignmentForm] = useState({ title: '', description: '', dueDate: '' });
  const [announcementForm, setAnnouncementForm] = useState({ title: '', content: '' });

  // Modal states
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [showStudentsModal, setShowStudentsModal] = useState(false);

  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      const res = await axios.get(`/api/courses/${courseId}`);
      setCourse(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching course:', error);
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`/api/courses/${courseId}/students`);
      setStudents(res.data);
      setShowStudentsModal(true);
    } catch (error) {
      console.error('Error fetching students:', error);
      alert('Error loading students');
    }
  };

  const exportStudents = () => {
    if (students.length === 0) {
      alert('No students to export');
      return;
    }

    const headers = ['Name', 'Email', 'Role', 'Enrolled Date'];
    const rows = students.map(s => [
      s.name,
      s.email,
      s.role,
      new Date(s.enrolledAt).toLocaleDateString()
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${course.title}-students.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  // Module handlers
  const handleAddModule = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/courses/${courseId}/modules`, moduleForm);
      fetchCourse();
      setShowModuleModal(false);
      setModuleForm({ title: '', description: '', order: '' });
    } catch (error) {
      alert(error.response?.data?.message || 'Error adding module');
    }
  };

  const handleDeleteModule = async (moduleId) => {
    if (!window.confirm('Delete this module?')) return;
    try {
      await axios.delete(`/api/courses/${courseId}/modules/${moduleId}`);
      fetchCourse();
    } catch (error) {
      alert('Error deleting module');
    }
  };

  // Material handlers
  const handleAddMaterial = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('title', materialForm.title);
      formData.append('type', materialForm.type);
      if (materialForm.file) {
        formData.append('file', materialForm.file);
      }

      await axios.post(`/api/courses/${courseId}/materials`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchCourse();
      setShowMaterialModal(false);
      setMaterialForm({ title: '', type: 'pdf', file: null });
    } catch (error) {
      alert(error.response?.data?.message || 'Error adding material');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteMaterial = async (materialId) => {
    if (!window.confirm('Delete this material?')) return;
    try {
      await axios.delete(`/api/courses/${courseId}/materials/${materialId}`);
      fetchCourse();
    } catch (error) {
      alert('Error deleting material');
    }
  };

  // Assignment handlers
  const handleAddAssignment = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/courses/${courseId}/assignments`, assignmentForm);
      fetchCourse();
      setShowAssignmentModal(false);
      setAssignmentForm({ title: '', description: '', dueDate: '' });
    } catch (error) {
      alert(error.response?.data?.message || 'Error adding assignment');
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (!window.confirm('Delete this assignment?')) return;
    try {
      await axios.delete(`/api/courses/${courseId}/assignments/${assignmentId}`);
      fetchCourse();
    } catch (error) {
      alert('Error deleting assignment');
    }
  };

  // Announcement handlers
  const handleAddAnnouncement = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/courses/${courseId}/announcements`, announcementForm);
      fetchCourse();
      setShowAnnouncementModal(false);
      setAnnouncementForm({ title: '', content: '' });
    } catch (error) {
      alert(error.response?.data?.message || 'Error adding announcement');
    }
  };

  const handleDeleteAnnouncement = async (announcementId) => {
    if (!window.confirm('Delete this announcement?')) return;
    try {
      await axios.delete(`/api/courses/${courseId}/announcements/${announcementId}`);
      fetchCourse();
    } catch (error) {
      alert('Error deleting announcement');
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
    return (
      <>
        <Navbar />
        <div className="container py-5">
          <p>Course not found</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '85vh' }}>
        <div className="container py-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2>{course.title}</h2>
              <p className="text-muted">{course.category}</p>
            </div>
            <button className="btn btn-secondary" onClick={() => navigate('/tutor')}>
              Back to Dashboard
            </button>
          </div>

          {/* Stats Cards */}
          <div className="row mb-4">
            <div className="col-md-3">
              <div className="card text-center">
                <div className="card-body">
                  <h3>{course.modules?.length || 0}</h3>
                  <p className="text-muted">Modules</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center">
                <div className="card-body">
                  <h3>{course.materials?.length || 0}</h3>
                  <p className="text-muted">Materials</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center">
                <div className="card-body">
                  <h3>{course.assignments?.length || 0}</h3>
                  <p className="text-muted">Assignments</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center">
                <div className="card-body">
                  <h3>{course.announcements?.length || 0}</h3>
                  <p className="text-muted">Announcements</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <ul className="nav nav-tabs mb-4">
            <li className="nav-item">
              <button className={`nav-link ${activeTab === 'modules' ? 'active' : ''}`} onClick={() => setActiveTab('modules')}>
                Modules
              </button>
            </li>
            <li className="nav-item">
              <button className={`nav-link ${activeTab === 'materials' ? 'active' : ''}`} onClick={() => setActiveTab('materials')}>
                Materials
              </button>
            </li>
            <li className="nav-item">
              <button className={`nav-link ${activeTab === 'assignments' ? 'active' : ''}`} onClick={() => setActiveTab('assignments')}>
                Assignments
              </button>
            </li>
            <li className="nav-item">
              <button className={`nav-link ${activeTab === 'announcements' ? 'active' : ''}`} onClick={() => setActiveTab('announcements')}>
                Announcements
              </button>
            </li>
            <li className="nav-item ms-auto">
              <button className="btn btn-sm btn-info" onClick={fetchStudents}>
                View Students ({course.enrolledStudents?.length || 0})
              </button>
            </li>
          </ul>

          {/* Modules Tab */}
          {activeTab === 'modules' && (
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5>Course Modules</h5>
                <button className="btn btn-primary btn-sm" onClick={() => setShowModuleModal(true)}>
                  <i className="bi bi-plus-circle me-2"></i> Add Module
                </button>
              </div>
              <div className="card-body">
                {!course.modules || course.modules.length === 0 ? (
                  <p className="text-muted">No modules yet</p>
                ) : (
                  <div className="list-group">
                    {course.modules.map((module, idx) => (
                      <div key={idx} className="list-group-item">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h6>{module.title}</h6>
                            <p className="text-muted small">{module.description}</p>
                            <small className="text-secondary">Order: {module.order}</small>
                          </div>
                          <button className="btn btn-sm btn-danger" onClick={() => handleDeleteModule(idx)}>
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Materials Tab */}
          {activeTab === 'materials' && (
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5>Course Materials</h5>
                <button className="btn btn-primary btn-sm" onClick={() => setShowMaterialModal(true)}>
                  <i className="bi bi-plus-circle me-2"></i> Add Material
                </button>
              </div>
              <div className="card-body">
                {!course.materials || course.materials.length === 0 ? (
                  <p className="text-muted">No materials yet</p>
                ) : (
                  <div className="list-group">
                    {course.materials.map((material, idx) => (
                      <div key={idx} className="list-group-item">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h6>
                              <i className={`bi ${material.type === 'pdf' ? 'bi-file-pdf' : 'bi-file-image'} me-2`}></i>
                              {material.title}
                            </h6>
                            <small className="text-secondary">Type: {material.type}</small>
                            {material.url && (
                              <>
                                <br />
                                <a href={material.url} target="_blank" rel="noopener noreferrer" className="small text-primary">
                                  Download
                                </a>
                              </>
                            )}
                          </div>
                          <button className="btn btn-sm btn-danger" onClick={() => handleDeleteMaterial(idx)}>
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Assignments Tab */}
          {activeTab === 'assignments' && (
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5>Course Assignments</h5>
                <button className="btn btn-primary btn-sm" onClick={() => setShowAssignmentModal(true)}>
                  <i className="bi bi-plus-circle me-2"></i> Add Assignment
                </button>
              </div>
              <div className="card-body">
                {!course.assignments || course.assignments.length === 0 ? (
                  <p className="text-muted">No assignments yet</p>
                ) : (
                  <div className="list-group">
                    {course.assignments.map((assignment, idx) => (
                      <div key={idx} className="list-group-item">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h6>{assignment.title}</h6>
                            <p className="text-muted small">{assignment.description}</p>
                            {assignment.dueDate && (
                              <small className="text-secondary">
                                Due: {new Date(assignment.dueDate).toLocaleDateString()}
                              </small>
                            )}
                          </div>
                          <button className="btn btn-sm btn-danger" onClick={() => handleDeleteAssignment(idx)}>
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Announcements Tab */}
          {activeTab === 'announcements' && (
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5>Course Announcements</h5>
                <button className="btn btn-primary btn-sm" onClick={() => setShowAnnouncementModal(true)}>
                  <i className="bi bi-plus-circle me-2"></i> Add Announcement
                </button>
              </div>
              <div className="card-body">
                {!course.announcements || course.announcements.length === 0 ? (
                  <p className="text-muted">No announcements yet</p>
                ) : (
                  <div className="list-group">
                    {course.announcements.map((announcement, idx) => (
                      <div key={idx} className="list-group-item">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h6>{announcement.title}</h6>
                            <p className="text-muted small">{announcement.content}</p>
                          </div>
                          <button className="btn btn-sm btn-danger" onClick={() => handleDeleteAnnouncement(idx)}>
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Module Modal */}
      {showModuleModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Add Module</h5>
                <button type="button" className="btn-close" onClick={() => setShowModuleModal(false)}></button>
              </div>
              <form onSubmit={handleAddModule}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Module Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={moduleForm.title}
                      onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={moduleForm.description}
                      onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Order</label>
                    <input
                      type="number"
                      className="form-control"
                      value={moduleForm.order}
                      onChange={(e) => setModuleForm({ ...moduleForm, order: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModuleModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Add Module
                  </button>
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
                <h5>Add Material</h5>
                <button type="button" className="btn-close" onClick={() => setShowMaterialModal(false)}></button>
              </div>
              <form onSubmit={handleAddMaterial}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Material Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={materialForm.title}
                      onChange={(e) => setMaterialForm({ ...materialForm, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Type</label>
                    <select
                      className="form-select"
                      value={materialForm.type}
                      onChange={(e) => setMaterialForm({ ...materialForm, type: e.target.value })}
                    >
                      <option value="pdf">PDF</option>
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                      <option value="document">Document</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Upload File</label>
                    <input
                      type="file"
                      className="form-control"
                      onChange={(e) => setMaterialForm({ ...materialForm, file: e.target.files[0] })}
                      accept=".pdf,.jpg,.jpeg,.png,.gif,.mp4,.doc,.docx"
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowMaterialModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={uploading}>
                    {uploading ? 'Uploading...' : 'Add Material'}
                  </button>
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
                <h5>Add Assignment</h5>
                <button type="button" className="btn-close" onClick={() => setShowAssignmentModal(false)}></button>
              </div>
              <form onSubmit={handleAddAssignment}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Assignment Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={assignmentForm.title}
                      onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={assignmentForm.description}
                      onChange={(e) => setAssignmentForm({ ...assignmentForm, description: e.target.value })}
                      required
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Due Date</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      value={assignmentForm.dueDate}
                      onChange={(e) => setAssignmentForm({ ...assignmentForm, dueDate: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowAssignmentModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Add Assignment
                  </button>
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
                <h5>Add Announcement</h5>
                <button type="button" className="btn-close" onClick={() => setShowAnnouncementModal(false)}></button>
              </div>
              <form onSubmit={handleAddAnnouncement}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={announcementForm.title}
                      onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Content</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      value={announcementForm.content}
                      onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e.target.value })}
                      required
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowAnnouncementModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Add Announcement
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Students Modal */}
      {showStudentsModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header d-flex justify-content-between align-items-center">
                <h5>Enrolled Students ({students.length})</h5>
                <div>
                  <button className="btn btn-sm btn-success me-2" onClick={exportStudents}>
                    <i className="bi bi-download me-2"></i> Export CSV
                  </button>
                  <button type="button" className="btn-close" onClick={() => setShowStudentsModal(false)}></button>
                </div>
              </div>
              <div className="modal-body">
                {students.length === 0 ? (
                  <p className="text-muted">No students enrolled yet</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Enrolled Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((student, idx) => (
                          <tr key={idx}>
                            <td>{student.name}</td>
                            <td>{student.email}</td>
                            <td>{student.role}</td>
                            <td>{new Date(student.enrolledAt).toLocaleDateString()}</td>
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
      )}
      <Footer />
    </>
  );
};

export default ManageCourse;
