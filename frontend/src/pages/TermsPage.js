import React from 'react';
import Navbar from '../components/layout/Navbar';
import './css/TermsPage.css';

const SECTIONS = [
  { id: 'acceptance', title: '1. Acceptance of Terms', content: `By accessing or using Job Quest, you agree to be bound by these Terms of Service. If you do not agree to all the terms, you must not use the platform.` },
  { id: 'accounts', title: '2. User Accounts', content: `You must provide accurate information when creating an account. You are responsible for maintaining the security of your account credentials and for all activities that occur under your account. You must not create accounts using automated means or under false pretenses.` },
  { id: 'conduct', title: '3. Acceptable Use', content: `You agree not to post false, misleading, or fraudulent job listings or profiles. Employers must only post genuine job opportunities. Candidates must not misrepresent their qualifications. Harassment, spam, scraping, or any unauthorized automated access is strictly prohibited.` },
  { id: 'ip', title: '4. Intellectual Property', content: `All content on Job Quest, including the platform design, code, logos, and branding, is the property of Job Quest and its creators. You may not copy, distribute, or create derivative works without explicit permission.` },
  { id: 'liability', title: '5. Limitation of Liability', content: `Job Quest is provided "as is" without warranties of any kind. We are not responsible for the accuracy of job listings, the conduct of employers or candidates, or any employment outcomes. Our total liability in any matter is limited to the fees you paid us in the preceding three months.` },
  { id: 'termination', title: '6. Account Termination', content: `We reserve the right to suspend or terminate accounts that violate these terms, post fraudulent content, engage in harassment, or abuse the platform in any way. You may delete your account at any time through the account settings.` },
  { id: 'changes', title: '7. Changes to Terms', content: `We may update these Terms of Service from time to time. We will notify you of significant changes via email or a prominent notice on the platform. Continued use after changes constitutes acceptance of the updated terms.` },
  { id: 'contact', title: '8. Contact', content: `For questions about these Terms, please email us at support@jobquest.in or write to us at Future Institute of Engineering & Management, Kolkata, West Bengal, India.` },
];

export default function TermsPage() {
  return (
    <div className="page-wrapper">
      <Navbar />

      <section className="terms-hero">
        <div className="container">
          <h1 className="terms-hero-title">Terms of Service</h1>
          <p className="terms-hero-date">Last updated: April 2025</p>
        </div>
      </section>

      <div className="container">
        <div className="terms-layout">
          {/* TOC */}
          <aside className="terms-toc">
            <div className="terms-toc-title">Contents</div>
            {SECTIONS.map(s => (
              <a key={s.id} href={`#${s.id}`} className="terms-toc-link">{s.title}</a>
            ))}
          </aside>

          {/* Content */}
          <div className="terms-content">
            <div className="terms-warning">
              Please read these Terms of Service carefully before using Job Quest. These terms constitute a legally binding agreement between you and Job Quest.
            </div>

            {SECTIONS.map(s => (
              <div key={s.id} id={s.id} className="terms-section">
                <h2 className="terms-section-title">{s.title}</h2>
                <p className="terms-text">{s.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
