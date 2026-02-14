import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Modal from '../../components/Modal';

export default function PasswordRecovery() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [resetCode, setResetCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/users');
      setUsers(res.data);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load users' });
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGenerateReset = async (user) => {
    try {
      const response = await axios.post(`/api/users/${user._id}/generate-reset-code`);
      setSelectedUser(user);
      setResetCode(response.data.resetCode);
      setShowModal(true);
      setMessage({ type: 'success', text: 'Reset code generated successfully!' });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to generate reset code' 
      });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(resetCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sendResetEmail = async () => {
    try {
      await axios.post(`/api/users/${selectedUser._id}/send-password-reset-email`, {
        resetCode
      });
      setMessage({ 
        type: 'success', 
        text: 'Password reset email sent to ' + selectedUser.email 
      });
      setTimeout(() => {
        setShowModal(false);
        setResetCode('');
        setSelectedUser(null);
      }, 2000);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to send email' 
      });
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '85vh' }}>
        <div className="container-fluid p-4">
          <div className="page-header mb-4">
            <h2>Password Recovery</h2>
            <p className="text-muted">Help users reset their passwords</p>
          </div>

          {message.text && (
            <div className={`alert alert-${message.type === 'error' ? 'danger' : 'success'} alert-dismissible fade show`} role="alert">
              {message.text}
              <button type="button" className="btn-close" onClick={() => setMessage({ type: '', text: '' })}></button>
            </div>
          )}

          <div className="card mb-4">
            <div className="card-body">
              <div className="row g-3 align-items-end">
                <div className="col-md-6">
                  <label className="form-label">Search Users</label>
                  <div className="input-group">
                    <span className="input-group-text"><i className="bi bi-search"></i></span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <button 
                    className="btn btn-outline-primary w-100"
                    onClick={fetchUsers}
                  >
                    <i className="bi bi-arrow-clockwise me-2"></i>Refresh
                  </button>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="loader-container">
              <div className="loader"></div>
            </div>
          ) : (
            <div className="card">
              <div className="card-body">
                <div className="table-responsive">
                  {filteredUsers.length === 0 ? (
                    <div className="text-center py-5 text-muted">
                      <i className="bi bi-inbox" style={{ fontSize: '2rem' }}></i>
                      <p className="mt-3">No users found</p>
                    </div>
                  ) : (
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map(user => (
                          <tr key={user._id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                              <span className={`badge bg-${
                                user.role === 'admin' ? 'danger' :
                                user.role === 'tutor' ? 'primary' :
                                'success'
                              }`}>
                                {user.role}
                              </span>
                            </td>
                            <td>
                              <span className={`badge bg-${
                                user.status === 'approved' ? 'success' :
                                user.status === 'pending' ? 'warning' :
                                'secondary'
                              }`}>
                                {user.status}
                              </span>
                            </td>
                            <td>
                              <button
                                className="btn btn-sm btn-info"
                                onClick={() => handleGenerateReset(user)}
                              >
                                <i className="bi bi-key me-1"></i>Generate Reset
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal
        show={showModal}
        title={`Password Reset for ${selectedUser?.name}`}
        onClose={() => {
          setShowModal(false);
          setResetCode('');
        }}
        onConfirm={sendResetEmail}
        confirmLabel="Send Email"
      >
        <div className="password-recovery-modal">
          <p className="text-muted mb-3">Share this reset code with the user or send it via email:</p>

          <div className="alert alert-info mb-3">
            <strong>Reset Code:</strong>
            <div className="d-flex align-items-center gap-2 mt-2">
              <code style={{ fontSize: '1.1rem', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px', flex: 1 }}>
                {resetCode}
              </code>
              <button
                className={`btn btn-sm ${copied ? 'btn-success' : 'btn-outline-primary'}`}
                onClick={copyToClipboard}
              >
                <i className={`bi bi-${copied ? 'check' : 'files'} me-1`}></i>
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          <p className="text-muted small mb-3">
            <i className="bi bi-info-circle me-1"></i>
            This code will expire in 30 minutes.
          </p>

          <div className="alert alert-light">
            <strong>User Email:</strong> {selectedUser?.email}
          </div>

          <div className="alert alert-warning">
            <strong>Instructions for user:</strong>
            <ol className="mb-0 mt-2">
              <li>Go to "Forgot Password" page</li>
              <li>Enter their email address</li>
              <li>Enter this reset code</li>
              <li>Set a new password</li>
            </ol>
          </div>
        </div>
      </Modal>

      <Footer />
    </>
  );
}
