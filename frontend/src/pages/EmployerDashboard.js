import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { FiHome, FiBriefcase, FiUsers, FiPlus, FiEdit2, FiTrash2, FiEye, FiLogOut, 
  FiSettings, FiCheckCircle } from 'react-icons/fi';
import Navbar from '../components/layout/Navbar';

const STATUS_COLORS = {
  pending: 'badge-gray', viewed: 'badge-primary', shortlisted: 'badge-success',
  interview: 'badge-warning', offer: 'badge-success', rejected: 'badge-danger', withdrawn: 'badge-gray'
};

const JOB_TYPES = ['full-time', 'part-time', 'remote', 'contract', 'internship'];
const EXP_LEVELS = ['entry', 'mid', 'senior', 'lead', 'executive'];
const INDUSTRIES = ['Technology', 'Finance', 'Healthcare', 'Education', 'Marketing', 'Design', 'Operations', 'Sales'];

export default function EmployerDashboard() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const hash = location.hash.replace('#', '') || 'overview';

  const [stats, setStats] = useState({});
  const [myJobs, setMyJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedJob, setSelectedJob] = useState('');
  const [loading, setLoading] = useState(false);
  const [showJobForm, setShowJobForm] = useState(false);
  const [editJob, setEditJob] = useState(null);

  const emptyJob = { title: '', description: '', location: '', jobType: 'full-time', industry: '', experienceLevel: 'entry', salaryMin: '', salaryMax: '', skills: '', requirements: '', responsibilities: '', benefits: '', status: 'active' };
  const [jobForm, setJobForm] = useState(emptyJob);

  const [companyForm, setCompanyForm] = useState({
    fullName: user?.fullName || '',
    company: {
      name: user?.company?.name || '',
      website: user?.company?.website || '',
      industry: user?.company?.industry || '',
      size: user?.company?.size || '',
      location: user?.company?.location || '',
      description: user?.company?.description || '',
    }
  });

  useEffect(() => {
    api.get('/api/users/dashboard-stats').then(r => setStats(r.data)).catch(() => {});
    api.get('/api/jobs/employer/myjobs').then(r => setMyJobs(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    const params = selectedJob ? { jobId: selectedJob } : {};
    api.get('/api/applications/employer', { params }).then(r => setApplications(r.data)).catch(() => {});
  }, [selectedJob]);

  const handleJobSubmit = async () => {
    if (!jobForm.title || !jobForm.description || !jobForm.location) { toast.error('Fill required fields'); return; }
    setLoading(true);
    try {
      const payload = {
        ...jobForm,
        skills: jobForm.skills.split(',').map(s => s.trim()).filter(Boolean),
        requirements: jobForm.requirements.split('\n').filter(Boolean),
        responsibilities: jobForm.responsibilities.split('\n').filter(Boolean),
        benefits: jobForm.benefits.split(',').map(s => s.trim()).filter(Boolean),
        salaryMin: parseInt(jobForm.salaryMin) || 0,
        salaryMax: parseInt(jobForm.salaryMax) || 0,
      };
      if (editJob) {
        await api.put(`/api/jobs/${editJob._id}`, payload);
        toast.success('Job updated!');
        setMyJobs(myJobs.map(j => j._id === editJob._id ? { ...j, ...payload } : j));
      } else {
        const { data } = await api.post('/api/jobs', payload);
        setMyJobs([data, ...myJobs]);
        toast.success('Job posted!');
      }
      setShowJobForm(false);
      setEditJob(null);
      setJobForm(emptyJob);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save job');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm('Delete this job?')) return;
    try {
      await api.delete(`/api/jobs/${id}`);
      setMyJobs(myJobs.filter(j => j._id !== id));
      toast.success('Job deleted');
    } catch { toast.error('Delete failed'); }
  };

  const handleStatusChange = async (appId, status) => {
    try {
      const { data } = await api.put(`/api/applications/${appId}/status`, { status });
      setApplications(applications.map(a => a._id === appId ? { ...a, status: data.status } : a));
      toast.success(`Status updated to ${status}`);
    } catch { toast.error('Failed to update status'); }
  };

  const handleSaveCompany = async () => {
    setLoading(true);
    try {
      const { data } = await api.put('/api/users/profile', companyForm);
      updateUser(data);
      toast.success('Company profile updated!');
    } catch { toast.error('Update failed'); }
    finally { setLoading(false); }
  };

  const openEditJob = (job) => {
    setEditJob(job);
    setJobForm({
      title: job.title, description: job.description, location: job.location,
      jobType: job.jobType, industry: job.industry || '', experienceLevel: job.experienceLevel || 'entry',
      salaryMin: job.salaryMin || '', salaryMax: job.salaryMax || '',
      skills: job.skills?.join(', ') || '',
      requirements: job.requirements?.join('\n') || '',
      responsibilities: job.responsibilities?.join('\n') || '',
      benefits: job.benefits?.join(', ') || '',
      status: job.status,
    });
    setShowJobForm(true);
  };

  const STAT_CARDS = [
    { label: 'Total Jobs', value: stats.totalJobs || 0, icon: '📋', color: '#dbeafe' },
    { label: 'Active Jobs', value: stats.activeJobs || 0, icon: '✅', color: '#d1fae5' },
    { label: 'Total Applications', value: stats.totalApplications || 0, icon: '📤', color: '#fef3c7' },
    { label: 'Pending Review', value: stats.pendingReview || 0, icon: '⏳', color: '#ffedd5' },
    { label: 'Shortlisted', value: stats.shortlisted || 0, icon: '⭐', color: '#ede9fe' },
    { label: 'Interviews', value: stats.interviews || 0, icon: '🎯', color: '#fce7f3' },
  ];

  const navLinks = [
    { id: 'overview', icon: FiHome, label: 'Overview' },
    { id: 'jobs', icon: FiBriefcase, label: 'My Job Posts' },
    { id: 'applications', icon: FiUsers, label: 'Applications' },
    { id: 'company', icon: FiBriefcase, label: 'Company Profile' },
  ];

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="dashboard-layout">
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--secondary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18 }}>
                {(user?.company?.name || user?.fullName)?.[0]?.toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{user?.company?.name || user?.fullName}</div>
                <div style={{ fontSize: 11, opacity: 0.6 }}>Employer Account</div>
              </div>
            </div>
          </div>
          <nav className="sidebar-nav">
            <div className="sidebar-section">Dashboard</div>
            {navLinks.map(({ id, icon: Icon, label }) => (
              <a key={id} href={`#${id}`} className={`sidebar-link ${hash === id ? 'active' : ''}`}>
                <Icon size={18} />{label}
              </a>
            ))}
            <div className="sidebar-section">Quick Actions</div>
            <a href="#jobs" onClick={() => { setShowJobForm(true); setEditJob(null); setJobForm(emptyJob); }} className="sidebar-link">
              <FiPlus size={18} />Post New Job
            </a>
            <div className="sidebar-section">Account</div>
            <button onClick={() => { logout(); navigate('/'); }} className="sidebar-link" style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}>
              <FiLogOut size={18} />Logout
            </button>
          </nav>
        </aside>

        <main className="dashboard-content">
          {/* Overview */}
          {hash === 'overview' && (
            <div>
              <div className="flex-between" style={{ marginBottom: 28 }}>
                <div>
                  <h1 style={{ fontSize: 26, fontWeight: 800 }}>Employer Dashboard</h1>
                  <p style={{ color: 'var(--gray)', marginTop: 4 }}>Manage your jobs and find the best talent</p>
                </div>
                <button onClick={() => { setShowJobForm(true); setEditJob(null); setJobForm(emptyJob); }}
                  className="btn btn-primary"><FiPlus />Post a Job</button>
              </div>
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
                <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
                  {applications.length === 0 ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--gray)' }}>No applications yet. Post a job to start receiving candidates.</div>
                  ) : (
                    <table className="data-table">
                      <thead><tr><th>Applicant</th><th>Job</th><th>Date</th><th>Status</th><th>Action</th></tr></thead>
                      <tbody>
                        {applications.slice(0, 8).map(app => (
                          <tr key={app._id}>
                            <td>
                              <div style={{ fontWeight: 600 }}>{app.applicant?.fullName}</div>
                              <div style={{ fontSize: 12, color: 'var(--gray)' }}>{app.applicant?.email}</div>
                            </td>
                            <td style={{ fontSize: 13 }}>{app.job?.title}</td>
                            <td style={{ fontSize: 12, color: 'var(--gray)' }}>{new Date(app.createdAt).toLocaleDateString('en-IN')}</td>
                            <td><span className={`badge ${STATUS_COLORS[app.status] || 'badge-gray'}`}>{app.status}</span></td>
                            <td>
                              <select value={app.status} onChange={e => handleStatusChange(app._id, e.target.value)}
                                style={{ fontSize: 12, padding: '4px 8px', border: '1px solid var(--border)', borderRadius: 6 }}>
                                {['pending','viewed','shortlisted','interview','offer','rejected'].map(s => <option key={s} value={s}>{s}</option>)}
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* My Jobs */}
          {hash === 'jobs' && (
            <div>
              <div className="flex-between" style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 24, fontWeight: 800 }}>My Job Posts ({myJobs.length})</h2>
                <button onClick={() => { setShowJobForm(true); setEditJob(null); setJobForm(emptyJob); }} className="btn btn-primary">
                  <FiPlus />Post New Job
                </button>
              </div>
              {myJobs.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '60px 24px' }}>
                  <div style={{ fontSize: 60 }}>📋</div>
                  <h3 style={{ marginTop: 16 }}>No jobs posted yet</h3>
                  <button onClick={() => setShowJobForm(true)} className="btn btn-primary" style={{ marginTop: 20 }}>Post Your First Job</button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {myJobs.map(job => (
                    <div key={job._id} className="card">
                      <div className="card-body" style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                            <div style={{ fontWeight: 700, fontSize: 17 }}>{job.title}</div>
                            <span className={`badge ${job.status === 'active' ? 'badge-success' : 'badge-gray'}`}>{job.status}</span>
                          </div>
                          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', fontSize: 13, color: 'var(--gray)' }}>
                            <span>📍 {job.location}</span>
                            <span>💼 {job.jobType}</span>
                            <span>👥 {job.applicantsCount || 0} applicants</span>
                            <span>👁 {job.views || 0} views</span>
                            <span>🗓 {new Date(job.createdAt).toLocaleDateString('en-IN')}</span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button onClick={() => openEditJob(job)} className="btn btn-ghost btn-sm"><FiEdit2 /></button>
                          <button onClick={() => handleDeleteJob(job._id)} className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }}><FiTrash2 /></button>
                          <Link to={`/jobs/${job._id}`} target="_blank" className="btn btn-outline btn-sm"><FiEye /></Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Job Form Modal */}
              {showJobForm && (
                <div className="modal-overlay" onClick={() => setShowJobForm(false)}>
                  <div className="modal" style={{ maxWidth: 700 }} onClick={e => e.stopPropagation()}>
                    <div className="modal-header">
                      <h3 style={{ fontWeight: 700 }}>{editJob ? 'Edit Job' : 'Post New Job'}</h3>
                      <button onClick={() => setShowJobForm(false)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--gray)' }}>✕</button>
                    </div>
                    <div className="modal-body">
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Job Title *</label>
                          <input className="form-control" value={jobForm.title} onChange={e => setJobForm({ ...jobForm, title: e.target.value })} placeholder="e.g. Senior React Developer" />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Location *</label>
                          <input className="form-control" value={jobForm.location} onChange={e => setJobForm({ ...jobForm, location: e.target.value })} placeholder="e.g. Kolkata or Remote" />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Job Type</label>
                          <select className="form-control" value={jobForm.jobType} onChange={e => setJobForm({ ...jobForm, jobType: e.target.value })}>
                            {JOB_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                          </select>
                        </div>
                        <div className="form-group">
                          <label className="form-label">Experience Level</label>
                          <select className="form-control" value={jobForm.experienceLevel} onChange={e => setJobForm({ ...jobForm, experienceLevel: e.target.value })}>
                            {EXP_LEVELS.map(l => <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
                          </select>
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Industry</label>
                          <select className="form-control" value={jobForm.industry} onChange={e => setJobForm({ ...jobForm, industry: e.target.value })}>
                            <option value="">Select Industry</option>
                            {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                          </select>
                        </div>
                        <div className="form-group">
                          <label className="form-label">Status</label>
                          <select className="form-control" value={jobForm.status} onChange={e => setJobForm({ ...jobForm, status: e.target.value })}>
                            <option value="active">Active</option>
                            <option value="draft">Draft</option>
                            <option value="paused">Paused</option>
                          </select>
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Min Salary (₹/month)</label>
                          <input className="form-control" type="number" value={jobForm.salaryMin} onChange={e => setJobForm({ ...jobForm, salaryMin: e.target.value })} placeholder="e.g. 30000" />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Max Salary (₹/month)</label>
                          <input className="form-control" type="number" value={jobForm.salaryMax} onChange={e => setJobForm({ ...jobForm, salaryMax: e.target.value })} placeholder="e.g. 60000" />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Required Skills (comma-separated)</label>
                        <input className="form-control" value={jobForm.skills} onChange={e => setJobForm({ ...jobForm, skills: e.target.value })} placeholder="React, Node.js, MongoDB, CSS..." />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Job Description *</label>
                        <textarea className="form-control" rows={5} value={jobForm.description} onChange={e => setJobForm({ ...jobForm, description: e.target.value })} placeholder="Describe the role, team, and impact..." />
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Requirements (one per line)</label>
                          <textarea className="form-control" rows={4} value={jobForm.requirements} onChange={e => setJobForm({ ...jobForm, requirements: e.target.value })} placeholder="3+ years React experience&#10;Strong JavaScript skills&#10;..." />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Benefits (comma-separated)</label>
                          <textarea className="form-control" rows={4} value={jobForm.benefits} onChange={e => setJobForm({ ...jobForm, benefits: e.target.value })} placeholder="Health Insurance, PF, Flexible Hours, WFH..." />
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button onClick={() => setShowJobForm(false)} className="btn btn-ghost">Cancel</button>
                      <button onClick={handleJobSubmit} disabled={loading} className="btn btn-primary">
                        {loading ? <><span className="spinner" />Saving...</> : editJob ? '✏️ Update Job' : '🚀 Post Job'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Applications */}
          {hash === 'applications' && (
            <div>
              <div className="flex-between" style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 24, fontWeight: 800 }}>All Applications ({applications.length})</h2>
                <select value={selectedJob} onChange={e => setSelectedJob(e.target.value)}
                  style={{ padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: 13 }}>
                  <option value="">All Jobs</option>
                  {myJobs.map(j => <option key={j._id} value={j._id}>{j.title}</option>)}
                </select>
              </div>
              {applications.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '60px 24px' }}>
                  <div style={{ fontSize: 60 }}>👥</div>
                  <h3 style={{ marginTop: 16 }}>No applications yet</h3>
                  <p style={{ color: 'var(--gray)', marginTop: 8 }}>Post jobs to start receiving applications</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {applications.map(app => (
                    <div key={app._id} className="card">
                      <div className="card-body" style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                        <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18, flexShrink: 0 }}>
                          {app.applicant?.fullName?.[0]}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 4 }}>
                            <span style={{ fontWeight: 700, fontSize: 16 }}>{app.applicant?.fullName}</span>
                            <span className={`badge ${STATUS_COLORS[app.status] || 'badge-gray'}`}>{app.status}</span>
                          </div>
                          <div style={{ fontSize: 13, color: 'var(--gray)', marginBottom: 6 }}>
                            {app.applicant?.email} • Applied for <strong>{app.job?.title}</strong>
                          </div>
                          {app.applicant?.profile?.headline && <div style={{ fontSize: 13, color: 'var(--dark-3)', marginBottom: 6 }}>💼 {app.applicant.profile.headline}</div>}
                          {app.applicant?.profile?.skills?.length > 0 && (
                            <div>{app.applicant.profile.skills.slice(0, 5).map(s => <span key={s} className="tag" style={{ fontSize: 11 }}>{s}</span>)}</div>
                          )}
                          {app.coverLetter && (
                            <details style={{ marginTop: 10 }}>
                              <summary style={{ cursor: 'pointer', fontSize: 13, color: 'var(--primary)', fontWeight: 600 }}>View Cover Letter</summary>
                              <p style={{ marginTop: 8, fontSize: 13, color: 'var(--dark-3)', lineHeight: 1.7, padding: '12px', background: 'var(--bg)', borderRadius: 6 }}>{app.coverLetter}</p>
                            </details>
                          )}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end', flexShrink: 0 }}>
                          <div style={{ fontSize: 12, color: 'var(--gray-light)' }}>{new Date(app.createdAt).toLocaleDateString('en-IN')}</div>
                          <select value={app.status} onChange={e => handleStatusChange(app._id, e.target.value)}
                            style={{ padding: '6px 10px', border: '1.5px solid var(--border)', borderRadius: 6, fontSize: 12, fontWeight: 600 }}>
                            {['pending', 'viewed', 'shortlisted', 'interview', 'offer', 'rejected'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                          </select>
                          {app.resumeUrl && (
                            <a href={`http://localhost:5000${app.resumeUrl}`} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">📄 Resume</a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Company Profile */}
          {hash === 'company' && (
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Company Profile</h2>
              <div className="card">
                <div className="card-body">
                  <div className="form-group">
                    <label className="form-label">Contact Name</label>
                    <input className="form-control" value={companyForm.fullName} onChange={e => setCompanyForm({ ...companyForm, fullName: e.target.value })} />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Company Name</label>
                      <input className="form-control" value={companyForm.company.name} onChange={e => setCompanyForm({ ...companyForm, company: { ...companyForm.company, name: e.target.value } })} placeholder="Acme Corp" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Website</label>
                      <input className="form-control" value={companyForm.company.website} onChange={e => setCompanyForm({ ...companyForm, company: { ...companyForm.company, website: e.target.value } })} placeholder="https://acme.com" />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Industry</label>
                      <select className="form-control" value={companyForm.company.industry} onChange={e => setCompanyForm({ ...companyForm, company: { ...companyForm.company, industry: e.target.value } })}>
                        <option value="">Select Industry</option>
                        {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Company Size</label>
                      <select className="form-control" value={companyForm.company.size} onChange={e => setCompanyForm({ ...companyForm, company: { ...companyForm.company, size: e.target.value } })}>
                        <option value="">Select Size</option>
                        {['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'].map(s => <option key={s} value={s}>{s} employees</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Office Location</label>
                    <input className="form-control" value={companyForm.company.location} onChange={e => setCompanyForm({ ...companyForm, company: { ...companyForm.company, location: e.target.value } })} placeholder="Kolkata, India" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Company Description</label>
                    <textarea className="form-control" rows={5} value={companyForm.company.description} onChange={e => setCompanyForm({ ...companyForm, company: { ...companyForm.company, description: e.target.value } })} placeholder="Tell candidates about your company culture, mission, and values..." />
                  </div>
                  <button onClick={handleSaveCompany} disabled={loading} className="btn btn-primary">
                    {loading ? <><span className="spinner" />Saving...</> : '💾 Save Company Profile'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
