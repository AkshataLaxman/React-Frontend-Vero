import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Shield } from 'lucide-react';
import { authAPI } from '../../services/api';
import { isValidEmail, isValidPassword } from '../../utils/helpers';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (!isValidEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!isValidPassword(formData.password)) {
      setError('Password must be at least 6 characters with 1 uppercase, 1 lowercase, 1 number, and 1 special character');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await authAPI.register({
        full_name: formData.fullName,
        email: formData.email,
        password: formData.password,
      });

      // Auto login after registration
      const loginResponse = await authAPI.login({
        email: formData.email,
        password: formData.password,
      });

      localStorage.setItem('token', loginResponse.data.token);
      localStorage.setItem('user', JSON.stringify(loginResponse.data.user));
      
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
              <circle cx="150" cy="130" r="30" fill="#0066FF" opacity="0.8"/>
              <path d="M 135 130 L 145 140 L 165 120" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="80" y="180" width="140" height="8" rx="4" fill="#E5E7EB"/>
              <rect x="80" y="200" width="100" height="8" rx="4" fill="#E5E7EB"/>
              <circle cx="260" cy="80" r="20" fill="#10B981" opacity="0.8"/>
              <circle cx="40" cy="220" r="16" fill="#F59E0B" opacity="0.8"/>
            </svg>
          </div>
          <h1>Join Vero Today</h1>
          <p>Start managing your documents securely with our powerful verification system.</p>
          <div className="carousel-dots">
            <div className="carousel-dot"></div>
            <div className="carousel-dot"></div>
            <div className="carousel-dot active"></div>
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

          <h3>Sign up</h3>
          <p className="auth-subtitle">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="fullName">Full Name *</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                className="form-control"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                placeholder="john@example.com"
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

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password *</label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                className="form-control"
                placeholder="••••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating account...' : 'Sign up'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;