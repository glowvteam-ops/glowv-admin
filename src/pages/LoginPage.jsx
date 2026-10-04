import React, { useState } from 'react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  Sparkles,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
} from 'lucide-react';

export default function LoginPage({ onLoginSuccess }) {
  const REQUIRED_ADMIN_EMAIL = 'glowv.admin123@gmail.com';
  const REQUIRED_ADMIN_PASS = 'Glow@#068';

  const featureItems = [
    { icon: Package, label: 'Manage Products' },
    { icon: ShoppingCart, label: 'Process Orders' },
    { icon: Users, label: 'View Customers' },
    { icon: BarChart3, label: 'Track Analytics' },
  ];

  const [email, setEmail] = useState(REQUIRED_ADMIN_EMAIL);
  const [password, setPassword] = useState(REQUIRED_ADMIN_PASS);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [forgotModal, setForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    if (email.trim().toLowerCase() !== REQUIRED_ADMIN_EMAIL.toLowerCase() || password !== REQUIRED_ADMIN_PASS) {
      setError(`Invalid credentials. Please use admin email: ${REQUIRED_ADMIN_EMAIL} and password: ${REQUIRED_ADMIN_PASS}`);
      return;
    }

    setIsLoading(true);
    setError('');

    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        name: 'Admin',
        email: REQUIRED_ADMIN_EMAIL,
        role: 'Super Admin'
      });
    }, 600);
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSent(true);
    setTimeout(() => {
      setForgotModal(false);
      setForgotSent(false);
    }, 2500);
  };

  return (
    <div className="login-screen-container">
      {/* Background glowing rings */}
      <div className="login-ambient-backdrop">
        <div className="ambient-image-overlay" />
        <div className="login-glass-ring-tl" />
        <div className="login-glass-ring-br" />
      </div>

      <div className="login-content-split">
        {/* Left Branding Area */}
        <div className="login-branding-col">
          <div className="login-brand-group">
            <h1 className="login-brand-title">
              Glow<span className="login-brand-accent">V</span>
            </h1>
            <h2 className="login-brand-subtitle">Admin Panel</h2>
            <p className="login-brand-tagline">Manage your skincare store</p>

            <div className="login-feature-grid" aria-label="Store management features">
              {featureItems.map(({ icon: Icon, label }) => (
                <div className="feature-pill" key={label}>
                  <div className="feature-icon-wrap">
                    <Icon size={20} />
                  </div>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="login-product-scene" aria-hidden="true">
            <div className="product-shelf">
              <div className="bottle bottle-one">
                <span className="bottle-cap" />
                <span className="bottle-body">
                  <small>GLOWV</small>
                </span>
              </div>
              <div className="bottle bottle-two">
                <span className="bottle-cap" />
                <span className="bottle-body">
                  <small>GLOWV</small>
                </span>
              </div>
              <div className="bottle bottle-three">
                <span className="bottle-cap" />
                <span className="bottle-body">
                  <small>GLOWV</small>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Floating Form Card */}
        <div className="login-card-col">
          <div className="login-white-card">
            <div className="login-card-header">
              <h3 className="card-welcome-title">Welcome Back <span className="wave-emoji">👋</span></h3>
              <p className="card-welcome-subtitle">Sign in to your admin account</p>
            </div>

            {error && <div className="login-error-alert">{error}</div>}

            <form onSubmit={handleSubmit} className="login-page-form">
              {/* Admin Email */}
              <div className="form-field">
                <label className="field-label" htmlFor="login-email">Admin Email</label>
                <div className="field-input-box">
                  <Mail size={18} className="field-icon-left" />
                  <input 
                    id="login-email"
                    type="text" 
                    inputMode="email"
                    placeholder="Enter your email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="form-field">
                <label className="field-label" htmlFor="login-pass">Password</label>
                <div className="field-input-box">
                  <Lock size={18} className="field-icon-left" />
                  <input 
                    id="login-pass"
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="Enter your password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button 
                    type="button" 
                    className="field-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="login-options-row">
                <label className="remember-checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="checkbox-custom" />
                  <span className="checkbox-text">Remember me</span>
                </label>

                <button 
                  type="button" 
                  className="forgot-pass-btn"
                  onClick={() => {
                    setForgotEmail(email);
                    setForgotModal(true);
                  }}
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                className="login-submit-button"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="spinner" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <span>Login</span>
                )}
              </button>

              {/* Security Badge */}
              <div className="login-security-badge">
                <ShieldCheck size={15} color="#059669" />
                <span>Secured & protected</span>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModal && (
        <div className="modal-overlay" onClick={() => setForgotModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h4 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Reset Admin Password</h4>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '18px' }}>
              Enter your admin email to receive a secure recovery code.
            </p>
            {forgotSent ? (
              <div style={{ padding: '16px', background: '#ecfdf5', borderRadius: '10px', color: '#065f46', fontSize: '13.5px' }}>
                ✓ Recovery instructions dispatched to <strong>{forgotEmail}</strong>.
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit}>
                <input 
                  type="email" 
                  value={forgotEmail} 
                  onChange={(e) => setForgotEmail(e.target.value)} 
                  placeholder="Enter your email" 
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', marginBottom: '16px' }}
                />
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button type="button" className="btn-cancel" onClick={() => setForgotModal(false)}>Cancel</button>
                  <button type="submit" className="login-submit-button" style={{ width: 'auto', padding: '0 20px' }}>Send Link</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
