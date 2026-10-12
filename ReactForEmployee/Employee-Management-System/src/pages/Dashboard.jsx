import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import { INITIAL_MOCK_EMPLOYEES } from '../mockData';
import { 
  Users, 
  UserCheck, 
  DollarSign, 
  Building, 
  TrendingUp, 
  UserPlus, 
  FileSpreadsheet, 
  ArrowRight, 
  Sparkles,
  Search,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    onLeaveEmployees: 0,
    totalDepartments: 0,
    averageSalary: 0,
    totalMonthlyPayroll: 0,
    departmentCounts: {}
  });

  const [recentHires, setRecentHires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Try fetching live statistics from Spring Boot Backend
      const [statsRes, employeesRes] = await Promise.all([
        axiosInstance.get('/employee/stats'),
        axiosInstance.get('/employee/all')
      ]);

      if (statsRes.data) {
        setStats(statsRes.data);
      }
      if (employeesRes.data && Array.isArray(employeesRes.data)) {
        // Sort by id desc for recent hires
        const sorted = [...employeesRes.data].reverse().slice(0, 5);
        setRecentHires(sorted);
      }
      setIsDemoMode(false);
    } catch (error) {
      console.warn("Backend API unavailable, loading standalone mock dataset:", error);
      setIsDemoMode(true);
      
      // Calculate stats from mock data
      const mockList = INITIAL_MOCK_EMPLOYEES;
      const total = mockList.length;
      const active = mockList.filter(e => e.status === 'ACTIVE').length;
      const onLeave = mockList.filter(e => e.status === 'ON_LEAVE').length;
      
      const deptMap = {};
      let totalSalary = 0;

      mockList.forEach(e => {
        deptMap[e.dept] = (deptMap[e.dept] || 0) + 1;
        totalSalary += (e.salary || 0);
      });

      setStats({
        totalEmployees: total,
        activeEmployees: active,
        onLeaveEmployees: onLeave,
        totalDepartments: Object.keys(deptMap).length,
        averageSalary: total ? totalSalary / total : 0,
        totalMonthlyPayroll: totalSalary,
        departmentCounts: deptMap
      });

      setRecentHires(mockList.slice(0, 5));
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val || 0);
  };

  const handleExportCsv = async () => {
    try {
      if (!isDemoMode) {
        const response = await axiosInstance.get('/employee/export/csv', { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'employees_report.csv');
        document.body.appendChild(link);
        link.click();
        toast.success("CSV export downloaded successfully!");
      } else {
        // Mock Export CSV
        const headers = ["ID", "Name", "Email", "Department", "Role", "Salary", "Status"];
        const rows = INITIAL_MOCK_EMPLOYEES.map(e => [
          e.id, e.name, e.email, e.dept, e.role, e.salary, e.status
        ]);

        let csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "employees_mock_report.csv");
        document.body.appendChild(link);
        link.click();
        toast.info("Demo Mode: CSV report generated!");
      }
    } catch (err) {
      toast.error("Failed to export CSV file.");
    }
  };

  return (
    <div className="container-fluid px-4 py-4 animate-fade-in">
      
      {/* Top Banner */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4 p-4 rounded-4 text-white" style={{
        background: 'var(--gradient-primary)',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <Sparkles size={20} className="text-warning" />
            <span className="badge bg-white bg-opacity-20 text-white rounded-pill px-3 py-1">Executive Overview</span>
          </div>
          <h2 className="fw-bold mb-1">Workforce Intelligence Hub</h2>
          <p className="mb-0 text-white-50">Manage employees, track payroll expenditures, and monitor organizational growth.</p>
        </div>

        <div className="d-flex align-items-center gap-2">
          {isDemoMode && (
            <span className="badge bg-warning text-dark px-3 py-2 rounded-3 border border-warning d-flex align-items-center gap-1">
              <ShieldCheck size={16} /> Demo Mode Active
            </span>
          )}

          <Link to="/add-employee" className="btn btn-light fw-semibold text-primary px-4 py-2 rounded-3 d-flex align-items-center gap-2 border-0 shadow-sm">
            <UserPlus size={18} /> Add Employee
          </Link>
          
          <button onClick={handleExportCsv} className="btn btn-outline-light px-3 py-2 rounded-3 d-flex align-items-center gap-2">
            <FileSpreadsheet size={18} /> Export Report
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="row g-3 mb-4">
        
        {/* Total Employees */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="glass-card p-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <span className="text-muted fw-medium fs-sm">Total Staff</span>
              <div className="rounded-3 p-2 bg-primary-subtle text-primary">
                <Users size={22} />
              </div>
            </div>
            <h3 className="fw-bold fs-2 mb-1">{loading ? '...' : stats.totalEmployees}</h3>
            <div className="d-flex align-items-center gap-1 text-success fs-xs fw-semibold">
              <TrendingUp size={14} /> +12% from last quarter
            </div>
          </div>
        </div>

        {/* Active Staff */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="glass-card p-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <span className="text-muted fw-medium fs-sm">Active Status</span>
              <div className="rounded-3 p-2 bg-success-subtle text-success">
                <UserCheck size={22} />
              </div>
            </div>
            <h3 className="fw-bold fs-2 mb-1">{loading ? '...' : stats.activeEmployees}</h3>
            <div className="d-flex align-items-center gap-2 text-muted fs-xs">
              <span className="badge bg-success-subtle text-success border border-success-subtle">
                {stats.totalEmployees ? Math.round((stats.activeEmployees / stats.totalEmployees) * 100) : 100}% Active
              </span>
              <span>• {stats.onLeaveEmployees} On Leave</span>
            </div>
          </div>
        </div>

        {/* Total Monthly Payroll */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="glass-card p-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <span className="text-muted fw-medium fs-sm">Monthly Expenditure</span>
              <div className="rounded-3 p-2 bg-warning-subtle text-warning">
                <DollarSign size={22} />
              </div>
            </div>
            <h3 className="fw-bold fs-2 mb-1">{loading ? '...' : formatCurrency(stats.totalMonthlyPayroll)}</h3>
            <div className="text-muted fs-xs">
              Avg: <span className="fw-semibold text-main">{formatCurrency(stats.averageSalary)}</span> / employee
            </div>
          </div>
        </div>

        {/* Departments */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="glass-card p-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <span className="text-muted fw-medium fs-sm">Departments</span>
              <div className="rounded-3 p-2 bg-info-subtle text-info">
                <Building size={22} />
              </div>
            </div>
            <h3 className="fw-bold fs-2 mb-1">{loading ? '...' : stats.totalDepartments}</h3>
            <div className="text-muted fs-xs">Cross-functional teams active</div>
          </div>
        </div>

      </div>

      {/* Main Grid: Department Breakdown & Recent Hires */}
      <div className="row g-4">
        
        {/* Department Breakdown Bar Visualization */}
        <div className="col-12 col-lg-5">
          <div className="glass-card p-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <h5 className="fw-bold mb-0">Department Breakdown</h5>
              <span className="badge bg-secondary-subtle text-secondary px-2.5 py-1">Distribution</span>
            </div>

            {loading ? (
              <div className="text-center py-4 text-muted">Loading department metrics...</div>
            ) : Object.keys(stats.departmentCounts || {}).length === 0 ? (
              <div className="text-center py-4 text-muted">No department data recorded yet.</div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {Object.entries(stats.departmentCounts).map(([dept, count], idx) => {
                  const percent = Math.round((count / (stats.totalEmployees || 1)) * 100);
                  const colors = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#06b6d4', '#8b5cf6'];
                  const barColor = colors[idx % colors.length];

                  return (
                    <div key={dept}>
                      <div className="d-flex justify-content-between fs-sm mb-1">
                        <span className="fw-medium">{dept}</span>
                        <span className="text-muted">{count} staff ({percent}%)</span>
                      </div>
                      <div className="progress rounded-pill" style={{ height: '8px', backgroundColor: 'rgba(0,0,0,0.05)' }}>
                        <div 
                          className="progress-bar rounded-pill transition-all" 
                          role="progressbar" 
                          style={{ width: `${percent}%`, backgroundColor: barColor }} 
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-4 pt-3 border-top d-flex align-items-center justify-content-between text-muted fs-xs">
              <span>Interactive Data View</span>
              <Link to="/employees" className="text-primary text-decoration-none fw-semibold d-flex align-items-center gap-1">
                View Full Directory <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Hires Feed */}
        <div className="col-12 col-lg-7">
          <div className="glass-card p-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <div>
                <h5 className="fw-bold mb-0">Recent Team Additions</h5>
                <span className="text-muted fs-xs">Latest employee onboarding records</span>
              </div>
              <Link to="/employees" className="btn btn-sm btn-outline-primary rounded-3 px-3">
                View All
              </Link>
            </div>

            {loading ? (
              <div className="text-center py-4 text-muted">Loading employee feed...</div>
            ) : recentHires.length === 0 ? (
              <div className="text-center py-4 text-muted">No employees registered yet.</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light fs-xs text-muted">
                    <tr>
                      <th className="border-0">EMPLOYEE</th>
                      <th className="border-0">DEPARTMENT</th>
                      <th className="border-0">ROLE</th>
                      <th className="border-0 text-end">SALARY</th>
                      <th className="border-0 text-center">STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentHires.map((emp) => (
                      <tr key={emp.id}>
                        <td className="py-3">
                          <div className="d-flex align-items-center gap-3">
                            <img 
                              src={emp.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.name || emp.firstName || 'User')}&background=6366f1&color=fff`} 
                              alt="avatar" 
                              className="rounded-circle object-fit-cover border"
                              style={{ width: '38px', height: '38px' }}
                            />
                            <div>
                              <div className="fw-semibold text-main fs-sm">{emp.name || `${emp.firstName} ${emp.lastName}`}</div>
                              <div className="text-muted fs-xs">{emp.email || 'N/A'}</div>
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

                        <td className="text-end fw-semibold fs-sm">
                          {formatCurrency(emp.salary || 0)}
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
