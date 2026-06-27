import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Heart, MessageSquare, Phone, Send, User, ChevronRight, X, PhoneCall, ShieldCheck } from 'lucide-react';

export default function SafeCircle({ profile, baselineMetrics, recentAnalysis }) {
  const { t } = useTranslation();
  const [selectedContact, setSelectedContact] = useState(null);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [activeAction, setActiveAction] = useState(''); // 'SMS' or 'Call'
  const [simulatedActionActive, setSimulatedActionActive] = useState(false);
  const [callTimer, setCallTimer] = useState(0);
  const [smsSending, setSmsSending] = useState(false);
  const [smsSent, setSmsSent] = useState(false);

  const stress = recentAnalysis?.burnoutKey === 'high' ? 8 : (baselineMetrics?.stressLevel || 5);
  const stressKey = stress >= 7 ? 'stressed' : 'calm';
  const exam = profile?.targetExam || 'JEE';
  const examName = t(`profile.exams.${exam}.name`);

  const contacts = [
    { id: 'mom', name: 'Mom (Family)', relationship: 'Mother', phone: '+91 98765 43210' },
    { id: 'dad', name: 'Dad (Family)', relationship: 'Father', phone: '+91 98765 43211' },
    { id: 'friend', name: 'Kabir (Friend)', relationship: 'Best Friend', phone: '+91 99999 88888' },
    { id: 'mentor', name: 'Sharma Sir (Physics)', relationship: 'Syllabus Mentor', phone: '+91 90000 11111' }
  ];

  // Call timer simulation
  useEffect(() => {
    let interval = null;
    if (simulatedActionActive && activeAction === 'Call') {
      interval = setInterval(() => {
        setCallTimer(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [simulatedActionActive, activeAction]);

  const getStarterTemplate = (contactId) => {
    switch (contactId) {
      case 'mom':
        return t('ai.safe_circle.mom_' + stressKey, { exam: examName });
      case 'dad':
        return t('ai.safe_circle.dad_' + stressKey, { exam: examName });
      case 'friend':
        return t('ai.safe_circle.friend_' + stressKey, { exam: examName });
      case 'mentor':
        return t('ai.safe_circle.mentor', { exam: examName });
      default:
        return '';
    }
  };

  const handleActionClick = (action) => {
    setActiveAction(action);
    setShowConsentModal(true);
  };

  const handleConsentApproved = () => {
    setShowConsentModal(false);
    setSimulatedActionActive(true);

    if (activeAction === 'SMS') {
      setSmsSending(true);
      setSmsSent(false);
      setTimeout(() => {
        setSmsSending(false);
        setSmsSent(true);
      }, 2000);
    } else {
      setCallTimer(0);
    }
  };

  const closeSimulatedWindow = () => {
    setSimulatedActionActive(false);
    setSmsSent(false);
    setCallTimer(0);
  };

  const formatTimer = (sec) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '24px' }}>
      
      {/* Left List: Safe contacts */}
      <div className="glass-panel" style={{ padding: '24px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.25rem', color: 'var(--text-primary)', margin: 0 }}>
            <Heart size={22} color="var(--color-danger)" /> {t('safe_circle.title')}
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginTop: '6px' }}>
            {t('safe_circle.subtitle')}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {contacts.map((contact) => {
            const isSelected = selectedContact?.id === contact.id;
            return (
              <div
                key={contact.id}
                onClick={() => {
                  setSelectedContact(contact);
                  closeSimulatedWindow();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  borderRadius: '12px',
                  background: isSelected ? 'var(--color-primary-glow)' : 'rgba(255, 255, 255, 0.01)',
                  border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--border-color)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className="flex-center" style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: isSelected ? 'var(--color-primary)' : 'rgba(255,255,255,0.05)',
                    color: 'var(--text-primary)'
                  }}>
                    <User size={18} />
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', color: isSelected ? '#fff' : 'var(--text-primary)', fontSize: '0.92rem' }}>
                      {contact.name}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {contact.relationship}
                    </div>
                  </div>
                </div>

                <ChevronRight size={16} color="var(--text-muted)" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Right List: Simulated actions */}
      <div className="glass-panel" style={{ padding: '28px', textAlign: 'left', display: 'flex', flexDirection: 'column', minHeight: '360px' }}>
        {selectedContact ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
            
            <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
              <h4 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', margin: 0 }}>
                {t('safe_circle.reaching_to', { name: selectedContact.name })}
              </h4>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{selectedContact.phone}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                {t('safe_circle.starter_header')}
              </div>
              <div style={{
                background: 'var(--bg-elevated)',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                fontSize: '0.9rem',
                color: 'var(--text-primary)',
                lineHeight: '1.4',
                fontStyle: 'italic'
              }}>
                "{getStarterTemplate(selectedContact.id)}"
              </div>
            </div>

            {/* Quick outreach action triggers */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
              <button className="btn btn-secondary" onClick={() => handleActionClick('SMS')} style={{ flex: 1 }}>
                <Send size={16} />
                {t('safe_circle.send_sms')}
              </button>

              <button className="btn btn-primary" onClick={() => handleActionClick('Call')} style={{ flex: 1 }}>
                <Phone size={16} />
                {t('safe_circle.one_tap_call')}
              </button>
            </div>

            {/* Simulated overlay container for active phone calls / sent sms */}
            {simulatedActionActive && (
              <div style={{
                marginTop: '16px',
                padding: '16px',
                borderRadius: '12px',
                background: activeAction === 'Call' ? 'rgba(6, 182, 212, 0.08)' : 'rgba(16, 185, 129, 0.08)',
                border: '1px solid',
                borderColor: activeAction === 'Call' ? 'rgba(6, 182, 212, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                position: 'relative'
              }}>
                <button
                  onClick={closeSimulatedWindow}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  <X size={16} />
                </button>

                {activeAction === 'Call' ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div className="flex-center" style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'var(--color-calm)',
                      color: '#fff',
                      animation: 'pulse 1.5s infinite'
                    }}>
                      <PhoneCall size={18} />
                    </div>
                    <div>
                      <div style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                        {callTimer > 3 ? t('safe_circle.connected') : t('safe_circle.calling')}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        {formatTimer(callTimer)}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div className="flex-center" style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'var(--color-success)',
                      color: '#fff'
                    }}>
                      <Send size={18} />
                    </div>
                    <div>
                      <div style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                        {smsSending ? t('safe_circle.sending_sms') : 'SMS Transmitted!'}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        {smsSending ? 'Broadcasting...' : t('safe_circle.sms_success')}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        ) : (
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
            textAlign: 'center',
            padding: '40px',
            background: 'var(--bg-elevated)',
            borderRadius: '12px',
            border: '1px dashed var(--border-color)'
          }}>
            <Heart size={44} style={{ marginBottom: '16px', opacity: 0.5 }} />
            <p style={{ fontSize: '0.88rem', maxWidth: '280px', lineHeight: '1.4' }}>
              {t('safe_circle.empty_state')}
            </p>
          </div>
        )}
      </div>

      {/* User consent modal overlay */}
      {showConsentModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000
        }}>
          <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '380px',
            padding: '32px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'var(--color-primary-glow)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShieldCheck size={28} color="var(--color-primary)" />
            </div>
            <h4 style={{ color: 'var(--text-primary)', fontSize: '1.25rem', margin: 0 }}>{t('safe_circle.consent_title')}</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', maxWidth: '300px', margin: 0, lineHeight: '1.4' }}>
              {t('safe_circle.consent_text', { action: activeAction, name: selectedContact.name })}
            </p>
            
            <div style={{ display: 'flex', gap: '12px', width: '100%', marginTop: '8px' }}>
              <button className="btn btn-secondary" onClick={() => setShowConsentModal(false)} style={{ flex: 1 }}>
                {t('safe_circle.consent_cancel')}
              </button>
              <button className="btn btn-primary" onClick={handleConsentApproved} style={{ flex: 1 }}>
                {t('safe_circle.consent_approve')}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

