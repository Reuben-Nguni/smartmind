import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Dynamic Chart import
const loadChart = async () => {
  const mod = await import('https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js');
  return mod.Chart;
};

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  
  const [pendingUsers, setPendingUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({ users: 0, tutors: 0, learners: 0, enrollments: 0 });
  
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, coursesRes, enrollmentsRes] = await Promise.all([
        axios.get('/api/users'),
        axios.get('/api/courses'),
        axios.get('/api/enrollments/admin')
      ]);
      
      setAllUsers(usersRes.data);
      setCourses(coursesRes.data);
      setEnrollments(enrollmentsRes.data);
      setPendingUsers(usersRes.data.filter(u => u.status === 'pending'));
      
      // Compute metrics
      const total = usersRes.data.length;
      setMetrics({
        users: total,
        tutors: usersRes.data.filter(u => u.role === 'tutor').length,
        learners: usersRes.data.filter(u => u.role === 'learner').length,
        enrollments: enrollmentsRes.data.length
      });

      // Prepare enrollment chart data (last 7 days)
      const counts = Array(7).fill(0);
      const labels = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        labels.push(d.toLocaleDateString());
      }
      enrollmentsRes.data.forEach(e => {
        const d = new Date(e.enrolledAt).toLocaleDateString();
        const idx = labels.indexOf(d);
        if (idx >= 0) counts[idx] += 1;
      });

      // Render chart
      const Chart = await loadChart();
      if (chartInstance.current) chartInstance.current.destroy();
      
      const ctx = chartRef.current?.getContext('2d');
      if (ctx) {
        const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color') || '#ff8a65';
        chartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels,
            datasets: [{
              label: 'Enrollments',
              data: counts,
              tension: 0.3,
              borderColor: primaryColor,
              backgroundColor: 'transparent'
            }]
          },
          options: { responsive: true, plugins: { legend: { display: false } } }
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Polling for real-time metrics
  useEffect(() => {
    const iv = setInterval(fetchData, 10000);
    return () => clearInterval(iv);
  }, []);

  const handleUserStatus = async (userId, status) => {
    try {
      await axios.put(`/api/users/${userId}/status`, { status });
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating status');
    }
  };

  const handleUserDelete = async (userId) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await axios.delete(`/api/users/${userId}`);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error');
    }
  };

  const handleCourseStatus = async (courseId, isPublished) => {
    try {
      await axios.put(`/api/courses/${courseId}`, { isPublished });
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error');
    }
  };

  const handleCourseDelete = async (courseId) => {
    if (!window.confirm('Delete this course?')) return;
    try {
      await axios.delete(`/api/courses/${courseId}`);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error');
    }
  };

  if (loading) return <div className="container py-5"><p>Loading...</p></div>;

  return (
    <>
      <Navbar />
      <div className="container-fluid py-4">
      <h1 className="mb-4">Admin Dashboard</h1>

      {/* Metrics Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Total Users</h5>
              <h2 className="text-primary">{metrics.users}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Tutors</h5>
              <h2 className="text-info">{metrics.tutors}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Learners</h5>
              <h2 className="text-success">{metrics.learners}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Enrollments</h5>
              <h2 className="text-warning">{metrics.enrollments}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="card mb-4">
        <div className="card-header">
          <h5>Enrollment Trend (Last 7 Days)</h5>
        </div>
        <div className="card-body">
          <canvas ref={chartRef} height="80"></canvas>
        </div>
      </div>

      {/* Management Tiles */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">
                <i className="bi bi-person-check me-2"></i> Pending Approvals
              </h5>
              <p className="text-muted">{pendingUsers.length} users awaiting review</p>
              <div className="mb-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {pendingUsers.slice(0, 5).map(u => (
                  <div key={u._id} className="d-flex justify-content-between align-items-start mb-2 pb-2 border-bottom">
                    <div className="flex-grow-1">
                      <div className="fw-bold small">{u.name}</div>
                      <small className="text-muted">{u.email}</small>
                    </div>
                    <div className="ms-2">
                      <button className="btn btn-sm btn-success me-1" onClick={() => handleUserStatus(u._id, 'approved')}>✓</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleUserStatus(u._id, 'rejected')}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/admin/users" className="btn btn-primary btn-sm w-100">Manage All Users</Link>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">
                <i className="bi bi-book me-2"></i> Courses
              </h5>
              <p className="text-muted">{courses.length} courses on platform</p>
              <div className="mb-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {courses.slice(0, 5).map(c => (
                  <div key={c._id} className="d-flex justify-content-between align-items-start mb-2 pb-2 border-bottom">
                    <div className="flex-grow-1">
                      <div className="fw-bold small">{c.title}</div>
                      <small className="text-muted">{c.tutor?.name || 'N/A'}</small>
                    </div>
                    <div className="ms-2">
                      <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleCourseStatus(c._id, !c.isPublished)}>
                        {c.isPublished ? 'Unpub' : 'Pub'}
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleCourseDelete(c._id)}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/admin/courses" className="btn btn-primary btn-sm w-100">Manage All Courses</Link>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">
                <i className="bi bi-person-plus me-2"></i> Enrollments
              </h5>
              <p className="text-muted">{enrollments.length} enrollment records</p>
              <div className="mb-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {enrollments.slice(0, 5).map(e => (
                  <div key={e._id} className="d-flex justify-content-between align-items-start mb-2 pb-2 border-bottom">
                    <div className="flex-grow-1">
                      <div className="fw-bold small">{e.learnerId?.name || 'N/A'}</div>
                      <small className="text-muted">{e.courseId?.title || 'N/A'}</small>
                    </div>
                    <span className={`badge ${e.status === 'approved' ? 'bg-success' : e.status === 'pending' ? 'bg-warning' : 'bg-danger'}`}>
                      {e.status}
                    </span>
                  </div>
                ))}
              </div>
              <Link to="/admin/enrollments" className="btn btn-primary btn-sm w-100">Manage All Enrollments</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <div className="row">
        <div className="col-md-2">
          <div className="card">
            <div className="list-group list-group-flush">
              <Link to="/admin" className="list-group-item list-group-item-action">
                <i className="bi bi-house me-2"></i> Dashboard
              </Link>
              <Link to="/admin/users" className="list-group-item list-group-item-action">
                <i className="bi bi-people me-2"></i> Users
              </Link>
              <Link to="/admin/courses" className="list-group-item list-group-item-action">
                <i className="bi bi-book me-2"></i> Courses
              </Link>
              <Link to="/admin/enrollments" className="list-group-item list-group-item-action">
                <i className="bi bi-person-plus me-2"></i> Enrollments
              </Link>
            </div>
          </div>
        </div>
      </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminDashboard;

