import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Home = () => {
  const features = [
    {
      icon: 'bi-laptop',
      title: 'Online Learning',
      description: 'Access courses from anywhere, anytime. Learn at your own pace with our flexible learning platform.'
    },
    {
      icon: 'bi-people',
      title: 'Expert Tutors',
      description: 'Learn from industry professionals and experienced educators who are passionate about teaching.'
    },
    {
      icon: 'bi-book',
      title: 'Comprehensive Content',
      description: 'Access rich course materials, assignments, and resources designed for effective learning.'
    },
    {
      icon: 'bi-award',
      title: ' certifications',
      description: 'Earn recognized certificates upon course completion to boost your career prospects.'
    },
    {
      icon: 'bi-chat-dots',
      title: 'Interactive Community',
      description: 'Engage with fellow learners and tutors through discussions and collaborative projects.'
    },
    {
      icon: 'bi-graph-up',
      title: 'Progress Tracking',
      description: 'Monitor your learning journey with detailed analytics and progress reports.'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Active Students' },
    { number: '500+', label: 'Expert Tutors' },
    { number: '200+', label: 'Courses' },
    { number: '50,000+', label: 'Certificates Issued' }
  ];

  return (
    <div className="landing-page">
      <Navbar />
      <div className="container pt-4">
        <div className="d-flex align-items-center gap-3">
          <img src="/logo.png" alt="SmartMind" style={{width:56,height:56,borderRadius:10}} />
          <div>
            <h5 className="mb-0" style={{color:'var(--dark-color)', fontWeight:700}}>SmartMind</h5>
            <small className="text-muted">Professional Learning Platform</small>
          </div>
        </div>
      </div>
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <div className="row align-items-center min-vh-75">
            <div className="col-lg-7">
              <span className="hero-badge mb-3 d-inline-block">🚀 Welcome to SmartMind</span>
              <h1 className="hero-title display-3 fw-bold mb-4">
                Transform Your <span className="text-gradient">Learning Journey</span> With Us
              </h1>
              <p className="hero-subtitle lead mb-4">
                Join thousands of learners achieving their goals with our cutting-edge 
                Learning Management System. Quality education is just a click away.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link to="/register" className="btn btn-primary btn-lg px-4">
                  <i className="bi bi-rocket-takeoff me-2"></i>Get Started
                </Link>
                <Link to="/courses" className="btn btn-outline-light btn-lg px-4">
                  <i className="bi bi-play-circle me-2"></i>Explore Courses
                </Link>
              </div>
              
              {/* Trust Badges */}
              <div className="mt-5 pt-3">
                <p className="text-light mb-3">Trusted by leading institutions</p>
                <div className="d-flex flex-wrap gap-4">
                  <span className="trust-badge"><i className="bi bi-check-circle-fill me-1"></i>ISO Certified</span>
                  <span className="trust-badge"><i className="bi bi-check-circle-fill me-1"></i>GDPR Compliant</span>
                  <span className="trust-badge"><i className="bi bi-check-circle-fill me-1"></i>24/7 Support</span>
                </div>
              </div>
            </div>
            <div className="col-lg-5 d-none d-lg-block">
              <div className="hero-image-wrapper">
                <div className="hero-card card border-0 shadow-lg">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center mb-3">
                      <div className="hero-icon-box me-3">
                        <i className="bi bi-mortarboard-fill"></i>
                      </div>
                      <div>
                        <h6 className="mb-0">Course Completed</h6>
                        <small className="text-muted">Web Development Bootcamp</small>
                      </div>
                      <span className="ms-auto badge bg-success">✓</span>
                    </div>
                    <div className="progress" style={{ height: '8px' }}>
                      <div className="progress-bar bg-success" style={{ width: '100%' }}></div>
                    </div>
                    <p className="mt-2 mb-0 text-end text-success fw-bold">100% Completed</p>
                  </div>
                </div>
                <div className="hero-card card border-0 shadow-lg mt-3">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center">
                      <div className="hero-icon-box me-3 bg-warning">
                        <i className="bi bi-trophy-fill text-white"></i>
                      </div>
                      <div>
                        <h6 className="mb-0">Certificate Earned!</h6>
                        <small className="text-muted">Data Science Masterclass</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-wave">
          <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="#ffffff" fillOpacity="1" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section py-5">
        <div className="container">
          <div className="row g-4">
            {stats.map((stat, index) => (
              <div className="col-6 col-md-3" key={index}>
                <div className="stat-box text-center">
                  <h2 className="stat-number display-4 fw-bold text-primary">{stat.number}</h2>
                  <p className="stat-label text-muted mb-0">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-badge">Why Choose Us</span>
            <h2 className="section-title mt-3">Everything You Need to Succeed</h2>
            <p className="section-subtitle text-muted mx-auto">
              Our platform provides all the tools and resources you need for an 
              exceptional learning experience
            </p>
          </div>
          <div className="row g-4">
            {features.map((feature, index) => (
              <div className="col-md-6 col-lg-4" key={index}>
                <div className="feature-card card h-100 border-0 shadow-sm">
                  <div className="card-body p-4">
                    <div className="feature-icon mb-3">
                      <i className={`bi ${feature.icon}`}></i>
                    </div>
                    <h5 className="feature-title">{feature.title}</h5>
                    <p className="feature-text text-muted mb-0">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-5">
        <div className="container">
          <div className="cta-card card border-0">
            <div className="card-body p-5 text-center">
              <h2 className="fw-bold mb-3">Ready to Start Learning?</h2>
              <p className="lead text-muted mb-4">
                Join our community of learners and unlock your potential today.
              </p>
              <div className="d-flex justify-content-center gap-3">
                <Link to="/register" className="btn btn-primary btn-lg px-5">
                  <i className="bi bi-person-plus me-2"></i>Sign Up Free
                </Link>
                <Link to="/contact" className="btn btn-outline-primary btn-lg px-5">
                  <i className="bi bi-chat-dots me-2"></i>Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;

