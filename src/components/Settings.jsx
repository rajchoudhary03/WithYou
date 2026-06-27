import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../App';
import {
  Globe, Moon, Sun, Bell, Lock, User, Heart,
  Phone, Shield, Eye, EyeOff, Trash2, Save,
  ChevronRight, Info, Check, AlertTriangle
} from 'lucide-react';

// Language options
const LANGUAGES = [
  { code: 'en',  label: 'English',       nativeLabel: 'English' },
  { code: 'hi',  label: 'Hindi',         nativeLabel: 'हिन्दी' },
  { code: 'bn',  label: 'Bengali',       nativeLabel: 'বাংলা' },
  { code: 'ta',  label: 'Tamil',         nativeLabel: 'தமிழ்' },
  { code: 'te',  label: 'Telugu',        nativeLabel: 'తెలుగు' },
  { code: 'kn',  label: 'Kannada',       nativeLabel: 'ಕನ್ನಡ' },
  { code: 'ml',  label: 'Malayalam',     nativeLabel: 'മലയാളം' },
  { code: 'mr',  label: 'Marathi',       nativeLabel: 'मराठी' },
  { code: 'gu',  label: 'Gujarati',      nativeLabel: 'ગુજરાતી' },
  { code: 'pa',  label: 'Punjabi',       nativeLabel: 'ਪੰਜਾਬੀ' },
];

// Default trusted contacts
const DEFAULT_CONTACTS = [
  { id: 'mom',    label: '👩 Mom',     role: 'Parent',  phone: '' },
  { id: 'dad',    label: '👨 Dad',     role: 'Parent',  phone: '' },
  { id: 'friend', label: '👫 Friend',  role: 'Friend',  phone: '' },
  { id: 'mentor', label: '🎓 Mentor',  role: 'Mentor',  phone: '' },
];

