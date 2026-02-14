import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const About = () => {
  const team = [
    {
      name: '----',
      role: 'CEO & Founder',
      image: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=667eea&color=fff&size=200',
      bio: 'Former education minister with 20+ years in academic leadership.'
    },
    {
      name: '-----',
      role: 'CTO',
      image: 'https://ui-avatars.com/api/?name=Michael+Chen&background=764ba2&color=fff&size=200',
      bio: 'Tech visionary bringing innovation to education.'
    },
    {
      name: '---------',
      role: 'Head of Content',
      image: 'https://ui-avatars.com/api/?name=Emily+Williams&background=10b981&color=fff&size=200',
      bio: 'Curriculum expert passionate about quality education.'
    },
    {
      name: '----------',
      role: 'Head of Operations',
      image: 'https://ui-avatars.com/api/?name=David+Martinez&background=f59e0b&color=fff&size=200',
      bio: 'Operations specialist ensuring seamless user experience.'
    }
  ];

  const values = [
    { icon: 'bi-lightbulb', title: 'Innovation', desc: 'We constantly innovate to provide the best learning experience.' },
    { icon: 'bi-heart', title: 'Integrity', desc: 'We uphold the highest standards of honesty and ethics.' },
    { icon: 'bi-people', title: 'Community', desc: 'We believe in the power of collaborative learning.' },
    { icon: 'bi-star', title: 'Excellence', desc: 'We strive for excellence in everything we do.' }
  ];

  return (
    <div className="landing-page">
      <Navbar />
      
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container py-5">
          <div className="row align-items-center min-vh-50 py-5">
            <div className="col-lg-8 mx-auto text-center">
              <span className="section-badge">About Us</span>
              <h1 className="display-3 fw-bold mt-3 mb-4">Empowering Learners Worldwide</h1>
              <p className="lead text-muted">
                We're on a mission to make quality education accessible to everyone, everywhere.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-5">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <h2 className="fw-bold mb-4">Our Story</h2>
              <p className="text-muted mb-4">
                Founded in 2020, SmartMind LMS emerged from a simple idea: make quality education 
                accessible to everyone, regardless of their location or background.
              </p>
              <p className="text-muted mb-4">
                What started as a small initiative has grown into a global platform serving 
                over 10,000 active learners and 500+ expert tutors. We believe that education 
                is the key to unlocking human potential and driving positive change in the world.
              </p>
              <p className="text-muted mb-4">
                Today, SmartMind continues to innovate and expand, bringing cutting-edge 
                technology to the world of online education. Our team is passionate about 
                creating meaningful learning experiences that transform lives.
              </p>
              <div className="d-flex gap-3">
                <Link to="/register" className="btn btn-primary">
                  Join Our Community
                </Link>
                <Link to="/contact" className="btn btn-outline-primary">
                  Get In Touch
                </Link>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="about-image-wrapper">
                <div className="row g-3">
                  <div className="col-6">
                    <div className="about-img-card card border-0 shadow-sm">
                      <div className="card-body p-4 text-center">
                        <i className="bi bi-mortarboard display-4 text-primary mb-3"></i>
                        <h5 className="fw-bold">10,000+</h5>
                        <p className="text-muted mb-0">Students</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="about-img-card card border-0 shadow-sm">
                      <div className="card-body p-4 text-center">
                        <i className="bi bi-people display-4 text-success mb-3"></i>
                        <h5 className="fw-bold">500+</h5>
                        <p className="text-muted mb-0">Tutors</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="about-img-card card border-0 shadow-sm">
                      <div className="card-body p-4 text-center">
                        <i className="bi bi-book display-4 text-warning mb-3"></i>
                        <h5 className="fw-bold">200+</h5>
                        <p className="text-muted mb-0">Courses</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="about-img-card card border-0 shadow-sm">
                      <div className="card-body p-4 text-center">
                        <i className="bi bi-award display-4 text-info mb-3"></i>
                        <h5 className="fw-bold">50,000+</h5>
                        <p className="text-muted mb-0">Certificates</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Our Core Values</h2>
            <p className="text-muted">The principles that guide everything we do</p>
          </div>
          <div className="row g-4">
            {values.map((value, index) => (
              <div className="col-md-6 col-lg-3" key={index}>
                <div className="value-card text-center p-4">
                  <div className="value-icon mb-3">
                    <i className={`bi ${value.icon}`}></i>
                  </div>
                  <h5>{value.title}</h5>
                  <p className="text-muted mb-0">{value.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Meet Our Leadership</h2>
            <p className="text-muted">The team driving innovation in education</p>
          </div>
          <div className="row g-4 justify-content-center">
            {team.map((member, index) => (
              <div className="col-md-6 col-lg-3" key={index}>
                <div className="team-card card border-0 shadow-sm h-100">
                  <div className="card-body text-center p-4">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="rounded-circle mb-3"
                      width="120"
                      height="120"
                    />
                    <h5 className="mb-1">{member.name}</h5>
                    <p className="text-primary mb-3">{member.role}</p>
                    <p className="text-muted mb-0 small">{member.bio}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;

