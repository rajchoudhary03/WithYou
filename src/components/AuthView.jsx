import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LogIn, ShieldAlert, CheckCircle2, Lock, Mail } from 'lucide-react';

export default function AuthView({ onLoginSuccess }) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleMockLogin = (e, provider) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate authenticating via Google / Firebase Auth
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess({
        uid: provider === 'guest' ? 'guest-student-123' : 'mock-student-123',
        email: provider === 'guest' ? 'guest@withyou.ai' : (email || 'student@withyou.ai'),
        displayName: provider === 'google' ? 'Aryan Sharma' : provider === 'guest' ? t('auth.guest_login') : 'Student Pro',
        photoURL: provider === 'google' ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100' : null
      });
    }, 1200);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '420px',
        padding: '32px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="flex-center" style={{ 
            width: '54px', 
            height: '54px', 
            borderRadius: '8px', 
            background: 'var(--color-primary)',
            margin: '0 auto 18px'
          }}>
            <LogIn size={26} color="#fff" />
          </div>

          <h2 style={{ fontSize: '1.8rem', marginBottom: '8px', color: 'var(--text-primary)' }}>{t('auth.title')}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '32px' }}>
            {t('auth.subtitle')}
          </p>

          {/* Social Google Login Button */}
          <button 
            type="button"
            className="btn btn-secondary" 
            onClick={(e) => handleMockLogin(e, 'google')}
            disabled={loading}
            style={{ 
              width: '100%', 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '12px',
              fontSize: '1rem',
              padding: '14px',
              marginBottom: '10px',
              fontWeight: '700'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.58 14.98 1 12 1 7.35 1 3.37 3.65 1.42 7.54l3.82 2.96c.9-2.7 3.42-4.46 6.76-4.46z" />
              <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.34H12v4.44h6.44c-.28 1.47-1.11 2.71-2.36 3.55l3.66 2.84c2.14-1.97 3.38-4.88 3.38-8.49z" />
              <path fill="#FBBC05" d="M5.24 14.75c-.23-.69-.36-1.43-.36-2.2s.13-1.51.36-2.2L1.42 7.39C.51 9.22 0 11.24 0 13.37s.51 4.15 1.42 5.98l3.82-2.6z" />
              <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.92l-3.66-2.84c-1.1.74-2.52 1.18-4.3 1.18-3.34 0-5.86-1.76-6.76-4.46L1.42 16.6C3.37 20.35 7.35 23 12 23z" />
            </svg>
            {t('auth.google_login')}
          </button>

          {/* Guest Login Button */}
          <button 
            type="button"
            className="btn btn-secondary" 
            onClick={(e) => handleMockLogin(e, 'guest')}
            disabled={loading}
            style={{ 
              width: '100%', 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '12px',
              fontSize: '1rem',
              padding: '14px',
              fontWeight: '700',
              borderColor: 'var(--border-color)',
              color: 'var(--color-calm)'
            }}
          >
            {t('auth.guest_login')}
          </button>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            margin: '24px 0',
            color: 'var(--text-muted)',
            fontSize: '0.85rem'
          }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
            <span>OR Email</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
          </div>

          <form onSubmit={(e) => handleMockLogin(e, 'email')} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', gap: '6px' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '500' }}>{t('auth.email_label')}</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '14px' }} />
                <input 
                  type="email" 
                  className="glass-input" 
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ width: '100%', paddingLeft: '42px' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', gap: '6px' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '500' }}>{t('auth.password_label')}</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '14px' }} />
                <input 
                  type="password" 
                  className="glass-input" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ width: '100%', paddingLeft: '42px' }}
                />
              </div>
            </div>

            {error && (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                color: 'var(--color-danger)', 
                fontSize: '0.85rem', 
                textAlign: 'left',
                background: 'var(--color-danger-glow)',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid rgba(239, 68, 68, 0.2)'
              }}>
                <ShieldAlert size={16} />
                <span>{error}</span>
              </div>
            )}

            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading}
              style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: '8px' }}
            >
              {loading ? (
                <span>{t('auth.login_loading')}</span>
              ) : (
                <>
                  {t('auth.login_btn')}
                  <CheckCircle2 size={18} />
                </>
              )}
            </button>
          </form>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '24px' }}>
            {t('auth.footer')}
          </p>
        </div>
      </div>
    </div>
  );
}

