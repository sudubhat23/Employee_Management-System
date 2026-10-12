import React from 'react';
import { X, Mail, Phone, Calendar, DollarSign, Briefcase, Building, ShieldCheck, MapPin } from 'lucide-react';

const EmployeeDetailModal = ({ employee, onClose }) => {
  if (!employee) return null;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val || 0);
  };

  const displayName = employee.name || `${employee.firstName || ''} ${employee.lastName || ''}`.trim() || 'Employee Profile';

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(8px)', zIndex: 1050 }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden" style={{ background: 'var(--bg-card)' }}>
          
          {/* Header Banner */}
          <div className="position-relative p-4 text-white" style={{ background: 'var(--gradient-primary)' }}>
            <button 
              type="button" 
              className="btn-close btn-close-white position-absolute top-0 end-0 m-3 shadow-none" 
              onClick={onClose} 
              aria-label="Close"
            />
            
            <div className="d-flex flex-column flex-sm-row align-items-center gap-4 mt-2">
              <img 
                src={employee.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=ffffff&color=6366f1&size=200`} 
                alt="Avatar" 
                className="rounded-circle border border-4 border-white shadow-md object-fit-cover"
                style={{ width: '90px', height: '90px' }}
              />
              <div className="text-center text-sm-start">
                <span className={`badge rounded-pill mb-2 px-3 py-1 ${
                  employee.status === 'ACTIVE' 
                    ? 'bg-success text-white' 
                    : 'bg-warning text-dark'
                }`}>
                  {employee.status || 'ACTIVE'}
                </span>
                <h3 className="fw-bold mb-1">{displayName}</h3>
                <div className="text-white-50 d-flex align-items-center justify-content-center justify-content-sm-start gap-2 fs-sm">
                  <Briefcase size={16} />
                  <span>{employee.role || 'Staff Member'}</span>
                  <span>•</span>
                  <Building size={16} />
                  <span>{employee.dept || 'Engineering'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Body */}
          <div className="modal-body p-4">
            <h6 className="fw-bold text-muted text-uppercase fs-xs tracking-wider mb-3">Employment Details</h6>

            <div className="row g-3">
              
              <div className="col-12 col-md-6">
                <div className="p-3 rounded-3 border bg-body-tertiary d-flex align-items-center gap-3">
                  <div className="p-2 rounded.3 bg-primary-subtle text-primary">
                    <Mail size={20} />
                  </div>
                  <div>
                    <div className="text-muted fs-xs">Email Address</div>
                    <div className="fw-semibold fs-sm text-truncate" style={{ maxWidth: '240px' }}>
                      {employee.email || 'N/A'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="p-3 rounded-3 border bg-body-tertiary d-flex align-items-center gap-3">
                  <div className="p-2 rounded-3 bg-success-subtle text-success">
                    <Phone size={20} />
                  </div>
                  <div>
                    <div className="text-muted fs-xs">Contact Phone</div>
                    <div className="fw-semibold fs-sm">{employee.phone || '+1 (555) 019-2834'}</div>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="p-3 rounded-3 border bg-body-tertiary d-flex align-items-center gap-3">
                  <div className="p-2 rounded-3 bg-warning-subtle text-warning">
                    <DollarSign size={20} />
                  </div>
                  <div>
                    <div className="text-muted fs-xs">Compensation Salary</div>
                    <div className="fw-semibold fs-sm">{formatCurrency(employee.salary || 95000)} / year</div>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="p-3 rounded-3 border bg-body-tertiary d-flex align-items-center gap-3">
                  <div className="p-2 rounded-3 bg-info-subtle text-info">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <div className="text-muted fs-xs">Joining Date</div>
                    <div className="fw-semibold fs-sm">{employee.joiningDate || '2022-01-15'}</div>
                  </div>
                </div>
              </div>

            </div>

            <div className="mt-4 p-3 rounded-3 border bg-light-subtle d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-2 text-muted fs-xs">
                <ShieldCheck size={18} className="text-success" /> Verified Internal Employee Record
              </div>
              <span className="text-muted fs-xs">ID #{employee.id}</span>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="modal-footer border-top p-3 bg-light">
            <button type="button" className="btn btn-secondary px-4 rounded-3" onClick={onClose}>
              Close Window
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailModal;
