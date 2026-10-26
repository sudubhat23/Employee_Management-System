import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance, { API_BASE_URL } from '../axiosInstance';
import { useAuth } from '../AuthContext';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Trash2, 
  Edit3, 
  Download, 
  Eye, 
  ShieldCheck, 
  DollarSign, 
  Building, 
  CheckCircle2, 
  Clock, 
  MessageSquare,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { toast } from 'react-toastify';
import EmployeeDetailModal from '../components/EmployeeDetailModal';

const AdminPortal = () => {
  const { user, isAdmin, isManager } = useAuth();
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    onLeaveEmployees: 0,
    totalDepartments: 0,
    averageSalary: 0,
    totalSalaryExpense: 0
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch all employees
      const empRes = await axiosInstance.get('/employee/all');
      if (Array.isArray(empRes.data)) {
        setEmployees(empRes.data);
      }

      // Fetch stats
      const statsRes = await axiosInstance.get('/employee/stats');
      if (statsRes.data) {
        setStats(statsRes.data);
      }
    } catch (err) {
      console.warn("Backend load failed, using local fallback if needed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove ${name} from the employee records?`)) {
      return;
    }

    try {
      await axiosInstance.delete(`/employee/${id}`);
      toast.success(`${name} was successfully removed.`);
      setEmployees(prev => prev.filter(e => e.id !== id));
      // Refresh stats
      fetchData();
    } catch (err) {
      toast.error("Failed to delete employee: " + (err.response?.data?.message || err.message));
    }
  };

  const handleStatusToggle = async (emp) => {
    const nextStatus = emp.status === 'ACTIVE' ? 'ON_LEAVE' : 'ACTIVE';
    try {
      const updated = { ...emp, status: nextStatus };
      await axiosInstance.put(`/employee/${emp.id}`, updated);
      toast.success(`Updated ${emp.name}'s status to ${nextStatus}`);
      setEmployees(prev => prev.map(e => e.id === emp.id ? updated : e));
      fetchData();
    } catch (err) {
      toast.error("Status update failed");
    }
  };

  const handleExportCSV = () => {
    window.open(`${API_BASE_URL}/employee/export/csv`, '_blank');
    toast.info("Downloading employee roster CSV...");
  };

  // Filtered list
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = 
      (emp.name || `${emp.firstName || ''} ${emp.lastName || ''}`).toLowerCase().includes(search.toLowerCase()) ||
      (emp.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (emp.role || '').toLowerCase().includes(search.toLowerCase());
    
    const matchesDept = selectedDept === 'ALL' || (emp.dept || '').toUpperCase() === selectedDept.toUpperCase();
    const matchesStatus = selectedStatus === 'ALL' || (emp.status || '').toUpperCase() === selectedStatus.toUpperCase();

    return matchesSearch && matchesDept && matchesStatus;
  });

  const departments = ['ALL', 'Engineering', 'Human Resources', 'Design', 'Finance', 'Marketing', 'Sales'];

  return (
    <div className="container-fluid px-4 py-4 animate-fade-in">
      
      {/* Admin Header Banner */}
      <div className="glass-card p-4 mb-4 border-0 shadow-sm" style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.04) 100%)'
      }}>
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-3">
            <div className="rounded-3 p-3 text-white d-flex align-items-center justify-content-center shadow-md" style={{
              background: 'var(--gradient-primary)',
              width: '52px',
              height: '52px'
            }}>
              <ShieldCheck size={28} />
            </div>
            <div>
              <div className="d-flex align-items-center gap-2">
                <h3 className="fw-bold mb-0">Admin & Manager Control Hub</h3>
                <span className="badge rounded-pill bg-primary text-white fs-xs px-2.5 py-1">
                  Full Authority
                </span>
              </div>
              <p className="text-muted fs-sm mb-0">
                Oversee workforce headcount, approve updates, adjust compensation, and broadcast communications.
              </p>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2 flex-wrap">
            <button 
              onClick={handleExportCSV} 
              className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2 rounded-3 px-3 py-2 fw-medium"
            >
              <Download size={16} /> Export CSV
            </button>
            <Link 
              to="/add-employee" 
              className="btn btn-primary btn-sm d-flex align-items-center gap-2 rounded-3 px-3 py-2 fw-semibold border-0 shadow-sm"
              style={{ background: 'var(--gradient-primary)' }}
            >
              <UserPlus size={16} /> Add New Employee
            </Link>
            <Link 
              to="/communication" 
              className="btn btn-dark btn-sm d-flex align-items-center gap-2 rounded-3 px-3 py-2 fw-medium"
            >
              <MessageSquare size={16} /> Broadcast Notice
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="row g-3 mb-4">
        
        {/* Total Workforce */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="glass-card p-3 p-xl-4 h-100 border-0">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted fs-xs fw-semibold text-uppercase tracking-wider">Total Staff</span>
              <div className="rounded-2 p-2 bg-primary-subtle text-primary">
                <Users size={18} />
              </div>
            </div>
            <h2 className="fw-bold mb-1">{stats.totalEmployees || employees.length}</h2>
            <div className="d-flex align-items-center gap-1 fs-xs text-success fw-medium">
              <TrendingUp size={14} /> Active Enterprise Records
            </div>
          </div>
        </div>

        {/* Active on Duty */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="glass-card p-3 p-xl-4 h-100 border-0">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted fs-xs fw-semibold text-uppercase tracking-wider">Active on Duty</span>
              <div className="rounded-2 p-2 bg-success-subtle text-success">
                <CheckCircle2 size={18} />
              </div>
            </div>
            <h2 className="fw-bold mb-1">{stats.activeEmployees || employees.filter(e => e.status === 'ACTIVE').length}</h2>
            <div className="d-flex align-items-center gap-1 fs-xs text-muted">
              Operational & productive
            </div>
          </div>
        </div>

        {/* On Leave */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="glass-card p-3 p-xl-4 h-100 border-0">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted fs-xs fw-semibold text-uppercase tracking-wider">On Leave</span>
              <div className="rounded-2 p-2 bg-warning-subtle text-warning">
                <Clock size={18} />
              </div>
            </div>
            <h2 className="fw-bold mb-1">{stats.onLeaveEmployees || employees.filter(e => e.status === 'ON_LEAVE').length}</h2>
            <div className="d-flex align-items-center gap-1 fs-xs text-warning fw-medium">
              Approved PTO / Sick Leave
            </div>
          </div>
        </div>

        {/* Total Payroll */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="glass-card p-3 p-xl-4 h-100 border-0">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted fs-xs fw-semibold text-uppercase tracking-wider">Annual Payroll</span>
              <div className="rounded-2 p-2 bg-info-subtle text-info">
                <DollarSign size={18} />
              </div>
            </div>
            <h2 className="fw-bold mb-1">
              ${(stats.totalSalaryExpense || employees.reduce((acc, e) => acc + (e.salary || 0), 0)).toLocaleString()}
            </h2>
            <div className="d-flex align-items-center gap-1 fs-xs text-muted">
              Avg: ${(stats.averageSalary || 105000).toLocaleString()} / yr
            </div>
          </div>
        </div>

      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card p-3 mb-4 border-0">
        <div className="row g-3 align-items-center">
          
          {/* Search */}
          <div className="col-12 col-md-5">
            <div className="input-group">
              <span className="input-group-text bg-transparent border-end-0 text-muted">
                <Search size={18} />
              </span>
              <input 
                type="text" 
                className="form-control border-start-0 ps-0 shadow-none bg-transparent"
                placeholder="Search by name, email, or role..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Department Filter */}
          <div className="col-6 col-md-3">
            <select 
              className="form-select shadow-none bg-transparent"
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>
                  {dept === 'ALL' ? 'All Departments' : dept}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="col-6 col-md-2">
            <select 
              className="form-select shadow-none bg-transparent"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="ON_LEAVE">On Leave</option>
              <option value="TERMINATED">Terminated</option>
            </select>
          </div>

          {/* Results Count */}
          <div className="col-12 col-md-2 text-md-end text-muted fs-xs">
            Showing <strong>{filteredEmployees.length}</strong> of {employees.length}
          </div>

        </div>
      </div>

      {/* Employee Management Table */}
      <div className="glass-card border-0 overflow-hidden shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light fs-xs text-uppercase tracking-wider text-muted">
              <tr>
                <th className="ps-4 py-3">Employee</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Salary</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted">
                    <div className="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
                    Loading employee database...
                  </td>
                </tr>
              ) : filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted">
                    <AlertCircle size={32} className="text-muted mb-2 d-block mx-auto" />
                    No employees matching your search criteria.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="transition-all">
                    
                    {/* Employee Avatar & Name */}
                    <td className="ps-4 py-3">
                      <div className="d-flex align-items-center gap-3">
                        <img 
                          src={emp.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.name || emp.firstName)}&background=6366f1&color=fff`} 
                          alt={emp.name}
                          className="rounded-circle object-fit-cover shadow-sm"
                          style={{ width: '42px', height: '42px' }}
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.name || emp.firstName)}&background=6366f1&color=fff`;
                          }}
                        />
                        <div>
                          <div className="fw-semibold text-truncate" style={{ maxWidth: '180px' }}>
                            {emp.name || `${emp.firstName || ''} ${emp.lastName || ''}`}
                          </div>
                          <div className="text-muted fs-xs text-truncate" style={{ maxWidth: '180px' }}>
                            {emp.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Department */}
                    <td>
                      <span className="badge rounded-pill bg-light text-dark border px-2.5 py-1 fs-xs fw-medium">
                        {emp.dept}
                      </span>
                    </td>

                    {/* Designation */}
                    <td>
                      <div className="fw-medium fs-sm">{emp.role || 'Associate'}</div>
                      <div className="text-muted fs-xs">Joined {emp.joiningDate || '2023'}</div>
                    </td>

                    {/* Salary */}
                    <td>
                      <div className="fw-semibold text-success fs-sm">
                        ${emp.salary ? emp.salary.toLocaleString() : 'N/A'}
                      </div>
                      <div className="text-muted fs-xs">per annum</div>
                    </td>

                    {/* Status Pill with One-Click Toggle */}
                    <td>
                      <button 
                        onClick={() => handleStatusToggle(emp)}
                        className={`badge rounded-pill border-0 px-2.5 py-1 fs-xs cursor-pointer ${
                          emp.status === 'ACTIVE' 
                            ? 'bg-success-subtle text-success border border-success-subtle' 
                            : 'bg-warning-subtle text-warning border border-warning-subtle'
                        }`}
                        title="Click to toggle status"
                      >
                        ● {emp.status || 'ACTIVE'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="d-flex align-items-center gap-1">
                        
                        {/* View Full Modal */}
                        <button 
                          onClick={() => { setSelectedEmployee(emp); setShowModal(true); }}
                          className="btn btn-sm btn-light rounded-2 p-1.5 text-secondary"
                          title="View Full Profile Dossier"
                        >
                          <Eye size={16} />
                        </button>

                        {/* Edit Employee */}
                        <Link 
                          to={`/update-employee/${emp.id}`}
                          className="btn btn-sm btn-light rounded-2 p-1.5 text-primary"
                          title="Edit Details / Compensation"
                        >
                          <Edit3 size={16} />
                        </Link>

                        {/* Official Message Direct Link */}
                        <button 
                          onClick={() => navigate(`/communication?user=${emp.email ? emp.email.split('@')[0].replace('.', '') : emp.id}`)}
                          className="btn btn-sm btn-light rounded-2 p-1.5 text-info"
                          title="Send Official Message"
                        >
                          <MessageSquare size={16} />
                        </button>

                        {/* Delete Employee */}
                        <button 
                          onClick={() => handleDelete(emp.id, emp.name || emp.firstName)}
                          className="btn btn-sm btn-light rounded-2 p-1.5 text-danger"
                          title="Delete Employee"
                        >
                          <Trash2 size={16} />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Employee Detail Modal */}
      {showModal && selectedEmployee && (
        <EmployeeDetailModal 
          employee={selectedEmployee} 
          onClose={() => { setShowModal(false); setSelectedEmployee(null); }} 
        />
      )}

    </div>
  );
};

export default AdminPortal;
