import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { FiSearch, FiMapPin, FiBriefcase, FiUsers, FiTrendingUp, FiArrowRight } from 'react-icons/fi';
import Navbar from '../components/layout/Navbar';
import './css/HomePage.css';

const CATEGORIES = [
  { label: 'Software Engineer', icon: '💻', count: '500+' },
  { label: 'Web Designer', icon: '🎨', count: '200+' },
  { label: 'Data Analyst', icon: '📊', count: '150+' },
  { label: 'Product Manager', icon: '🚀', count: '120+' },
  { label: 'DevOps', icon: '⚙️', count: '100+' },
  { label: 'UI/UX Designer', icon: '🖌️', count: '180+' },
  { label: 'Mobile Developer', icon: '📱', count: '130+' },
  { label: 'Marketing', icon: '📢', count: '90+' },
];

const FEATURES = [
  { icon: '🎯', title: 'Smart Job Matching', desc: 'Our intelligent algorithm matches your skills with the right opportunities.' },
  { icon: '⚡', title: 'Easy Apply', desc: 'One-click apply with your saved profile. No repetitive form filling.' },
  { icon: '🤖', title: 'ATS Resume Checker', desc: 'Optimize your resume with our AI-powered ATS scoring system.' },
  { icon: '📈', title: 'Track Applications', desc: 'Real-time status updates on all your job applications in one place.' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState([]);

  useEffect(() => {
    api.get('/api/jobs?limit=8&sort=latest')
      .then(res => setFeaturedJobs(res.data.jobs || []))
      .catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.set('keyword', keyword);
    if (location) params.set('location', location);
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <div>
      <Navbar />

      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="badge badge-warning" style={{ marginBottom: 20, fontSize: 13 }}>
              🚀 #1 Job Board in India
            </div>
            <h1>Find Your <span>Dream Job</span> Today</h1>
            <p>Connect with top employers across India. 10,000+ active job listings across all industries and experience levels.</p>
            <form onSubmit={handleSearch} style={{ maxWidth: 680, margin: '0 auto' }}>
              <div className="search-bar">
                <div style={{ display: 'flex', alignItems: 'center', flex: 1, padding: '0 16px', gap: 8 }}>
                  <FiSearch color="var(--gray)" size={18} />
                  <input
                    className="search-input" value={keyword} onChange={e => setKeyword(e.target.value)}
                    placeholder="Job title, keywords, or company..."
                    style={{ flex: 1, border: 'none', outline: 'none', padding: '16px 0', fontSize: 15 }}
                  />
                </div>
                <div className="search-divider" />
                <div style={{ display: 'flex', alignItems: 'center', padding: '0 16px', gap: 8 }}>
                  <FiMapPin color="var(--gray)" size={18} />
                  <input
                    value={location} onChange={e => setLocation(e.target.value)}
                    placeholder="City or Remote"
                    style={{ border: 'none', outline: 'none', padding: '16px 0', fontSize: 15, width: 160 }}
                  />
                </div>
                <button type="submit" className="search-btn">Search Jobs</button>
              </div>
            </form>
            <p className="home-search-popular">
              Popular: <span className="home-search-tag">React Developer</span>, <span className="home-search-tag">Python</span>, <span className="home-search-tag">Remote</span>, <span className="home-search-tag">Internship</span>
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="home-stats-bar">
        <div className="container">
          <div className="home-stats-inner">
            {[{ icon: FiBriefcase, label: 'Active Jobs', val: '10,000+' }, { icon: FiUsers, label: 'Companies', val: '2,000+' }, { icon: FiTrendingUp, label: 'Job Seekers', val: '50,000+' }].map(({ icon: Icon, label, val }) => (
              <div key={label} className="home-stat-item">
                <div className="home-stat-icon"><Icon size={22} /></div>
                <div>
                  <div className="home-stat-value">{val}</div>
                  <div className="home-stat-label">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="home-categories-section">
        <div className="container">
          <div className="home-section-header">
            <h2 className="home-section-title">Browse by Category</h2>
            <p className="home-section-subtitle">Explore opportunities across all major tech and business domains</p>
          </div>
          <div className="home-categories-grid">
            {CATEGORIES.map(cat => (
              <Link key={cat.label} to={`/jobs?keyword=${encodeURIComponent(cat.label)}`} className="home-category-card">
                <span className="home-category-icon">{cat.icon}</span>
                <div>
                  <div className="home-category-label">{cat.label}</div>
                  <div className="home-category-count">{cat.count} jobs</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      {featuredJobs.length > 0 && (
        <section className="home-featured-section">
          <div className="container">
            <div className="flex-between" style={{ marginBottom: 40 }}>
              <div>
                <h2 style={{ fontSize: 32, fontWeight: 800 }}>Featured Jobs</h2>
                <p style={{ color: 'var(--gray)', marginTop: 6 }}>Latest opportunities from top companies</p>
              </div>
              <Link to="/jobs" className="btn btn-outline">View All Jobs <FiArrowRight /></Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
              {featuredJobs.slice(0, 6).map(job => <JobCard key={job._id} job={job} />)}
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="home-features-section">
        <div className="container">
          <div className="home-features-header home-section-header">
            <h2 className="home-section-title">Why Choose Job Quest?</h2>
            <p className="home-section-subtitle">Built for modern job seekers and employers</p>
          </div>
          <div className="grid-4">
            {FEATURES.map(f => (
              <div key={f.title} className="home-feature-card">
                <div className="home-feature-icon">{f.icon}</div>
                <h3 className="home-feature-title">{f.title}</h3>
                <p className="home-feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="home-cta-section">
        <div className="container">
          <h2 className="home-cta-title">Ready to Find Your Next Opportunity?</h2>
          <p className="home-cta-subtitle">Join 50,000+ professionals already using Job Quest</p>
          <div className="home-cta-buttons">
            <Link to="/register" className="btn btn-lg home-cta-btn-primary">Get Started Free</Link>
            <Link to="/resume-checker" className="btn btn-lg btn-outline home-cta-btn-outline">Check Your Resume</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function JobCard({ job }) {
  const navigate = useNavigate();
  const typeColors = { 'full-time': 'badge-success', 'part-time': 'badge-warning', 'remote': 'badge-primary', 'contract': 'badge-purple', 'internship': 'badge-orange' };
  return (
    <div className="job-card" onClick={() => navigate(`/jobs/${job._id}`)}>
      <div className="job-card-header">
        <div className="company-logo">{job.companyName?.[0] || '?'}</div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 3 }}>{job.title}</h3>
          <p style={{ fontSize: 13, color: 'var(--gray)' }}>{job.companyName}</p>
        </div>
      </div>
      <div className="job-card-meta">
        <span className={`badge ${typeColors[job.jobType] || 'badge-gray'}`}>{job.jobType}</span>
        <span className="badge badge-gray">📍 {job.location}</span>
        {job.experienceLevel && <span className="badge badge-gray">{job.experienceLevel}</span>}
      </div>
      {job.skills?.slice(0, 3).map(s => <span key={s} className="tag">{s}</span>)}
      <div className="job-card-footer">
        <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: 16 }}>
          {job.salaryMin ? `₹${(job.salaryMin / 1000).toFixed(0)}K – ₹${(job.salaryMax / 1000).toFixed(0)}K` : 'Salary not disclosed'}
        </span>
        <span style={{ fontSize: 12, color: 'var(--gray-light)' }}>
          {new Date(job.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
        </span>
      </div>
    </div>
  );
}