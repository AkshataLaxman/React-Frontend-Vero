import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, FolderKanban, Settings, Shield } from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/documents', icon: FileText, label: 'Documents' },
    { path: '/projects', icon: FolderKanban, label: 'Projects' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <Shield size={20} />
        </div>
        <h2>Vero</h2>
      </div>

      <nav>
        <ul className="sidebar-menu">
          {menuItems.map((item) => (
            <li key={item.path} className="sidebar-menu-item">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `sidebar-menu-link ${isActive ? 'active' : ''}`
                }
              >
                <item.icon size={20} />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;