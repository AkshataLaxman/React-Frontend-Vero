import { useNavigate } from 'react-router-dom';
import { Home, RefreshCw } from 'lucide-react';

const ServerError = ({ error }) => {
  const navigate = useNavigate();

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="error-page">
      <div className="error-content">
        <div className="error-code">500</div>
        <h1 className="error-title">Something went wrong</h1>
        <p className="error-message">
          We're experiencing technical difficulties. Please try again later.
        </p>
        {error && (
          <p style={{ fontSize: '0.875rem', opacity: '0.8', marginTop: '1rem' }}>
            Error: {error.message}
          </p>
        )}
        <div className="error-actions">
          <button className="btn-white" onClick={handleRefresh}>
            <RefreshCw size={20} />
            Refresh Page
          </button>
          <button className="btn-white" onClick={() => navigate('/dashboard')}>
            <Home size={20} />
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServerError;