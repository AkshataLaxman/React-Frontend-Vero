import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Shield, CheckCircle } from 'lucide-react';
import { authAPI } from '../../services/api';
import { isValidEmail } from '../../utils/helpers';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    if (!isValidEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.login({
        email: formData.email,
        password: formData.password,
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="auth-content">
          <div className="auth-illustration">
            <svg viewBox="0 0 300 300" fill="none">
              <rect x="60" y="80" width="180" height="160" rx="12" fill="white" opacity="0.9"/>
              <rect x="80" y="100" width="40" height="40" rx="4" fill="#F59E0B"/>
              <rect x="80" y="150" width="140" height="8" rx="4" fill="#E5E7EB"/>
              <rect x="80" y="170" width="100" height="8" rx="4" fill="#E5E7EB"/>
              <rect x="130" y="100" width="30" height="40" rx="4" fill="#10B981"/>
              <rect x="170" y="100" width="50" height="40" rx="4" fill="#0066FF"/>
              <rect x="80" y="190" width="140" height="40" rx="4" fill="#E5E7EB"/>
              <circle cx="260" cy="80" r="20" fill="#10B981" opacity="0.8"/>
              <circle cx="40" cy="220" r="16" fill="#F59E0B" opacity="0.8"/>
              <path d="M 200 60 Q 220 50 240 60" stroke="#0066FF" strokeWidth="4" opacity="0.6"/>
            </svg>
          </div>
          <h1>Simple and Secure Access</h1>
          <p>Manage users, and maintain complete control from one dashboard.</p>
          <div className="carousel-dots">
            <div className="carousel-dot"></div>
            <div className="carousel-dot active"></div>
            <div className="carousel-dot"></div>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-container">
          <div className="auth-logo">
            <div className="auth-logo-icon">
              <Shield size={24} />
            </div>
            <h2>Vero</h2>
          </div>

          <h3>Sign in</h3>
          <p className="auth-subtitle">
            Don't have an account? <Link to="/register">Sign up</Link>
          </p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                placeholder="rebekha@gmail.com"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  className="form-control"
                  placeholder="••••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="form-footer">
              <div className="checkbox-wrapper">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  disabled={loading}
                />
                <label htmlFor="rememberMe">Remember Me</label>
              </div>
              <Link to="/forgot-password" className="forgot-password">
                Forgot password
              </Link>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;