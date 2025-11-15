import { useState, useRef } from 'react';
import { User, Lock, Bell, Shield, Upload } from 'lucide-react';

const Settings = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    fullName: user.full_name || '',
    email: user.email || '',
  });
  const [avatarUrl, setAvatarUrl] = useState(
    `https://ui-avatars.com/api/?name=${user.full_name || 'User'}&background=0066FF&color=fff&size=200`
  );
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [notifications, setNotifications] = useState({
    email: true,
    document: true,
    project: false,
    weekly: true,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const fileInputRef = useRef(null);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
    setMessage({ type: '', text: '' });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
    setMessage({ type: '', text: '' });
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotifications(prev => ({ ...prev, [name]: checked }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'error', text: 'Please select an image file' });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Image size must be less than 5MB' });
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result);
        setMessage({ type: 'success', text: 'Avatar updated! Click "Save Changes" to apply.' });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    // Simulate API call
    setTimeout(() => {
      // Update localStorage
      const updatedUser = { ...user, full_name: profileData.fullName };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setLoading(false);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    }, 1000);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    // Validation
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      setMessage({ type: 'error', text: 'Please fill in all password fields' });
      return;
    }

    if (passwords.new.length < 6) {
      setMessage({ type: 'error', text: 'New password must be at least 6 characters' });
      return;
    }

    if (passwords.new !== passwords.confirm) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setPasswords({ current: '', new: '', confirm: '' });
    }, 1000);
  };

  const handleNotificationSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setMessage({ type: 'success', text: 'Notification preferences saved!' });
    }, 1000);
  };

  return (
    <div>
      <div className="page-header">
        <h1>Settings</h1>
      </div>

      <div style={{ display: 'flex', gap: '2rem' }}>
        <div style={{ width: '240px', background: 'white', borderRadius: '12px', padding: '1.5rem', height: 'fit-content', border: '1px solid var(--gray-200)' }}>
          <nav>
            <button
              onClick={() => setActiveTab('profile')}
              style={{
                width: '100%',
                padding: '0.875rem',
                background: activeTab === 'profile' ? '#EFF6FF' : 'transparent',
                border: 'none',
                borderRadius: '8px',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '0.5rem',
                color: activeTab === 'profile' ? 'var(--primary)' : 'var(--gray-600)',
                fontWeight: activeTab === 'profile' ? '600' : '500',
              }}
            >
              <User size={20} />
              Profile
            </button>
            <button
              onClick={() => setActiveTab('security')}
              style={{
                width: '100%',
                padding: '0.875rem',
                background: activeTab === 'security' ? '#EFF6FF' : 'transparent',
                border: 'none',
                borderRadius: '8px',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '0.5rem',
                color: activeTab === 'security' ? 'var(--primary)' : 'var(--gray-600)',
                fontWeight: activeTab === 'security' ? '600' : '500',
              }}
            >
              <Lock size={20} />
              Security
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              style={{
                width: '100%',
                padding: '0.875rem',
                background: activeTab === 'notifications' ? '#EFF6FF' : 'transparent',
                border: 'none',
                borderRadius: '8px',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                color: activeTab === 'notifications' ? 'var(--primary)' : 'var(--gray-600)',
                fontWeight: activeTab === 'notifications' ? '600' : '500',
              }}
            >
              <Bell size={20} />
              Notifications
            </button>
          </nav>
        </div>

        <div style={{ flex: 1, background: 'white', borderRadius: '12px', padding: '2rem', border: '1px solid var(--gray-200)' }}>
          {activeTab === 'profile' && (
            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: '700' }}>Profile Settings</h2>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" className="form-control" defaultValue={user.full_name} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" className="form-control" defaultValue={user.email} disabled />
              </div>
              <button className="btn-primary" style={{ marginTop: '1rem' }}>
                Save Changes
              </button>
            </div>
          )}

          {activeTab === 'security' && (
            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: '700' }}>Security Settings</h2>
              <div className="form-group">
                <label>Current Password</label>
                <input type="password" className="form-control" placeholder="••••••••" />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input type="password" className="form-control" placeholder="••••••••" />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input type="password" className="form-control" placeholder="••••••••" />
              </div>
              <button className="btn-primary" style={{ marginTop: '1rem' }}>
                Update Password
              </button>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: '700' }}>Notification Preferences</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="checkbox-wrapper">
                  <input type="checkbox" id="emailNotif" defaultChecked />
                  <label htmlFor="emailNotif">Email notifications</label>
                </div>
                <div className="checkbox-wrapper">
                  <input type="checkbox" id="documentNotif" defaultChecked />
                  <label htmlFor="documentNotif">Document verification updates</label>
                </div>
                <div className="checkbox-wrapper">
                  <input type="checkbox" id="projectNotif" />
                  <label htmlFor="projectNotif">Project status changes</label>
                </div>
                <div className="checkbox-wrapper">
                  <input type="checkbox" id="weeklyReport" defaultChecked />
                  <label htmlFor="weeklyReport">Weekly summary reports</label>
                </div>
              </div>
              <button className="btn-primary" style={{ marginTop: '2rem' }}>
                Save Preferences
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;