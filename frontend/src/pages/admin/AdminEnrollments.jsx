import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import Modal from '../../components/Modal';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function AdminEnrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState({ field: 'enrolledAt', dir: -1 });
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);

  useEffect(() => { fetchEnrollments(); const iv = setInterval(fetchEnrollments, 10000); return () => clearInterval(iv); }, []);

  const fetchEnrollments = async () => {
    try {
      const res = await axios.get('/api/enrollments/admin');
      setEnrollments(res.data);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  const sorted = useMemo(() => {
    const arr = [...enrollments];
    arr.sort((a,b) => {
      const f = sortBy.field;
      const va = a[f]; const vb = b[f];
      if (va < vb) return -1 * sortBy.dir;
      if (va > vb) return 1 * sortBy.dir;
      return 0;
    });
    return arr;
  }, [enrollments, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const pageData = sorted.slice((page-1)*pageSize, page*pageSize);

  const changeSort = (field) => {
    setSortBy(prev => prev.field === field ? { field, dir: -prev.dir } : { field, dir: -1 });
    setPage(1);
  };

  const confirmAction = (enrollment, action) => {
    setModalData({ enrollment, action });
    setShowModal(true);
  };

  const handleConfirm = async () => {
    const { enrollment, action } = modalData;
    setShowModal(false);
    try {
      if (action === 'delete') {
        // delete enrollment endpoint not implemented; fake by updating status
        await axios.put(`/api/enrollments/${enrollment._id}/status`, { status: 'rejected' });
      } else if (action === 'approve') {
        await axios.put(`/api/enrollments/${enrollment._id}/status`, { status: 'approved' });
      }
      fetchEnrollments();
    } catch (err) {
      alert(err.response?.data?.message || 'Error performing action');
    }
  };

  const exportCSV = () => {
    const headers = ['learner','course','status','enrolledAt'];
    const rows = enrollments.map(e => [e.learnerId?.name, e.courseId?.title, e.status, new Date(e.enrolledAt).toLocaleString()]);
    const csv = [headers.join(','), ...rows.map(r => '"'+r.join('","')+'"')].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'enrollments.csv'; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '85vh' }}>
      <div className="container-fluid p-4">
      <div className="page-header mb-4">
        <h2>Enrollments</h2>
        <p className="text-muted">Track and manage enrollment requests</p>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <button className="btn btn-outline-primary me-2" onClick={() => fetchEnrollments()}>Refresh</button>
          <button className="btn btn-outline-secondary" onClick={exportCSV}>Export CSV</button>
        </div>
        <div className="text-muted">Total: {enrollments.length}</div>
      </div>

      {loading ? (
        <div className="loader-container"><div className="loader"></div></div>
      ) : (
        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th onClick={() => changeSort('learnerId')} style={{cursor:'pointer'}}>Learner</th>
                    <th onClick={() => changeSort('courseId')} style={{cursor:'pointer'}}>Course</th>
                    <th onClick={() => changeSort('status')} style={{cursor:'pointer'}}>Status</th>
                    <th onClick={() => changeSort('enrolledAt')} style={{cursor:'pointer'}}>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pageData.map(e => (
                    <tr key={e._id}>
                      <td>{e.learnerId?.name}</td>
                      <td>{e.courseId?.title}</td>
                      <td>{e.status}</td>
                      <td>{new Date(e.enrolledAt).toLocaleDateString()}</td>
                      <td>
                        {e.status === 'pending' && <button className="btn btn-success btn-sm me-2" onClick={() => confirmAction(e, 'approve')}>Approve</button>}
                        <button className="btn btn-outline-danger btn-sm" onClick={() => confirmAction(e, 'delete')}>Reject</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="d-flex justify-content-between align-items-center mt-3">
              <div>
                <button className="btn btn-sm btn-outline-primary me-2" disabled={page<=1} onClick={() => setPage(p => Math.max(1,p-1))}>Prev</button>
                <button className="btn btn-sm btn-outline-primary" disabled={page>=totalPages} onClick={() => setPage(p => Math.min(totalPages,p+1))}>Next</button>
              </div>
              <div className="text-muted">Page {page} / {totalPages}</div>
            </div>
          </div>
        </div>
      )}

      <Modal
        show={showModal}
        title={modalData?.action === 'delete' ? 'Confirm Reject' : 'Confirm Approve'}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirm}
        confirmLabel={modalData?.action === 'delete' ? 'Reject' : 'Approve'}
      >
        <p>Are you sure you want to <strong>{modalData?.action}</strong> this enrollment request?</p>
      </Modal>
      </div>
      </div>
      <Footer />
    </>
  );
}
