import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, useSearchParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiSearch, FiMapPin, FiBookmark, FiClock, FiBriefcase, FiDollarSign, FiFilter, FiArrowLeft, FiSend } from 'react-icons/fi';
import Navbar from '../components/layout/Navbar';

const JOB_TYPES = ['full-time', 'part-time', 'remote', 'contract', 'internship'];
const EXP_LEVELS = ['entry', 'mid', 'senior', 'lead', 'executive'];
const INDUSTRIES = ['Technology', 'Finance', 'Healthcare', 'Education', 'Marketing', 'Design', 'Operations', 'Sales'];

export function JobsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    location: searchParams.get('location') || '',
    jobType: searchParams.get('jobType') || '',
    experienceLevel: searchParams.get('experienceLevel') || '',
    industry: searchParams.get('industry') || '',
    page: parseInt(searchParams.get('page') || '1'),
    sort: 'latest',
  });
  const [showFilters, setShowFilters] = useState(false);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
      const { data } = await api.get('/api/jobs', { params });
      setJobs(data.jobs || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } catch {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const updateFilter = (key, val) => setFilters(f => ({ ...f, [key]: val, page: 1 }));

  const handleSaveJob = async (jobId, e) => {
    e.stopPropagation();
    if (!user) { navigate('/candidate-login'); return; }
    try {
      const { data } = await api.post(`/api/users/save-job/${jobId}`);
      toast.success(data.message);
    } catch { toast.error('Failed to save job'); }
  };

  const typeColors = { 'full-time': 'badge-success', 'part-time': 'badge-warning', 'remote': 'badge-primary', 'contract': 'badge-purple', 'internship': 'badge-orange' };

  return (
    <div className="page-wrapper">
      <Navbar />
      {/* Search header */}
      <div style={{ background: 'var(--dark-2)', padding: '32px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 240, background: 'white', borderRadius: 'var(--radius-sm)', padding: '0 16px', gap: 8 }}>
              <FiSearch color="var(--gray)" />
              <input value={filters.keyword} onChange={e => updateFilter('keyword', e.target.value)}
                placeholder="Job title, skills..." style={{ flex: 1, border: 'none', outline: 'none', padding: '12px 0', fontSize: 14 }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', background: 'white', borderRadius: 'var(--radius-sm)', padding: '0 16px', gap: 8 }}>
              <FiMapPin color="var(--gray)" />
              <input value={filters.location} onChange={e => updateFilter('location', e.target.value)}
                placeholder="Location..." style={{ border: 'none', outline: 'none', padding: '12px 0', fontSize: 14, width: 160 }} />
            </div>
            <button className="btn btn-primary" onClick={fetchJobs}>Search</button>
            <button className="btn btn-ghost" style={{ color: 'white', border: '1px solid rgba(255,255,255,.3)' }} onClick={() => setShowFilters(!showFilters)}>
              <FiFilter /> Filters
            </button>
          </div>
          {showFilters && (
            <div style={{ display: 'flex', gap: 12, marginTop: 12, flexWrap: 'wrap' }}>
              {[
                { key: 'jobType', opts: JOB_TYPES, label: 'Job Type' },
                { key: 'experienceLevel', opts: EXP_LEVELS, label: 'Experience' },
                { key: 'industry', opts: INDUSTRIES, label: 'Industry' },
              ].map(({ key, opts, label }) => (
                <select key={key} value={filters[key]} onChange={e => updateFilter(key, e.target.value)}
                  style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: 'none', fontSize: 13, minWidth: 140 }}>
                  <option value="">{label}</option>
                  {opts.map(o => <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
                </select>
              ))}
              <button className="btn btn-ghost" style={{ color: 'var(--gray-light)', fontSize: 13 }}
                onClick={() => setFilters({ keyword: '', location: '', jobType: '', experienceLevel: '', industry: '', page: 1, sort: 'latest' })}>
                Clear All
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="container" style={{ padding: '32px 24px' }}>
        <div className="flex-between" style={{ marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700 }}>
              {loading ? 'Loading...' : `${total.toLocaleString()} Jobs Found`}
            </h2>
            {filters.keyword && <p style={{ color: 'var(--gray)', fontSize: 14 }}>Results for "{filters.keyword}"</p>}
          </div>
          <select value={filters.sort} onChange={e => updateFilter('sort', e.target.value)}
            style={{ padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: 13 }}>
            <option value="latest">Latest First</option>
            <option value="salary">Highest Salary</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ height: 200, borderRadius: 'var(--radius)' }} className="skeleton" />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--gray)' }}>
            <div style={{ fontSize: 64 }}>🔍</div>
            <h3 style={{ marginTop: 16, fontSize: 20 }}>No jobs found</h3>
            <p style={{ marginTop: 8 }}>Try adjusting your filters or search terms</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
            {jobs.map(job => (
              <div key={job._id} className="job-card" onClick={() => navigate(`/jobs/${job._id}`)}>
                <div className="job-card-header">
                  <div className="company-logo">{job.companyName?.[0]}</div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 2 }}>{job.title}</h3>
                    <p style={{ fontSize: 13, color: 'var(--gray)' }}>{job.companyName}</p>
                  </div>
                  <button onClick={e => handleSaveJob(job._id, e)} style={{ background: 'none', border: 'none', color: 'var(--gray)', padding: 4 }}>
                    <FiBookmark size={18} />
                  </button>
                </div>
                <div className="job-card-meta">
                  <span className={`badge ${typeColors[job.jobType] || 'badge-gray'}`}>{job.jobType}</span>
                  <span className="badge badge-gray">📍 {job.location}</span>
                  {job.experienceLevel && <span className="badge badge-gray">{job.experienceLevel}</span>}
                </div>
                {job.skills?.slice(0, 3).map(s => <span key={s} className="tag">{s}</span>)}
                <div className="job-card-footer">
                  <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: 15 }}>
                    {job.salaryMin ? `₹${(job.salaryMin / 1000).toFixed(0)}K – ₹${(job.salaryMax / 1000).toFixed(0)}K/mo` : 'Negotiable'}
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--gray-light)' }}>
                    {new Date(job.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="pagination">
            <button className="page-btn" disabled={filters.page === 1} onClick={() => updateFilter('page', filters.page - 1)}>‹</button>
            {[...Array(Math.min(pages, 7))].map((_, i) => (
              <button key={i + 1} className={`page-btn ${filters.page === i + 1 ? 'active' : ''}`} onClick={() => updateFilter('page', i + 1)}>{i + 1}</button>
            ))}
            <button className="page-btn" disabled={filters.page === pages} onClick={() => updateFilter('page', filters.page + 1)}>›</button>
          </div>
        )}
      </div>
    </div>
  );
}

