import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiLock, FiMail } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { AuthCard, InputField } from '../components/auth/AuthLayout';

export default function EmployerLoginPage() {
  const { login, logout } = useAuth();
  const navigate = useNavigate();
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
      if (user.role !== 'recruiter' && user.role !== 'admin') {
        logout();
        toast.error('Please use the candidate login page.');
        return;
      }

      toast.success(`Welcome back, ${user.fullName}!`);
      navigate(user.role === 'admin' ? '/admin' : '/employer');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Employer Login" subtitle="Sign in to manage jobs and applicants">
      <form onSubmit={handleSubmit}>
        <InputField
          label="Email Address"
          icon={FiMail}
          type="email"
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
          placeholder="hr@company.com"
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
          {loading ? <><span className="spinner" />Signing in...</> : 'Sign In as Employer'}
        </button>
      </form>
      <p className="auth-footer-text">
        Looking for jobs? <Link to="/candidate-login" className="auth-footer-link">Candidate login</Link>
      </p>
      <p className="auth-footer-text">
        Need an account? <Link to="/register" className="auth-footer-link">Create employer account</Link>
      </p>
    </AuthCard>
  );
}
