import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, LogOut } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getTitleFromPath = () => {
    const pathMap = {
      '/dashboard': 'Dashboard',
      '/documents': 'Documents',
      '/projects': 'Projects',
      '/settings': 'Settings',
    };
    return pathMap[location.pathname] || 'Dashboard';
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <header className="header">
      <div className="header-title">
        <h1>{getTitleFromPath()}</h1>
      </div>
      <div className="header-actions">
        <button className="header-icon-btn" title="Notifications">
          <Bell size={20} />
          <span className="notification-badge"></span>
        </button>
        <button 
          className="header-icon-btn" 
          title="Logout"
          onClick={handleLogout}
        >
          <LogOut size={20} />
        </button>
        <img
          src={`https://ui-avatars.com/api/?name=${user.full_name || 'User'}&background=0066FF&color=fff`}
          alt="User avatar"
          className="user-avatar"
          title={user.email}
        />
      </div>
    </header>
  );
};

export default Header;