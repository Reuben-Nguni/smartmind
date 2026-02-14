import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [step, setStep] = useState(1); // 1: email, 2: verify code, 3: reset password
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setMessage({ type: 'error', text: 'Please enter your email address' });
      return;
    }

    try {
      setLoading(true);
      await axios.post('/api/auth/forgot-password', { email });
      setMessage({ 
        type: 'success', 
        text: 'Password reset code sent to your email. Check your inbox!' 
      });
      setStep(2);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Error sending reset code' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    
    if (!resetCode) {
      setMessage({ type: 'error', text: 'Please enter the reset code' });
      return;
    }

    try {
      setLoading(true);
      await axios.post('/api/auth/verify-reset-code', { email, code: resetCode });
      setMessage({ type: 'success', text: 'Code verified! Now set your new password.' });
      setStep(3);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Invalid or expired code' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      setMessage({ type: 'error', text: 'Please fill in all password fields' });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    try {
      setLoading(true);
      await axios.post('/api/auth/reset-password', { 
        email, 
        code: resetCode,
        newPassword 
      });
      setMessage({ type: 'success', text: 'Password reset successfully! Redirecting...' });
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Error resetting password' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-5">
              <div className="card shadow-lg">
                <div className="card-body p-4">
                  {/* Header */}
                  <div className="text-center mb-4">
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                      <i className="bi bi-key-fill text-primary"></i>
                    </div>
                    <h3 className="card-title">Reset Password</h3>
                    <p className="text-muted small">
                      {step === 1 && 'Enter your email to receive a reset code'}
                      {step === 2 && 'Enter the code sent to your email'}
                      {step === 3 && 'Create your new password'}
                    </p>
                  </div>

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

                  {/* Step 1: Email */}
                  {step === 1 && (
                    <form onSubmit={handleEmailSubmit}>
                      <div className="mb-3">
                        <label className="form-label">Email Address</label>
                        <input
                          type="email"
                          className="form-control form-control-lg"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="btn btn-primary btn-lg w-100"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Sending...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-envelope me-2"></i> Send Reset Code
                          </>
                        )}
                      </button>
                    </form>
                  )}

                  {/* Step 2: Verify Code */}
                  {step === 2 && (
                    <form onSubmit={handleCodeSubmit}>
                      <div className="mb-3">
                        <label className="form-label">Reset Code</label>
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          placeholder="Enter the 6-digit code"
                          value={resetCode}
                          onChange={(e) => setResetCode(e.target.value)}
                          maxLength="6"
                          required
                        />
                        <small className="text-muted">Check your email for the code</small>
                      </div>
                      <button
                        type="submit"
                        className="btn btn-primary btn-lg w-100"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Verifying...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-check-circle me-2"></i> Verify Code
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm w-100 mt-2"
                        onClick={() => {
                          setStep(1);
                          setResetCode('');
                          setMessage({ type: '', text: '' });
                        }}
                      >
                        Back to Email
                      </button>
                    </form>
                  )}

                  {/* Step 3: Reset Password */}
                  {step === 3 && (
                    <form onSubmit={handlePasswordReset}>
                      <div className="mb-3">
                        <label className="form-label">New Password</label>
                        <input
                          type="password"
                          className="form-control form-control-lg"
                          placeholder="Enter new password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Confirm Password</label>
                        <input
                          type="password"
                          className="form-control form-control-lg"
                          placeholder="Confirm password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                        {newPassword !== confirmPassword && confirmPassword && (
                          <small className="text-danger d-block mt-1">
                            <i className="bi bi-exclamation-circle me-1"></i> Passwords do not match
                          </small>
                        )}
                      </div>
                      <button
                        type="submit"
                        className="btn btn-primary btn-lg w-100"
                        disabled={loading || newPassword !== confirmPassword}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Resetting...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-lock me-2"></i> Reset Password
                          </>
                        )}
                      </button>
                    </form>
                  )}

                  {/* Footer Links */}
                  <div className="text-center mt-4">
                    <p className="text-muted small mb-0">
                      Remember your password?{' '}
                      <Link to="/login" className="text-primary text-decoration-none fw-bold">
                        Back to Login
                      </Link>
                    </p>
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="card mt-3 bg-light border-0">
                <div className="card-body">
                  <h6 className="card-title">
                    <i className="bi bi-info-circle text-info me-2"></i> Security Tips
                  </h6>
                  <ul className="small mb-0 ps-3">
                    <li>Never share your reset code with anyone</li>
                    <li>Use a strong password (6+ characters)</li>
                    <li>Code expires in 30 minutes</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ForgotPassword;
