import React, { useState } from 'react';
import { 
  Search, 
  ChevronDown, 
  Edit3, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  Mail, 
  Phone,
  Plus,
  Users,
  X
} from 'lucide-react';

export default function CustomersPage({ 
  customers, 
  onAddCustomer, 
  onDeleteCustomer,
  onUpdateCustomer 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  
  // Add Customer Modal
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newStatus, setNewStatus] = useState('Active');

  const filteredCustomers = customers.filter((cust) => {
    if (selectedStatus !== 'All' && cust.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = cust.name.toLowerCase().includes(q);
      const matchEmail = cust.email.toLowerCase().includes(q);
      const matchPhone = cust.phone.includes(q);
      if (!matchName && !matchEmail && !matchPhone) return false;
    }
    return true;
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    onAddCustomer({
      id: Date.now(),
      name: newName.trim(),
      email: newEmail.trim(),
      phone: newPhone.trim() || '+91 98765 00000',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      orders: 0,
      totalSpent: 0,
      joined: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: newStatus
    });

    setNewName('');
    setNewEmail('');
    setNewPhone('');
    setAddModalOpen(false);
  };

  return (
    <div className="page-main-content">
      {/* Page Header */}
      <div className="page-header-row">
        <div>
          <h2 className="page-title">Customers</h2>
          <p className="page-subtitle">Manage your customers</p>
        </div>

        <div className="orders-top-actions">
          <div className="catalog-search-box" style={{ width: '220px' }}>
            <Search size={16} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search customers..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="catalog-search-input"
            />
          </div>

          <div className="filter-select-wrapper">
            <select 
              value={selectedStatus} 
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="toolbar-select"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <button 
            className="btn-primary-add"
            onClick={() => setAddModalOpen(true)}
          >
            <Plus size={16} />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="table-responsive-card">
        <table className="custom-data-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Orders</th>
              <th>Total Spent</th>
              <th>Joined</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '48px 20px', color: '#64748b' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                    <Users size={36} color="#94a3b8" />
                    <span style={{ fontSize: '15px', fontWeight: 600, color: '#334155' }}>No customer records found</span>
                    <span style={{ fontSize: '13px', color: '#64748b' }}>
                      {customers.length === 0 
                        ? 'You have not added any skincare customers yet.' 
                        : 'No customers match your search criteria.'}
                    </span>
                    {customers.length === 0 && (
                      <button 
                        className="btn-primary-add" 
                        onClick={() => setAddModalOpen(true)}
                        style={{ marginTop: '8px' }}
                      >
                        <Plus size={16} />
                        <span>Add First Customer</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              filteredCustomers.map((cust) => (
                <tr key={cust.id}>
                  <td>
                    <div className="customer-cell-flex">
                      <img 
                        src={cust.avatar} 
                        alt={cust.name} 
                        className="customer-table-avatar" 
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80';
                        }}
                      />
                      <div className="customer-text-col">
                        <span className="customer-name-bold">{cust.name}</span>
                        <span className="customer-sub-email">{cust.email}</span>
                        <span className="customer-sub-phone">{cust.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="orders-count-badge">{cust.orders}</span>
                  </td>
                  <td>
                    <span className="table-price">₹{cust.totalSpent.toLocaleString()}</span>
                  </td>
                  <td>
                    <span className="date-time-text">{cust.joined}</span>
                  </td>
                  <td>
                    <span className={`status-pill ${cust.status === 'Active' ? 'badge-active' : 'badge-inactive'}`}>
                      {cust.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="table-action-btns">
                      <button 
                        className="action-icon-btn text-danger" 
                        onClick={() => {
                          if (window.confirm(`Delete customer ${cust.name}?`)) {
                            onDeleteCustomer(cust.id);
                          }
                        }}
                        title="Delete customer"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination Footer */}
        <div className="table-pagination-footer">
          <span className="pagination-text">Showing 1-{filteredCustomers.length} of {customers.length} customers</span>
          <div className="pagination-controls">
            <button className="page-nav-btn" disabled><ChevronLeft size={14} /></button>
            <button className="page-num-btn active">1</button>
            <button className="page-nav-btn" disabled><ChevronRight size={14} /></button>
          </div>
        </div>
      </div>

      {/* Add Customer Modal */}
      {addModalOpen && (
        <div className="modal-overlay" onClick={() => setAddModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Add Skincare Customer</h3>
              <button className="modal-close-btn" onClick={() => setAddModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group">
                <label className="input-field-label">Customer Full Name *</label>
                <input 
                  type="text" 
                  className="custom-text-input"
                  placeholder="e.g. Ananya Sen"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="input-field-label">Email Address *</label>
                <input 
                  type="email" 
                  className="custom-text-input"
                  placeholder="customer@example.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="input-field-label">Phone Number</label>
                <input 
                  type="text" 
                  className="custom-text-input"
                  placeholder="+91 98765 43210"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="input-field-label">Account Status</label>
                <select 
                  className="custom-text-input"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" className="btn-form-cancel" onClick={() => setAddModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary-add">
                  Add Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
