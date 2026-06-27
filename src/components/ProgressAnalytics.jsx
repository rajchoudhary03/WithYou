import React from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart2, Activity, ShieldAlert, Sparkles, TrendingUp } from 'lucide-react';

export default function ProgressAnalytics({ baselineMetrics, currentLogs }) {
  const { t } = useTranslation();

  // Simulated 7-day data (Thursday is high strain)
  const chartData = [
    { day: 'Sat', stress: 3, mood: 7, sleep: 7.5, study: 6 },
    { day: 'Sun', stress: 2, mood: 8, sleep: 8.0, study: 5 },
    { day: 'Mon', stress: 4, mood: 7, sleep: 7.0, study: 8 },
    { day: 'Tue', stress: 5, mood: 6, sleep: 6.5, study: 9 },
    { day: 'Wed', stress: 6, mood: 5, sleep: 6.0, study: 10 },
    { day: 'Thu', stress: 8, mood: 3, sleep: 4.5, study: 11 }, // Burnout crossing peak
    { day: 'Fri', stress: 4, mood: 6, sleep: 7.5, study: 7 }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Header */}
      <div className="glass-panel" style={{ padding: '24px', textAlign: 'left' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
          <BarChart2 size={24} color="var(--color-primary)" /> {t('analytics.title')}
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          {t('analytics.subtitle')}
        </p>
      </div>

      {/* SVG Charts section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        {/* Chart 1: Stress vs Mood */}
        <div className="glass-panel" style={{ padding: '24px', textAlign: 'left' }}>
          <h4 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', marginBottom: '6px' }}>{t('analytics.mood_vs_stress')}</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '24px' }}>{t('analytics.stress_vs_mood_chart')}</p>

          <div style={{ position: 'relative', height: '200px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', paddingBottom: '24px', borderBottom: '1px solid var(--border-color)' }}>
            
            {chartData.map((d, index) => {
              const stressHeight = `${d.stress * 10}%`;
              const moodHeight = `${d.mood * 10}%`;

              return (
                <div key={index} style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: '12%',
                  height: '100%',
                  justifyContent: 'flex-end',
                  position: 'relative'
                }}>
                  {/* Stress Bar (Primary) */}
                  <div style={{
                    width: '6px',
                    height: stressHeight,
                    background: 'var(--color-danger)',
                    borderRadius: '3px 3px 0 0',
                    transition: 'all var(--transition-fast)',
                    position: 'absolute',
                    left: '35%'
                  }} />

                  {/* Mood Bar (Secondary) */}
                  <div style={{
                    width: '6px',
                    height: moodHeight,
                    background: 'var(--color-primary)',
                    borderRadius: '3px 3px 0 0',
                    transition: 'all var(--transition-fast)',
                    position: 'absolute',
                    left: '55%'
                  }} />

                  <span style={{ position: 'absolute', bottom: '-22px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {d.day}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Legends */}
          <div style={{ display: 'flex', gap: '16px', marginTop: '16px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '10px', height: '10px', background: 'var(--color-danger)', borderRadius: '2px' }} />
              {t('analytics.stress_legend')}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '10px', height: '10px', background: 'var(--color-primary)', borderRadius: '2px' }} />
              {t('analytics.mood_legend')}
            </span>
          </div>
        </div>

        {/* Chart 2: Study vs Sleep */}
        <div className="glass-panel" style={{ padding: '24px', textAlign: 'left' }}>
          <h4 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', marginBottom: '6px' }}>{t('analytics.study_vs_sleep')}</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '24px' }}>{t('analytics.weekly_comparison')}</p>

          <div style={{ position: 'relative', height: '200px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', paddingBottom: '24px', borderBottom: '1px solid var(--border-color)' }}>
            
            {chartData.map((d, index) => {
              // Scale hours to height. max study 12 = 100%, sleep hours / 12
              const studyHeight = `${(d.study / 12) * 100}%`;
              const sleepHeight = `${(d.sleep / 12) * 100}%`;

              return (
                <div key={index} style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: '12%',
                  height: '100%',
                  justifyContent: 'flex-end',
                  position: 'relative'
                }}>
                  {/* Study hours Bar */}
                  <div style={{
                    width: '6px',
                    height: studyHeight,
                    background: 'var(--color-primary)',
                    borderRadius: '3px 3px 0 0',
                    transition: 'all var(--transition-fast)',
                    position: 'absolute',
                    left: '35%'
                  }} />

                  {/* Sleep hours Bar */}
                  <div style={{
                    width: '6px',
                    height: sleepHeight,
                    background: 'var(--color-calm)',
                    borderRadius: '3px 3px 0 0',
                    transition: 'all var(--transition-fast)',
                    position: 'absolute',
                    left: '55%'
                  }} />

                  <span style={{ position: 'absolute', bottom: '-22px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {d.day}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Legends */}
          <div style={{ display: 'flex', gap: '16px', marginTop: '16px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '10px', height: '10px', background: 'var(--color-primary)', borderRadius: '2px' }} />
              {t('profile.goal_label').split(' ')[0]}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '10px', height: '10px', background: 'var(--color-calm)', borderRadius: '2px' }} />
              {t('dashboard.sleep_quality')}
            </span>
          </div>
        </div>

      </div>

      {/* Insights compilation */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
        
        {/* Dynamic anomalies analysis */}
        <div className="glass-panel" style={{ padding: '24px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h4 style={{ color: 'var(--text-primary)', fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="var(--color-warning)" />
            Gemini Analytical Insights
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <TrendingUp size={20} color="var(--color-primary)" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.92rem' }}>{t('analytics.correlation_detected')}</div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: '1.4' }}>
                  {t('analytics.correlation_text')}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <ShieldAlert size={20} color="var(--color-danger)" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.92rem' }}>{t('analytics.burnout_threshold')}</div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: '1.4' }}>
                  {t('analytics.burnout_text')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Small card indicators */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="glass-panel" style={{ padding: '20px', textAlign: 'left' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '700' }}>
              {t('analytics.ratio_label')}
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '4px' }}>
              1 : 1.3
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
              {t('analytics.ratio_text')}
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '20px', textAlign: 'left' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '700' }}>
              {t('analytics.consistency')}
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--color-success)', marginTop: '4px' }}>
              82.5%
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
              {t('analytics.consistency_text')}
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}

