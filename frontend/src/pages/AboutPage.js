import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiFacebook, FiTwitter, FiInstagram, FiLinkedin,
  FiMail, FiMapPin, FiStar, FiUsers, FiBriefcase,
  FiTrendingUp, FiCheckCircle, FiArrowRight, FiPhone
} from 'react-icons/fi';
import Navbar from '../components/layout/Navbar';
import './css/AboutPage.css';

/* ─── Team Members (from members.json of Job_Portal) ─── */
const TEAM = [
  {
    id: 1,
    name: 'Aman Agastya',
    role: 'Full Stack Developer',
    img: '/Aman1.jpeg',
    location: 'Kolkata',
    rate: 5,
    bio: 'Passionate full-stack dev with expertise in React, Node.js & MongoDB.',
    social: { facebook: '#', twitter: '#', instagram: '#', linkedin: '#' },
  },
  {
    id: 2,
    name: 'Bikash Lal Shaw',
    role: 'Backend Developer',
    img: '/Bikash1.jpeg',
    location: 'Kolkata',
    rate: 5,
    bio: 'Backend specialist building secure, scalable APIs and database systems.',
    social: { facebook: '#', twitter: '#', instagram: '#', linkedin: '#' },
  },
  {
    id: 3,
    name: 'Rampratap Chauhan',
    role: 'Frontend Developer',
    img: '/Ram.jpeg',
    location: 'Kolkata',
    rate: 5,
    bio: 'Frontend wizard crafting pixel-perfect, responsive React applications.',
    social: { facebook: '#', twitter: '#', instagram: '#', linkedin: '#' },
  },
];

const VALUES = [
  { icon: '🎯', title: 'Mission-Driven', text: 'We exist to bridge the gap between talent and opportunity across India.' },
  { icon: '🤝', title: 'Transparency', text: 'Clear communication, honest job listings, and fair hiring practices.' },
  { icon: '⚡', title: 'Innovation', text: 'AI-powered tools like ATS Checker to give job seekers a competitive edge.' },
  { icon: '🌍', title: 'Inclusivity', text: 'Opportunities for everyone, regardless of background or location.' },
];

const STATS = [
  { value: '1000+', label: 'Active Jobs', icon: '💼' },
  { value: '200+', label: 'Companies', icon: '🏢' },
  { value: '50000+', label: 'Job Seekers', icon: '👥' },
  { value: '95%', label: 'Satisfaction Rate', icon: '⭐' },
];


