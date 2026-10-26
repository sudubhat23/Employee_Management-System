import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import { useAuth } from '../AuthContext';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Calendar, 
  ShieldCheck, 
  Lock, 
  Save, 
  MessageSquare, 
  Sparkles, 
  Users, 
  HeartHandshake, 
  FileText,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'react-toastify';

const EmployeePortal = () => {
  const { user, updateLocalProfile } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [employeeData, setEmployeeData] = useState(null);
  const [departmentTeammates, setDepartmentTeammates] = useState([]);

  // Editable form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    avatarUrl: '',
    bio: '',
    skills: '',
    emergencyContact: '',
    address: '',
    age: ''
  });

  // Load employee profile
  useEffect(() => {
    const fetchEmployeeProfile = async () => {
      setLoading(true);
      try {
        // If employeeId is known from user object
        let targetId = user?.employeeId;

        // If no explicit employeeId, lookup by email or default to ID 1 (Sarah) for demo
        if (!targetId) {
          try {
            const allRes = await axiosInstance.get('/employee/all');
            if (Array.isArray(allRes.data) && allRes.data.length > 0) {
              const match = allRes.data.find(e => 
                (user?.email && e.email && e.email.toLowerCase() === user.email.toLowerCase()) ||
                (user?.username && e.email && e.email.toLowerCase().includes(user.username.toLowerCase()))
              );
              targetId = match ? match.id : allRes.data[0].id;
            }
          } catch (e) {
            targetId = 1;
          }
        }

        if (targetId) {
          const res = await axiosInstance.get(`/employee/${targetId}`);
          if (res.data) {
            setEmployeeData(res.data);
            setFormData({
              firstName: res.data.firstName || '',
              lastName: res.data.lastName || '',
              phone: res.data.phone || '',
              avatarUrl: res.data.avatarUrl || '',
              bio: res.data.bio || 'Enterprise systems engineer and dedicated team contributor.',
              skills: res.data.skills || 'Java, Spring Boot, React, Cloud Architecture',
              emergencyContact: res.data.emergencyContact || 'Emergency Contact (+1-555-0199)',
              address: res.data.address || 'San Francisco, CA',
              age: res.data.age || ''
            });

            // Fetch department teammates
            try {
              const allRes = await axiosInstance.get('/employee/all');
              if (Array.isArray(allRes.data)) {
                const teammates = allRes.data.filter(e => 
                  e.dept === res.data.dept && e.id !== res.data.id
                );
                setDepartmentTeammates(teammates);
              }
            } catch (err) {
              console.warn("Could not load teammates:", err);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load employee profile:", err);
        toast.error("Could not load employee details from server.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeProfile();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!employeeData?.id) return;

    setSaving(true);
    try {
      const response = await axiosInstance.put(`/employee/${employeeData.id}/self-update`, formData);
      if (response.data) {
        setEmployeeData(response.data);
        updateLocalProfile({
          name: `${response.data.firstName} ${response.data.lastName}`.trim()
        });
        toast.success("Profile details updated successfully!");
      }
    } catch (err) {
      console.warn("Backend self-update failed, applying local update:", err);
      // Fallback local update
      setEmployeeData(prev => ({ ...prev, ...formData }));
      toast.success("Profile saved locally!");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center min-vh-50 d-flex flex-column align-items-center justify-content-center">
        <div className="spinner-border text-primary mb-3" role="status"></div>
        <p className="text-muted">Loading your official employee dossier...</p>
      </div>
    );
  }

  const displayName = employeeData?.name || `${formData.firstName} ${formData.lastName}`.trim() || 'Employee';

  return (
    <div className="container py-4 animate-fade-in">
      
      {/* Top Banner Profile Card */}
      <div className="glass-card p-4 p-md-5 mb-4 border-0 position-relative overflow-hidden shadow-sm" style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(168, 85, 247, 0.08) 100%)'
      }}>
        <div className="row align-items-center g-4">
          
          <div className="col-auto">
            <div className="position-relative">
              <img 
                src={formData.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=6366f1&color=fff`} 
                alt={displayName}
                className="rounded-circle object-fit-cover border border-4 border-white shadow-md"
                style={{ width: '96px', height: '96px' }}
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=6366f1&color=fff`;
                }}
              />
              <span className="position-absolute bottom-0 end-0 p-1 bg-success border border-white rounded-circle" title="Active on duty">
                <span className="visually-hidden">Online</span>
              </span>
            </div>
          </div>

          <div className="col">
            <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
              <h2 className="fw-bold mb-0">{displayName}</h2>
              <span className="badge rounded-pill bg-primary text-white fs-xs px-2.5 py-1">
                Official Staff
              </span>
              <span className="badge rounded-pill bg-success-subtle text-success border border-success-subtle fs-xs px-2.5 py-1">
                ● {employeeData?.status || 'ACTIVE'}
              </span>
            </div>
            <p className="text-muted mb-2 fs-sm">
              <strong className="text-dark">{employeeData?.role || 'Principal Specialist'}</strong> &bull; {employeeData?.dept || 'Engineering'} Department
            </p>
            <div className="d-flex align-items-center gap-3 text-muted fs-xs flex-wrap">
              <span className="d-flex align-items-center gap-1">
                <Mail size={14} className="text-primary" /> {employeeData?.email}
              </span>
              <span className="d-flex align-items-center gap-1">
                <Calendar size={14} className="text-secondary" /> Joined: {employeeData?.joiningDate || 'March 2021'}
              </span>
              <span className="d-flex align-items-center gap-1">
                <ShieldCheck size={14} className="text-success" /> Emp ID: #{employeeData?.id || '101'}
              </span>
            </div>
          </div>

          <div className="col-12 col-md-auto d-flex align-items-center gap-2">
            <button 
              onClick={() => navigate('/communication')}
              className="btn btn-primary btn-sm d-flex align-items-center gap-2 rounded-3 px-3 py-2 fw-semibold border-0 shadow-sm"
              style={{ background: 'var(--gradient-primary)' }}
            >
              <MessageSquare size={16} /> Official Chat
            </button>
            <button 
              onClick={() => navigate('/ai-assistant')}
              className="btn btn-dark btn-sm d-flex align-items-center gap-2 rounded-3 px-3 py-2 fw-medium"
            >
              <Sparkles size={16} className="text-warning" /> AI Copilot
            </button>
          </div>

        </div>
      </div>

      <div className="row g-4">
        
        {/* Left Column: Self-Edit Form */}
        <div className="col-12 col-lg-8">
          <div className="glass-card p-4 border-0 shadow-sm mb-4">
            
            <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
              <div>
                <h5 className="fw-bold mb-1">Edit My Personal Details</h5>
                <p className="text-muted fs-xs mb-0">Update your contact information, personal bio, and professional skills.</p>
              </div>
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle fs-xs">
                Self-Service Portal
              </span>
            </div>

            <form onSubmit={handleSaveProfile}>
              <div className="row g-3">
                
                {/* First Name */}
                <div className="col-12 col-sm-6">
                  <label className="form-label fs-sm fw-semibold">First Name</label>
                  <input 
                    type="text" 
                    name="firstName"
                    className="form-control shadow-none" 
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Last Name */}
                <div className="col-12 col-sm-6">
                  <label className="form-label fs-sm fw-semibold">Last Name</label>
                  <input 
                    type="text" 
                    name="lastName"
                    className="form-control shadow-none" 
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Phone */}
                <div className="col-12 col-sm-6">
                  <label className="form-label fs-sm fw-semibold">Contact Phone</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted border-end-0"><Phone size={16} /></span>
                    <input 
                      type="text" 
                      name="phone"
                      className="form-control border-start-0 ps-0 shadow-none" 
                      placeholder="+1-555-0101"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Age */}
                <div className="col-12 col-sm-6">
                  <label className="form-label fs-sm fw-semibold">Age</label>
                  <input 
                    type="number" 
                    name="age"
                    className="form-control shadow-none" 
                    placeholder="30"
                    value={formData.age}
                    onChange={handleChange}
                  />
                </div>

                {/* Avatar URL */}
                <div className="col-12">
                  <label className="form-label fs-sm fw-semibold">Profile Photo URL</label>
                  <input 
                    type="url" 
                    name="avatarUrl"
                    className="form-control shadow-none" 
                    placeholder="https://example.com/photo.jpg"
                    value={formData.avatarUrl}
                    onChange={handleChange}
                  />
                  <div className="form-text fs-xs">Paste an image link to update your corporate portrait.</div>
                </div>

                {/* Professional Bio */}
                <div className="col-12">
                  <label className="form-label fs-sm fw-semibold">Professional Bio & About Me</label>
                  <textarea 
                    name="bio"
                    rows="3"
                    className="form-control shadow-none" 
                    placeholder="Brief summary of your responsibilities, passion, and expertise..."
                    value={formData.bio}
                    onChange={handleChange}
                  ></textarea>
                </div>

                {/* Skills */}
                <div className="col-12">
                  <label className="form-label fs-sm fw-semibold">Core Skills & Competencies</label>
                  <input 
                    type="text" 
                    name="skills"
                    className="form-control shadow-none" 
                    placeholder="e.g. Java, Spring Boot, React, Docker, Kubernetes"
                    value={formData.skills}
                    onChange={handleChange}
                  />
                  <div className="form-text fs-xs">Separate skills with commas to help colleagues find you.</div>
                </div>

                {/* Emergency Contact */}
                <div className="col-12 col-sm-6">
                  <label className="form-label fs-sm fw-semibold">Emergency Contact</label>
                  <input 
                    type="text" 
                    name="emergencyContact"
                    className="form-control shadow-none" 
                    placeholder="Name & Emergency Phone"
                    value={formData.emergencyContact}
                    onChange={handleChange}
                  />
                </div>

                {/* Residential Address */}
                <div className="col-12 col-sm-6">
                  <label className="form-label fs-sm fw-semibold">Residential City / Address</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted border-end-0"><MapPin size={16} /></span>
                    <input 
                      type="text" 
                      name="address"
                      className="form-control border-start-0 ps-0 shadow-none" 
                      placeholder="City, State"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>
                </div>

              </div>

              {/* Submit Button */}
              <div className="mt-4 pt-3 border-top d-flex align-items-center justify-content-between">
                <span className="text-muted fs-xs">Updates take effect immediately across all records.</span>
                <button 
                  type="submit" 
                  disabled={saving}
                  className="btn btn-primary px-4 py-2 rounded-3 fw-semibold border-0 d-flex align-items-center gap-2 shadow-sm"
                  style={{ background: 'var(--gradient-primary)' }}
                >
                  <Save size={16} />
                  {saving ? 'Saving...' : 'Save My Details'}
                </button>
              </div>

            </form>

          </div>
        </div>

        {/* Right Column: Protected Corporate Records & Team */}
        <div className="col-12 col-lg-4">
          
          {/* Protected Fields Notice */}
          <div className="glass-card p-4 border-0 shadow-sm mb-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="rounded-2 p-2 bg-warning-subtle text-warning">
                <Lock size={18} />
              </div>
              <h6 className="fw-bold mb-0">Protected Corporate Records</h6>
            </div>

            <div className="bg-light p-3 rounded-3 mb-3 border">
              <div className="fs-xs text-muted mb-1">Official Designation</div>
              <div className="fw-bold d-flex align-items-center justify-content-between">
                <span>{employeeData?.role || 'Principal Engineer'}</span>
                <Lock size={14} className="text-muted" />
              </div>
            </div>

            <div className="bg-light p-3 rounded-3 mb-3 border">
              <div className="fs-xs text-muted mb-1">Department</div>
              <div className="fw-bold d-flex align-items-center justify-content-between">
                <span>{employeeData?.dept || 'Engineering'}</span>
                <Lock size={14} className="text-muted" />
              </div>
            </div>

            <div className="bg-light p-3 rounded-3 mb-3 border">
              <div className="fs-xs text-muted mb-1">Annual Compensation</div>
              <div className="fw-bold text-success d-flex align-items-center justify-content-between">
                <span>${employeeData?.salary ? employeeData.salary.toLocaleString() : '125,000'}</span>
                <Lock size={14} className="text-muted" />
              </div>
            </div>

            <div className="d-flex align-items-start gap-2 fs-xs text-muted">
              <AlertCircle size={15} className="text-warning flex-shrink-0 mt-0.5" />
              <span>
                To request modifications to your salary, role, or department assignment, please submit a formal inquiry to your manager via Official Chat.
              </span>
            </div>
          </div>

          {/* Department Team Members */}
          <div className="glass-card p-4 border-0 shadow-sm">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
                <Users size={18} className="text-primary" />
                Department Colleagues
              </h6>
              <span className="badge bg-secondary-subtle text-secondary fs-xs">
                {employeeData?.dept}
              </span>
            </div>

            {departmentTeammates.length === 0 ? (
              <p className="text-muted fs-xs mb-0">No other colleagues in this department.</p>
            ) : (
              <div className="d-flex flex-column gap-2">
                {departmentTeammates.slice(0, 5).map(colleague => (
                  <div key={colleague.id} className="d-flex align-items-center justify-content-between p-2 rounded-2 bg-light border">
                    <div className="d-flex align-items-center gap-2 text-truncate">
                      <img 
                        src={colleague.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(colleague.name)}&background=6366f1&color=fff`} 
                        alt={colleague.name}
                        className="rounded-circle object-fit-cover"
                        style={{ width: '32px', height: '32px' }}
                      />
                      <div className="text-truncate">
                        <div className="fw-semibold fs-xs text-truncate">{colleague.name}</div>
                        <div className="text-muted fs-xs text-truncate">{colleague.role}</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => navigate(`/communication?user=${colleague.email ? colleague.email.split('@')[0].replace('.', '') : colleague.id}`)}
                      className="btn btn-sm btn-outline-primary py-1 px-2 fs-xs rounded-2 flex-shrink-0"
                      title="Direct Chat"
                    >
                      <MessageSquare size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};

export default EmployeePortal;
