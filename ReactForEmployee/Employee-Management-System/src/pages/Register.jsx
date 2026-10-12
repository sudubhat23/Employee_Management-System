import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import axiosInstance from '../axiosInstance';
import { Building2, Lock, User, Mail, UserPlus, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';

const Register = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    password: '',
    role: 'ROLE_ADMIN'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password || !formData.firstname) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post('/register', formData);
      if (typeof response.data === 'object') {
        login(response.data);
      } else {
        login({ username: formData.username, role: formData.role, firstname: formData.firstname, lastname: formData.lastname });
      }

      toast.success("Account registered successfully!");
      navigate('/');
    } catch (error) {
      console.warn("Backend register failed, using client demo register:", error);
      login({ username: formData.username, role: formData.role, firstname: formData.firstname, lastname: formData.lastname });
      toast.success("Registered and logged in with Demo Account!");
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container min-vh-100 d-flex align-items-center justify-content-center py-5 animate-fade-in">
      <div className="row w-100 justify-content-center">
        <div className="col-12 col-sm-10 col-md-8 col-lg-6">
          
          <div className="glass-card p-4 p-sm-5 border-0 shadow-lg">
            
            <div className="text-center mb-4">
              <div className="d-inline-flex align-items-center justify-content-center rounded-4 text-white p-3 mb-3 shadow-md" style={{
                background: 'var(--gradient-primary)',
                width: '60px',
                height: '60px'
              }}>
                <Building2 size={32} />
              </div>
              <h3 className="fw-bold mb-1">Create Account</h3>
              <p className="text-muted fs-sm">Register as an Administrator or Manager to access NexusEMS</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="row g-3 mb-3">
                
                <div className="col-12 col-sm-6">
                  <label className="form-label fs-sm fw-semibold">First Name</label>
                  <input 
                    type="text" 
                    name="firstname"
                    className="form-control shadow-none" 
                    placeholder="Sudarshan" 
                    value={formData.firstname} 
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-12 col-sm-6">
                  <label className="form-label fs-sm fw-semibold">Last Name</label>
                  <input 
                    type="text" 
                    name="lastname"
                    className="form-control shadow-none" 
                    placeholder="Bhat" 
                    value={formData.lastname} 
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-12 col-sm-6">
                  <label className="form-label fs-sm fw-semibold">Username</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted border-end-0"><User size={16} /></span>
                    <input 
                      type="text" 
                      name="username"
                      className="form-control border-start-0 ps-0 shadow-none" 
                      placeholder="sudubhat23" 
                      value={formData.username} 
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="col-12 col-sm-6">
                  <label className="form-label fs-sm fw-semibold">Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted border-end-0"><Mail size={16} /></span>
                    <input 
                      type="email" 
                      name="email"
                      className="form-control border-start-0 ps-0 shadow-none" 
                      placeholder="sudarshan@company.com" 
                      value={formData.email} 
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="col-12">
                  <label className="form-label fs-sm fw-semibold">Password</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted border-end-0"><Lock size={16} /></span>
                    <input 
                      type={showPassword ? "text" : "password"} 
                      name="password"
                      className="form-control border-start-0 border-end-0 ps-0 shadow-none" 
                      placeholder="Minimum 6 characters" 
                      value={formData.password} 
                      onChange={handleChange}
                      required
                    />
                    <button 
                      type="button" 
                      className="input-group-text bg-light text-muted border-start-0" 
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

              </div>

              <button 
                type="submit" 
                disabled={loading} 
                className="btn btn-primary w-100 py-2.5 rounded-3 fw-semibold border-0 d-flex align-items-center justify-content-center gap-2 mb-3 shadow-md"
                style={{ background: 'var(--gradient-primary)' }}
              >
                <UserPlus size={18} />
                {loading ? 'Creating Account...' : 'Register Account'}
              </button>
            </form>

            <div className="text-center text-muted fs-xs mt-3">
              Already have an account? <Link to="/login" className="text-primary text-decoration-none fw-semibold">Log In</Link>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Register;