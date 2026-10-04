import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Tag, 
  Boxes, 
  BarChart3, 
  Bell, 
  Settings,
  Sparkles
} from 'lucide-react';

export default function Sidebar({ currentTab, setCurrentTab, unreadNotificationsCount }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'categories', label: 'Categories', icon: Tag },
    { id: 'inventory', label: 'Inventory', icon: Boxes },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotificationsCount },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="app-sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand-wrapper">
        <h1 className="sidebar-brand-title">GlowVai</h1>
      </div>

      {/* Nav Menu */}
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id || (item.id === 'products' && currentTab === 'add-product') || (item.id === 'orders' && currentTab === 'order-details');
          return (
            <button
              key={item.id}
              className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setCurrentTab(item.id)}
            >
              <Icon size={18} className="sidebar-icon" />
              <span className="sidebar-label">{item.label}</span>
              {item.badge > 0 && (
                <span className="sidebar-badge">{item.badge}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Skincare Store Pro Badge */}
      <div className="sidebar-pro-card">
        <div className="pro-card-header">
          <Sparkles size={16} color="#1868f7" />
          <span>Skincare Admin</span>
        </div>
        <p className="pro-card-text">GlowVai v2.4 Store Engine active with live AI recommendations.</p>
      </div>
    </aside>
  );
}
