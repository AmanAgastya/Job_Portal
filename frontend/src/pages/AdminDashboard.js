import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import {
  FiHome, FiUsers, FiBriefcase, FiFileText, FiTrash2,
  FiLogOut, FiShield, FiToggleLeft, FiToggleRight, FiEye
} from 'react-icons/fi';
import Navbar from '../components/layout/Navbar';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const hash = location.hash.replace('#', '') || 'overview';

  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [userFilter, setUserFilter] = useState('');
  const [jobFilter, setJobFilter] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/api/admin/stats').then(r => setStats(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (hash === 'users' || hash === 'overview') {
      const params = {};
      if (userFilter) params.role = userFilter;
      if (search) params.search = search;
      api.get('/api/admin/users', { params }).then(r => setUsers(r.data.users || [])).catch(() => {});
    }
    if (hash === 'jobs') {
      const params = jobFilter ? { status: jobFilter } : {};
      api.get('/api/admin/jobs', { params }).then(r => setJobs(r.data.jobs || [])).catch(() => {});
    }
    if (hash === 'applications') {
      api.get('/api/admin/applications').then(r => setApplications(r.data.applications || [])).catch(() => {});
    }
  }, [hash, userFilter, jobFilter, search]);

  const toggleUserStatus = async (id, current) => {
    try {
      await api.put(`/api/admin/users/${id}/status`, { isActive: !current });
      setUsers(users.map(u => u._id === id ? { ...u, isActive: !current } : u));
      toast.success(`User ${!current ? 'activated' : 'deactivated'}`);
    } catch { toast.error('Failed'); }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Permanently delete this user?')) return;
    try {
      await api.delete(`/api/admin/users/${id}`);
      setUsers(users.filter(u => u._id !== id));
      toast.success('User deleted');
    } catch { toast.error('Delete failed'); }
  };

  const toggleJobStatus = async (id, current) => {
    const newStatus = current === 'active' ? 'paused' : 'active';
    try {
      await api.put(`/api/admin/jobs/${id}/status`, { status: newStatus });
      setJobs(jobs.map(j => j._id === id ? { ...j, status: newStatus } : j));
      toast.success(`Job ${newStatus}`);
    } catch { toast.error('Failed'); }
  };

  const deleteJob = async (id) => {
    if (!window.confirm('Delete this job?')) return;
    try {
      await api.delete(`/api/admin/jobs/${id}`);
      setJobs(jobs.filter(j => j._id !== id));
      toast.success('Job deleted');
    } catch { toast.error('Delete failed'); }
  };

  const STAT_CARDS = [
    { label: 'Total Users', value: stats.totalUsers || 0, icon: '👥', color: '#dbeafe' },
    { label: 'Candidates', value: stats.candidates || 0, icon: '🔍', color: '#d1fae5' },
    { label: 'Employers', value: stats.recruiters || 0, icon: '🏢', color: '#fef3c7' },
    { label: 'Total Jobs', value: stats.totalJobs || 0, icon: '📋', color: '#ede9fe' },
    { label: 'Active Jobs', value: stats.activeJobs || 0, icon: '✅', color: '#ffedd5' },
    { label: 'Applications', value: stats.totalApps || 0, icon: '📤', color: '#fce7f3' },
  ];

  const navLinks = [
    { id: 'overview', icon: FiHome, label: 'Overview' },
    { id: 'users', icon: FiUsers, label: 'Manage Users' },
    { id: 'jobs', icon: FiBriefcase, label: 'Manage Jobs' },
    { id: 'applications', icon: FiFileText, label: 'Applications' },
  ];

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="dashboard-layout">
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: '#7c3aed', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FiShield size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>Admin Panel</div>
                <div style={{ fontSize: 11, opacity: 0.6 }}>{user?.email}</div>
              </div>
            </div>
          </div>
          <nav className="sidebar-nav">
            <div className="sidebar-section">Administration</div>
            {navLinks.map(({ id, icon: Icon, label }) => (
              <a key={id} href={`#${id}`} className={`sidebar-link ${hash === id ? 'active' : ''}`}>
                <Icon size={18} />{label}
              </a>
            ))}
            <div className="sidebar-section">Account</div>
            <button onClick={() => { logout(); navigate('/'); }}
              className="sidebar-link" style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}>
              <FiLogOut size={18} />Logout
            </button>
          </nav>
        </aside>

        <main className="dashboard-content">
          {/* Overview */}
          {hash === 'overview' && (
            <div>
              <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: 26, fontWeight: 800 }}>Admin Dashboard</h1>
                <p style={{ color: 'var(--gray)', marginTop: 4 }}>Platform overview and management</p>
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
              <div className="grid-2" style={{ gap: 24, marginTop: 8 }}>
                <div className="card">
                  <div className="card-header"><h3 style={{ fontWeight: 700 }}>Recent Users</h3></div>
                  <table className="data-table">
                    <thead><tr><th>Name</th><th>Role</th><th>Status</th></tr></thead>
                    <tbody>
                      {users.slice(0, 6).map(u => (
                        <tr key={u._id}>
                          <td>
                            <div style={{ fontWeight: 600, fontSize: 13 }}>{u.fullName}</div>
                            <div style={{ fontSize: 11, color: 'var(--gray)' }}>{u.email}</div>
                          </td>
                          <td><span className={`badge ${u.role === 'recruiter' ? 'badge-warning' : 'badge-primary'}`}>{u.role}</span></td>
                          <td><span className={`badge ${u.isActive ? 'badge-success' : 'badge-danger'}`}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="card">
                  <div className="card-header"><h3 style={{ fontWeight: 700 }}>Recent Jobs</h3></div>
                  <table className="data-table">
                    <thead><tr><th>Title</th><th>Company</th><th>Status</th></tr></thead>
                    <tbody>
                      {jobs.slice(0, 6).map(j => (
                        <tr key={j._id}>
                          <td style={{ fontWeight: 600, fontSize: 13 }}>{j.title}</td>
                          <td style={{ fontSize: 12, color: 'var(--gray)' }}>{j.companyName}</td>
                          <td><span className={`badge ${j.status === 'active' ? 'badge-success' : 'badge-gray'}`}>{j.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Users */}
          {hash === 'users' && (
            <div>
              <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>Manage Users ({users.length})</h2>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..."
                    className="form-control" style={{ maxWidth: 280 }} />
                  <select value={userFilter} onChange={e => setUserFilter(e.target.value)}
                    style={{ padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: 13 }}>
                    <option value="">All Roles</option>
                    <option value="candidate">Candidates</option>
                    <option value="recruiter">Recruiters</option>
                  </select>
                </div>
              </div>
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>User</th><th>Role</th><th>Joined</th><th>Last Login</th><th>Status</th><th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                              {u.fullName?.[0]}
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, fontSize: 14 }}>{u.fullName}</div>
                              <div style={{ fontSize: 12, color: 'var(--gray)' }}>{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td><span className={`badge ${u.role === 'recruiter' ? 'badge-warning' : 'badge-primary'}`}>{u.role}</span></td>
                        <td style={{ fontSize: 12, color: 'var(--gray)' }}>{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                        <td style={{ fontSize: 12, color: 'var(--gray)' }}>{u.lastLogin ? new Date(u.lastLogin).toLocaleDateString('en-IN') : '—'}</td>
                        <td><span className={`badge ${u.isActive ? 'badge-success' : 'badge-danger'}`}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
                        <td>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button onClick={() => toggleUserStatus(u._id, u.isActive)}
                              className="btn btn-ghost btn-sm" title={u.isActive ? 'Deactivate' : 'Activate'}
                              style={{ color: u.isActive ? 'var(--warning)' : 'var(--secondary)' }}>
                              {u.isActive ? <FiToggleRight size={18} /> : <FiToggleLeft size={18} />}
                            </button>
                            <button onClick={() => deleteUser(u._id)} className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }}>
                              <FiTrash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {users.length === 0 && <div style={{ padding: 40, textAlign: 'center', color: 'var(--gray)' }}>No users found</div>}
              </div>
            </div>
          )}

          {/* Jobs */}
          {hash === 'jobs' && (
            <div>
              <div className="flex-between" style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 24, fontWeight: 800 }}>Manage Jobs ({jobs.length})</h2>
                <select value={jobFilter} onChange={e => setJobFilter(e.target.value)}
                  style={{ padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: 13 }}>
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="closed">Closed</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              <div className="table-wrapper">
                <table className="data-table">
                  <thead><tr><th>Job Title</th><th>Company</th><th>Type</th><th>Applicants</th><th>Posted</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {jobs.map(j => (
                      <tr key={j._id}>
                        <td style={{ fontWeight: 600 }}>{j.title}</td>
                        <td style={{ fontSize: 13, color: 'var(--gray)' }}>{j.companyName}</td>
                        <td><span className="badge badge-gray">{j.jobType}</span></td>
                        <td style={{ fontWeight: 600 }}>{j.applicantsCount || 0}</td>
                        <td style={{ fontSize: 12, color: 'var(--gray)' }}>{new Date(j.createdAt).toLocaleDateString('en-IN')}</td>
                        <td><span className={`badge ${j.status === 'active' ? 'badge-success' : 'badge-gray'}`}>{j.status}</span></td>
                        <td>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button onClick={() => toggleJobStatus(j._id, j.status)}
                              className="btn btn-ghost btn-sm"
                              style={{ color: j.status === 'active' ? 'var(--warning)' : 'var(--secondary)' }}>
                              {j.status === 'active' ? <FiToggleRight size={18} /> : <FiToggleLeft size={18} />}
                            </button>
                            <button onClick={() => deleteJob(j._id)} className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }}>
                              <FiTrash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {jobs.length === 0 && <div style={{ padding: 40, textAlign: 'center', color: 'var(--gray)' }}>No jobs found</div>}
              </div>
            </div>
          )}

          {/* Applications */}
          {hash === 'applications' && (
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>All Applications ({applications.length})</h2>
              <div className="table-wrapper">
                <table className="data-table">
                  <thead><tr><th>Applicant</th><th>Job</th><th>Company</th><th>Applied</th><th>Status</th></tr></thead>
                  <tbody>
                    {applications.map(a => (
                      <tr key={a._id}>
                        <td>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{a.applicant?.fullName}</div>
                          <div style={{ fontSize: 11, color: 'var(--gray)' }}>{a.applicant?.email}</div>
                        </td>
                        <td style={{ fontSize: 13 }}>{a.job?.title}</td>
                        <td style={{ fontSize: 13, color: 'var(--gray)' }}>{a.job?.companyName}</td>
                        <td style={{ fontSize: 12, color: 'var(--gray)' }}>{new Date(a.createdAt).toLocaleDateString('en-IN')}</td>
                        <td>
                          <span className={`badge ${
                            a.status === 'shortlisted' ? 'badge-success' :
                            a.status === 'rejected' ? 'badge-danger' :
                            a.status === 'interview' ? 'badge-warning' :
                            a.status === 'offer' ? 'badge-purple' : 'badge-gray'
                          }`}>{a.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {applications.length === 0 && <div style={{ padding: 40, textAlign: 'center', color: 'var(--gray)' }}>No applications found</div>}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
