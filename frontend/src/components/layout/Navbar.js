import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiUser, FiLogOut, FiChevronDown, FiMenu, FiX } from 'react-icons/fi';
import './css/Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); setDropOpen(false); };
  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-inner">

          {/* ── Logo ── */}
          <Link to="/" className="navbar-logo" onClick={closeMenu}>
            <img src="/logo1.jpg" alt="Job Quest Logo" className="navbar-logo-img" />
            <span>Job<span>Quest</span></span>
          </Link>

          {/* ── Nav links (centre, hidden on mobile) ── */}
          <div className={`navbar-nav${menuOpen ? ' open' : ''}`}>
            <Link to="/" className={isActive('/')} onClick={closeMenu}>Home</Link>
            <Link to="/jobs" className={isActive('/jobs')} onClick={closeMenu}>Find Jobs</Link>
            <Link to="/resume-checker" className={isActive('/resume-checker')} onClick={closeMenu}>ATS Checker</Link>
            <Link to="/about" className={isActive('/about')} onClick={closeMenu}>About</Link>
            <Link to="/contact" className={isActive('/contact')} onClick={closeMenu}>Contact</Link>
            {user?.role === 'recruiter' && (
              <Link to="/post-job" className={isActive('/post-job')} onClick={closeMenu}>Post a Job</Link>
            )}
          </div>

          {/* ── Right actions ── */}
          <div className="navbar-actions">
            {user ? (
              <div className="navbar-dropdown-wrapper">
                <button
                  className="btn btn-ghost navbar-user-btn"
                  onClick={() => setDropOpen(o => !o)}
                >
                  <div className="navbar-avatar">{user.fullName?.[0]?.toUpperCase()}</div>
                  <span className="navbar-username">{user.fullName?.split(' ')[0]}</span>
                  <FiChevronDown size={14} />
                </button>
                {dropOpen && (
                  <div className="navbar-dropdown" onClick={() => setDropOpen(false)}>
                    <div className="navbar-dropdown-header">
                      <div className="navbar-dropdown-name">{user.fullName}</div>
                      <div className="navbar-dropdown-email">{user.email}</div>
                      <span className="badge badge-primary" style={{ marginTop: 4, fontSize: 11 }}>{user.role}</span>
                    </div>
                    <Link to="/dashboard" className="navbar-dropdown-link">
                      <FiUser size={15} /> Dashboard
                    </Link>
                    <button onClick={handleLogout} className="navbar-dropdown-logout">
                      <FiLogOut size={15} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/candidate-login" className="btn btn-ghost btn-sm">Candidate Login</Link>
                <Link to="/employer-login" className="btn btn-ghost btn-sm">Employer Login</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
              </>
            )}

            {/* Hamburger — mobile only */}
            <button
              className="navbar-hamburger"
              onClick={() => setMenuOpen(o => !o)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}
