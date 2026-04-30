import React from 'react';
import { HashRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, DashboardRouter } from './components/layout/ProtectedRoute';
import Footer  from './components/layout/Footer';
import HomePage from './pages/HomePage';
import CandidateLoginPage from './pages/CandidateLoginPage';
import EmployerLoginPage from './pages/EmployerLoginPage';
import RegisterPage from './pages/RegisterPage';
import { JobsPage, JobDetailPage } from './pages/JobsPages';
import ATSCheckerPage from './pages/ATSCheckerPage';
import CandidateDashboard from './pages/CandidateDashboard';
import EmployerDashboard from './pages/EmployerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import PostJobPage from './pages/PostJobPage';

import './index.css';

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              borderRadius: '10px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
              fontSize: '14px',
              fontWeight: 500,
            },
            success: { iconTheme: { primary: '#10b981', secondary: 'white' } },
            error: { iconTheme: { primary: '#ef4444', secondary: 'white' } },
          }}
        />
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Navigate to="/candidate-login" replace />} />
          <Route path="/candidate-login" element={<CandidateLoginPage />} />
          <Route path="/employer-login" element={<EmployerLoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs/:id" element={<JobDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/post-job" element={<PostJobPage />} />
        
          {/* ATS - requires login */}
          <Route path="/resume-checker" element={
            <ProtectedRoute>
              <ATSCheckerPage />
            </ProtectedRoute>
          } />

          {/* Dashboard router */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardRouter />
            </ProtectedRoute>
          } />

          {/* Candidate */}
          <Route path="/candidate" element={
            <ProtectedRoute roles={['candidate']}>
              <CandidateDashboard />
            </ProtectedRoute>
          } />

          {/* Employer */}
          <Route path="/employer" element={
            <ProtectedRoute roles={['recruiter']} loginPath="/employer-login">
              <EmployerDashboard />
            </ProtectedRoute>
          } />

          {/* Admin */}
          <Route path="/admin" element={
            <ProtectedRoute roles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          {/* 404 */}
          <Route path="*" element={
            <div className="home-404">
              <div className="home-404-emoji">🔍</div>
              <h1 className="home-404-title">Page Not Found</h1>
              <p className="home-404-text">The page you're looking for doesn't exist.</p>
              <Link to="/" className="btn btn-primary">Go Home</Link>
            </div>
          } />
        </Routes>
        <Footer />
      </HashRouter>
    </AuthProvider>
  );
}
