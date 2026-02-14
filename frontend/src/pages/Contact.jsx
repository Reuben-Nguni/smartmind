import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would send to backend
    console.log('Form submitted:', formData);
    setSubmitted(true);
  };

  const contactInfo = [
    {
      icon: 'bi-geo-alt',
      title: 'Visit Us',
      content: 'Munkoyo Street, Kabwe, Zambia'
    },
    {
      icon: 'bi-telephone',
      title: 'Call Us',
      content: '+260970067982'
    },
    {
      icon: 'bi-envelope',
      title: 'Email Us',
      content: 'smartmind1@gmail.com'
    },
    {
      icon: 'bi-clock',
      title: 'Working Hours',
      content: 'Mon - Fri: 9:00 AM - 6:00 PM'
    }
  ];

  const faqs = [
    {
      question: 'How do I register for a course?',
      answer: 'Simply create an account, browse our course catalog, and click "Enroll" on any course. Your enrollment will be pending until a tutor approves it.'
    },
    {
      question: 'How do I become a tutor?',
      answer: 'Register as a tutor and wait for admin approval. Once approved, you can create and manage your own courses.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, and bank transfers. Contact us for enterprise billing options.'
    },
    {
      question: 'How do I get my certificate?',
      answer: 'Complete all course requirements and assignments. Your certificate will be automatically generated and available for download.'
    }
  ];

  return (
    <div className="landing-page">
      <Navbar />
      
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="container py-5">
          <div className="row align-items-center min-vh-50 py-5">
            <div className="col-lg-8 mx-auto text-center">
              <span className="section-badge">Contact Us</span>
              <h1 className="display-3 fw-bold mt-3 mb-4">We'd Love to Hear From You</h1>
              <p className="lead text-muted">
                Have questions? Our team is here to help. Reach out and we'll respond as soon as possible.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-5">
        <div className="container">
          <div className="row g-4">
            {contactInfo.map((info, index) => (
              <div className="col-md-6 col-lg-3" key={index}>
                <div className="contact-card card h-100 border-0 shadow-sm">
                  <div className="card-body text-center p-4">
                    <div className="contact-icon mb-3">
                      <i className={`bi ${info.icon}`}></i>
                    </div>
                    <h5 className="mb-2">{info.title}</h5>
                    <p className="text-muted mb-0">{info.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row g-5">
            {/* Contact Form */}
            <div className="col-lg-7">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-5">
                  <h3 className="fw-bold mb-4">Send us a Message</h3>
                  {submitted ? (
                    <div className="text-center py-5">
                      <div className="mb-4">
                        <i className="bi bi-check-circle-fill text-success display-1"></i>
                      </div>
                      <h4>Thank You!</h4>
                      <p className="text-muted">We've received your message and will get back to you soon.</p>
                      <button 
                        className="btn btn-primary mt-3"
                        onClick={() => setSubmitted(false)}
                      >
                        Send Another Message
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit}>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label">Your Name</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Email Address</label>
                          <input 
                            type="email" 
                            className="form-control" 
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="col-12">
                          <label className="form-label">Subject</label>
                          <select 
                            className="form-select"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Select a topic</option>
                            <option value="general">General Inquiry</option>
                            <option value="support">Technical Support</option>
                            <option value="courses">Course Information</option>
                            <option value="partnerships">Partnerships</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div className="col-12">
                          <label className="form-label">Message</label>
                          <textarea 
                            className="form-control" 
                            rows="5"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                          ></textarea>
                        </div>
                        <div className="col-12">
                          <button type="submit" className="btn btn-primary btn-lg w-100">
                            <i className="bi bi-send me-2"></i>Send Message
                          </button>
                        </div>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="col-lg-5">
              <h3 className="fw-bold mb-4">Frequently Asked Questions</h3>
              <div className="accordion" id="faqAccordion">
                {faqs.map((faq, index) => (
                  <div className="accordion-item border-0 mb-3 shadow-sm" key={index}>
                    <h2 className="accordion-header">
                      <button 
                        className="accordion-button" 
                        type="button" 
                        data-bs-toggle="collapse" 
                        data-bs-target={`#faq${index}`}
                      >
                        {faq.question}
                      </button>
                    </h2>
                    <div 
                      id={`faq${index}`} 
                      className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`}
                      data-bs-parent="#faqAccordion"
                    >
                      <div className="accordion-body text-muted">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Contact Card */}
              <div className="card border-0 shadow-sm mt-4">
                <div className="card-body p-4 text-center">
                  <h5 className="mb-3">Need Immediate Assistance?</h5>
                  <p className="text-muted mb-4">Check our comprehensive documentation or join our community forum.</p>
                  <div className="d-flex gap-2 justify-content-center">
                    <Link to="#" className="btn btn-outline-primary">
                      <i className="bi bi-book me-2"></i>Documentation
                    </Link>
                    <Link to="#" className="btn btn-outline-primary">
                      <i className="bi bi-people me-2"></i>Community
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;

