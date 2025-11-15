import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="error-page">
      <div className="error-content">
        <div className="error-code">404</div>
        <h1 className="error-title">Page Not Found</h1>
        <p className="error-message">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="error-actions">
          <button className="btn-white" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
            Go Back
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

export default NotFound;