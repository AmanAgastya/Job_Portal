import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PostJobPage() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/employer-login" />;
  if (user.role !== 'recruiter') return <Navigate to="/dashboard" />;
  // Redirect to employer dashboard jobs tab
  return <Navigate to="/dashboard#jobs" />;
}
