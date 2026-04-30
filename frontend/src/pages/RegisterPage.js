import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiLock, FiMail, FiUser } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { AuthCard, InputField } from '../components/auth/AuthLayout';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    cpassword: '',
    role: 'candidate',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const nextErrors = {};
    if (!form.fullName.trim()) nextErrors.fullName = 'Full name required';
    if (!form.email) nextErrors.email = 'Email required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) nextErrors.email = 'Invalid email';
    if (!form.username || form.username.length < 3) nextErrors.username = 'Username min 3 chars';
    if (!form.password || form.password.length < 8) nextErrors.password = 'Password min 8 chars';
    if (form.password !== form.cpassword) nextErrors.cpassword = 'Passwords do not match';
    if (!form.role) nextErrors.role = 'Select a role';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const user = await register({
        fullName: form.fullName,
        email: form.email,
        username: form.username,
        password: form.password,
        role: form.role,
      });
      toast.success('Account created successfully!');
      navigate(user.role === 'recruiter' ? '/employer' : '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const fieldProps = (key) => ({
    value: form[key],
    onChange: (event) => setForm({ ...form, [key]: event.target.value }),
  });

  return (
    <AuthCard title="Create Account" subtitle="Start your Job Quest journey today">
      <form onSubmit={handleSubmit}>
        <InputField label="Full Name" icon={FiUser} placeholder="John Doe" error={errors.fullName} {...fieldProps('fullName')} />
        <div className="form-row">
          <InputField label="Email" icon={FiMail} type="email" placeholder="you@example.com" error={errors.email} {...fieldProps('email')} />
          <InputField label="Username" icon={FiUser} placeholder="johndoe" error={errors.username} {...fieldProps('username')} />
        </div>
        <div className="form-row">
          <InputField label="Password" icon={FiLock} type="password" placeholder="Min 8 chars" error={errors.password} {...fieldProps('password')} />
          <InputField label="Confirm Password" icon={FiLock} type="password" placeholder="Repeat password" error={errors.cpassword} {...fieldProps('cpassword')} />
        </div>
        <div className="form-group">
          <label className="form-label">I am a...</label>
          <div className="auth-role-selector">
            {['candidate', 'recruiter'].map((role) => (
              <label key={role} className={`auth-role-option${form.role === role ? ' selected' : ''}`}>
                <input
                  type="radio"
                  name="role"
                  value={role}
                  checked={form.role === role}
                  onChange={() => setForm({ ...form, role })}
                  className="auth-role-input"
                />
                {role === 'candidate' ? 'Job Seeker' : 'Employer'}
              </label>
            ))}
          </div>
          {errors.role && <div className="form-error">{errors.role}</div>}
        </div>
        <button type="submit" className="btn btn-primary btn-lg auth-submit-btn" disabled={loading}>
          {loading ? <><span className="spinner" />Creating account...</> : 'Create Free Account'}
        </button>
      </form>
      <p className="auth-footer-text">
        Already have an account? <Link to="/candidate-login" className="auth-footer-link">Candidate login</Link> or{' '}
        <Link to="/employer-login" className="auth-footer-link">Employer login</Link>
      </p>
    </AuthCard>
  );
}
