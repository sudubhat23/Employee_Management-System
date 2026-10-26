import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { API_BASE_URL } from '../axiosInstance';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  FileCode2, 
  Sun, 
  Moon, 
  LogOut, 
  Building2,
  Sparkles,
  ShieldCheck,
  MessageSquare,
  User,
  Repeat
} from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, logout, theme, toggleTheme, user, isAdmin, isManager, isEmployee, switchDemoRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky-top border-bottom" style={{
      background: 'var(--bg-card)',
      backdropFilter: 'blur(16px)',
      borderColor: 'var(--border-color)',
      zIndex: 1000
    }}>
      <div className="container-fluid px-3 px-md-4 py-2">
        <div className="d-flex align-items-center justify-content-between">
          
          {/* Brand Logo */}
          <Link to="/" className="d-flex align-items-center gap-2.5 text-decoration-none">
            <div className="d-flex align-items-center justify-content-center rounded-3 text-white" style={{
              width: '40px',
              height: '40px',
              background: 'var(--gradient-primary)',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)'
            }}>
              <Building2 size={22} />
            </div>
            <div>
              <div className="fw-bold fs-5 leading-tight d-flex align-items-center gap-1.5" style={{ color: 'var(--text-main)' }}>
                Nexus<span className="gradient-text">EMS</span>
                <span className="badge rounded-pill bg-primary-subtle text-primary border border-primary-subtle fs-xs fw-normal px-2 py-0.5">
                  AI Pro
                </span>
              </div>
              <div className="text-muted" style={{ fontSize: '0.72rem' }}>Workforce & Communications</div>
            </div>
          </Link>

          {/* Navigation Links */}
          {isAuthenticated && (
            <nav className="d-none d-lg-flex align-items-center gap-1 bg-body-secondary p-1 rounded-4 border">
              
              {/* If Admin / Manager: Show Dashboard & Admin Hub */}
              {isManager && (
                <>
                  <Link 
                    to="/" 
                    className={`btn btn-sm d-flex align-items-center gap-1.5 rounded-3 px-2.5 py-1.5 fw-medium border-0 transition-all ${
                      isActive('/') ? 'bg-white shadow-sm text-primary fw-semibold' : 'text-secondary hover-bg-light'
                    }`}
                  >
                    <LayoutDashboard size={16} />
                    Dashboard
                  </Link>

                  <Link 
                    to="/admin" 
                    className={`btn btn-sm d-flex align-items-center gap-1.5 rounded-3 px-2.5 py-1.5 fw-medium border-0 transition-all ${
                      isActive('/admin') ? 'bg-white shadow-sm text-primary fw-semibold' : 'text-secondary hover-bg-light'
                    }`}
                  >
                    <ShieldCheck size={16} className="text-primary" />
                    Admin Portal
                  </Link>
                </>
              )}

              {/* If Employee: Show Employee Profile Portal */}
              {isEmployee && (
                <Link 
                  to="/my-profile" 
                  className={`btn btn-sm d-flex align-items-center gap-1.5 rounded-3 px-2.5 py-1.5 fw-medium border-0 transition-all ${
                    isActive('/my-profile') ? 'bg-white shadow-sm text-primary fw-semibold' : 'text-secondary hover-bg-light'
                  }`}
                >
                  <User size={16} className="text-primary" />
                  My Profile
                </Link>
              )}

              {/* Universal Directory */}
              <Link 
                to="/employees" 
                className={`btn btn-sm d-flex align-items-center gap-1.5 rounded-3 px-2.5 py-1.5 fw-medium border-0 transition-all ${
                  isActive('/employees') ? 'bg-white shadow-sm text-primary fw-semibold' : 'text-secondary hover-bg-light'
                }`}
              >
                <Users size={16} />
                Directory
              </Link>

              {/* Official Communications */}
              <Link 
                to="/communication" 
                className={`btn btn-sm d-flex align-items-center gap-1.5 rounded-3 px-2.5 py-1.5 fw-medium border-0 transition-all ${
                  isActive('/communication') ? 'bg-white shadow-sm text-primary fw-semibold' : 'text-secondary hover-bg-light'
                }`}
              >
                <MessageSquare size={16} className="text-info" />
                Communications
              </Link>

              {/* AI Assistant */}
              <Link 
                to="/ai-assistant" 
                className={`btn btn-sm d-flex align-items-center gap-1.5 rounded-3 px-2.5 py-1.5 fw-medium border-0 transition-all ${
                  isActive('/ai-assistant') ? 'bg-white shadow-sm text-primary fw-semibold' : 'text-secondary hover-bg-light'
                }`}
              >
                <Sparkles size={16} className="text-warning" />
                AI Copilot
              </Link>

              {/* Swagger API */}
              <a 
                href={`${API_BASE_URL}/swagger-ui.html`} 
                target="_blank" 
                rel="noreferrer" 
                className="btn btn-sm d-flex align-items-center gap-1.5 rounded-3 px-2 py-1.5 text-secondary fw-medium border-0 hover-bg-light"
                title="Open API Documentation"
              >
                <FileCode2 size={16} className="text-muted" />
              </a>

            </nav>
          )}

          {/* Right Action Icons & Profile Switcher */}
          <div className="d-flex align-items-center gap-2 gap-md-3">
            
            {/* Quick Role Switcher for Testing / Evaluation */}
            {isAuthenticated && (
              <div className="dropdown">
                <button 
                  className="btn btn-sm btn-outline-secondary dropdown-toggle d-flex align-items-center gap-1.5 rounded-3 py-1 px-2 fs-xs" 
                  type="button" 
                  data-bs-toggle="dropdown"
                  title="Switch testing profile (Admin vs Employee)"
                >
                  <Repeat size={13} className="text-primary" />
                  <span className="d-none d-sm-inline">
                    Role: <strong>{user?.role === 'ROLE_ADMIN' ? 'Admin' : (user?.role === 'ROLE_MANAGER' ? 'Manager' : 'Employee')}</strong>
                  </span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow-md border-0 p-2 fs-xs">
                  <li className="dropdown-header text-uppercase fs-xs fw-bold text-muted">Switch Role Mode</li>
                  <li>
                    <button 
                      className={`dropdown-item rounded-2 py-1.5 d-flex align-items-center gap-2 ${user?.role === 'ROLE_ADMIN' ? 'active' : ''}`}
                      onClick={() => { switchDemoRole('admin'); navigate('/admin'); }}
                    >
                      <ShieldCheck size={14} className="text-danger" /> Admin (Full Control)
                    </button>
                  </li>
                  <li>
                    <button 
                      className={`dropdown-item rounded-2 py-1.5 d-flex align-items-center gap-2 ${user?.role === 'ROLE_MANAGER' ? 'active' : ''}`}
                      onClick={() => { switchDemoRole('manager'); navigate('/admin'); }}
                    >
                      <Users size={14} className="text-warning" /> Manager (Elena Rostova)
                    </button>
                  </li>
                  <li>
                    <button 
                      className={`dropdown-item rounded-2 py-1.5 d-flex align-items-center gap-2 ${user?.role === 'ROLE_EMPLOYEE' ? 'active' : ''}`}
                      onClick={() => { switchDemoRole('employee'); navigate('/my-profile'); }}
                    >
                      <User size={14} className="text-primary" /> Employee (Sarah Connor)
                    </button>
                  </li>
                </ul>
              </div>
            )}

            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme} 
              className="btn btn-outline-secondary btn-sm rounded-circle p-1.5 d-flex align-items-center justify-content-center"
              style={{ width: '36px', height: '36px' }}
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} className="text-warning" />}
            </button>

            {isAuthenticated ? (
              <div className="d-flex align-items-center gap-2">
                <div className="d-none d-md-flex align-items-center gap-2 border-start ps-2.5">
                  <div className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold" style={{
                    width: '34px',
                    height: '34px',
                    background: user?.role === 'ROLE_ADMIN' ? 'var(--gradient-primary)' : 'var(--accent-purple)',
                    fontSize: '0.85rem'
                  }}>
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="text-start leading-tight">
                    <div className="fw-semibold text-truncate" style={{ maxWidth: '110px', fontSize: '0.8rem' }}>
                      {user?.name || 'User'}
                    </div>
                    <div className={`badge fs-xs py-0 px-1 border ${
                      user?.role === 'ROLE_ADMIN' 
                        ? 'bg-danger-subtle text-danger border-danger-subtle' 
                        : (user?.role === 'ROLE_MANAGER' ? 'bg-warning-subtle text-warning border-warning-subtle' : 'bg-primary-subtle text-primary border-primary-subtle')
                    }`}>
                      {user?.role === 'ROLE_ADMIN' ? 'Admin' : (user?.role === 'ROLE_MANAGER' ? 'Manager' : 'Employee')}
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleLogout} 
                  className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1.5 rounded-3 px-2.5 py-1"
                  title="Logout"
                >
                  <LogOut size={15} />
                  <span className="d-none d-md-inline fs-xs">Exit</span>
                </button>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link to="/login" className="btn btn-outline-primary btn-sm px-3 py-1.5 rounded-3 fw-medium fs-sm">
                  Log In
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm px-3 py-1.5 rounded-3 fw-medium border-0 fs-sm" style={{ background: 'var(--gradient-primary)' }}>
                  Sign Up
                </Link>
              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;