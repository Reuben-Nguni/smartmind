import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Services = () => {
  const services = [
    {
      icon: 'bi-mortarboard',
      title: 'Online Courses',
      description: 'Access hundreds of courses across various disciplines. Learn at your own pace with video lectures, quizzes, and assignments.',
      features: ['Video Lectures', 'Interactive Quizzes', 'Certificate on Completion']
    },
    {
      icon: 'bi-people',
      title: 'Tutor Programs',
      description: 'Become a tutor and share your knowledge. Create courses, manage students, and earn while teaching.',
      features: ['Course Creation', 'Student Management', 'Analytics Dashboard']
    },
    {
      icon: 'bi-briefcase',
      title: 'Corporate Training',
      description: 'Customized learning solutions for organizations. Train your workforce with tailored courses and progress tracking.',
      features: ['Custom Courses', 'Team Analytics', 'Dedicated Support']
    },
    {
      icon: 'bi-award',
      title: 'Certifications',
      description: 'Earn industry-recognized certificates upon course completion. Boost your resume and career prospects.',
      features: ['Verified Certificates', 'Digital Badges', 'Portfolio Building']
    },
    {
      icon: 'bi-laptop',
      title: 'E-Learning Platform',
      description: 'State-of-the-art learning management system with modern features for seamless educational experience.',
      features: ['Cloud Storage', 'Mobile Responsive', 'Offline Access']
    },
    {
      icon: 'bi-chat-dots',
      title: 'Mentorship',
      description: 'Connect with experienced mentors for guidance. Get personalized feedback and career advice.',
      features: ['1-on-1 Sessions', 'Career Guidance', 'Technical Reviews']
    }
  ];

  const benefits = [
    { icon: 'bi-clock', title: 'Learn Anytime', desc: 'Access content 24/7 from any device' },
    { icon: 'bi-shield-check', title: 'Secure Platform', desc: 'Your data is protected with enterprise-grade security' },
    { icon: 'bi-currency-dollar', title: 'Affordable Pricing', desc: 'Quality education at competitive prices' },
    { icon: 'bi-globe', title: 'Global Access', desc: 'Connect learners from around the world' }
  ];

  return (
    <div className="landing-page">
      <Navbar />
      
      {/* Hero Section */}
      <section className="services-hero">
        <div className="container py-5">
          <div className="row align-items-center min-vh-50 py-5">
            <div className="col-lg-8 mx-auto text-center">
              <span className="section-badge">Our Services</span>
              <h1 className="display-3 fw-bold mt-3 mb-4">Comprehensive Learning Solutions</h1>
              <p className="lead text-muted mb-4">
                Discover a range of services designed to meet your educational needs. 
                From individual learning to corporate training, we've got you covered.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-5">
        <div className="container">
          <div className="row g-4">
            {services.map((service, index) => (
              <div className="col-md-6 col-lg-4" key={index}>
                <div className="service-card card h-100 border-0 shadow-sm">
                  <div className="card-body p-4">
                    <div className="service-icon mb-4">
                      <i className={`bi ${service.icon}`}></i>
                    </div>
                    <h4 className="service-title mb-3">{service.title}</h4>
                    <p className="service-desc text-muted mb-4">{service.description}</p>
                    <ul className="service-features list-unstyled mb-0">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="mb-2">
                          <i className="bi bi-check-circle-fill text-primary me-2"></i>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Why Choose SmartMind?</h2>
            <p className="text-muted">We deliver excellence in every aspect of online education</p>
          </div>
          <div className="row g-4">
            {benefits.map((benefit, index) => (
              <div className="col-md-6 col-lg-3" key={index}>
                <div className="benefit-card text-center p-4">
                  <div className="benefit-icon mb-3">
                    <i className={`bi ${benefit.icon}`}></i>
                  </div>
                  <h5>{benefit.title}</h5>
                  <p className="text-muted mb-0">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-5">
        <div className="container">
          <div className="cta-card card border-0 bg-primary text-white">
            <div className="card-body p-5 text-center">
              <h2 className="fw-bold mb-3">Ready to Get Started?</h2>
              <p className="lead mb-4 opacity-75">
                Join thousands of learners and start your journey today.
              </p>
              <div className="d-flex justify-content-center gap-3">
                <Link to="/register" className="btn btn-light btn-lg px-5">
                  Sign Up Now
                </Link>
                <Link to="/contact" className="btn btn-outline-light btn-lg px-5">
                  Contact Sales
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

export default Services;