function StarRating({ rating, max = 5 }) {
  return (
    <div className="star-rating" aria-label={`${rating} out of ${max} stars`}>
      {Array.from({ length: max }).map((_, i) => (
        <FiStar
          key={i}
          className={i < rating ? 'star star-filled' : 'star star-empty'}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

function Newsletter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) setSubscribed(true);
  };

  return (
    <section className="newsletter-section">
      <div className="container">
        <div className="newsletter-box">
          <div className="newsletter-content">
            <h2 className="newsletter-title">
              New Things Will Always<br />Update Regularly
            </h2>
            <p className="newsletter-subtitle">
              Stay updated with the latest jobs, career tips, and platform features.
            </p>
            {subscribed ? (
              <div className="newsletter-success">
                <FiCheckCircle className="newsletter-success-icon" />
                <span>You're subscribed! We'll keep you updated.</span>
              </div>
            ) : (
              <form className="newsletter-form" onSubmit={handleSubscribe}>
                <input
                  className="newsletter-input"
                  type="email"
                  placeholder="Enter your email here"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
                <button className="newsletter-btn" type="submit">Subscribe</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <div className="page-wrapper">
      <Navbar />

      {/* Hero */}
      <section className="about-hero">
        <div className="about-hero-bg-shapes">
          <div className="hero-shape hero-shape-1" />
          <div className="hero-shape hero-shape-2" />
        </div>
        <div className="container">
          <div className="about-hero-badge">OUR COMPANY</div>
          <h1 className="about-hero-title">About Job Quest</h1>
          <p className="about-hero-subtitle">
            India's leading job portal connecting talent with top opportunities —
            built with passion by a team of engineers from Kolkata.
          </p>
          <div className="about-hero-actions">
            <Link to="/register" className="btn btn-white-primary">
              Get Started Free <FiArrowRight />
            </Link>
            <Link to="/contact" className="btn btn-hero-outline">Contact Us</Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="about-stats-bar">
        <div className="container">
          <div className="about-stats-row">
            {STATS.map(s => (
              <div key={s.label} className="about-stat-item">
                <div className="about-stat-icon">{s.icon}</div>
                <div className="about-stat-value">{s.value}</div>
                <div className="about-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="about-section">
        <div className="container">
          <div className="about-grid-2">
            <div className="about-mission-text">
              <p className="about-label">Our Mission</p>
              <h2 className="about-section-title">Empowering Careers Across India</h2>
              <p className="about-section-text">
                Job Quest was founded with a simple but powerful mission: make job hunting
                smarter, faster, and more accessible for every professional in India.
              </p>
              <p className="about-section-text">
                We leverage modern technology — including AI-powered resume analysis,
                real-time application tracking, and smart job matching — to level the
                playing field for job seekers and help employers find the right talent.
              </p>
              <ul className="about-mission-list">
                {['Smart AI-powered job matching', 'ATS Resume Checker tool', 'Real-time application tracking', 'Verified company listings'].map(item => (
                  <li key={item} className="about-mission-list-item">
                    <FiCheckCircle className="check-icon" /> {item}
                  </li>
                ))}
              </ul>
              <Link to="/register" className="btn btn-primary btn-lg" style={{ marginTop: 24 }}>
                Join Job Quest Free <FiArrowRight />
              </Link>
            </div>
            <div className="about-mission-image-wrapper">
              <div className="about-mission-image-bg" />
              <div className="about-mission-image-card">
                <div className="mission-card-stat">
                  <FiBriefcase className="mission-card-icon" />
                  <div>
                    <div className="mission-card-number">1000+</div>
                    <div className="mission-card-text">Jobs Posted</div>
                  </div>
                </div>
                <div className="mission-card-stat">
                  <FiUsers className="mission-card-icon" />
                  <div>
                    <div className="mission-card-number">500+</div>
                    <div className="mission-card-text">Active Users</div>
                  </div>
                </div>
                <div className="mission-card-stat">
                  <FiTrendingUp className="mission-card-icon" />
                  <div>
                    <div className="mission-card-number">95%</div>
                    <div className="mission-card-text">Satisfaction</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="about-section-alt">
        <div className="container">
          <div className="home-section-header">
            <p className="about-label text-center">What We Stand For</p>
            <h2 className="home-section-title">Our Core Values</h2>
            <p className="home-section-subtitle">The principles that guide everything we build</p>
          </div>
          <div className="about-values-grid">
            {VALUES.map(v => (
              <div key={v.title} className="about-value-card">
                <div className="about-value-icon">{v.icon}</div>
                <h3 className="about-value-title">{v.title}</h3>
                <p className="about-value-text">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Members */}
      <section className="about-section-alt">
        <div className="container">
          <div className="home-section-header">
            <p className="about-label text-center">OUR COMPANY</p>
            <h2 className="home-section-title">Meet Our Team</h2>
            <p className="home-section-subtitle">
              Built by students of Future Institute of Engineering &amp; Management, Kolkata
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
                    <p className="team-bio">{member.bio}</p>
                    <div className="team-location">
                      <FiMapPin className="location-icon" />
                      <span>{member.location}</span>
                    </div>
                    <div className="team-social">
                      <a href={member.social.facebook} className="social-icon" aria-label="Facebook" onClick={e => e.preventDefault()}>
                        <FiFacebook />
                      </a>
                      <a href={member.social.twitter} className="social-icon" aria-label="Twitter" onClick={e => e.preventDefault()}>
                        <FiTwitter />
                      </a>
                      <a href={member.social.instagram} className="social-icon" aria-label="Instagram" onClick={e => e.preventDefault()}>
                        <FiInstagram />
                      </a>
                      <a href={member.social.linkedin} className="social-icon" aria-label="LinkedIn" onClick={e => e.preventDefault()}>
                        <FiLinkedin />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Strip */}
      <section className="about-contact-strip">
        <div className="container">
          <div className="contact-strip-grid">
            <div className="contact-strip-item">
              <div className="contact-strip-icon"><FiMail /></div>
              <div>
                <div className="contact-strip-label">Email Us</div>
                <div className="contact-strip-value">support@jobquest.in</div>
              </div>
            </div>
            <div className="contact-strip-item">
              <div className="contact-strip-icon"><FiPhone /></div>
              <div>
                <div className="contact-strip-label">Call Us</div>
                <div className="contact-strip-value">+91 98765 43210</div>
              </div>
            </div>
            <div className="contact-strip-item">
              <div className="contact-strip-icon"><FiMapPin /></div>
              <div>
                <div className="contact-strip-label">Visit Us</div>
                <div className="contact-strip-value">FIEM, Kolkata, West Bengal</div>
              </div>
            </div>
            <Link to="/contact" className="btn btn-primary btn-contact-strip">
              Contact Us <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <Newsletter />

      {/* CTA */}
      <section className="home-cta-section">
        <div className="container">
          <h2 className="home-cta-title">Ready to Start Your Journey?</h2>
          <p className="home-cta-subtitle">Join thousands of professionals already on Job Quest</p>
          <div className="home-cta-buttons">
            <Link to="/register" className="btn btn-lg home-cta-btn-primary">Get Started Free</Link>
            <Link to="/jobs" className="btn btn-lg btn-outline home-cta-btn-outline">Browse Jobs</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
