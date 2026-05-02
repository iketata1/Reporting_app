import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import '../styles/Sidebar.css';

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { language, changeLanguage, t } = useLanguage();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    { path: '/dashboard', icon: '📊', label: t('dashboard') },
    ...(user.role === 'admin' ? [{ path: '/admin', icon: '🔐', label: 'Admin' }] : []),
    { path: '/statistics', icon: '📈', label: t('statistics') || 'Statistics' },
    { path: '/reports', icon: '📋', label: t('reports') },
    { path: '/reports/new-mould', icon: '➕', label: t('newReport') },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">🏢</div>
          {!isCollapsed && <span className="logo-text">Intra Air</span>}
        </div>
        <button 
          className="collapse-btn" 
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? 'Expand' : 'Collapse'}
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      <div className="sidebar-user">
        <div className="user-avatar">
          {user.firstName?.[0]}{user.lastName?.[0]}
        </div>
        {!isCollapsed && (
          <div className="user-info">
            <div className="user-name">{user.firstName} {user.lastName}</div>
            <div className="user-role">{user.role}</div>
          </div>
        )}
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.path}
            className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
            title={isCollapsed ? item.label : ''}
          >
            <span className="nav-icon">{item.icon}</span>
            {!isCollapsed && <span className="nav-label">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="language-selector">
          {!isCollapsed && <label>{t('language') || 'Language'}:</label>}
          <div className="language-buttons">
            <button
              className={`lang-btn ${language === 'en' ? 'active' : ''}`}
              onClick={() => changeLanguage('en')}
              title="English"
            >
              EN
            </button>
            <button
              className={`lang-btn ${language === 'fr' ? 'active' : ''}`}
              onClick={() => changeLanguage('fr')}
              title="Français"
            >
              FR
            </button>
            <button
              className={`lang-btn ${language === 'nl' ? 'active' : ''}`}
              onClick={() => changeLanguage('nl')}
              title="Nederlands"
            >
              NL
            </button>
          </div>
        </div>

        <button className="logout-btn" onClick={handleLogout} title={t('logout')}>
          <span className="nav-icon">🚪</span>
          {!isCollapsed && <span>{t('logout')}</span>}
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
