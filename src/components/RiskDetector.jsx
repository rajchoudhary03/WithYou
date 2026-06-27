import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldAlert, AlertTriangle, CheckCircle2, ChevronRight } from 'lucide-react';

export default function RiskDetector({ baselineMetrics, recentAnalysis, onNavigateToSafeCircle }) {
  const { t } = useTranslation();
  const stress = recentAnalysis?.burnoutKey === 'high' ? 8 : (baselineMetrics?.stressLevel || 5);
  const sleep = baselineMetrics?.sleepHours || 7;

  // Determine current wellness risk categorization
  const getRiskData = () => {
    if (stress >= 7 || sleep < 5) {
      return {
        key: 'high_risk',
        level: 'CRITICAL BURNOUT RISK',
        color: 'var(--color-danger)',
        bg: 'var(--color-danger-glow)',
        icon: <ShieldAlert size={20} color="var(--color-danger)" />
      };
    } else if (stress >= 5 || sleep < 7) {
      return {
        key: 'med_risk',
        level: 'MODERATE TENSION',
        color: 'var(--color-warning)',
        bg: 'rgba(245, 158, 11, 0.05)',
        icon: <AlertTriangle size={20} color="var(--color-warning)" />
      };
    } else {
      return {
        key: 'low_risk',
        level: 'STABLE / HEALTHY PATH',
        color: 'var(--color-success)',
        bg: 'var(--color-success-glow)',
        icon: <CheckCircle2 size={20} color="var(--color-success)" />
      };
    }
  };

  const risk = getRiskData();

  return (
    <div className="glass-panel" style={{
      padding: '24px',
      textAlign: 'left',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      border: '1px solid var(--border-color)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: '700', margin: 0 }}>
          {t('risk.title')}
        </h4>
        <span className="badge" style={{
          background: risk.bg,
          color: risk.color,
          borderColor: 'transparent',
          fontSize: '0.72rem',
          fontWeight: '700'
        }}>
          {risk.level}
        </span>
      </div>

      <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', margin: 0 }}>
        {t('risk.subtitle')}
      </p>

      {/* Recommended directives list */}
      <div style={{
        background: 'var(--bg-elevated)',
        padding: '16px',
        borderRadius: '12px',
        border: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
          {risk.icon}
          <div>
            <div style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
              {t('risk.recommended_directives')}
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: '1.4' }}>
              {t(`risk.${risk.key}.directive`)}
            </p>
          </div>
        </div>

        {/* Tip points */}
        <ul style={{
          margin: '4px 0 0 30px',
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          fontSize: '0.8rem',
          color: 'var(--text-secondary)',
          listStyleType: 'disc'
        }}>
          <li>{t(`risk.${risk.key}.tips_0`)}</li>
          <li>{t(`risk.${risk.key}.tips_1`)}</li>
          <li>{t(`risk.${risk.key}.tips_2`)}</li>
        </ul>
      </div>

      {risk.key === 'high_risk' ? (
        <button 
          onClick={onNavigateToSafeCircle} 
          className="btn btn-primary" 
          style={{ width: '100%', padding: '12px', justifyContent: 'center', background: 'var(--color-danger)', border: 'none', boxShadow: 'none' }}
        >
          {t(`risk.${risk.key}.action`)}
          <ChevronRight size={16} />
        </button>
      ) : (
        <div style={{
          fontSize: '0.78rem',
          color: risk.color,
          textAlign: 'center',
          fontWeight: '600',
          padding: '8px',
          background: risk.bg,
          borderRadius: '8px'
        }}>
          {t(`risk.${risk.key}.action`)}
        </div>
      )}
    </div>
  );
}

