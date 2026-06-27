import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Activity, Smile, Brain, Heart, Check } from 'lucide-react';

const MOODS = [
  { key: 'Anxious', emoji: '😰' },
  { key: 'Exhausted', emoji: '😴' },
  { key: 'Neutral', emoji: '😐' },
  { key: 'Focused', emoji: '📚' },
  { key: 'Motivated', emoji: '😊' }
];

export default function InitialAssessment({ profile, onAssessmentComplete }) {
  const { t } = useTranslation();
  const [stress, setStress] = useState(5);
  const [sleep, setSleep] = useState(7);
  const [study, setStudy] = useState(6);
  const [confidence, setConfidence] = useState(7);
  const [moodToday, setMoodToday] = useState('Neutral');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAssessmentComplete({
      stressLevel: Number(stress),
      sleepHours: Number(sleep),
      studyHours: Number(study),
      confidenceScore: Number(confidence),
      moodToday: moodToday
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '760px',
        padding: '32px',
        position: 'relative'
      }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '8px', color: 'var(--text-primary)' }}>{t('assessment.title')}</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '36px' }}>
          {t('assessment.subtitle')}
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Mood Checkin */}
          <div style={{ textAlign: 'left' }}>
            <label style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: '600', display: 'block', marginBottom: '14px' }}>
              {t('assessment.mood_q')}
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(105px, 1fr))', gap: '10px' }}>
              {MOODS.map((m) => {
                const isSelected = moodToday === m.key;
                return (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => setMoodToday(m.key)}
                    style={{
                      padding: '16px 8px',
                      borderRadius: '12px',
                      background: isSelected ? 'var(--color-primary-glow)' : 'var(--bg-surface)',
                      border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--border-color)',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <span style={{ fontSize: '2rem' }}>{m.emoji}</span>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      fontWeight: '600', 
                      color: isSelected ? 'var(--color-primary)' : 'var(--text-secondary)',
                      textAlign: 'center',
                      lineHeight: '1.2'
                    }}>
                      {t(`assessment.moods.${m.key}`)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', textAlign: 'left' }}>
            
            {/* Stress level */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '600', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Brain size={18} color="var(--color-danger)" /> {t('assessment.stress_label')}
                </span>
                <span style={{ 
                  fontWeight: '700', 
                  color: stress > 7 ? 'var(--color-danger)' : stress > 4 ? 'var(--color-warning)' : 'var(--color-success)',
                  fontSize: '1.1rem'
                }}>{stress} / 10</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="10" 
                value={stress}
                onChange={(e) => setStress(e.target.value)}
                style={{ 
                  width: '100%', 
                  accentColor: stress > 7 ? 'var(--color-danger)' : 'var(--color-primary)',
                  cursor: 'pointer'
                }} 
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {stress > 7 ? t('assessment.stress_high') : stress > 4 ? t('assessment.stress_mid') : t('assessment.stress_low')}
              </span>
            </div>

            {/* Sleep hours */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '600', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Heart size={18} color="var(--color-calm)" /> {t('assessment.sleep_label')}
                </span>
                <span style={{ 
                  fontWeight: '700', 
                  color: sleep < 6 ? 'var(--color-danger)' : sleep >= 8 ? 'var(--color-success)' : 'var(--color-calm)',
                  fontSize: '1.1rem'
                }}>{sleep} Hours</span>
              </div>
              <input 
                type="range" 
                min="3" 
                max="12" 
                step="0.5"
                value={sleep}
                onChange={(e) => setSleep(e.target.value)}
                style={{ 
                  width: '100%', 
                  accentColor: 'var(--color-calm)',
                  cursor: 'pointer' 
                }} 
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {sleep < 6 ? t('assessment.sleep_low') : sleep >= 8 ? t('assessment.sleep_high') : t('assessment.sleep_mid')}
              </span>
            </div>

            {/* Study hours */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '600', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Activity size={18} color="var(--color-primary)" /> {t('assessment.study_label')}
                </span>
                <span style={{ 
                  fontWeight: '700', 
                  color: study > profile.dailyGoalHours ? 'var(--color-success)' : 'var(--color-warning)',
                  fontSize: '1.1rem'
                }}>{study} Hrs / Goal: {profile.dailyGoalHours} Hrs</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="16" 
                step="0.5"
                value={study}
                onChange={(e) => setStudy(e.target.value)}
                style={{ 
                  width: '100%', 
                  accentColor: 'var(--color-primary)',
                  cursor: 'pointer' 
                }} 
              />
            </div>

            {/* Confidence Score */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '600', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Smile size={18} color="var(--color-success)" /> {t('assessment.confidence_label')}
                </span>
                <span style={{ 
                  fontWeight: '700', 
                  color: confidence > 7 ? 'var(--color-success)' : confidence > 4 ? 'var(--color-primary)' : 'var(--color-danger)',
                  fontSize: '1.1rem'
                }}>{confidence} / 10</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="10" 
                value={confidence}
                onChange={(e) => setConfidence(e.target.value)}
                style={{ 
                  width: '100%', 
                  accentColor: confidence > 7 ? 'var(--color-success)' : 'var(--color-primary)',
                  cursor: 'pointer' 
                }} 
              />
            </div>

          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: '16px' }}
          >
            {t('assessment.submit_btn')}
            <Check size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}

