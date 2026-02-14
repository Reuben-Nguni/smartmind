import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark sticky-top">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <i className="bi bi-mortarboard-fill me-2"></i>
          SmartMind
        </Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/services">Services</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">About</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact">Contact</Link>
            </li>
            {user && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/notifications">
                    <i className="bi bi-bell me-1"></i> Notifications
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/profile">
                    <i className="bi bi-person me-1"></i> Profile
                  </Link>
                </li>
              </>
            )}
            <li className="nav-item ms-lg-3 d-flex align-items-center">
              {!user ? (
                <>
                  <Link className="btn btn-light me-2" to="/login">
                    <i className="bi bi-person-circle me-1"></i> Login
                  </Link>
                  <Link className="btn btn-outline-light" to="/register">Register</Link>
                </>
              ) : (
                <>
                  <Link className="btn btn-light me-2" to="/dashboard">Dashboard</Link>
                  <button className="btn btn-outline-light" onClick={logout}>Logout</button>
                </>
              )}
            </li>
            <li className="nav-item ms-2 d-flex align-items-center">
              <button
                className="btn btn-sm btn-toggle"
                onClick={toggleTheme}
                aria-label="Toggle theme"
                title={theme === 'light' ? 'Switch to dark' : 'Switch to light'}
              >
                {theme === 'light' ? <i className="bi bi-moon-fill"></i> : <i className="bi bi-sun-fill"></i>}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

