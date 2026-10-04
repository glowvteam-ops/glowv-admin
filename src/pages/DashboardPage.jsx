import React, { useState } from 'react';
import { 
  Package, 
  ShoppingBag, 
  IndianRupee, 
  Users, 
  Calendar, 
  ChevronDown, 
  TrendingUp, 
  ArrowUpRight,
  ShoppingBag as ShoppingBagIcon
} from 'lucide-react';
import SalesChart from '../components/SalesChart';

export default function DashboardPage({ 
  products = [], 
  orders = [], 
  customers = [], 
  onNavigate, 
  onSelectOrder 
}) {
  const [dateRange, setDateRange] = useState('Sep 1 - Sep 30, 2024');
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);

  const recentOrders = orders.slice(0, 4);
  const totalRevenue = orders.reduce((sum, o) => sum + (o.amount || 0), 0);

  // Dynamic Chart points based on actual revenue or clean baseline
  const dynamicChartData = [
    { date: 'Sep 1', value: Math.round(totalRevenue * 0.15), label: `₹${Math.round(totalRevenue * 0.15).toLocaleString()}` },
    { date: 'Sep 8', value: Math.round(totalRevenue * 0.22), label: `₹${Math.round(totalRevenue * 0.22).toLocaleString()}` },
    { date: 'Sep 15', value: Math.round(totalRevenue * 0.18), label: `₹${Math.round(totalRevenue * 0.18).toLocaleString()}` },
    { date: 'Sep 22', value: Math.round(totalRevenue * 0.35), label: `₹${Math.round(totalRevenue * 0.35).toLocaleString()}` },
    { date: 'Sep 30', value: totalRevenue, label: `₹${totalRevenue.toLocaleString()}` }
  ];

  const getStatusBadgeClass = (status = '') => {
    switch (status.toLowerCase()) {
      case 'new': return 'badge-new';
      case 'pending': return 'badge-pending';
      case 'processing': return 'badge-processing';
      case 'shipped': return 'badge-shipped';
      case 'delivered': return 'badge-delivered';
      case 'cancelled': return 'badge-cancelled';
      default: return 'badge-default';
    }
  };

  return (
    <div className="page-main-content">
      {/* Header with Title and Date Picker */}
      <div className="page-header-row">
        <div>
          <h2 className="page-title">Dashboard</h2>
          <p className="page-subtitle">Overview of your store performance</p>
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
      </div>

      {/* 4 KPI Metrics Grid */}
      <div className="kpi-cards-grid">
        {/* Metric 1: Products */}
        <div className="kpi-card" onClick={() => onNavigate('products')} style={{ cursor: 'pointer' }}>
          <div className="kpi-top">
            <span className="kpi-title">Products</span>
            <div className="kpi-icon-box bg-blue-tint">
              <Package size={20} color="#1868f7" />
            </div>
          </div>
          <div className="kpi-bottom">
            <span className="kpi-value">{products.length}</span>
            <span className="kpi-growth-pill positive">
              <TrendingUp size={12} />
              + 12%
            </span>
          </div>
        </div>

        {/* Metric 2: Orders */}
        <div className="kpi-card" onClick={() => onNavigate('orders')} style={{ cursor: 'pointer' }}>
          <div className="kpi-top">
            <span className="kpi-title">Orders</span>
            <div className="kpi-icon-box bg-blue-tint">
              <ShoppingBag size={20} color="#1868f7" />
            </div>
          </div>
          <div className="kpi-bottom">
            <span className="kpi-value">{orders.length}</span>
            <span className="kpi-growth-pill positive">
              <TrendingUp size={12} />
              + 8%
            </span>
          </div>
        </div>

        {/* Metric 3: Revenue */}
        <div className="kpi-card" onClick={() => onNavigate('analytics')} style={{ cursor: 'pointer' }}>
          <div className="kpi-top">
            <span className="kpi-title">Revenue</span>
            <div className="kpi-icon-box bg-blue-tint">
              <IndianRupee size={20} color="#1868f7" />
            </div>
          </div>
          <div className="kpi-bottom">
            <span className="kpi-value">₹{totalRevenue.toLocaleString()}</span>
            <span className="kpi-growth-pill positive">
              <TrendingUp size={12} />
              + 15%
            </span>
          </div>
        </div>

        {/* Metric 4: Customers */}
        <div className="kpi-card" onClick={() => onNavigate('customers')} style={{ cursor: 'pointer' }}>
          <div className="kpi-top">
            <span className="kpi-title">Customers</span>
            <div className="kpi-icon-box bg-blue-tint">
              <Users size={20} color="#1868f7" />
            </div>
          </div>
          <div className="kpi-bottom">
            <span className="kpi-value">{customers.length}</span>
            <span className="kpi-growth-pill positive">
              <TrendingUp size={12} />
              + 18%
            </span>
          </div>
        </div>
      </div>

      {/* 2-Column Analytics & Orders Area */}
      <div className="dashboard-grid-split">
        {/* Left Column: Sales Overview Chart */}
        <div className="dash-card sales-overview-card">
          <div className="card-header-flex">
            <div>
              <h3 className="card-section-title">Sales Overview</h3>
              <div className="sales-total-amount">₹{totalRevenue.toLocaleString()}</div>
            </div>
            <span className="kpi-growth-pill positive">
              <TrendingUp size={12} />
              + 15%
            </span>
          </div>

          <div className="chart-container-box">
            <SalesChart data={dynamicChartData} height={230} />
          </div>
        </div>

        {/* Right Column: Recent Orders */}
        <div className="dash-card recent-orders-card">
          <div className="card-header-flex" style={{ marginBottom: '16px' }}>
            <h3 className="card-section-title">Recent Orders</h3>
            <button 
              className="view-all-link-btn"
              onClick={() => onNavigate('orders')}
            >
              View All
            </button>
          </div>

          <div className="recent-orders-list">
            {recentOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '36px 12px', color: '#64748b' }}>
                <ShoppingBagIcon size={32} color="#94a3b8" style={{ margin: '0 auto 8px' }} />
                <p style={{ fontSize: '13.5px', fontWeight: 600, color: '#334155' }}>No recent orders</p>
                <p style={{ fontSize: '12px' }}>Customer orders will show up here automatically.</p>
              </div>
            ) : (
              recentOrders.map((ord) => (
                <div 
                  key={ord.id} 
                  className="recent-order-row"
                  onClick={() => onSelectOrder(ord)}
                >
                  <div className="order-item-left">
                    <img 
                      src={ord.items?.[0]?.image || ord.customer?.avatar || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=120&auto=format&fit=crop&q=80'} 
                      alt={ord.id} 
                      className="recent-order-thumb"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=120&auto=format&fit=crop&q=80';
                      }}
                    />
                    <div className="recent-order-info">
                      <span className="order-code">{ord.id}</span>
                      <span className="order-customer-name">{ord.customer?.name}</span>
                    </div>
                  </div>

                  <div className="order-item-right">
                    <span className={`status-pill ${getStatusBadgeClass(ord.status)}`}>
                      {ord.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
