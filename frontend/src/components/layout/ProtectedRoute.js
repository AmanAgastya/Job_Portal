import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './css/ProtectedRoute.css';

export function ProtectedRoute({ children, roles, loginPath = '/candidate-login' }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="protected-loading">
        <div className="protected-loading-inner">
          <div className="spinner spinner-dark protected-loading-spinner" />
          <p className="protected-loading-text">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to={loginPath} state={{ from: location.pathname }} replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return children;
}

export function DashboardRouter() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/candidate-login" replace />;
  if (user.role === 'admin') return <Navigate to="/admin" replace />;
  if (user.role === 'recruiter') return <Navigate to="/employer" replace />;
  return <Navigate to="/candidate" replace />;
}
