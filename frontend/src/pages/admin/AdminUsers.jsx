import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import Modal from '../../components/Modal';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState({ field: 'createdAt', dir: -1 });
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);

  useEffect(() => { fetchUsers(); const iv = setInterval(fetchUsers, 10000); return () => clearInterval(iv); }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  const sorted = useMemo(() => {
    const arr = [...users];
    arr.sort((a,b) => {
      const f = sortBy.field;
      if (a[f] < b[f]) return -1 * sortBy.dir;
      if (a[f] > b[f]) return 1 * sortBy.dir;
      return 0;
    });
    return arr;
  }, [users, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const pageData = sorted.slice((page-1)*pageSize, page*pageSize);

  const changeSort = (field) => {
    setSortBy(prev => prev.field === field ? { field, dir: -prev.dir } : { field, dir: -1 });
    setPage(1);
  };

  const confirmAction = (user, action) => {
    setModalData({ user, action });
    setShowModal(true);
  };

  const handleConfirm = async () => {
    const { user, action } = modalData;
    setShowModal(false);
    try {
      if (action === 'delete') {
        await axios.delete(`/api/users/${user._id}`);
      } else {
        await axios.put(`/api/users/${user._id}/status`, { status: action });
      }
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Error performing action');
    }
  };

  const exportCSV = () => {
    const headers = ['name','email','role','status','createdAt'];
    const rows = users.map(u => headers.map(h => (u[h] || '').toString().replace(/"/g,'""')));
    const csv = [headers.join(','), ...rows.map(r => '"'+r.join('","')+'"')].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'users.csv'; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '85vh' }}>
      <div className="container-fluid p-4">
      <div className="page-header mb-4">
        <h2>Users</h2>
        <p className="text-muted">Manage platform users and approvals</p>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <button className="btn btn-outline-primary me-2" onClick={() => fetchUsers()}>Refresh</button>
          <button className="btn btn-outline-secondary" onClick={exportCSV}>Export CSV</button>
        </div>
        <div className="text-muted">Total: {users.length}</div>
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
                    <th onClick={() => changeSort('name')} style={{cursor:'pointer'}}>Name</th>
                    <th onClick={() => changeSort('email')} style={{cursor:'pointer'}}>Email</th>
                    <th onClick={() => changeSort('role')} style={{cursor:'pointer'}}>Role</th>
                    <th onClick={() => changeSort('status')} style={{cursor:'pointer'}}>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pageData.map(u => (
                    <tr key={u._id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.role}</td>
                      <td>{u.status}</td>
                      <td>
                        {u.status === 'pending' && <button className="btn btn-success btn-sm me-2" onClick={() => confirmAction(u, 'approved')}>Approve</button>}
                        {u.status === 'pending' && <button className="btn btn-danger btn-sm me-2" onClick={() => confirmAction(u, 'rejected')}>Reject</button>}
                        {u.role !== 'admin' && <button className="btn btn-outline-danger btn-sm" onClick={() => confirmAction(u, 'delete')}>Delete</button>}
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
        title={modalData?.action === 'delete' ? 'Confirm Delete' : 'Confirm Action'}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirm}
        confirmLabel={modalData?.action === 'delete' ? 'Delete' : 'Confirm'}
      >
        <p>Are you sure you want to <strong>{modalData?.action}</strong> user <strong>{modalData?.user?.name}</strong>?</p>
      </Modal>
      </div>
      </div>
      <Footer />
    </>
  );
}
