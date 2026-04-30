import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import Navbar from '../layout/Navbar';
import '../../pages/css/AuthPages.css';

export const AuthCard = ({ children, title, subtitle }) => (
  <>
    <Navbar />
    <div className="auth-page">
      <div className="auth-card-wrapper">
        <div className="auth-logo-header">
          <h1 className="auth-title">{title}</h1>
          <p className="auth-subtitle">{subtitle}</p>
        </div>
        <div className="card">
          <div className="card-body">{children}</div>
        </div>
      </div>
    </div>
  </>
);

export const InputField = ({
  label,
  icon: Icon,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
}) => {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <div className="auth-input-wrapper">
        {Icon && <Icon className="auth-input-icon" />}
        <input
          type={isPassword ? (show ? 'text' : 'password') : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="form-control"
          style={{
            paddingLeft: Icon ? 40 : 14,
            paddingRight: isPassword ? 40 : 14,
          }}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="auth-input-toggle"
            aria-label={show ? 'Hide password' : 'Show password'}
          >
            {show ? <FiEyeOff size={16} /> : <FiEye size={16} />}
          </button>
        )}
      </div>
      {error && <div className="form-error">{error}</div>}
    </div>
  );
};
