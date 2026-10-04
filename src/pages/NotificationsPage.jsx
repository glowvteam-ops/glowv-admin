import React from 'react';
import { Bell, Check, Clock, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

export default function NotificationsPage({ notifications, onMarkAllRead }) {
  return (
    <div className="page-main-content">
      <div className="page-header-row">
        <div>
          <h2 className="page-title">Notifications</h2>
          <p className="page-subtitle">Real-time alerts and activity updates</p>
        </div>

        <button className="btn-primary-add" onClick={onMarkAllRead}>
          <Check size={16} />
          <span>Mark all as read</span>
        </button>
      </div>

      <div className="table-responsive-card" style={{ padding: '8px' }}>
        {notifications.map((item) => (
          <div 
            key={item.id} 
            className={`notification-item-row ${item.unread ? 'unread-bg' : ''}`}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '14px',
              padding: '16px',
              borderBottom: '1px solid #f1f5f9',
              borderRadius: '12px'
            }}
          >
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: item.unread ? '#eff6ff' : '#f1f5f9',
              color: item.unread ? '#1868f7' : '#64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Bell size={18} />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <h4 style={{ fontSize: '14.5px', fontWeight: 700, color: '#0f172a' }}>{item.title}</h4>
                <span style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={12} /> {item.time}
                </span>
              </div>
              <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.4 }}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
