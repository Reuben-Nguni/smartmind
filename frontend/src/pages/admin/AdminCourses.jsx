import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchCourses(); }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get('/api/courses');
      setCourses(res.data);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '85vh' }}>
      <div className="container-fluid p-4">
      <div className="page-header mb-4">
        <h2>Courses</h2>
        <p className="text-muted">View and manage all courses</p>
      </div>

      {loading ? (
        <div className="loader-container"><div className="loader"></div></div>
      ) : (
        <div className="row g-4">
          {courses.map(c => (
            <div key={c._id} className="col-md-4">
              <div className="card course-card">
                <img src={c.thumbnail} alt="thumb" className="course-thumbnail" />
                <div className="card-body">
                  <h5 className="card-title">{c.title}</h5>
                  <p className="card-text">{c.description?.slice(0, 100)}...</p>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <small className="text-muted">{c.category}</small>
                    <span className={c.isPublished ? 'badge bg-success' : 'badge bg-warning'}>
                      {c.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
      </div>
      <Footer />
    </>
  );
}
