import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import {
  FiHome, FiBriefcase, FiBookmark, FiUser, FiFileText, FiSettings,
  FiLogOut, FiUpload, FiEdit2, FiTrash2, FiEye, FiChevronRight, FiAward
} from 'react-icons/fi';
import Navbar from '../components/layout/Navbar';

const STATUS_MAP = {
  pending: { label: 'Pending', cls: 'badge-gray' },
  viewed: { label: 'Viewed', cls: 'badge-primary' },
  shortlisted: { label: 'Shortlisted', cls: 'badge-success' },
  interview: { label: 'Interview', cls: 'badge-warning' },
  offer: { label: 'Offer', cls: 'badge-success' },
  rejected: { label: 'Rejected', cls: 'badge-danger' },
  withdrawn: { label: 'Withdrawn', cls: 'badge-gray' },
};

export default function CandidateDashboard() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const hash = location.hash.replace('#', '') || 'overview';

  const [stats, setStats] = useState({});
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [profileForm, setProfileForm] = useState({
    fullName: user?.fullName || '',
    profile: {
      headline: user?.profile?.headline || '',
      bio: user?.profile?.bio || '',
      location: user?.profile?.location || '',
      phone: user?.profile?.phone || '',
      linkedin: user?.profile?.linkedin || '',
      github: user?.profile?.github || '',
      skills: user?.profile?.skills?.join(', ') || '',
    }
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    api.get('/api/users/dashboard-stats').then(r => setStats(r.data)).catch(() => {});
    api.get('/api/applications/my').then(r => setApplications(r.data)).catch(() => {});
    api.get('/api/users/saved-jobs').then(r => setSavedJobs(r.data)).catch(() => {});
  }, []);

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const payload = {
        fullName: profileForm.fullName,
        profile: { ...profileForm.profile, skills: profileForm.profile.skills.split(',').map(s => s.trim()).filter(Boolean) }
      };
      const { data } = await api.put('/api/users/profile', payload);
      updateUser(data);
      toast.success('Profile updated!');
    } catch { toast.error('Failed to update profile'); }
    finally { setLoading(false); }
  };

  const handleResumeUpload = async () => {
    if (!resumeFile) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('resume', resumeFile);
      const { data } = await api.post('/api/users/upload-resume', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Resume uploaded!');
      setResumeFile(null);
    } catch { toast.error('Upload failed'); }
    finally { setUploading(false); }
  };

  const STAT_CARDS = [
    { label: 'Total Applied', value: stats.totalApplied || 0, icon: '📤', color: '#dbeafe', iconColor: 'var(--primary)' },
    { label: 'Shortlisted', value: stats.shortlisted || 0, icon: '⭐', color: '#d1fae5', iconColor: 'var(--secondary)' },
    { label: 'Interviews', value: stats.interviews || 0, icon: '🎯', color: '#fef3c7', iconColor: 'var(--accent)' },
    { label: 'Offers', value: stats.offers || 0, icon: '🎉', color: '#ede9fe', iconColor: '#7c3aed' },
    { label: 'Saved Jobs', value: stats.savedJobs || 0, icon: '🔖', color: '#ffedd5', iconColor: 'var(--warning)' },
    { label: 'Pending', value: stats.pending || 0, icon: '⏳', color: '#f1f5f9', iconColor: 'var(--gray)' },
  ];

  const navLinks = [
    { id: 'overview', icon: FiHome, label: 'Overview' },
    { id: 'applications', icon: FiBriefcase, label: 'My Applications' },
    { id: 'saved', icon: FiBookmark, label: 'Saved Jobs' },
    { id: 'resume', icon: FiFileText, label: 'Resume' },
    { id: 'profile', icon: FiUser, label: 'Profile' },
    { id: 'ats', icon: FiAward, label: 'ATS Checker' },
  ];

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="dashboard-layout">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18 }}>
                {user?.fullName?.[0]?.toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{user?.fullName}</div>
                <div style={{ fontSize: 12, opacity: 0.6 }}>{user?.profile?.headline || 'Job Seeker'}</div>
              </div>
            </div>
          </div>
          <nav className="sidebar-nav">
            <div className="sidebar-section">Main</div>
            {navLinks.map(({ id, icon: Icon, label }) => (
              <a key={id} href={`#${id}`} className={`sidebar-link ${hash === id ? 'active' : ''}`}>
                <Icon size={18} />{label}
              </a>
            ))}
            <div className="sidebar-section">Account</div>
            <button onClick={() => { logout(); navigate('/'); }} className="sidebar-link" style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}>
              <FiLogOut size={18} />Logout
            </button>
          </nav>
        </aside>

        {/* Main */}
        <main className="dashboard-content">
          {/* Overview */}
          {hash === 'overview' && (
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>Welcome back, {user?.fullName?.split(' ')[0]}! 👋</h1>
              <p style={{ color: 'var(--gray)', marginBottom: 28 }}>Here's your job search summary</p>
              <div className="stats-grid">
                {STAT_CARDS.map(s => (
                  <div key={s.label} className="stat-card">
                    <div className="stat-icon" style={{ background: s.color }}><span>{s.icon}</span></div>
                    <div className="stat-value">{s.value}</div>
                    <div className="stat-label">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="card">
                <div className="card-header flex-between">
                  <h3 style={{ fontWeight: 700 }}>Recent Applications</h3>
                  <a href="#applications" style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 600 }}>View All</a>
                </div>
                <div className="table-wrapper" style={{ borderRadius: 0, border: 'none' }}>
                  {applications.length === 0 ? (
                    <div style={{ padding: 32, textAlign: 'center', color: 'var(--gray)' }}>
                      <div style={{ fontSize: 40 }}>📭</div>
                      <p style={{ marginTop: 12 }}>No applications yet. <Link to="/jobs" style={{ color: 'var(--primary)' }}>Browse jobs</Link></p>
                    </div>
                  ) : (
                    <table className="data-table">
                      <thead><tr><th>Job</th><th>Company</th><th>Applied</th><th>Status</th></tr></thead>
                      <tbody>
                        {applications.slice(0, 5).map(app => (
                          <tr key={app._id}>
                            <td style={{ fontWeight: 600 }}>{app.job?.title}</td>
                            <td style={{ color: 'var(--gray)' }}>{app.job?.companyName}</td>
                            <td style={{ color: 'var(--gray)', fontSize: 13 }}>{new Date(app.createdAt).toLocaleDateString('en-IN')}</td>
                            <td><span className={`badge ${STATUS_MAP[app.status]?.cls || 'badge-gray'}`}>{STATUS_MAP[app.status]?.label}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
              {!user?.profile?.headline && (
                <div style={{ marginTop: 20, padding: 20, background: 'var(--primary-light)', borderRadius: 'var(--radius)', border: '1.5px solid var(--primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--primary)' }}>Complete your profile</div>
                    <div style={{ fontSize: 13, color: 'var(--gray)', marginTop: 3 }}>A complete profile gets 3x more visibility</div>
                  </div>
                  <a href="#profile" className="btn btn-primary btn-sm">Complete Now <FiChevronRight /></a>
                </div>
              )}
            </div>
          )}

          {/* Applications */}
          {hash === 'applications' && (
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>My Applications ({applications.length})</h2>
              {applications.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '60px 24px' }}>
                  <div style={{ fontSize: 60 }}>📭</div>
                  <h3 style={{ marginTop: 16 }}>No applications yet</h3>
                  <p style={{ color: 'var(--gray)', marginTop: 8 }}>Start applying to jobs to see them here</p>
                  <Link to="/jobs" className="btn btn-primary" style={{ marginTop: 20 }}>Browse Jobs</Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {applications.map(app => (
                    <div key={app._id} className="card">
                      <div className="card-body" style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                        <div className="company-logo" style={{ width: 52, height: 52 }}>{app.job?.companyName?.[0]}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: 16 }}>{app.job?.title}</div>
                          <div style={{ color: 'var(--gray)', fontSize: 13, marginTop: 3 }}>
                            {app.job?.companyName} • {app.job?.location} • {app.job?.jobType}
                          </div>
                          <div style={{ fontSize: 12, color: 'var(--gray-light)', marginTop: 4 }}>
                            Applied {new Date(app.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                          <span className={`badge ${STATUS_MAP[app.status]?.cls || 'badge-gray'}`}>{STATUS_MAP[app.status]?.label}</span>
                          {app.status === 'interview' && app.interviewDate && (
                            <div style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600 }}>
                              📅 {new Date(app.interviewDate).toLocaleDateString('en-IN')}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Saved Jobs */}
          {hash === 'saved' && (
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Saved Jobs ({savedJobs.length})</h2>
              {savedJobs.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '60px 24px' }}>
                  <div style={{ fontSize: 60 }}>🔖</div>
                  <h3 style={{ marginTop: 16 }}>No saved jobs</h3>
                  <p style={{ color: 'var(--gray)', marginTop: 8 }}>Save interesting jobs to apply later</p>
                  <Link to="/jobs" className="btn btn-primary" style={{ marginTop: 20 }}>Browse Jobs</Link>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
                  {savedJobs.map(job => (
                    <div key={job._id} className="card" style={{ cursor: 'pointer' }} onClick={() => navigate(`/jobs/${job._id}`)}>
                      <div className="card-body">
                        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
                          <div className="company-logo">{job.companyName?.[0]}</div>
                          <div>
                            <div style={{ fontWeight: 700 }}>{job.title}</div>
                            <div style={{ fontSize: 13, color: 'var(--gray)' }}>{job.companyName}</div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          <span className="badge badge-gray">📍 {job.location}</span>
                          <span className="badge badge-gray">{job.jobType}</span>
                        </div>
                        <div style={{ marginTop: 12, fontWeight: 700, color: 'var(--primary)', fontSize: 15 }}>
                          {job.salaryMin ? `₹${(job.salaryMin / 1000).toFixed(0)}K – ₹${(job.salaryMax / 1000).toFixed(0)}K/mo` : 'Negotiable'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Resume */}
          {hash === 'resume' && (
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>My Resume</h2>
              <div className="card">
                <div className="card-body">
                  {user?.profile?.resume ? (
                    <div style={{ display: 'flex', gap: 16, alignItems: 'center', padding: '16px', background: 'var(--bg)', borderRadius: 'var(--radius-sm)', marginBottom: 20 }}>
                      <div style={{ fontSize: 36 }}>📄</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700 }}>{user.profile.resume.filename}</div>
                        <div style={{ fontSize: 13, color: 'var(--gray)', marginTop: 3 }}>
                          Uploaded {new Date(user.profile.resume.uploadedAt).toLocaleDateString('en-IN')}
                        </div>
                      </div>
                      <a href={`${process.env.REACT_APP_API_URL}${user.profile.resume.url}`} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">
                        <FiEye /> View
                      </a>
                    </div>
                  ) : (
                    <div style={{ padding: '20px', background: '#fff8e1', borderRadius: 'var(--radius-sm)', marginBottom: 20, border: '1px solid #fbbf24' }}>
                      <p style={{ color: '#92400e', fontWeight: 600 }}>⚠️ No resume uploaded yet</p>
                      <p style={{ color: 'var(--gray)', fontSize: 13, marginTop: 4 }}>Upload your resume to apply faster</p>
                    </div>
                  )}
                  <label className="upload-zone">
                    <input type="file" accept=".pdf,.doc,.docx" onChange={e => setResumeFile(e.target.files[0])} />
                    {resumeFile ? (
                      <p style={{ color: 'var(--primary)', fontWeight: 600 }}>📎 {resumeFile.name}</p>
                    ) : (
                      <>
                        <div style={{ fontSize: 40, marginBottom: 12 }}>📤</div>
                        <p style={{ fontWeight: 700 }}>Upload New Resume</p>
                        <p style={{ color: 'var(--gray)', fontSize: 13, marginTop: 6 }}>PDF, DOC, DOCX • Max 10MB</p>
                      </>
                    )}
                  </label>
                  {resumeFile && (
                    <button onClick={handleResumeUpload} disabled={uploading} className="btn btn-primary" style={{ marginTop: 16 }}>
                      {uploading ? <><span className="spinner" />Uploading...</> : <><FiUpload />Upload Resume</>}
                    </button>
                  )}
                  <div style={{ marginTop: 24, padding: '16px', background: 'var(--primary-light)', borderRadius: 'var(--radius-sm)' }}>
                    <p style={{ fontWeight: 600, color: 'var(--primary)', marginBottom: 8 }}>💡 Pro Tip</p>
                    <p style={{ fontSize: 14, color: 'var(--dark-3)' }}>Use our <Link to="/resume-checker" style={{ color: 'var(--primary)', fontWeight: 600 }}>ATS Resume Checker</Link> to score and optimize your resume before applying.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Profile */}
          {hash === 'profile' && (
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>My Profile</h2>
              <div className="card">
                <div className="card-body">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input className="form-control" value={profileForm.fullName} onChange={e => setProfileForm({ ...profileForm, fullName: e.target.value })} />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Professional Headline</label>
                      <input className="form-control" placeholder="e.g. Full Stack Developer | React & Node.js"
                        value={profileForm.profile.headline}
                        onChange={e => setProfileForm({ ...profileForm, profile: { ...profileForm.profile, headline: e.target.value } })} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Location</label>
                      <input className="form-control" placeholder="e.g. Kolkata, India"
                        value={profileForm.profile.location}
                        onChange={e => setProfileForm({ ...profileForm, profile: { ...profileForm.profile, location: e.target.value } })} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Bio / About</label>
                    <textarea className="form-control" rows={4} placeholder="Tell employers about yourself..."
                      value={profileForm.profile.bio}
                      onChange={e => setProfileForm({ ...profileForm, profile: { ...profileForm.profile, bio: e.target.value } })} />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Phone</label>
                      <input className="form-control" placeholder="+91 9876543210"
                        value={profileForm.profile.phone}
                        onChange={e => setProfileForm({ ...profileForm, profile: { ...profileForm.profile, phone: e.target.value } })} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">LinkedIn URL</label>
                      <input className="form-control" placeholder="linkedin.com/in/yourname"
                        value={profileForm.profile.linkedin}
                        onChange={e => setProfileForm({ ...profileForm, profile: { ...profileForm.profile, linkedin: e.target.value } })} />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">GitHub URL</label>
                      <input className="form-control" placeholder="github.com/yourname"
                        value={profileForm.profile.github}
                        onChange={e => setProfileForm({ ...profileForm, profile: { ...profileForm.profile, github: e.target.value } })} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Skills (comma separated)</label>
                      <input className="form-control" placeholder="React, Node.js, MongoDB, Python..."
                        value={profileForm.profile.skills}
                        onChange={e => setProfileForm({ ...profileForm, profile: { ...profileForm.profile, skills: e.target.value } })} />
                    </div>
                  </div>
                  <button onClick={handleSaveProfile} disabled={loading} className="btn btn-primary">
                    {loading ? <><span className="spinner" />Saving...</> : '💾 Save Profile'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ATS shortcut */}
          {hash === 'ats' && (
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>ATS Resume Checker</h2>
              <div className="card" style={{ padding: 32, textAlign: 'center' }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>🤖</div>
                <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 12 }}>Check Your ATS Score</h3>
                <p style={{ color: 'var(--gray)', marginBottom: 24, maxWidth: 500, margin: '0 auto 24px' }}>
                  Upload your resume and get an instant ATS compatibility score with detailed suggestions to improve your chances.
                </p>
                <Link to="/resume-checker" className="btn btn-primary btn-lg">Open ATS Checker →</Link>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
