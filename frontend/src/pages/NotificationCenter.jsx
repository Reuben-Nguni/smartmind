import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';

export default function NotificationCenter() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('notifications');

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [user]);

  const fetchData = async () => {
    try {
      if (user?.role === 'learner') {
        // Fetch learner data
        const [announcementsRes, coursesRes] = await Promise.all([
          axios.get('/api/announcements'),
          axios.get('/api/enrollments/learner')
        ]);
        setAnnouncements(announcementsRes.data);
        generateTimetable(coursesRes.data);
      } else if (user?.role === 'tutor') {
        // Fetch tutor data
        const [lessonsRes, coursesRes] = await Promise.all([
          axios.get('/api/lessons/tutor'),
          axios.get('/api/courses/tutor/my-courses')
        ]);
        setLessons(lessonsRes.data);
      }
      
      // Fetch general notifications for all roles
      const notificationsRes = await axios.get('/api/notifications');
      setNotifications(notificationsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateTimetable = (enrollments) => {
    // Generate a sample weekly timetable
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const timeSlots = [
      '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
      '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
    ];

    const schedule = days.map((day, dayIndex) => ({
      day,
      slots: timeSlots.map((time, slotIndex) => {
        // Assign courses to random slots for demo
        const enrollment = enrollments[(dayIndex + slotIndex) % enrollments.length];
        return {
          time,
          course: enrollment?.courseId?.title || null,
          tutor: enrollment?.courseId?.tutor?.name || null,
          type: enrollment ? 'live' : 'free'
        };
      })
    }));

    setTimetable(schedule);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container py-5 text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container-fluid py-4">
        <div className="row mb-4">
          <div className="col-12">
            <h1 className="mb-2">Notification Center</h1>
            <p className="text-muted">Stay updated with your courses and activities</p>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="row mb-4">
          <div className="col-12">
            <ul className="nav nav-tabs" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${activeTab === 'notifications' ? 'active' : ''}`}
                  onClick={() => setActiveTab('notifications')}
                  type="button"
                  role="tab"
                >
                  <i className="bi bi-bell me-2"></i> Notifications
                </button>
              </li>

              {user?.role === 'learner' && (
                <>
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link ${activeTab === 'timetable' ? 'active' : ''}`}
                      onClick={() => setActiveTab('timetable')}
                      type="button"
                      role="tab"
                    >
                      <i className="bi bi-calendar-event me-2"></i> Timetable
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link ${activeTab === 'announcements' ? 'active' : ''}`}
                      onClick={() => setActiveTab('announcements')}
                      type="button"
                      role="tab"
                    >
                      <i className="bi bi-megaphone me-2"></i> Announcements
                    </button>
                  </li>
                </>
              )}

              {user?.role === 'tutor' && (
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === 'lessons' ? 'active' : ''}`}
                    onClick={() => setActiveTab('lessons')}
                    type="button"
                    role="tab"
                  >
                    <i className="bi bi-play-circle me-2"></i> Live Lessons
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header bg-light">
                  <h5 className="mb-0">Recent Notifications</h5>
                </div>
                <div className="card-body" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                  {notifications.length === 0 ? (
                    <div className="text-center text-muted py-5">
                      <i className="bi bi-inbox" style={{ fontSize: '2rem' }}></i>
                      <p className="mt-3">No notifications yet</p>
                    </div>
                  ) : (
                    notifications.map(notif => (
                      <div key={notif._id} className="border-bottom pb-3 mb-3">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h6 className="mb-1">{notif.title}</h6>
                            <p className="text-muted small mb-1">{notif.message}</p>
                            <small className="text-muted">{formatDate(notif.createdAt)}</small>
                          </div>
                          <span className={`badge ${notif.type === 'urgent' ? 'bg-danger' : 'bg-info'}`}>
                            {notif.type}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Timetable Tab (Learners Only) */}
        {activeTab === 'timetable' && user?.role === 'learner' && (
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header bg-light">
                  <h5 className="mb-0">Weekly Timetable</h5>
                </div>
                <div className="card-body" style={{ overflowX: 'auto' }}>
                  <table className="table table-bordered table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th style={{ minWidth: '80px' }}>Time</th>
                        {timetable.map((day, idx) => (
                          <th key={idx} style={{ minWidth: '120px' }} className="text-center">
                            {day.day}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {timetable[0]?.slots.map((_, slotIdx) => (
                        <tr key={slotIdx}>
                          <td className="fw-bold" style={{ minWidth: '80px' }}>
                            {timetable[0].slots[slotIdx].time}
                          </td>
                          {timetable.map((day, dayIdx) => {
                            const slot = day.slots[slotIdx];
                            return (
                              <td
                                key={dayIdx}
                                className={`text-center ${slot.course ? 'bg-light' : ''}`}
                                style={{ minWidth: '120px' }}
                              >
                                {slot.course ? (
                                  <div>
                                    <strong className="d-block">{slot.course}</strong>
                                    <small className="text-muted d-block">{slot.tutor}</small>
                                    <span className={`badge ${slot.type === 'live' ? 'bg-success' : 'bg-secondary'}`}>
                                      {slot.type}
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-muted">-</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Announcements Tab (Learners Only) */}
        {activeTab === 'announcements' && user?.role === 'learner' && (
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header bg-light">
                  <h5 className="mb-0">Course Announcements</h5>
                </div>
                <div className="card-body" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                  {announcements.length === 0 ? (
                    <div className="text-center text-muted py-5">
                      <i className="bi bi-megaphone" style={{ fontSize: '2rem' }}></i>
                      <p className="mt-3">No announcements at this moment</p>
                    </div>
                  ) : (
                    announcements.map(announcement => (
                      <div key={announcement._id} className="mb-4 pb-4 border-bottom">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6 className="mb-0">{announcement.courseTitle}</h6>
                          <small className="text-muted">{formatDate(announcement.createdAt)}</small>
                        </div>
                        <p className="text-muted small mb-2">By: {announcement.tutorName}</p>
                        <p className="mb-0">{announcement.content}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Live Lessons Tab (Tutors Only) */}
        {activeTab === 'lessons' && user?.role === 'tutor' && (
          <div className="row">
            <div className="col-md-8">
              <div className="card mb-4">
                <div className="card-header bg-light">
                  <h5 className="mb-0">Scheduled Live Lessons</h5>
                </div>
                <div className="card-body" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                  {lessons.length === 0 ? (
                    <div className="text-center text-muted py-5">
                      <i className="bi bi-play-circle" style={{ fontSize: '2rem' }}></i>
                      <p className="mt-3">No live lessons scheduled</p>
                    </div>
                  ) : (
                    lessons.map(lesson => (
                      <div key={lesson._id} className="mb-4 pb-4 border-bottom">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h6 className="mb-2">{lesson.courseTitle}</h6>
                            <p className="text-muted small mb-2">
                              <i className="bi bi-calendar-event me-2"></i>
                              {formatDate(lesson.scheduledDate)}
                            </p>
                            <p className="text-muted small mb-2">
                              <i className="bi bi-person me-2"></i>
                              {lesson.enrolledCount} students enrolled
                            </p>
                            <p className="mb-0">{lesson.description}</p>
                          </div>
                          <div>
                            {lesson.status === 'scheduled' && (
                              <button className="btn btn-sm btn-success">
                                <i className="bi bi-play-fill me-1"></i> Start Live
                              </button>
                            )}
                            {lesson.status === 'live' && (
                              <span className="badge bg-danger animate-pulse">
                                <i className="bi bi-circle-fill me-1"></i> LIVE
                              </span>
                            )}
                            {lesson.status === 'completed' && (
                              <span className="badge bg-secondary">Completed</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card">
                <div className="card-header bg-light">
                  <h5 className="mb-0">Add New Lesson</h5>
                </div>
                <div className="card-body">
                  <form>
                    <div className="mb-3">
                      <label className="form-label">Course</label>
                      <select className="form-select">
                        <option>Select a course...</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Lesson Title</label>
                      <input type="text" className="form-control" placeholder="e.g., Introduction to React" />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Schedule Date & Time</label>
                      <input type="datetime-local" className="form-control" />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea className="form-control" rows="3" placeholder="Lesson details..."></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary w-100">
                      <i className="bi bi-plus-circle me-2"></i> Schedule Lesson
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
