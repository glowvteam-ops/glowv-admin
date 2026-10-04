import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ChevronDown, 
  CheckCircle, 
  Package, 
  Truck, 
  Navigation, 
  CheckSquare, 
  XCircle, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Check, 
  X 
} from 'lucide-react';

const getStatusBadgeClass = (status) => {
  switch (String(status).toLowerCase()) {
    case 'new': return 'badge-new';
    case 'pending': return 'badge-pending';
    case 'confirmed':
    case 'processing':
    case 'packed': return 'badge-processing';
    case 'shipped':
    case 'out for delivery': return 'badge-shipped';
    case 'delivered': return 'badge-delivered';
    case 'cancelled': return 'badge-cancelled';
    default: return 'badge-new';
  }
};

export default function OrderDetailsPage({ order, onBack, onUpdateOrderStatus }) {
  const [currentStatus, setCurrentStatus] = useState(order?.status || 'New');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (order?.status) {
      setCurrentStatus(order.status);
    }
  }, [order?.status]);

  if (!order) {
    return (
      <div className="page-main-content">
        <button className="back-nav-btn" onClick={onBack}>
          <ArrowLeft size={16} /> Back to Orders
        </button>
        <p style={{ marginTop: '20px' }}>No order selected.</p>
      </div>
    );
  }

  const statusOptions = [
    { label: 'Confirm Order', status: 'Confirmed', icon: CheckCircle },
    { label: 'Pack Order', status: 'Packed', icon: Package },
    { label: 'Ship Order', status: 'Shipped', icon: Truck },
    { label: 'Out for Delivery', status: 'Out for Delivery', icon: Navigation },
    { label: 'Mark as Delivered', status: 'Delivered', icon: CheckSquare },
    { label: 'Cancel Order', status: 'Cancelled', icon: XCircle, danger: true },
  ];

  const handleStatusChange = async (newStatus, successMessage) => {
    if (isUpdating) return;

    setDropdownOpen(false);
    setIsUpdating(true);
    try {
      const updated = await onUpdateOrderStatus(order.id, newStatus);
      setCurrentStatus(updated?.status || newStatus);
      showNotice(successMessage || `Order status updated to "${newStatus}"`);
    } catch (error) {
      showNotice(error.message || 'Could not update order status. Please retry.');
    } finally {
      setIsUpdating(false);
    }
  };

  const showNotice = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleAccept = () => {
    handleStatusChange('Confirmed', 'Order accepted. Customer tracking is updated.');
  };

  const handleDecline = () => {
    handleStatusChange('Cancelled', 'Order declined. Customer tracking is updated.');
  };

  return (
    <div className="page-main-content">
      {/* Back Button */}
      <button className="back-nav-btn" onClick={onBack}>
        <ArrowLeft size={16} />
        <span>Back</span>
      </button>

      {/* Top Header Card */}
      <div className="order-details-top-card">
        <div className="order-meta-info">
          <div className="order-meta-title-row">
            <h2 className="order-big-id">{order.id}</h2>
            <span className={`status-pill ${getStatusBadgeClass(currentStatus)}`}>
              {currentStatus}
            </span>
          </div>
          <span className="order-timestamp">{order.date}</span>
        </div>

        {/* Status Dropdown Menu */}
        <div className="order-status-dropdown-wrapper">
          <button 
            className="status-dropdown-toggle-btn"
            disabled={isUpdating}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <span>{currentStatus}</span>
            <ChevronDown size={15} />
          </button>

          {dropdownOpen && (
            <div className="status-options-menu">
              {statusOptions.map((opt) => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.status}
                    className={`status-option-item ${opt.danger ? 'text-danger' : ''}`}
                    disabled={isUpdating}
                    onClick={() => handleStatusChange(opt.status)}
                  >
                    <Icon size={15} />
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="details-inline-toast">
          {toastMessage}
        </div>
      )}

      {/* Content Grid */}
      <div className="order-details-grid">
        
        {/* Left Column: Customer & Items */}
        <div className="order-details-left-col">
          
          {/* Customer Info Card */}
          <div className="details-card-box">
            <h3 className="details-box-title">Customer</h3>
            
            <div className="customer-info-layout">
              <div className="customer-avatar-col">
                <img 
                  src={order.customer.avatar} 
                  alt={order.customer.name} 
                  className="customer-large-avatar" 
                />
              </div>

              <div className="customer-data-col">
                <h4 className="customer-full-name">{order.customer.name}</h4>
                <div className="customer-meta-row">
                  <Phone size={14} className="meta-icon" />
                  <span>{order.customer.phone}</span>
                </div>
                <div className="customer-meta-row">
                  <Mail size={14} className="meta-icon" />
                  <span>{order.customer.email}</span>
                </div>
                <div className="customer-meta-row">
                  <MapPin size={14} className="meta-icon" />
                  <span>{order.customer.address}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Items Card */}
          <div className="details-card-box">
            <h3 className="details-box-title">Items</h3>
            
            <div className="order-items-list-box">
              {order.items.map((item) => (
                <div key={item.id} className="order-item-detail-row">
                  <div className="item-detail-info">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="item-detail-thumb" 
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=120&auto=format&fit=crop&q=80';
                      }}
                    />
                    <div>
                      <h5 className="item-detail-title">{item.name}</h5>
                      <span className="item-unit-calc">₹{item.price} × {item.quantity}</span>
                    </div>
                  </div>
                  <div className="item-detail-total">
                    ₹{item.price * item.quantity}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Actions */}
        <div className="order-details-right-col">
          <div className="details-card-box">
            <h3 className="details-box-title">Order Summary</h3>

            <div className="summary-breakdown-list">
              <div className="summary-line">
                <span className="summary-label">Subtotal</span>
                <span className="summary-value">₹{order.subtotal?.toLocaleString() || order.amount.toLocaleString()}</span>
              </div>
              <div className="summary-line">
                <span className="summary-label">Shipping</span>
                <span className="summary-value" style={{ color: '#10b981' }}>Free (₹0)</span>
              </div>
              <div className="summary-line">
                <span className="summary-label">Discount</span>
                <span className="summary-value">- ₹0</span>
              </div>
              
              <div className="summary-divider" />

              <div className="summary-total-line">
                <span className="total-label">Total</span>
                <span className="total-value">₹{order.amount.toLocaleString()}</span>
              </div>
            </div>

            {/* Bottom Actions: Accept or Decline */}
            {['New', 'Pending'].includes(currentStatus) && (
              <div className="order-decision-actions">
                <button
                  className="btn-accept-order"
                  disabled={isUpdating}
                  onClick={handleAccept}
                >
                  <Check size={16} />
                  <span>{isUpdating ? 'Updating…' : 'Accept Order'}</span>
                </button>

                <button
                  className="btn-decline-order"
                  disabled={isUpdating}
                  onClick={handleDecline}
                >
                  <X size={16} />
                  <span>Decline Order</span>
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
