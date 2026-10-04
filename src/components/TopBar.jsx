import React, { useState } from 'react';
import { Search, Bell, LogOut, ChevronDown, Check, User, ShieldCheck } from 'lucide-react';

export default function TopBar({ 
  onLogout, 
  notifications, 
  onMarkNotificationsRead, 
  onOpenNotifications 
}) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="app-topbar">
      {/* Search Bar */}
      <div className="topbar-search-box">
        <Search size={18} className="search-icon" />
        <input 
          type="text" 
          placeholder="Search anything..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="topbar-search-input"
        />
      </div>

      {/* Right Controls */}
      <div className="topbar-right-actions">
        {/* Notification Bell */}
        <div className="notification-wrapper">
          <button 
            className="topbar-icon-btn" 
            onClick={onOpenNotifications}
            aria-label="View notifications"
          >
            <Bell size={19} />
            {unreadCount > 0 && <span className="notif-indicator-dot" />}
          </button>
        </div>

        {/* User Profile Pill */}
        <div className="profile-menu-container">
          <button 
            className="user-profile-pill"
            onClick={() => setProfileOpen(!profileOpen)}
            aria-label="Admin options"
          >
            <img 
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80" 
              alt="Admin avatar" 
              className="user-avatar-img"
            />
            <div className="user-details-text">
              <span className="user-name">Admin</span>
              <span className="user-role">Super Admin</span>
            </div>
            <ChevronDown size={14} color="#64748b" />
          </button>

          {profileOpen && (
            <div className="profile-dropdown-menu">
              <div className="dropdown-header">
                <p className="dropdown-user-title">Admin</p>
                <p className="dropdown-user-sub">glowv.admin123@gmail.com</p>
              </div>
              <div className="dropdown-divider" />
              <button 
                className="dropdown-item"
                onClick={() => {
                  setProfileOpen(false);
                }}
              >
                <ShieldCheck size={16} />
                <span>Security & Roles</span>
              </button>
              <button 
                className="dropdown-item text-danger"
                onClick={() => {
                  setProfileOpen(false);
                  onLogout();
                }}
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
