import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import {
  FiMail, FiMapPin, FiPhone, FiSend, FiCheckCircle,
  FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiStar, FiArrowRight
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import './css/ContactPage.css';

/* ─── Team Members (reused from AboutPage - Job_Portal members.json) ─── */
const TEAM = [
  { id: 1, name: 'Aman Agastya', role: 'Full Stack Developer',
    img: '/Aman1.jpeg',
    location: 'Kolkata', rate: 5,
    social: { facebook: '#', twitter: '#', instagram: '#', linkedin: '#' } },
  { id: 2, name: 'Bikash Lal Shaw', role: 'Backend Developer',
    img: '/Bikash1.jpeg',
    location: 'Kolkata', rate: 5,
    social: { facebook: '#', twitter: '#', instagram: '#', linkedin: '#' } },
  { id: 3, name: 'Rampratap Chauhan', role: 'Frontend Developer',
   img: '/Ram.jpeg',
    location: 'Kolkata', rate: 5,
    social: { facebook: '#', twitter: '#', instagram: '#', linkedin: '#' } },
];

function StarRating({ rating, max = 5 }) {
  return (
    <div className="star-rating">
      {Array.from({ length: max }).map((_, i) => (
        <FiStar key={i} className={i < rating ? 'star star-filled' : 'star star-empty'} />
      ))}
    </div>
  );
}

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const f = (key) => ({ value: form[key], onChange: e => setForm({ ...form, [key]: e.target.value }) });

  return (
    <div className="page-wrapper">
      <Navbar />

      {/* Hero */}
      <section className="contact-hero">
        <div className="container">
          <div className="contact-breadcrumb">Home &rsaquo; Contact Us</div>
          <h1 className="contact-hero-title">Contact Us</h1>
          <p className="contact-hero-subtitle">
            Get the latest news, updates and tips — we'd love to hear from you!
          </p>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="contact-section">
        <div className="container">
          <div className="contact-grid">
            {/* Left Info */}
            <div className="contact-info-side">
              <h5 className="contact-info-eyebrow">Contact Us</h5>
              <h2 className="contact-info-title">Get in touch</h2>
              <p className="contact-info-text">
                The right move at the right time saves your investment.
                Have a question, feedback, or partnership inquiry? We're here to help.
              </p>

              <div className="contact-info-items">
                <div className="contact-info-item">
                  <div className="contact-info-icon"><FiMail /></div>
                  <div>
                    <div className="contact-info-label">Email</div>
                    <div className="contact-info-value">support@jobquest.in</div>
                  </div>
                </div>
                <div className="contact-info-item">
                  <div className="contact-info-icon"><FiPhone /></div>
                  <div>
                    <div className="contact-info-label">Phone</div>
                    <div className="contact-info-value">+91 98765 43210</div>
                  </div>
                </div>
                <div className="contact-info-item">
                  <div className="contact-info-icon"><FiMapPin /></div>
                  <div>
                    <div className="contact-info-label">Address</div>
                    <div className="contact-info-value">
                      Future Institute of Engineering &amp; Management,<br />
                      Kolkata, West Bengal – 700150
                    </div>
                  </div>
                </div>
              </div>

              <div className="contact-social-row">
                <span className="contact-social-label">Follow us:</span>
                {['Facebook', 'Twitter', 'Instagram', 'LinkedIn'].map((net, i) => {
                  const Icons = [FiFacebook, FiTwitter, FiInstagram, FiLinkedin];
                  const Icon = Icons[i];
                  return (
                    <a key={net} href="#" className="social-icon" aria-label={net} onClick={e => e.preventDefault()}>
                      <Icon />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Right Form */}
            <div className="contact-form-card">
              {submitted ? (
                <div className="contact-success">
                  <div className="contact-success-icon">✅</div>
                  <h3 className="contact-success-title">Message Sent!</h3>
                  <p className="contact-success-text">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                  <button className="btn btn-primary" onClick={() => { setForm({ name: '', company: '', email: '', phone: '', subject: '', message: '' }); setSubmitted(false); }}>
                    Send Another
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="contact-form-title">Send a Message</h3>
                  <div className="contact-form-row">
                    <div className="form-group">
                      <label className="form-label">Full Name *</label>
                      <input className="form-control" placeholder="Enter your name" {...f('name')} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Company (optional)</label>
                      <input className="form-control" placeholder="Your company" {...f('company')} />
                    </div>
                  </div>
                  <div className="contact-form-row">
                    <div className="form-group">
                      <label className="form-label">Email Address *</label>
                      <input className="form-control" type="email" placeholder="you@example.com" {...f('email')} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone Number</label>
                      <input className="form-control" placeholder="+91 98765 43210" {...f('phone')} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Subject</label>
                    <input className="form-control" placeholder="How can we help?" {...f('subject')} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tell us about yourself *</label>
                    <textarea className="form-control" rows={5} placeholder="Tell us about yourself or your query..." {...f('message')} required
                      style={{ resize: 'vertical' }} />
                  </div>
                  <button className="btn btn-primary btn-send-msg" onClick={handleSubmit}>
                    <FiSend /> Send Message
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Map placeholder */}
      <section className="contact-map-section">
        <div className="container">
          <div className="contact-map-wrapper">
            <div className="contact-map-placeholder">
              <FiMapPin className="map-pin-icon" />
              <h3>Future Institute of Engineering &amp; Management</h3>
              <p>Kolkata, West Bengal – 700150, India</p>
              <a
                href="https://maps.google.com/?q=Future+Institute+of+Engineering+and+Management+Kolkata"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Open in Google Maps <FiArrowRight />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Team Members Section (from Job_Portal Members component) */}
      <section className="contact-members-section">
        <div className="container">
          <div className="home-section-header">
            <p className="about-label text-center">OUR COMPANY</p>
            <h2 className="home-section-title">Meet Our Team</h2>
            <p className="home-section-subtitle">
              The people behind Job Quest — students of FIEM, Kolkata
            </p>
          </div>
          <div className="about-team-grid">
            {TEAM.map(member => (
              <div key={member.id} className="about-team-card">
                <div className="team-card-inner">
                  <div className="team-avatar-wrapper">
                    <img
                      className="team-avatar-img"
                      src={member.img}
                      alt={member.name}
                      onError={e => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="team-avatar-fallback" style={{ display: 'none' }}>
                      {member.name.charAt(0)}
                    </div>
                  </div>
                  <div className="team-info">
                    <h4 className="team-name">{member.name}</h4>
                    <span className="team-role">{member.role}</span>
                    <StarRating rating={member.rate} />
                    <div className="team-location">
                      <FiMapPin className="location-icon" />
                      <span>{member.location}</span>
                    </div>
                    <div className="team-social">
                      {[FiFacebook, FiTwitter, FiInstagram, FiLinkedin].map((Icon, i) => (
                        <a key={i} href="#" className="social-icon" onClick={e => e.preventDefault()}>
                          <Icon />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
