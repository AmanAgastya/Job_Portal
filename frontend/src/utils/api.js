import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL + "/api" || 'https://job-portal-backend-o3d5.onrender.com/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('jp_token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('jp_token');
      localStorage.removeItem('jp_user');
      window.location.href = '/candidate-login';
    }
    return Promise.reject(err);
  }
);

export default api;
