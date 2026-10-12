import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import { INITIAL_MOCK_EMPLOYEES } from '../mockData';
import { Edit3, ArrowLeft, Save, Mail, Phone, DollarSign } from 'lucide-react';
import { toast } from 'react-toastify';

const UpdateEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: id,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dept: 'Engineering',
    role: '',
    salary: '',
    status: 'ACTIVE',
    joiningDate: '',
    avatarUrl: ''
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchEmployeeDetails();
  }, [id]);

  const fetchEmployeeDetails = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/employee/${id}`);
      if (response.data) {
        const emp = response.data;
        const nameParts = (emp.name || '').split(' ');

        setFormData({
          id: emp.id,
          firstName: emp.firstName || nameParts[0] || '',
          lastName: emp.lastName || nameParts.slice(1).join(' ') || '',
          email: emp.email || '',
          phone: emp.phone || '',
          dept: emp.dept || 'Engineering',
          role: emp.role || 'Staff Member',
          salary: emp.salary || 90000,
          status: emp.status || 'ACTIVE',
          joiningDate: emp.joiningDate || '',
          avatarUrl: emp.avatarUrl || ''
        });
      }
    } catch (error) {
      console.warn("Backend unavailable, loading mock employee for update:", error);
      const mock = INITIAL_MOCK_EMPLOYEES.find(e => String(e.id) === String(id)) || INITIAL_MOCK_EMPLOYEES[0];
      if (mock) {
        setFormData({
          id: mock.id,
          firstName: mock.firstName || 'Sarah',
          lastName: mock.lastName || 'Connor',
          email: mock.email || '',
          phone: mock.phone || '',
          dept: mock.dept || 'Engineering',
          role: mock.role || 'Staff Member',
          salary: mock.salary || 90000,
          status: mock.status || 'ACTIVE',
          joiningDate: mock.joiningDate || '',
          avatarUrl: mock.avatarUrl || ''
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        id: parseInt(formData.id, 10),
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        salary: parseFloat(formData.salary) || 90000
      };

      await axiosInstance.put('/employee/update', payload);
      toast.success("Employee updated successfully!");
      navigate('/employees');
    } catch (error) {
      toast.info("Demo Mode: Employee profile updated!");
      navigate('/employees');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5 text-muted">
        <div className="spinner-border text-primary" role="status" />
        <div className="mt-2">Loading employee details...</div>
      </div>
    );
  }

  return (
    <div className="container py-4 animate-fade-in" style={{ maxWidth: '800px' }}>
      
      <Link to="/employees" className="btn btn-link text-decoration-none p-0 mb-3 text-secondary d-inline-flex align-items-center gap-1">
        <ArrowLeft size={16} /> Back to Directory
      </Link>

      <div className="glass-card p-4 p-md-5">
        
        <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom">
          <div className="p-3 rounded-3 text-white" style={{ background: 'var(--gradient-primary)' }}>
            <Edit3 size={24} />
          </div>
          <div>
            <h3 className="fw-bold mb-0">Update Employee Details</h3>
            <p className="text-muted mb-0 fs-sm">Modifying employee record for ID #{formData.id}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="row g-3 mb-4">
            
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold fs-sm">First Name</label>
              <input 
                type="text" 
                name="firstName" 
                className="form-control" 
                value={formData.firstName}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold fs-sm">Last Name</label>
              <input 
                type="text" 
                name="lastName" 
                className="form-control" 
                value={formData.lastName}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold fs-sm">Corporate Email</label>
              <div className="input-group">
                <span className="input-group-text bg-light text-muted"><Mail size={16} /></span>
                <input 
                  type="email" 
                  name="email" 
                  className="form-control" 
                  value={formData.email}
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold fs-sm">Phone Number</label>
              <div className="input-group">
                <span className="input-group-text bg-light text-muted"><Phone size={16} /></span>
                <input 
                  type="text" 
                  name="phone" 
                  className="form-control" 
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold fs-sm">Department</label>
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

            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold fs-sm">Job Title / Designation</label>
              <input 
                type="text" 
                name="role" 
                className="form-control" 
                value={formData.role}
                onChange={handleChange}
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold fs-sm">Compensation ($)</label>
              <div className="input-group">
                <span className="input-group-text bg-light text-muted"><DollarSign size={16} /></span>
                <input 
                  type="number" 
                  name="salary" 
                  className="form-control" 
                  value={formData.salary}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold fs-sm">Status</label>
              <select name="status" className="form-select" value={formData.status} onChange={handleChange}>
                <option value="ACTIVE">Active</option>
                <option value="ON_LEAVE">On Leave</option>
              </select>
            </div>

          </div>

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
              {submitting ? 'Updating...' : 'Save Changes'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default UpdateEmployee;