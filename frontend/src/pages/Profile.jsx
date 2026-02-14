import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Profile = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    role: '',
    phone: '',
    bio: '',
    avatar: ''
  });
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [activeTab, setActiveTab] = useState('info');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        email: user.email || '',
        role: user.role || '',
        phone: user.phone || '',
        bio: user.bio || '',
        avatar: user.avatar || ''
      });
      setLoading(false);
    }
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log('Avatar upload started:', { fileName: file.name, fileSize: file.size, fileType: file.type });

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please select an image file' });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image size must be less than 5MB' });
      return;
    }

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      setSaving(true);
      console.log('Uploading avatar to /api/users/avatar');
      const response = await axios.post('/api/users/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log('Avatar upload response:', response.data);
      setProfile(prev => ({ ...prev, avatar: response.data.avatar }));
      setMessage({ type: 'success', text: 'Avatar updated successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Avatar upload error:', error.response?.data || error.message);
      setMessage({ type: 'error', text: error.response?.data?.message || error.message || 'Error uploading avatar' });
    } finally {
      setSaving(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await axios.put(`/api/users/${user._id}`, {
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        bio: profile.bio
      });
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Error updating profile' });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (passwords.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'New password must be at least 6 characters' });
      return;
    }

    try {
      setSaving(true);
      await axios.put(`/api/users/${user._id}/password`, {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Error changing password' });
    } finally {
      setSaving(false);
    }
  };

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
        <div className="container py-4">
          <div className="row">
            {/* Sidebar - Avatar & Quick Info */}
            <div className="col-md-3">
              <div className="card text-center">
                <div className="card-body">
                  {/* Avatar */}
                  <div className="mb-3">
                    <div
                      onClick={handleAvatarClick}
                      style={{
                        width: '120px',
                        height: '120px',
                        margin: '0 auto',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        backgroundColor: '#e9ecef',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '3px solid #007bff',
                        transition: 'transform 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      {profile.avatar ? (
                        <img
                          src={profile.avatar}
                          alt="Avatar"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <i className="bi bi-person-circle" style={{ fontSize: '60px', color: '#999' }}></i>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleAvatarUpload}
                    />
                    <small className="text-muted d-block mt-2">Click to change avatar</small>
                  </div>

                  {/* Quick Info */}
                  <h5>{profile.name}</h5>
                  <p className="text-muted small mb-2">{profile.email}</p>
                  <span className="badge bg-primary">{profile.role}</span>

                  {/* Navigation Buttons */}
                  <div className="mt-4">
                    <button
                      className={`btn w-100 mb-2 ${activeTab === 'info' ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setActiveTab('info')}
                    >
                      <i className="bi bi-person me-2"></i> Profile Info
                    </button>
                    <button
                      className={`btn w-100 mb-2 ${activeTab === 'password' ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setActiveTab('password')}
                    >
                      <i className="bi bi-lock me-2"></i> Change Password
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="col-md-9">
              {/* Message Alert */}
              {message.text && (
                <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'} alert-dismissible fade show`} role="alert">
                  {message.type === 'success' ? (
                    <i className="bi bi-check-circle me-2"></i>
                  ) : (
                    <i className="bi bi-exclamation-circle me-2"></i>
                  )}
                  {message.text}
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setMessage({ type: '', text: '' })}
                  ></button>
                </div>
              )}

              {/* Profile Info Tab */}
              {activeTab === 'info' && (
                <div className="card">
                  <div className="card-header bg-white">
                    <h5 className="mb-0">Update Profile Information</h5>
                  </div>
                  <div className="card-body">
                    <form onSubmit={handleProfileSubmit}>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Full Name *</label>
                          <input
                            type="text"
                            className="form-control"
                            name="name"
                            value={profile.name}
                            onChange={handleProfileChange}
                            required
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Email Address *</label>
                          <input
                            type="email"
                            className="form-control"
                            name="email"
                            value={profile.email}
                            onChange={handleProfileChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Phone Number</label>
                          <input
                            type="tel"
                            className="form-control"
                            name="phone"
                            value={profile.phone}
                            onChange={handleProfileChange}
                            placeholder="+1 (555) 000-0000"
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Role</label>
                          <input
                            type="text"
                            className="form-control"
                            value={profile.role}
                            disabled
                          />
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Bio</label>
                        <textarea
                          className="form-control"
                          name="bio"
                          value={profile.bio}
                          onChange={handleProfileChange}
                          rows="4"
                          placeholder="Tell us about yourself..."
                        ></textarea>
                      </div>

                      <div className="d-flex gap-2">
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={saving}
                        >
                          {saving ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Saving...
                            </>
                          ) : (
                            <>
                              <i className="bi bi-save me-2"></i> Save Changes
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Change Password Tab */}
              {activeTab === 'password' && (
                <div className="card">
                  <div className="card-header bg-white">
                    <h5 className="mb-0">Change Your Password</h5>
                  </div>
                  <div className="card-body">
                    <form onSubmit={handlePasswordSubmit}>
                      <div className="mb-3">
                        <label className="form-label">Current Password *</label>
                        <input
                          type="password"
                          className="form-control"
                          name="currentPassword"
                          value={passwords.currentPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">New Password *</label>
                        <input
                          type="password"
                          className="form-control"
                          name="newPassword"
                          value={passwords.newPassword}
                          onChange={handlePasswordChange}
                          placeholder="At least 6 characters"
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Confirm New Password *</label>
                        <input
                          type="password"
                          className="form-control"
                          name="confirmPassword"
                          value={passwords.confirmPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                      </div>

                      {passwords.newPassword !== passwords.confirmPassword && passwords.confirmPassword && (
                        <div className="alert alert-warning">
                          <i className="bi bi-exclamation-triangle me-2"></i>
                          Passwords do not match
                        </div>
                      )}

                      <div className="d-flex gap-2">
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={saving}
                        >
                          {saving ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Updating...
                            </>
                          ) : (
                            <>
                              <i className="bi bi-key me-2"></i> Change Password
                            </>
                          )}
                        </button>
                      </div>
                    </form>
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

export default Profile;
