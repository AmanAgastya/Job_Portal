import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiLock, FiMail } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { AuthCard, InputField } from '../components/auth/AuthLayout';

export default function CandidateLoginPage() {
  const { login, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/dashboard';
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const nextErrors = {};
    if (!form.email) nextErrors.email = 'Email required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) nextErrors.email = 'Invalid email';
    if (!form.password) nextErrors.password = 'Password required';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      if (user.role === 'recruiter') {
        logout();
        toast.error('Please use the employer login page.');
        return;
      }

      toast.success(`Welcome back, ${user.fullName}!`);
      navigate(user.role === 'admin' ? '/admin' : from);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Candidate Login" subtitle="Sign in to continue your job search">
      <form onSubmit={handleSubmit}>
        <InputField
          label="Email Address"
          icon={FiMail}
          type="email"
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
          placeholder="you@example.com"
          error={errors.email}
        />
        <InputField
          label="Password"
          icon={FiLock}
          type="password"
          value={form.password}
          onChange={(event) => setForm({ ...form, password: event.target.value })}
          placeholder="Password"
          error={errors.password}
        />
        <button type="submit" className="btn btn-primary w-full btn-lg auth-submit-btn" disabled={loading}>
          {loading ? <><span className="spinner" />Signing in...</> : 'Sign In as Candidate'}
        </button>
      </form>
      <p className="auth-footer-text">
        Are you an employer? <Link to="/employer-login" className="auth-footer-link">Employer login</Link>
      </p>
      <p className="auth-footer-text">
        Don't have an account? <Link to="/register" className="auth-footer-link">Create one free</Link>
      </p>
      <div className="auth-admin-hint">
        <strong>Admin:</strong> admin@jobportal.com / Admin@1234
      </div>
    </AuthCard>
  );
}