export default function Settings({ profile, onLogout }) {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  const [activeSection, setActiveSection] = useState('language');
  const [contacts, setContacts] = useState(() => {
    const saved = localStorage.getItem('withyou-contacts');
    return saved ? JSON.parse(saved) : DEFAULT_CONTACTS;
  });
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('withyou-notifications');
    return saved ? JSON.parse(saved) : {
      dailyReminder: true,
      morningRoutine: true,
      breathingBreak: true,
      moodCheckin: true,
      examAlerts: false,
    };
  });
  const [privacy, setPrivacy] = useState(() => {
    const saved = localStorage.getItem('withyou-privacy');
    return saved ? JSON.parse(saved) : {
      shareDataForResearch: false,
      analyticsOptIn: true,
      showEmotionHistory: true,
    };
  });
  const [saved, setSaved] = useState(false);
  const [editingContact, setEditingContact] = useState(null);

  const handleLanguageChange = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem('i18nextLng', code);
  };

  const handleNotificationToggle = (key) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    localStorage.setItem('withyou-notifications', JSON.stringify(updated));
  };

  const handlePrivacyToggle = (key) => {
    const updated = { ...privacy, [key]: !privacy[key] };
    setPrivacy(updated);
    localStorage.setItem('withyou-privacy', JSON.stringify(updated));
  };

  const handleContactSave = (id, phone) => {
    const updated = contacts.map(c => c.id === id ? { ...c, phone } : c);
    setContacts(updated);
    localStorage.setItem('withyou-contacts', JSON.stringify(updated));
    setEditingContact(null);
  };

  const handleSaveAll = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const sections = [
    { id: 'language',  label: t('settings.language', 'Language'),           icon: Globe,   color: 'var(--color-primary)' },
    { id: 'theme',     label: t('settings.theme', 'Appearance'),            icon: theme === 'dark' ? Moon : Sun,  color: 'var(--color-calm)' },
    { id: 'notifications', label: t('settings.notifications', 'Notifications'), icon: Bell, color: 'var(--color-warning)' },
    { id: 'privacy',   label: t('settings.privacy', 'Privacy'),             icon: Lock,    color: 'var(--color-success)' },
    { id: 'profile',   label: t('settings.profile', 'Profile'),             icon: User,    color: 'var(--color-lavender)' },
    { id: 'contacts',  label: t('settings.contacts', 'Trusted Contacts'),   icon: Heart,   color: 'var(--color-danger)' },
  ];

  return (
    <div className="page-transition" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <h1 className="section-title">⚙️ {t('settings.title', 'Settings')}</h1>
        <p className="section-sub">{t('settings.subtitle', 'Customize your WithYou experience')}</p>
      </div>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* Sidebar nav */}
        <div className="glass-panel" style={{ padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '210px', flex: '0 0 210px' }}>
          {sections.map(s => {
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                className={`nav-item ${activeSection === s.id ? 'active' : ''}`}
                onClick={() => setActiveSection(s.id)}
                style={{ '--active-color': s.color }}
              >
                <Icon size={16} color={activeSection === s.id ? s.color : 'var(--text-muted)'} />
                {s.label}
              </button>
            );
          })}
        </div>

        {/* Content area */}
        <div style={{ flex: 1, minWidth: '280px' }}>

          {/* ── Language ── */}
          {activeSection === 'language' && (
            <div className="settings-section page-transition">
              <div className="settings-group">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <Globe size={18} color="var(--color-primary)" />
                  <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {t('settings.selectLanguage', 'Select Language')}
                  </h3>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  {t('settings.languageHint', 'All UI text will be translated to your selected language.')}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '10px' }}>
                  {LANGUAGES.map(lang => {
                    const isActive = i18n.language === lang.code;
                    return (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        style={{
                          padding: '12px 16px',
                          borderRadius: '12px',
                          border: `1.5px solid ${isActive ? 'var(--color-primary)' : 'var(--border-color)'}`,
                          background: isActive ? 'var(--color-primary-glow)' : 'rgba(255,255,255,0.02)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontFamily: 'var(--font-sans)',
                          transition: 'all var(--transition-fast)',
                        }}
                      >
                        <div style={{ textAlign: 'left' }}>
                          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: isActive ? 'var(--color-primary)' : 'var(--text-primary)' }}>
                            {lang.nativeLabel}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '1px' }}>{lang.label}</div>
                        </div>
                        {isActive && <Check size={15} color="var(--color-primary)" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ── Appearance (Theme) ── */}
          {activeSection === 'theme' && (
            <div className="settings-section page-transition">
              <div className="settings-group">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  {theme === 'dark' ? <Moon size={18} color="var(--color-calm)" /> : <Sun size={18} color="var(--color-warning)" />}
                  <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {t('settings.appearance', 'Appearance')}
                  </h3>
                </div>

                {/* Theme toggle cards */}
                <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                  {['dark', 'light'].map(mode => {
                    const isActive = theme === mode;
                    return (
                      <button
                        key={mode}
                        onClick={toggleTheme}
                        style={{
                          flex: '1',
                          minWidth: '150px',
                          padding: '20px',
                          borderRadius: '16px',
                          border: `2px solid ${isActive ? 'var(--color-primary)' : 'var(--border-color)'}`,
                          background: mode === 'dark'
                            ? isActive ? 'rgba(129,140,248,0.1)' : 'rgba(15,14,26,0.5)'
                            : isActive ? 'rgba(129,140,248,0.1)' : 'rgba(240,244,255,0.5)',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px',
                          alignItems: 'center',
                          fontFamily: 'var(--font-sans)',
                          transition: 'all var(--transition-fast)',
                        }}
                      >
                        <div style={{ fontSize: '2rem' }}>{mode === 'dark' ? '🌙' : '☀️'}</div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 700, color: isActive ? 'var(--color-primary)' : 'var(--text-primary)', textTransform: 'capitalize' }}>
                          {mode} {t('settings.mode', 'Mode')}
                        </div>
                        {isActive && (
                          <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>
                            <Check size={10} /> Active
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div style={{ marginTop: '20px', padding: '14px', borderRadius: '12px', background: 'rgba(129,140,248,0.06)', border: '1px solid var(--border-color)' }}>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <Info size={14} color="var(--color-primary)" style={{ marginTop: '2px', flexShrink: 0 }} />
                    {t('settings.themeHint', 'Your theme preference is saved and will persist across sessions.')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── Notifications ── */}
          {activeSection === 'notifications' && (
            <div className="settings-section page-transition">
              <div className="settings-group">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <Bell size={18} color="var(--color-warning)" />
                  <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {t('settings.notifications', 'Notification Preferences')}
                  </h3>
                </div>
                {[
                  { key: 'dailyReminder',    label: '🌟 Daily Wellness Reminder',    desc: 'Morning reminder to check in with your mood' },
                  { key: 'morningRoutine',   label: '🌅 Morning Routine Reminder',   desc: 'Nudge to start your morning wellness routine' },
                  { key: 'breathingBreak',   label: '🌬️ Breathing Break Alerts',    desc: 'Remind you to take Box Breathing breaks during study' },
                  { key: 'moodCheckin',      label: '😊 Mood Check-In Prompt',       desc: 'Gentle reminders to log your mood' },
                  { key: 'examAlerts',       label: '📅 Exam Schedule Alerts',       desc: 'Alerts about upcoming exam dates and deadlines' },
                ].map(item => (
                  <div key={item.key} className="settings-row">
                    <div>
                      <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>
                        {item.label}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{item.desc}</div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={notifications[item.key]}
                        onChange={() => handleNotificationToggle(item.key)}
                      />
                      <span className="toggle-slider" />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Privacy ── */}
          {activeSection === 'privacy' && (
            <div className="settings-section page-transition">
              <div className="settings-group">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <Lock size={18} color="var(--color-success)" />
                  <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {t('settings.privacy', 'Privacy Settings')}
                  </h3>
                </div>

                <div style={{ padding: '12px 14px', borderRadius: '10px', background: 'rgba(52,211,153,0.07)', border: '1px solid rgba(52,211,153,0.2)', marginBottom: '16px', display: 'flex', gap: '8px' }}>
                  <Shield size={16} color="var(--color-success)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    Your data is stored locally and never shared without your explicit consent.
                  </p>
                </div>

                {[
                  { key: 'shareDataForResearch',  label: '🔬 Share Anonymous Data for Research', desc: 'Help improve mental health tools for students', icon: Eye },
                  { key: 'analyticsOptIn',        label: '📊 Usage Analytics',                   desc: 'Allow anonymous usage statistics to improve the app', icon: Eye },
                  { key: 'showEmotionHistory',    label: '📋 Emotion History Visibility',         desc: 'Allow your emotion history to appear on dashboard', icon: EyeOff },
                ].map(item => (
                  <div key={item.key} className="settings-row">
                    <div>
                      <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>
                        {item.label}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{item.desc}</div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={privacy[item.key]}
                        onChange={() => handlePrivacyToggle(item.key)}
                      />
                      <span className="toggle-slider" />
                    </label>
                  </div>
                ))}

                <div style={{ marginTop: '8px', padding: '14px', borderRadius: '12px', background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.2)', display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <AlertTriangle size={16} color="var(--color-danger)" style={{ flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-danger)', marginBottom: '4px' }}>Clear All Local Data</p>
                    <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>This will erase all stored preferences, journal entries, and your wellness history.</p>
                  </div>
                  <button className="btn btn-danger" style={{ fontSize: '0.76rem', padding: '7px 12px', marginLeft: 'auto', flexShrink: 0, whiteSpace: 'nowrap' }}>
                    <Trash2 size={12} /> Clear Data
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── Profile ── */}
          {activeSection === 'profile' && (
            <div className="settings-section page-transition">
              <div className="settings-group">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <User size={18} color="var(--color-lavender)" />
                  <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {t('settings.profile', 'Profile Settings')}
                  </h3>
                </div>
                {profile && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {[
                      { label: '👤 Name',     value: profile.name || profile.displayName || 'Guest User' },
                      { label: '📧 Email',    value: profile.email || 'guest@withyou.ai' },
                      { label: '🎯 Exam Goal', value: profile.examGoal || '—' },
                      { label: '📅 Exam Date', value: profile.examDate || '—' },
                    ].map(row => (
                      <div key={row.label} className="settings-row" style={{ alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600, minWidth: '110px' }}>{row.label}</span>
                        <span style={{ fontSize: '0.88rem', color: 'var(--text-primary)', fontWeight: 600, textAlign: 'right' }}>{row.value}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button className="btn btn-secondary" style={{ fontSize: '0.82rem' }}>
                    Edit Profile
                  </button>
                  <button className="btn btn-danger" onClick={onLogout} style={{ fontSize: '0.82rem' }}>
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── Trusted Contacts ── */}
          {activeSection === 'contacts' && (
            <div className="settings-section page-transition">
              <div className="settings-group">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <Heart size={18} color="var(--color-danger)" />
                  <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {t('settings.contacts', 'Trusted Contacts')}
                  </h3>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  These contacts appear in your SafeCircle and can be called during moments of crisis.
                </p>

                {contacts.map(contact => (
                  <div key={contact.id} style={{ padding: '16px 0', borderBottom: '1px solid var(--border-color)' }}>
                    {editingContact === contact.id ? (
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div style={{ fontSize: 'var(--font-size-lg)', lineHeight: 1 }}>{contact.label.split(' ')[0]}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                            {contact.label}
                          </div>
                          <input
                            type="tel"
                            defaultValue={contact.phone}
                            placeholder="+91 98765 43210"
                            className="glass-input"
                            style={{ maxWidth: '220px' }}
                            id={`contact-phone-${contact.id}`}
                          />
                        </div>
                        <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                          <button
                            className="btn btn-success"
                            style={{ fontSize: '0.78rem', padding: '7px 12px' }}
                            onClick={() => {
                              const val = document.getElementById(`contact-phone-${contact.id}`)?.value || '';
                              handleContactSave(contact.id, val);
                            }}
                          >
                            <Save size={12} /> Save
                          </button>
                          <button className="btn btn-secondary" style={{ fontSize: '0.78rem', padding: '7px 12px' }} onClick={() => setEditingContact(null)}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ fontSize: '1.6rem', lineHeight: 1 }}>{contact.label.split(' ')[0]}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>{contact.label.split(' ').slice(1).join(' ')}</div>
                          <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                            {contact.phone || 'No phone number added'}
                          </div>
                        </div>
                        <span className="badge badge-calm" style={{ fontSize: '0.65rem' }}>{contact.role}</span>
                        <button
                          className="btn btn-secondary"
                          style={{ fontSize: '0.76rem', padding: '6px 12px' }}
                          onClick={() => setEditingContact(contact.id)}
                        >
                          Edit
                        </button>
                        {contact.phone && (
                          <a
                            href={`tel:${contact.phone}`}
                            className="btn btn-success"
                            style={{ fontSize: '0.76rem', padding: '6px 12px', textDecoration: 'none' }}
                          >
                            <Phone size={11} /> Call
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                <div style={{ padding: '12px 14px', background: 'rgba(248,113,113,0.06)', borderRadius: '10px', border: '1px solid rgba(248,113,113,0.18)', display: 'flex', gap: '8px', alignItems: 'flex-start', marginTop: '16px' }}>
                  <Heart size={14} color="var(--color-danger)" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    These contacts will be available in your SafeCircle tab for quick emergency access. Phone numbers are stored only on your device.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Save Banner */}
      {saved && (
        <div style={{
          position: 'fixed', bottom: '24px', right: '24px',
          padding: '12px 20px',
          borderRadius: '12px',
          background: 'var(--color-success)',
          color: '#fff',
          fontWeight: 700,
          fontSize: '0.88rem',
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          boxShadow: '0 8px 24px rgba(52,211,153,0.4)',
          animation: 'fadeSlideIn 0.3s both',
          zIndex: 999,
        }}>
          <Check size={16} /> Settings saved!
        </div>
      )}
    </div>
  );
}

