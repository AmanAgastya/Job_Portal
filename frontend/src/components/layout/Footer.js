import React from "react";
import { Link } from "react-router-dom";
import "./css/Footer.css";

const FOOTER_COLS = [
  {
    title: 'For Job Seekers',
    links: [
      { label: 'Find Jobs', to: '/jobs' },
      { label: 'ATS Resume Checker', to: '/resume-checker' },
      { label: 'Create Profile', to: '/register' },
      { label: 'Dashboard', to: '/dashboard' },
    ],
  },
  {
    title: 'For Employers',
    links: [
      { label: 'Post a Job', to: '/post-job' },
      { label: 'Browse Jobs', to: '/jobs' },
      { label: 'Employer Dashboard', to: '/employer' },
      { label: 'Get Started', to: '/register' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', to: '/about' },
      { label: 'Contact Us', to: '/contact' },
      { label: 'Privacy Policy', to: '/privacy' },
      { label: 'Terms of Service', to: '/terms' },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-inner">
          
          {/* Brand Section */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <img src="/logo1.jpg" alt="Job Quest" className="footer-logo-img" />
              <span>Job Quest</span>
            </Link>
            <p className="footer-brand-desc">
              India's leading job portal connecting talent with opportunities. Built with MERN Stack.
            </p>
            <span className="footer-logo2-text">Est. 2024</span>
          </div>

          {/* Dynamic Columns */}
          {FOOTER_COLS.map((col) => (
            <div key={col.title}>
              <h4 className="footer-col-title">{col.title}</h4>
              {col.links.map((l) => (
                <Link key={l.label} to={l.to} className="footer-link">
                  {l.label}
                </Link>
              ))}
            </div>
          ))}

        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          © 2025 Job Quest — Built by Aman Agastya | Ardent CompTech PVT LTD
        </div>
      </div>
    </footer>
  );
};

export default Footer;
