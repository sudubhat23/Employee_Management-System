import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import { INITIAL_MOCK_EMPLOYEES } from '../mockData';
import EmployeeDetailModal from '../components/EmployeeDetailModal';
import { 
  Search, 
  Filter, 
  UserPlus, 
  Edit3, 
  Trash2, 
  Eye, 
  LayoutGrid, 
  List, 
  FileSpreadsheet, 
  ChevronLeft, 
  ChevronRight,
  SlidersHorizontal,
  Mail,
  Building,
  Phone,
  Sparkles
} from 'lucide-react';
import { toast } from 'react-toastify';

const ViewEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [sortBy, setSortBy] = useState('id');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Selected Employee Modal
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/employee/all');
      if (response.data && Array.isArray(response.data)) {
        setEmployees(response.data);
      } else {
        setEmployees(INITIAL_MOCK_EMPLOYEES);
      }
      setIsDemoMode(false);
    } catch (error) {
      console.warn("Backend server not reachable, switching to interactive standalone demo dataset:", error);
      setEmployees(INITIAL_MOCK_EMPLOYEES);
      setIsDemoMode(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee record?")) return;

    try {
      if (!isDemoMode) {
        await axiosInstance.delete(`/employee/delete/${id}`);
      }
      setEmployees(prev => prev.filter(emp => emp.id !== id));
      toast.success("Employee record deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete employee.");
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val || 0);
  };

  // Extract unique departments
  const departments = ['ALL', ...new Set(employees.map(e => e.dept || 'Engineering'))];

  // Filtering & Search
  const filteredEmployees = employees.filter(emp => {
    const fullName = (emp.name || `${emp.firstName || ''} ${emp.lastName || ''}`).toLowerCase();
    const email = (emp.email || '').toLowerCase();
    const dept = (emp.dept || '').toLowerCase();

    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) || 
                          email.includes(searchTerm.toLowerCase()) ||
                          dept.includes(searchTerm.toLowerCase());

    const matchesDept = selectedDept === 'ALL' || (emp.dept || '').equalsIgnoreCase?.(selectedDept) || emp.dept === selectedDept;
    const matchesStatus = selectedStatus === 'ALL' || (emp.status || 'ACTIVE') === selectedStatus;

    return matchesSearch && matchesDept && matchesStatus;
  });

  // Sorting
  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    if (sortBy === 'name') {
      const nameA = a.name || a.firstName || '';
      const nameB = b.name || b.firstName || '';
      return nameA.localeCompare(nameB);
    } else if (sortBy === 'salary') {
      return (b.salary || 0) - (a.salary || 0);
    } else if (sortBy === 'joiningDate') {
      return new Date(b.joiningDate || 0) - new Date(a.joiningDate || 0);
    }
    return (a.id || 0) - (b.id || 0);
  });

  // Pagination Math
  const totalPages = Math.ceil(sortedEmployees.length / itemsPerPage) || 1;
  const paginatedEmployees = sortedEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container-fluid px-4 py-4 animate-fade-in">
      
      {/* Header Bar */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1 d-flex align-items-center gap-2">
            Workforce Directory
            <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill fs-xs px-2.5 py-1">
              {filteredEmployees.length} Records
            </span>
          </h2>
          <p className="text-muted mb-0">Search, filter, manage, and inspect team members across all departments.</p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <Link to="/add-employee" className="btn btn-primary px-3 py-2 rounded-3 d-flex align-items-center gap-2 border-0" style={{ background: 'var(--gradient-primary)' }}>
            <UserPlus size={18} /> Add New Employee
          </Link>
        </div>
      </div>

      {/* Filter & Toolbar Controls */}
      <div className="glass-card p-3 mb-4">
        <div className="row g-3 align-items-center">
          
          {/* Search Bar */}
          <div className="col-12 col-md-4">
            <div className="input-group">
              <span className="input-group-text bg-transparent border-end-0 text-muted">
                <Search size={18} />
              </span>
              <input 
                type="text" 
                className="form-control border-start-0 ps-0 shadow-none" 
                placeholder="Search by name, email, or department..." 
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              />
            </div>
          </div>

          {/* Department Filter */}
          <div className="col-6 col-md-3">
            <div className="d-flex align-items-center gap-2">
              <Filter size={16} className="text-muted d-none d-sm-inline" />
              <select 
                className="form-select shadow-none" 
                value={selectedDept}
                onChange={(e) => { setSelectedDept(e.target.value); setCurrentPage(1); }}
              >
                {departments.map(d => (
                  <option key={d} value={d}>
                    {d === 'ALL' ? 'All Departments' : d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Status Filter */}
          <div className="col-6 col-md-2">
            <select 
              className="form-select shadow-none" 
              value={selectedStatus}
              onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active Only</option>
              <option value="ON_LEAVE">On Leave</option>
            </select>
          </div>

          {/* Sort Selector */}
          <div className="col-6 col-md-2">
            <select 
              className="form-select shadow-none" 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="id">Sort by ID</option>
              <option value="name">Sort by Name</option>
              <option value="salary">Sort by Salary</option>
              <option value="joiningDate">Sort by Date</option>
            </select>
          </div>

          {/* View Toggle (Grid vs Table) */}
          <div className="col-6 col-md-1 text-end">
            <div className="btn-group btn-group-sm" role="group">
              <button 
                type="button" 
                className={`btn ${viewMode === 'table' ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => setViewMode('table')}
                title="Table View"
              >
                <List size={16} />
              </button>
              <button 
                type="button" 
                className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => setViewMode('grid')}
                title="Grid Cards View"
              >
                <LayoutGrid size={16} />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="text-center py-5 text-muted">
          <div className="spinner-border text-primary mb-2" role="status" />
          <div>Loading workforce directory...</div>
        </div>
      ) : paginatedEmployees.length === 0 ? (
        <div className="glass-card p-5 text-center text-muted">
          <h5>No employees match your search parameters.</h5>
          <p className="fs-sm mb-3">Try clearing search filters or add a new employee.</p>
          <button onClick={() => { setSearchTerm(''); setSelectedDept('ALL'); setSelectedStatus('ALL'); }} className="btn btn-outline-primary btn-sm rounded-3">
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'table' ? (

        /* Table View */
        <div className="glass-card overflow-hidden mb-4">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light fs-xs text-muted">
                <tr>
                  <th className="py-3 px-4">EMPLOYEE</th>
                  <th className="py-3">DEPARTMENT</th>
                  <th className="py-3">ROLE</th>
                  <th className="py-3">CONTACT</th>
                  <th className="py-3 text-end">SALARY</th>
                  <th className="py-3 text-center">STATUS</th>
                  <th className="py-3 text-end px-4">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {paginatedEmployees.map(emp => {
                  const name = emp.name || `${emp.firstName || ''} ${emp.lastName || ''}`.trim() || 'Employee';
                  return (
                    <tr key={emp.id}>
                      <td className="py-3 px-4">
                        <div 
                          className="d-flex align-items-center gap-3 cursor-pointer"
                          onClick={() => setSelectedEmployee(emp)}
                          style={{ cursor: 'pointer' }}
                        >
                          <img 
                            src={emp.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff`} 
                            alt="Avatar" 
                            className="rounded-circle border object-fit-cover"
                            style={{ width: '40px', height: '40px' }}
                          />
                          <div>
                            <div className="fw-semibold text-main text-hover-primary">{name}</div>
                            <div className="text-muted fs-xs">ID #{emp.id}</div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-2 fs-xs px-2.5 py-1">
                          {emp.dept || 'Engineering'}
                        </span>
                      </td>

                      <td className="fs-sm text-secondary">
                        {emp.role || 'Staff Member'}
                      </td>

                      <td className="fs-xs text-muted">
                        <div>{emp.email || 'N/A'}</div>
                        <div>{emp.phone || ''}</div>
                      </td>

                      <td className="text-end fw-semibold fs-sm">
                        {formatCurrency(emp.salary || 90000)}
                      </td>

                      <td className="text-center">
                        <span className={`badge rounded-pill fs-xs px-2.5 py-1 ${
                          emp.status === 'ACTIVE' 
                            ? 'bg-success-subtle text-success border border-success-subtle' 
                            : 'bg-warning-subtle text-warning border border-warning-subtle'
                        }`}>
                          {emp.status || 'ACTIVE'}
                        </span>
                      </td>

                      <td className="text-end px-4">
                        <div className="btn-group btn-group-sm">
                          <button 
                            onClick={() => setSelectedEmployee(emp)} 
                            className="btn btn-outline-secondary rounded-2 p-1.5"
                            title="View Profile"
                          >
                            <Eye size={15} />
                          </button>
                          
                          <Link 
                            to={`/update-employee/${emp.id}`} 
                            className="btn btn-outline-primary rounded-2 p-1.5 ms-1"
                            title="Edit Details"
                          >
                            <Edit3 size={15} />
                          </Link>

                          <button 
                            onClick={() => handleDelete(emp.id)} 
                            className="btn btn-outline-danger rounded-2 p-1.5 ms-1"
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      ) : (

        /* Grid View Cards */
        <div className="row g-4 mb-4">
          {paginatedEmployees.map(emp => {
            const name = emp.name || `${emp.firstName || ''} ${emp.lastName || ''}`.trim() || 'Employee';
            return (
              <div key={emp.id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
                <div className="glass-card p-4 h-100 d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-2 fs-xs px-2 py-1">
                        {emp.dept || 'Engineering'}
                      </span>
                      <span className={`badge rounded-pill fs-xs px-2 py-1 ${
                        emp.status === 'ACTIVE' 
                          ? 'bg-success-subtle text-success border border-success-subtle' 
                          : 'bg-warning-subtle text-warning border border-warning-subtle'
                      }`}>
                        {emp.status || 'ACTIVE'}
                      </span>
                    </div>

                    <div className="text-center my-3">
                      <img 
                        src={emp.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff`} 
                        alt="Avatar" 
                        className="rounded-circle border border-2 border-primary-subtle object-fit-cover shadow-sm mb-2"
                        style={{ width: '70px', height: '70px' }}
                      />
                      <h5 className="fw-bold mb-0">{name}</h5>
                      <div className="text-muted fs-xs">{emp.role || 'Staff Member'}</div>
                    </div>

                    <div className="bg-light p-3 rounded-3 fs-xs mb-3">
                      <div className="d-flex justify-content-between text-muted mb-1">
                        <span>Email:</span>
                        <span className="fw-semibold text-main text-truncate ms-2" style={{ maxWidth: '140px' }}>{emp.email || 'N/A'}</span>
                      </div>
                      <div className="d-flex justify-content-between text-muted mb-1">
                        <span>Salary:</span>
                        <span className="fw-semibold text-main">{formatCurrency(emp.salary || 90000)}</span>
                      </div>
                      <div className="d-flex justify-content-between text-muted">
                        <span>Joined:</span>
                        <span className="fw-semibold text-main">{emp.joiningDate || '2022-01-01'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex align-items-center justify-content-between border-top pt-3">
                    <button 
                      onClick={() => setSelectedEmployee(emp)} 
                      className="btn btn-sm btn-outline-secondary rounded-3 d-flex align-items-center gap-1"
                    >
                      <Eye size={14} /> Profile
                    </button>

                    <div className="d-flex gap-1">
                      <Link to={`/update-employee/${emp.id}`} className="btn btn-sm btn-outline-primary rounded-3">
                        <Edit3 size={14} />
                      </Link>
                      <button onClick={() => handleDelete(emp.id)} className="btn btn-sm btn-outline-danger rounded-3">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      )}

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="d-flex align-items-center justify-content-between glass-card p-3">
          <div className="text-muted fs-xs">
            Showing Page <span className="fw-semibold text-main">{currentPage}</span> of <span className="fw-semibold text-main">{totalPages}</span>
          </div>

          <div className="d-flex gap-2">
            <button 
              className="btn btn-sm btn-outline-secondary rounded-3 d-flex align-items-center gap-1" 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            >
              <ChevronLeft size={16} /> Previous
            </button>

            <button 
              className="btn btn-sm btn-outline-secondary rounded-3 d-flex align-items-center gap-1" 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Employee Detail Modal */}
      {selectedEmployee && (
        <EmployeeDetailModal 
          employee={selectedEmployee} 
          onClose={() => setSelectedEmployee(null)} 
        />
      )}

    </div>
  );
};

export default ViewEmployee;