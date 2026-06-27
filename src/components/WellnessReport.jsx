import React from 'react';
import { useTranslation } from 'react-i18next';
import { X, Printer, BrainCircuit, Heart, Activity, CheckCircle2 } from 'lucide-react';

export default function WellnessReport({ profile, baselineMetrics, recentAnalysis, onClose }) {
  const { t } = useTranslation();
  const stress = recentAnalysis?.burnoutKey === 'high' ? 8 : (baselineMetrics?.stressLevel || 5);
  const sleep = baselineMetrics?.sleepHours || 7;
  const study = baselineMetrics?.studyHours || 6;
  const confidence = baselineMetrics?.confidenceScore || 7;

  // Calculate dynamic wellness score
  const getWellnessScore = () => {
    let base = 100;
    base -= stress * 5; // stress deduction
    base -= Math.abs(sleep - 8) * 4; // sleep deflection deduction
    base -= Math.abs(study - profile.dailyGoalHours) * 2; // pacing deflection deduction
    return Math.min(Math.max(base, 10), 100);
  };

  const score = getWellnessScore();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '20px'
    }}>
      <div className="glass-panel printable-report" style={{
        width: '100%',
        maxWidth: '800px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '40px',
        textAlign: 'left',
        position: 'relative',
        background: 'rgba(17, 24, 39, 0.95)',
        border: '1px solid var(--border-color)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
      }}>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: 0
          }}
        >
          <X size={20} />
        </button>

        {/* Print Header */}
        <div style={{ borderBottom: '2px solid var(--border-color)', paddingBottom: '20px', marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BrainCircuit size={28} color="var(--color-primary)" />
            <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
              {t('report.title')}
            </h2>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '6px', margin: 0 }}>
            {t('report.period')}
          </p>
        </div>

        {/* Student Meta Details */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
          background: 'var(--bg-elevated)',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid var(--border-color)',
          marginBottom: '28px'
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
              {t('report.student_name')}
            </div>
            <div style={{ color: 'var(--text-primary)', fontWeight: '700', fontSize: '1rem', marginTop: '4px' }}>
              {profile?.name || 'Aryan Sharma'}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
              {t('report.target_exam')}
            </div>
            <div style={{ color: 'var(--text-primary)', fontWeight: '700', fontSize: '1rem', marginTop: '4px' }}>
              {t(`profile.exams.${profile?.targetExam || 'OTHER'}.name`)}
            </div>
          </div>
        </div>

        {/* Core wellness score index */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '28px', marginBottom: '28px' }}>
          <div>
            <h4 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', margin: 0 }}>{t('report.wellness_label')}</h4>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginTop: '12px' }}>
              <span style={{ fontSize: '3rem', fontWeight: '900', color: score > 75 ? 'var(--color-success)' : score > 50 ? 'var(--color-warning)' : 'var(--color-danger)' }}>
                {score}
              </span>
              <span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                {stress >= 7 ? t('report.high_burnout') : stress >= 5 ? t('report.moderate_strain') : t('report.optimal_balance')}
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '12px', lineHeight: '1.4', margin: 0 }}>
              {t('report.report_desc')}
            </p>
          </div>

          {/* Mini analytics cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--bg-elevated)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <Activity size={16} color="var(--color-danger)" />
                {t('report.avg_stress')}
              </span>
              <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{stress} / 10</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--bg-elevated)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <Heart size={16} color="var(--color-calm)" />
                {t('report.avg_sleep')}
              </span>
              <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{sleep} Hrs</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--bg-elevated)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <Activity size={16} color="var(--color-primary)" />
                {t('report.study_pacing')}
              </span>
              <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{study} Hrs / Day</span>
            </div>
          </div>
        </div>

        {/* Gemini Synthesis Clinical details */}
        <div style={{
          background: 'var(--bg-elevated)',
          border: '1px dashed var(--border-color)',
          padding: '24px',
          borderRadius: '12px',
          marginBottom: '32px'
        }}>
          <h4 style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: '700', margin: '0 0 10px 0' }}>
            {t('report.synthesis_title')}
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: '0 0 12px 0' }}>
            {t('report.synthesis_desc')}
          </p>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.8rem',
            color: 'var(--color-success)',
            background: 'rgba(16, 185, 129, 0.05)',
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid rgba(16, 185, 129, 0.2)'
          }}>
            <CheckCircle2 size={14} />
            <span>{t('report.synthesis_recommend')}</span>
          </div>
        </div>

        {/* Actions footer */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary" onClick={onClose}>
            {t('report.close_btn')}
          </button>
          
          <button className="btn btn-primary" onClick={handlePrint}>
            <Printer size={16} />
            {t('report.print_btn')}
          </button>
        </div>

      </div>
    </div>
  );
}

