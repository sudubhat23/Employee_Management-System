import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import axiosInstance from '../axiosInstance';
import { Building2, Lock, User, Eye, EyeOff, LogIn, Sparkles, KeyRound } from 'lucide-react';
import { toast } from 'react-toastify';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Please enter both username and password.");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post('/login', { username, password });
      
      // Check if response returned AuthResponse JSON object or string
      if (typeof response.data === 'object') {
        login(response.data);
      } else {
        login({ username, role: 'ROLE_ADMIN', firstname: 'Admin', lastname: 'User' });
      }

      toast.success(`Welcome back, ${username}!`);
      navigate('/');
    } catch (error) {
      console.warn("Backend auth failed, using client demo login:", error);
      // Standalone demo login fallback
      login({ username: username || 'admin', role: 'ROLE_ADMIN', firstname: 'Admin', lastname: 'User' });
      toast.success("Signed in with Demo Administrator Profile!");
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const autofillDemoAdmin = () => {
    setUsername('admin');
    setPassword('admin123');
    toast.info("Autofilled Admin Demo Credentials!");
  };

  return (
    <div className="container min-vh-100 d-flex align-items-center justify-content-center py-5 animate-fade-in">
      <div className="row w-100 justify-content-center">
        <div className="col-12 col-sm-10 col-md-8 col-lg-5">
          
          <div className="glass-card p-4 p-sm-5 border-0 shadow-lg">
            
            {/* Logo & Header */}
            <div className="text-center mb-4">
              <div className="d-inline-flex align-items-center justify-content-center rounded-4 text-white p-3 mb-3 shadow-md" style={{
                background: 'var(--gradient-primary)',
                width: '60px',
                height: '60px'
              }}>
                <Building2 size={32} />
              </div>
              <h3 className="fw-bold mb-1">Nexus<span className="gradient-text">EMS</span></h3>
              <p className="text-muted fs-sm">Workforce Management & Analytics Portal</p>
            </div>

            {/* Quick Demo Fill Alert */}
            <div className="bg-primary-subtle border border-primary-subtle rounded-3 p-3 mb-4 d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-2 fs-xs text-primary fw-medium">
                <Sparkles size={16} /> Portfolio Reviewer Demo Mode
              </div>
              <button 
                type="button" 
                onClick={autofillDemoAdmin} 
                className="btn btn-sm btn-primary border-0 fs-xs py-1 px-2.5 rounded-2 d-flex align-items-center gap-1"
                style={{ background: 'var(--gradient-primary)' }}
              >
                <KeyRound size={13} /> Auto-Fill Admin
              </button>
            </div>

            <form onSubmit={handleLogin}>
              
              {/* Username Input */}
              <div className="mb-3">
                <label className="form-label fs-sm fw-semibold">Username</label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted border-end-0"><User size={18} /></span>
                  <input 
                    type="text" 
                    className="form-control border-start-0 ps-0 shadow-none" 
                    placeholder="Enter username (e.g. admin)" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="mb-4">
                <label className="form-label fs-sm fw-semibold">Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted border-end-0"><Lock size={18} /></span>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    className="form-control border-start-0 border-end-0 ps-0 shadow-none" 
                    placeholder="Enter password (e.g. admin123)" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button 
                    type="button" 
                    className="input-group-text bg-light text-muted border-start-0" 
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={loading} 
                className="btn btn-primary w-100 py-2.5 rounded-3 fw-semibold border-0 d-flex align-items-center justify-content-center gap-2 mb-3 shadow-md"
                style={{ background: 'var(--gradient-primary)' }}
              >
                <LogIn size={18} />
                {loading ? 'Authenticating...' : 'Sign In to Portal'}
              </button>

            </form>

            <div className="text-center text-muted fs-xs mt-3">
              Don't have an account? <Link to="/register" className="text-primary text-decoration-none fw-semibold">Register User</Link>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;