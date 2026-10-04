import React, { useState } from 'react';
import { Calendar, ChevronDown, TrendingUp, IndianRupee, ShoppingBag, Users, Layers } from 'lucide-react';
import SalesChart from '../components/SalesChart';

export default function AnalyticsPage({ products = [], orders = [], customers = [] }) {
  const [dateRange, setDateRange] = useState('Sep 1 - Sep 30, 2024');
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);

  const totalSales = orders.reduce((sum, o) => sum + (o.amount || 0), 0);
  const totalOrders = orders.length;
  const totalCustomers = customers.length;
  const productsSold = orders.reduce((sum, o) => sum + (o.itemsCount || 1), 0);

  const dynamicChartData = [
    { date: 'Sep 1', value: Math.round(totalSales * 0.15), label: `₹${Math.round(totalSales * 0.15).toLocaleString()}` },
    { date: 'Sep 8', value: Math.round(totalSales * 0.22), label: `₹${Math.round(totalSales * 0.22).toLocaleString()}` },
    { date: 'Sep 15', value: Math.round(totalSales * 0.18), label: `₹${Math.round(totalSales * 0.18).toLocaleString()}` },
    { date: 'Sep 22', value: Math.round(totalSales * 0.35), label: `₹${Math.round(totalSales * 0.35).toLocaleString()}` },
    { date: 'Sep 30', value: totalSales, label: `₹${totalSales.toLocaleString()}` }
  ];

  return (
    <div className="page-main-content">
      {/* Header */}
      <div className="page-header-row">
        <div>
          <h2 className="page-title">Analytics</h2>
          <p className="page-subtitle">Detailed store analytics</p>
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

      {/* 4 Metric Cards */}
      <div className="kpi-cards-grid">
        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-title">Total Sales</span>
            <div className="kpi-icon-box bg-blue-tint">
              <IndianRupee size={20} color="#1868f7" />
            </div>
          </div>
          <div className="kpi-bottom">
            <span className="kpi-value">₹{totalSales.toLocaleString()}</span>
            <span className="kpi-growth-pill positive">
              <TrendingUp size={12} />
              + 15%
            </span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-title">Total Orders</span>
            <div className="kpi-icon-box bg-blue-tint">
              <ShoppingBag size={20} color="#1868f7" />
            </div>
          </div>
          <div className="kpi-bottom">
            <span className="kpi-value">{totalOrders}</span>
            <span className="kpi-growth-pill positive">
              <TrendingUp size={12} />
              + 8%
            </span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-title">Total Customers</span>
            <div className="kpi-icon-box bg-blue-tint">
              <Users size={20} color="#1868f7" />
            </div>
          </div>
          <div className="kpi-bottom">
            <span className="kpi-value">{totalCustomers}</span>
            <span className="kpi-growth-pill positive">
              <TrendingUp size={12} />
              + 18%
            </span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-title">Products Sold</span>
            <div className="kpi-icon-box bg-blue-tint">
              <Layers size={20} color="#1868f7" />
            </div>
          </div>
          <div className="kpi-bottom">
            <span className="kpi-value">{productsSold}</span>
            <span className="kpi-growth-pill positive">
              <TrendingUp size={12} />
              + 22%
            </span>
          </div>
        </div>
      </div>

      {/* Main Analytics Chart Card */}
      <div className="dash-card sales-overview-card" style={{ marginTop: '24px' }}>
        <div className="card-header-flex">
          <div>
            <h3 className="card-section-title">Sales Overview</h3>
            <div className="sales-total-amount">₹{totalSales.toLocaleString()}</div>
          </div>
          <span className="kpi-growth-pill positive">
            <TrendingUp size={12} />
            + 15%
          </span>
        </div>

        <div className="chart-container-box" style={{ marginTop: '16px' }}>
          <SalesChart data={dynamicChartData} height={300} />
        </div>
      </div>
    </div>
  );
}
