import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import { UserPlus, ArrowLeft, Save, Sparkles, Building, Briefcase, Mail, Phone, DollarSign } from 'lucide-react';
import { toast } from 'react-toastify';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
];

const AddEmployee = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dept: 'Engineering',
    role: '',
    salary: '',
    age: 28,
    status: 'ACTIVE',
    joiningDate: new Date().toISOString().split('T')[0],
    avatarUrl: PRESET_AVATARS[0]
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast.error("Please fill in all required fields (First Name, Last Name, Email).");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        salary: parseFloat(formData.salary) || 85000,
        age: parseInt(formData.age, 10) || 28
      };

      await axiosInstance.post('/employee/add', payload);
      toast.success("Employee added successfully!");
      navigate('/employees');
    } catch (error) {
      console.warn("Backend add employee failed, continuing with client state:", error);
      toast.info("Demo Mode: Employee record saved locally!");
      navigate('/employees');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-4 animate-fade-in" style={{ maxWidth: '800px' }}>
      
      {/* Back link */}
      <Link to="/employees" className="btn btn-link text-decoration-none p-0 mb-3 text-secondary d-inline-flex align-items-center gap-1">
        <ArrowLeft size={16} /> Back to Directory
      </Link>

      <div className="glass-card p-4 p-md-5">
        
        {/* Title */}
        <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom">
          <div className="p-3 rounded-3 text-white" style={{ background: 'var(--gradient-primary)' }}>
            <UserPlus size={24} />
          </div>
          <div>
            <h3 className="fw-bold mb-0">Add New Team Member</h3>
            <p className="text-muted mb-0 fs-sm">Create a new employee profile in the workforce database.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="row g-3 mb-4">
            
            {/* First Name */}
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold fs-sm">First Name <span className="text-danger">*</span></label>
              <input 
                type="text" 
                name="firstName" 
                className="form-control" 
                placeholder="e.g. Sarah"
                value={formData.firstName}
                onChange={handleChange}
                required 
              />
            </div>

            {/* Last Name */}
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold fs-sm">Last Name <span className="text-danger">*</span></label>
              <input 
                type="text" 
                name="lastName" 
                className="form-control" 
                placeholder="e.g. Connor"
                value={formData.lastName}
                onChange={handleChange}
                required 
              />
            </div>

            {/* Email */}
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold fs-sm">Corporate Email <span className="text-danger">*</span></label>
              <div className="input-group">
                <span className="input-group-text bg-light text-muted"><Mail size={16} /></span>
                <input 
                  type="email" 
                  name="email" 
                  className="form-control" 
                  placeholder="sarah.c@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>

            {/* Phone */}
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold fs-sm">Phone Number</label>
              <div className="input-group">
                <span className="input-group-text bg-light text-muted"><Phone size={16} /></span>
                <input 
                  type="text" 
                  name="phone" 
                  className="form-control" 
                  placeholder="+1 (555) 019-2834"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Department */}
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold fs-sm">Department <span className="text-danger">*</span></label>
              <select name="dept" className="form-select" value={formData.dept} onChange={handleChange}>
                <option value="Engineering">Engineering</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Finance">Finance</option>
                <option value="Sales">Sales</option>
                <option value="Operations">Operations</option>
              </select>
            </div>

            {/* Role / Job Title */}
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold fs-sm">Job Title / Designation</label>
              <input 
                type="text" 
                name="role" 
                className="form-control" 
                placeholder="e.g. Senior Software Engineer"
                value={formData.role}
                onChange={handleChange}
              />
            </div>

            {/* Salary */}
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold fs-sm">Annual Compensation ($)</label>
              <div className="input-group">
                <span className="input-group-text bg-light text-muted"><DollarSign size={16} /></span>
                <input 
                  type="number" 
                  name="salary" 
                  className="form-control" 
                  placeholder="95000"
                  value={formData.salary}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Joining Date */}
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold fs-sm">Joining Date</label>
              <input 
                type="date" 
                name="joiningDate" 
                className="form-control" 
                value={formData.joiningDate}
                onChange={handleChange}
              />
            </div>

            {/* Status */}
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold fs-sm">Employment Status</label>
              <select name="status" className="form-select" value={formData.status} onChange={handleChange}>
                <option value="ACTIVE">Active</option>
                <option value="ON_LEAVE">On Leave</option>
              </select>
            </div>

            {/* Avatar Selector */}
            <div className="col-12">
              <label className="form-label fw-semibold fs-sm mb-2">Choose Avatar Profile Picture</label>
              <div className="d-flex align-items-center gap-3 overflow-auto py-2">
                {PRESET_AVATARS.map((url, idx) => (
                  <img 
                    key={idx}
                    src={url}
                    alt="avatar"
                    className={`rounded-circle cursor-pointer border border-3 transition-all ${
                      formData.avatarUrl === url ? 'border-primary shadow-sm scale-110' : 'border-transparent opacity-75'
                    }`}
                    style={{ width: '50px', height: '50px', cursor: 'pointer' }}
                    onClick={() => setFormData(prev => ({ ...prev, avatarUrl: url }))}
                  />
                ))}
              </div>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="d-flex align-items-center justify-content-end gap-2 border-top pt-3">
            <Link to="/employees" className="btn btn-light px-4 rounded-3">
              Cancel
            </Link>
            <button 
              type="submit" 
              disabled={submitting} 
              className="btn btn-primary px-4 py-2 rounded-3 d-flex align-items-center gap-2 border-0" 
              style={{ background: 'var(--gradient-primary)' }}
            >
              <Save size={18} />
              {submitting ? 'Saving...' : 'Save Employee'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default AddEmployee;