import React, { useState } from 'react';
import { 
  Search, 
  Calendar, 
  ChevronDown, 
  Eye, 
  Edit3, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  ShoppingBag,
  X
} from 'lucide-react';

export default function OrdersPage({ 
  orders, 
  products = [], 
  customers = [],
  onSelectOrder, 
  onCreateOrder 
}) {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [dateRange, setDateRange] = useState('Sep 1 - Sep 30, 2024');
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);

  // Create Order Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custAddress, setCustAddress] = useState('');
  const [selectedProdId, setSelectedProdId] = useState('');
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [orderStatus, setOrderStatus] = useState('New');

  const tabs = [
    { label: 'All', count: orders.length },
    { label: 'New', count: orders.filter(o => o.status?.toLowerCase() === 'new').length },
    { label: 'Pending', count: orders.filter(o => o.status?.toLowerCase() === 'pending').length },
    { label: 'Confirmed', count: orders.filter(o => o.status?.toLowerCase() === 'confirmed').length },
    { label: 'Processing', count: orders.filter(o => o.status?.toLowerCase() === 'processing').length },
    { label: 'Packed', count: orders.filter(o => o.status?.toLowerCase() === 'packed').length },
    { label: 'Shipped', count: orders.filter(o => o.status?.toLowerCase() === 'shipped').length },
    { label: 'Out for Delivery', count: orders.filter(o => o.status?.toLowerCase() === 'out for delivery').length },
    { label: 'Delivered', count: orders.filter(o => o.status?.toLowerCase() === 'delivered').length },
    { label: 'Cancelled', count: orders.filter(o => o.status?.toLowerCase() === 'cancelled').length },
  ];

  const filteredOrders = orders.filter((ord) => {
    // Tab filter
    if (activeTab !== 'All' && ord.status.toLowerCase() !== activeTab.toLowerCase()) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = ord.id?.toLowerCase().includes(q);
      const matchCustomer = ord.customer?.name?.toLowerCase().includes(q);
      if (!matchId && !matchCustomer) return false;
    }

    return true;
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredOrders.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredOrders.map(o => o.id));
    }
  };

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const getStatusBadgeClass = (status = '') => {
    switch (status.toLowerCase()) {
      case 'new': return 'badge-new';
      case 'pending': return 'badge-pending';
      case 'confirmed': return 'badge-processing';
      case 'processing': return 'badge-processing';
      case 'packed': return 'badge-processing';
      case 'shipped': return 'badge-shipped';
      case 'out for delivery': return 'badge-shipped';
      case 'delivered': return 'badge-delivered';
      case 'cancelled': return 'badge-cancelled';
      default: return 'badge-default';
    }
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!custName.trim()) return;

    const prod = products.find(p => p.id === Number(selectedProdId)) || products[0] || {
      id: 99,
      name: 'Custom Skincare Product',
      price: 999,
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=120&auto=format&fit=crop&q=80'
    };

    const qty = Number(orderQuantity) || 1;
    const itemTotal = prod.price * qty;

    const newOrder = {
      id: `#GV2024${Math.floor(1000 + Math.random() * 9000)}`,
      rawId: `GV2024${Date.now().toString().slice(-4)}`,
      customer: {
        name: custName.trim(),
        phone: custPhone.trim() || '+91 98765 43210',
        email: custEmail.trim() || `${custName.toLowerCase().replace(/\s+/g, '')}@example.com`,
        address: custAddress.trim() || '123 Skincare Lane, Hyderabad, Telangana',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80'
      },
      itemsCount: qty,
      items: [
        {
          id: prod.id,
          name: prod.name,
          price: prod.price,
          quantity: qty,
          image: prod.image
        }
      ],
      amount: itemTotal,
      subtotal: itemTotal,
      shipping: 0,
      discount: 0,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: orderStatus
    };

    onCreateOrder(newOrder);
    setCreateModalOpen(false);
    setCustName('');
    setCustPhone('');
    setCustEmail('');
    setCustAddress('');
  };

  return (
    <div className="page-main-content">
      {/* Header with Title, Search, and Date Picker */}
      <div className="page-header-row">
        <div>
          <h2 className="page-title">Orders</h2>
          <p className="page-subtitle">Manage customer orders</p>
        </div>

        <div className="orders-top-actions">
          <div className="catalog-search-box" style={{ width: '230px' }}>
            <Search size={16} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search orders, customer name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="catalog-search-input"
            />
          </div>

          <div style={{ position: 'relative' }}>
            <div 
              className="date-picker-dropdown" 
              onClick={() => setDateDropdownOpen(!dateDropdownOpen)}
            >
              <Calendar size={15} className="date-icon" />
              <span>{dateRange}</span>
              <ChevronDown size={14} />
            </div>

            {dateDropdownOpen && (
              <div className="profile-dropdown-menu" style={{ width: '190px', right: 0 }}>
                {['Today', 'Last 7 Days', 'Sep 1 - Sep 30, 2024', 'This Year'].map(range => (
                  <button 
                    key={range} 
                    className="dropdown-item" 
                    onClick={() => {
                      setDateRange(range);
                      setDateDropdownOpen(false);
                    }}
                  >
                    {range}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button 
            className="btn-primary-add"
            onClick={() => setCreateModalOpen(true)}
          >
            <Plus size={16} />
            <span>Create Order</span>
          </button>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="catalog-tabs-row" style={{ overflowX: 'auto' }}>
        {tabs.map((tab) => (
          <button 
            key={tab.label}
            className={`catalog-tab-btn ${activeTab === tab.label ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.label)}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Table Container */}
      <div className="table-responsive-card">
        <table className="custom-data-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}>
                <input 
                  type="checkbox" 
                  checked={filteredOrders.length > 0 && selectedIds.length === filteredOrders.length}
                  onChange={toggleSelectAll}
                />
              </th>
              <th>Order</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '48px 20px', color: '#64748b' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                    <ShoppingBag size={36} color="#94a3b8" />
                    <span style={{ fontSize: '15px', fontWeight: 600, color: '#334155' }}>No orders found</span>
                    <span style={{ fontSize: '13px', color: '#64748b' }}>
                      {orders.length === 0 
                        ? 'No customer orders have been received or created yet.' 
                        : 'No orders match this status filter.'}
                    </span>
                    {orders.length === 0 && (
                      <button 
                        className="btn-primary-add" 
                        onClick={() => setCreateModalOpen(true)}
                        style={{ marginTop: '8px' }}
                      >
                        <Plus size={16} />
                        <span>Create First Order</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              filteredOrders.map((ord) => (
                <tr key={ord.id}>
                  <td>
                    <input 
                      type="checkbox" 
                      checked={selectedIds.includes(ord.id)}
                      onChange={() => toggleSelect(ord.id)}
                    />
                  </td>
                  <td>
                    <span 
                      className="order-link-code"
                      onClick={() => onSelectOrder(ord)}
                    >
                      {ord.id}
                    </span>
                  </td>
                  <td>
                    <span className="customer-name-table">{ord.customer?.name}</span>
                  </td>
                  <td>
                    <span className="items-count-text">{ord.itemsCount} items</span>
                  </td>
                  <td>
                    <span className="table-price">₹{ord.amount?.toLocaleString()}</span>
                  </td>
                  <td>
                    <span className="date-time-text">{ord.date}</span>
                  </td>
                  <td>
                    <span className={`status-pill ${getStatusBadgeClass(ord.status)}`}>
                      {ord.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="table-action-btns">
                      <button 
                        className="action-icon-btn"
                        onClick={() => onSelectOrder(ord)}
                        title="View order details"
                      >
                        <Eye size={15} />
                      </button>
                      <button 
                        className="action-icon-btn"
                        onClick={() => onSelectOrder(ord)}
                        title="Update order"
                      >
                        <Edit3 size={15} />
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
          <span className="pagination-text">Showing 1-{filteredOrders.length} of {orders.length} orders</span>
          <div className="pagination-controls">
            <button className="page-nav-btn" disabled><ChevronLeft size={14} /></button>
            <button className="page-num-btn active">1</button>
            <button className="page-nav-btn" disabled><ChevronRight size={14} /></button>
          </div>
        </div>
      </div>

      {/* Create Order Modal */}
      {createModalOpen && (
        <div className="modal-overlay" onClick={() => setCreateModalOpen(false)}>
          <div className="modal-card" style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Create Skincare Order</h3>
              <button className="modal-close-btn" onClick={() => setCreateModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group">
                <label className="input-field-label">Customer Name *</label>
                <input 
                  type="text" 
                  className="custom-text-input"
                  placeholder="e.g. Meera Patel"
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                  required
                />
              </div>

              <div className="form-field-row">
                <div className="field-group">
                  <label className="input-field-label">Phone Number</label>
                  <input 
                    type="text" 
                    className="custom-text-input"
                    placeholder="+91 98765 11223"
                    value={custPhone}
                    onChange={(e) => setCustPhone(e.target.value)}
                  />
                </div>
                <div className="field-group">
                  <label className="input-field-label">Email</label>
                  <input 
                    type="email" 
                    className="custom-text-input"
                    placeholder="meera@example.com"
                    value={custEmail}
                    onChange={(e) => setCustEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="input-field-label">Shipping Address</label>
                <input 
                  type="text" 
                  className="custom-text-input"
                  placeholder="Street, City, State, PIN"
                  value={custAddress}
                  onChange={(e) => setCustAddress(e.target.value)}
                />
              </div>

              <div className="form-field-row">
                <div className="field-group">
                  <label className="input-field-label">Select Product</label>
                  <select 
                    className="custom-text-input"
                    value={selectedProdId}
                    onChange={(e) => setSelectedProdId(e.target.value)}
                  >
                    <option value="">Choose product...</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name} - ₹{p.price}</option>
                    ))}
                    {products.length === 0 && (
                      <option value="default">Standard Skincare Kit - ₹999</option>
                    )}
                  </select>
                </div>
                <div className="field-group">
                  <label className="input-field-label">Quantity</label>
                  <input 
                    type="number" 
                    min="1"
                    className="custom-text-input"
                    value={orderQuantity}
                    onChange={(e) => setOrderQuantity(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="input-field-label">Order Status</label>
                <select 
                  className="custom-text-input"
                  value={orderStatus}
                  onChange={(e) => setOrderStatus(e.target.value)}
                >
                  <option value="New">New</option>
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" className="btn-form-cancel" onClick={() => setCreateModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary-add">
                  Create Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
