import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-5 pb-4">
      <div className="container">
        <div className="row text-md-left">
          {/* Company Info */}
          <div className="col-md-4 col-lg-4 col-xl-4 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 font-weight-bold text-warning">
              <i className="bi bi-mortarboard-fill me-2"></i>SmartMind
            </h5>
            <p className="text-light">
              Empowering learners worldwide with cutting-edge online education. 
              Join thousands of students and tutors in our collaborative learning environment.
            </p>
            <div className="mt-3">
              <Link to="#" className="btn btn-outline-light btn-sm me-2">
                <i className="bi bi-facebook"></i>
              </Link>
              <Link to="#" className="btn btn-outline-light btn-sm me-2">
                <i className="bi bi-twitter-x"></i>
              </Link>
              <Link to="#" className="btn btn-outline-light btn-sm me-2">
                <i className="bi bi-linkedin"></i>
              </Link>
              <Link to="#" className="btn btn-outline-light btn-sm">
                <i className="bi bi-instagram"></i>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mt-3">
            <h6 className="text-uppercase mb-4 font-weight-bold text-warning">Quick Links</h6>
            <p><Link to="/" className="text-white text-decoration-none">Home</Link></p>
            <p><Link to="/services" className="text-white text-decoration-none">Services</Link></p>
            <p><Link to="/about" className="text-white text-decoration-none">About Us</Link></p>
            <p><Link to="/contact" className="text-white text-decoration-none">Contact</Link></p>
          </div>

          {/* Portals */}
          <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mt-3">
            <h6 className="text-uppercase mb-4 font-weight-bold text-warning">Portals</h6>
            <p><Link to="/login" className="text-white text-decoration-none">Student Login</Link></p>
            <p><Link to="/register" className="text-white text-decoration-none">Student Register</Link></p>
            <p><Link to="/courses" className="text-white text-decoration-none">Browse Courses</Link></p>
            <p><Link to="/dashboard" className="text-white text-decoration-none">Dashboard</Link></p>
          </div>

          {/* Contact Info */}
          <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mt-3">
            <h6 className="text-uppercase mb-4 font-weight-bold text-warning">Contact</h6>
            <p className="text-light">
              <i className="bi bi-geo-alt me-2"></i>
              munkoyo street, kabwe, zambia
            </p>
            <p className="text-light">
              <i className="bi bi-envelope me-2"></i>
              smartmind1@gmail.com
            </p>
            <p className="text-light">
              <i className="bi bi-telephone me-2"></i>
              +260 970067982 / +260 769963307
            </p>
          </div>
        </div>

        <div className="row align-items-center mt-4">
          <div className="col-md-7 col-lg-8">
            <p className="text-light">
              Copyright © {new Date().getFullYear()} SmartMind LMS. All rights reserved.
              <span className="ms-2">Designed with <i className="bi bi-heart-fill text-danger"></i> by SmartMind Team</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

