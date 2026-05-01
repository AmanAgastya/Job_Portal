import React from 'react';
import Navbar from '../components/layout/Navbar';
import './css/PrivacyPage.css';

const SECTIONS = [
  { id: 'info', title: '1. Information We Collect', content: `We collect information you provide when you register, such as your name, email address, password, and role (job seeker or employer). We also collect profile data including work experience, skills, and uploaded resumes. Additionally, usage data such as pages visited, searches performed, and job applications submitted may be collected automatically.` },
  { id: 'use', title: '2. How We Use Your Information', content: `Your information is used to operate and improve the Job Quest platform, match job seekers with relevant opportunities, allow employers to review candidate applications, send notifications about job listings or application status, and improve our AI-powered ATS Resume Checker.` },
  { id: 'sharing', title: '3. Sharing Your Information', content: `We do not sell your personal data. We share your information only with employers when you apply to their job listings, service providers who help us operate the platform (under strict confidentiality), and authorities when required by law. We will always inform you when a material change to sharing practices occurs.` },
  { id: 'security', title: '4. Data Security', content: `We implement industry-standard security measures including encrypted connections (HTTPS), hashed password storage, and JWT-based session management. However, no system is 100% secure. We encourage you to use strong passwords and log out of shared devices.` },
  { id: 'rights', title: '5. Your Rights', content: `You have the right to access, update, or delete your personal data at any time through your account dashboard. You may also request a full export of your data by contacting us at support@jobquest.in. You can withdraw consent for marketing emails via the unsubscribe link.` },
  { id: 'cookies', title: '6. Cookies', content: `We use cookies to maintain your login session, remember your preferences, and analyze traffic patterns. You may disable cookies in your browser settings, but some features of the platform may not function correctly without them.` },
  { id: 'contact', title: '7. Contact Us', content: `If you have any questions about this Privacy Policy, please contact us at support@jobquest.in or write to us at Future Institute of Engineering & Management, Kolkata, West Bengal, India.` },
];

export default function PrivacyPage() {
  return (
    <div className="page-wrapper">
      <Navbar />

      <section className="policy-hero">
        <div className="container">
          <h1 className="policy-hero-title">Privacy Policy</h1>
          <p className="policy-hero-date">Last updated: April 2025</p>
        </div>
      </section>

      <div className="container">
        <div className="policy-layout">
          {/* TOC */}
          <aside className="policy-toc" aria-labelledby="privacy-contents-title">
            <div id="privacy-contents-title" className="policy-toc-title">Contents</div>
            {SECTIONS.map(s => (
              <a key={s.id} className="policy-toc-link">
                {s.title}
              </a>
            ))}
          </aside>

          {/* Content */}
          <div className="policy-content">
            <div className="policy-highlight">
              This Privacy Policy describes how Job Quest ("we", "us", or "our") collects, uses, and protects your personal information when you use our platform.
            </div>

            {SECTIONS.map(s => (
              <div key={s.id} id={s.id} className="policy-section">
                <h2 className="policy-section-title">{s.title}</h2>
                <p className="policy-text">{s.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
