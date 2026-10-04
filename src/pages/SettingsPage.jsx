import React, { useState } from 'react';
import { Save, Store, Shield, CreditCard, BellRing, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  const [storeName, setStoreName] = useState('GlowVai Skincare');
  const [currency, setCurrency] = useState('INR (₹)');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="page-main-content">
      <div className="page-header-row">
        <div>
          <h2 className="page-title">Settings</h2>
          <p className="page-subtitle">Configure store parameters, payments, and admin access</p>
        </div>
      </div>

      {saved && (
        <div style={{ background: '#ecfdf5', color: '#065f46', padding: '12px 18px', borderRadius: '12px', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={18} />
          <span>Store settings successfully updated!</span>
        </div>
      )}

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '720px' }}>
        <div className="form-card-box">
          <h3 className="form-box-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Store size={18} color="#1868f7" /> General Store Settings
          </h3>
          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label className="input-field-label">Store Brand Name</label>
            <input 
              type="text" 
              className="custom-text-input" 
              value={storeName} 
              onChange={(e) => setStoreName(e.target.value)} 
            />
          </div>
          <div className="form-group">
            <label className="input-field-label">Primary Currency</label>
            <select className="custom-text-input" value={currency} onChange={(e) => setCurrency(e.target.value)}>
              <option value="INR (₹)">INR (₹) - Indian Rupee</option>
              <option value="USD ($)">USD ($) - US Dollar</option>
              <option value="EUR (€)">EUR (€) - Euro</option>
            </select>
          </div>
        </div>

        <div className="form-card-box">
          <h3 className="form-box-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BellRing size={18} color="#1868f7" /> Communication Preferences
          </h3>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={emailNotifications} 
              onChange={(e) => setEmailNotifications(e.target.checked)} 
            />
            <span style={{ fontSize: '14px', color: '#334155' }}>Send automated order alerts to administrator email</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={smsNotifications} 
              onChange={(e) => setSmsNotifications(e.target.checked)} 
            />
            <span style={{ fontSize: '14px', color: '#334155' }}>Send instant SMS updates on critical out-of-stock items</span>
          </label>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="btn-primary-add">
            <Save size={16} />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
}