export function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applyModal, setApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  useEffect(() => {
    api.get(`/api/jobs/${id}`).then(res => { setJob(res.data); setLoading(false); }).catch(() => setLoading(false));
    if (user?.role === 'candidate') {
      api.get('/api/applications/my').then(res => {
        setAlreadyApplied(res.data.some(a => a.job?._id === id || a.job === id));
      }).catch(() => {});
    }
  }, [id, user]);

  const handleApply = async () => {
    if (!user) { navigate('/candidate-login', { state: { from: `/jobs/${id}` } }); return; }
    if (user.role !== 'candidate') { toast.error('Only candidates can apply'); return; }
    setApplyModal(true);
  };

  const submitApplication = async () => {
    setApplying(true);
    try {
      const fd = new FormData();
      fd.append('jobId', id);
      fd.append('coverLetter', coverLetter);
      if (resumeFile) fd.append('resume', resumeFile);
      await api.post('/api/applications', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Application submitted successfully!');
      setApplyModal(false);
      setAlreadyApplied(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="page-wrapper"><Navbar /><div style={{ padding: 80, textAlign: 'center' }}><span className="spinner spinner-dark" style={{ width: 40, height: 40, borderWidth: 3 }} /></div></div>;
  if (!job) return <div className="page-wrapper"><Navbar /><div style={{ padding: 80, textAlign: 'center' }}>Job not found.</div></div>;

  const typeColors = { 'full-time': 'badge-success', 'part-time': 'badge-warning', 'remote': 'badge-primary', 'contract': 'badge-purple', 'internship': 'badge-orange' };

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="container" style={{ padding: '32px 24px' }}>
        <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm" style={{ marginBottom: 20 }}>
          <FiArrowLeft /> Back to Jobs
        </button>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 28, alignItems: 'start' }}>
          {/* Main */}
          <div>
            <div className="card" style={{ marginBottom: 24 }}>
              <div className="card-body">
                <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
                  <div className="company-logo" style={{ width: 72, height: 72, fontSize: 28, borderRadius: 14 }}>{job.companyName?.[0]}</div>
                  <div style={{ flex: 1 }}>
                    <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 6 }}>{job.title}</h1>
                    <p style={{ color: 'var(--gray)', fontWeight: 600, fontSize: 16, marginBottom: 12 }}>{job.companyName}</p>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      <span className={`badge ${typeColors[job.jobType] || 'badge-gray'}`}>{job.jobType}</span>
                      <span className="badge badge-gray"><FiMapPin size={11} /> {job.location}</span>
                      {job.experienceLevel && <span className="badge badge-gray">{job.experienceLevel}</span>}
                      {job.industry && <span className="badge badge-purple">{job.industry}</span>}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 24, padding: '20px 0', borderTop: '1px solid var(--border)' }}>
                  <div style={{ textAlign: 'center' }}>
                    <FiDollarSign style={{ color: 'var(--primary)', marginBottom: 4 }} size={20} />
                    <div style={{ fontWeight: 700, fontSize: 15 }}>
                      {job.salaryMin ? `₹${(job.salaryMin / 1000).toFixed(0)}K – ₹${(job.salaryMax / 1000).toFixed(0)}K` : 'Negotiable'}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--gray)' }}>{job.salaryPeriod || 'per month'}</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <FiBriefcase style={{ color: 'var(--secondary)', marginBottom: 4 }} size={20} />
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{job.experienceLevel || 'Any'}</div>
                    <div style={{ fontSize: 12, color: 'var(--gray)' }}>Experience</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <FiClock style={{ color: 'var(--accent)', marginBottom: 4 }} size={20} />
                    <div style={{ fontWeight: 700, fontSize: 15 }}>
                      {job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString('en-IN') : 'Open'}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--gray)' }}>Deadline</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card" style={{ marginBottom: 24 }}>
              <div className="card-body">
                <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Job Description</h2>
                <p style={{ color: 'var(--dark-3)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{job.description}</p>

                {job.requirements?.length > 0 && (
                  <>
                    <h3 style={{ fontSize: 17, fontWeight: 700, marginTop: 28, marginBottom: 12 }}>Requirements</h3>
                    <ul style={{ paddingLeft: 20 }}>
                      {job.requirements.map((r, i) => <li key={i} style={{ marginBottom: 8, color: 'var(--dark-3)', lineHeight: 1.6 }}>{r}</li>)}
                    </ul>
                  </>
                )}

                {job.responsibilities?.length > 0 && (
                  <>
                    <h3 style={{ fontSize: 17, fontWeight: 700, marginTop: 28, marginBottom: 12 }}>Responsibilities</h3>
                    <ul style={{ paddingLeft: 20 }}>
                      {job.responsibilities.map((r, i) => <li key={i} style={{ marginBottom: 8, color: 'var(--dark-3)', lineHeight: 1.6 }}>{r}</li>)}
                    </ul>
                  </>
                )}

                {job.benefits?.length > 0 && (
                  <>
                    <h3 style={{ fontSize: 17, fontWeight: 700, marginTop: 28, marginBottom: 12 }}>Benefits</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {job.benefits.map((b, i) => <span key={i} className="tag" style={{ background: '#d1fae5', color: '#065f46' }}>✓ {b}</span>)}
                    </div>
                  </>
                )}

                {job.skills?.length > 0 && (
                  <>
                    <h3 style={{ fontSize: 17, fontWeight: 700, marginTop: 28, marginBottom: 12 }}>Required Skills</h3>
                    <div>{job.skills.map(s => <span key={s} className="tag">{s}</span>)}</div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ position: 'sticky', top: 88 }}>
            <div className="card" style={{ marginBottom: 16 }}>
              <div className="card-body" style={{ textAlign: 'center' }}>
                {alreadyApplied ? (
                  <div>
                    <div style={{ fontSize: 40, marginBottom: 8 }}>✅</div>
                    <div style={{ fontWeight: 700, color: 'var(--secondary)', marginBottom: 4 }}>Already Applied</div>
                    <p style={{ fontSize: 13, color: 'var(--gray)' }}>Track status in your dashboard</p>
                    <Link to="/dashboard" className="btn btn-outline btn-sm" style={{ marginTop: 12 }}>View Dashboard</Link>
                  </div>
                ) : (
                  <>
                    <button onClick={handleApply} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                      <FiSend /> Apply Now
                    </button>
                    <p style={{ fontSize: 12, color: 'var(--gray)', marginTop: 10 }}>{job.applicantsCount || 0} people have applied</p>
                  </>
                )}
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 14 }}>About Company</h3>
                <div style={{ fontSize: 14, color: 'var(--gray)', lineHeight: 1.7 }}>
                  <p><strong>Company:</strong> {job.companyName}</p>
                  <p style={{ marginTop: 8 }}><strong>Posted:</strong> {new Date(job.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  <p style={{ marginTop: 8 }}><strong>Views:</strong> {job.views || 0}</p>
                </div>
                <Link to="/resume-checker" className="btn btn-outline btn-sm" style={{ width: '100%', marginTop: 16, justifyContent: 'center' }}>
                  🤖 Check ATS Score for this Job
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {applyModal && (
        <div className="modal-overlay" onClick={() => setApplyModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontWeight: 700 }}>Apply for {job.title}</h3>
              <button onClick={() => setApplyModal(false)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--gray)' }}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Cover Letter (optional)</label>
                <textarea value={coverLetter} onChange={e => setCoverLetter(e.target.value)} className="form-control"
                  rows={5} placeholder="Tell the employer why you're a great fit for this role..." />
              </div>
              <div className="form-group">
                <label className="form-label">Resume</label>
                <label className="upload-zone" style={{ cursor: 'pointer' }}>
                  <input type="file" accept=".pdf,.doc,.docx" onChange={e => setResumeFile(e.target.files[0])} />
                  {resumeFile ? (
                    <p style={{ color: 'var(--primary)', fontWeight: 600 }}>📎 {resumeFile.name}</p>
                  ) : (
                    <>
                      <p style={{ fontWeight: 600, marginBottom: 4 }}>Upload Resume</p>
                      <p style={{ color: 'var(--gray)', fontSize: 13 }}>PDF, DOC, DOCX accepted • Max 5MB</p>
                      {user?.profile?.resume && <p style={{ color: 'var(--secondary)', fontSize: 12, marginTop: 6 }}>Or we'll use your saved resume</p>}
                    </>
                  )}
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setApplyModal(false)} className="btn btn-ghost">Cancel</button>
              <button onClick={submitApplication} disabled={applying} className="btn btn-primary">
                {applying ? <><span className="spinner" />Submitting...</> : <><FiSend /> Submit Application</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
