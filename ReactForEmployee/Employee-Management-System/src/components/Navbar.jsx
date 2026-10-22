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
  Sparkles
} from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, logout, theme, toggleTheme, user } = useAuth();
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
      <div className="container-fluid px-4 py-2">
        <div className="d-flex align-items-center justify-content-between">
          
          {/* Brand Logo */}
          <Link to="/" className="d-flex align-items-center gap-3 text-decoration-none">
            <div className="d-flex align-items-center justify-content-center rounded-3 text-white" style={{
              width: '42px',
              height: '42px',
              background: 'var(--gradient-primary)',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)'
            }}>
              <Building2 size={22} />
            </div>
            <div>
              <div className="fw-bold fs-5 leading-tight d-flex align-items-center gap-2" style={{ color: 'var(--text-main)' }}>
                Nexus<span className="gradient-text">EMS</span>
                <span className="badge rounded-pill bg-primary-subtle text-primary border border-primary-subtle fs-xs fw-normal px-2 py-1">
                  v2.0 Pro
                </span>
              </div>
              <div className="text-muted" style={{ fontSize: '0.75rem' }}>Enterprise Workforce Suite</div>
            </div>
          </Link>

          {/* Navigation Links */}
          {isAuthenticated && (
            <nav className="d-none d-md-flex align-items-center gap-1 bg-body-secondary p-1 rounded-4 border">
              <Link 
                to="/" 
                className={`btn btn-sm d-flex align-items-center gap-2 rounded-3 px-3 py-2 fw-medium border-0 transition-all ${
                  isActive('/') ? 'bg-white shadow-sm text-primary fw-semibold' : 'text-secondary hover-bg-light'
                }`}
              >
                <LayoutDashboard size={17} />
                Dashboard
              </Link>

              <Link 
                to="/employees" 
                className={`btn btn-sm d-flex align-items-center gap-2 rounded-3 px-3 py-2 fw-medium border-0 transition-all ${
                  isActive('/employees') ? 'bg-white shadow-sm text-primary fw-semibold' : 'text-secondary hover-bg-light'
                }`}
              >
                <Users size={17} />
                Directory
              </Link>

              <Link 
                to="/add-employee" 
                className={`btn btn-sm d-flex align-items-center gap-2 rounded-3 px-3 py-2 fw-medium border-0 transition-all ${
                  isActive('/add-employee') ? 'bg-white shadow-sm text-primary fw-semibold' : 'text-secondary hover-bg-light'
                }`}
              >
                <UserPlus size={17} />
                Add Employee
              </Link>

              <a 
                href={`${API_BASE_URL}/swagger-ui.html`} 
                target="_blank" 
                rel="noreferrer" 
                className="btn btn-sm d-flex align-items-center gap-2 rounded-3 px-3 py-2 text-secondary fw-medium border-0 hover-bg-light"
                title="Open API Documentation"
              >
                <FileCode2 size={17} className="text-info" />
                Swagger API
              </a>
            </nav>
          )}

          {/* Right Action Icons & Profile */}
          <div className="d-flex align-items-center gap-3">
            
            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme} 
              className="btn btn-outline-secondary btn-sm rounded-circle p-2 d-flex align-items-center justify-content-center"
              style={{ width: '38px', height: '38px' }}
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} className="text-warning" />}
            </button>

            {isAuthenticated ? (
              <div className="d-flex align-items-center gap-3">
                <div className="d-none d-lg-flex align-items-center gap-2 border-start ps-3">
                  <div className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold" style={{
                    width: '36px',
                    height: '36px',
                    background: 'var(--accent-purple)',
                    fontSize: '0.9rem'
                  }}>
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                  </div>
                  <div className="text-start">
                    <div className="fw-semibold text-truncate" style={{ maxWidth: '120px', fontSize: '0.85rem' }}>
                      {user?.name || 'Admin'}
                    </div>
                    <div className="badge bg-success-subtle text-success fs-xs py-0 px-1 border border-success-subtle">
                      {user?.role === 'ROLE_ADMIN' ? 'Administrator' : 'Manager'}
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleLogout} 
                  className="btn btn-outline-danger btn-sm d-flex align-items-center gap-2 rounded-3 px-3 py-1-5"
                >
                  <LogOut size={16} />
                  <span className="d-none d-sm-inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link to="/login" className="btn btn-outline-primary btn-sm px-3 py-2 rounded-3 fw-medium">
                  Log In
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm px-3 py-2 rounded-3 fw-medium border-0" style={{ background: 'var(--gradient-primary)' }}>
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