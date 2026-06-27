import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, BrainCircuit, Heart, Play, Pause, RotateCcw, AlertCircle } from 'lucide-react';

export default function AICoach({ profile, baselineMetrics, recentAnalysis }) {
  const { t } = useTranslation();

  // Breathing Exercise State
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState('Inhale'); // Inhale, Hold, Exhale, Hold
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [cycleCount, setCycleCount] = useState(0);

  // Box Breathing cycle: Inhale (4s) -> Hold (4s) -> Exhale (4s) -> Hold (4s)
  useEffect(() => {
    let interval = null;
    if (breathingActive) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            // Transition phase
            setBreathPhase((currentPhase) => {
              switch (currentPhase) {
                case 'Inhale':
                  return 'Hold (Full)';
                case 'Hold (Full)':
                  return 'Exhale';
                case 'Exhale':
                  return 'Hold (Empty)';
                case 'Hold (Empty)':
                  setCycleCount((c) => c + 1);
                  return 'Inhale';
                default:
                  return 'Inhale';
              }
            });
            return 4; // Reset phase duration to 4 seconds
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [breathingActive]);

  const resetBreathing = () => {
    setBreathingActive(false);
    setBreathPhase('Inhale');
    setSecondsLeft(4);
    setCycleCount(0);
  };

  // Get dynamic coaching guidance based on stress metrics
  const getCoachingInsights = () => {
    const isHighStress = (recentAnalysis?.burnoutKey === 'high' || (baselineMetrics?.stressLevel || 5) >= 7);
    const stressKey = isHighStress ? 'high' : 'low';
    
    let motivation = t(`ai.coach.motivation_${stressKey}`);
    let studyTip = t(`ai.coach.study_${stressKey}`);
    let breakTip = t(`ai.coach.break_${stressKey}`);
    let coping = t(`ai.coach.coping_${stressKey}`);

    return { motivation, studyTip, breakTip, coping };
  };

  const insights = getCoachingInsights();

  // Determine breathing circle scale class
  const getCircleScale = () => {
    if (!breathingActive) return 1.0;
    if (breathPhase === 'Inhale') return 1.4;
    if (breathPhase === 'Hold (Full)') return 1.4;
    if (breathPhase === 'Exhale') return 0.8;
    return 0.8; // Hold (Empty)
  };

  // Localized breath phase strings
  const getBreathPhaseLabel = (phase) => {
    switch (phase) {
      case 'Inhale':
        return t('coach.inhale', 'Inhale');
      case 'Hold (Full)':
        return t('coach.hold_full', 'Hold (Full)');
      case 'Exhale':
        return t('coach.exhale', 'Exhale');
      case 'Hold (Empty)':
        return t('coach.hold_empty', 'Hold (Empty)');
      default:
        return phase;
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
      
      {/* Personalized Insights Panel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="glass-panel" style={{ padding: '28px', textAlign: 'left' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '16px' }}>
            <Sparkles size={24} color="var(--color-warning)" /> {t('coach.title')}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Daily Motivation */}
            <div style={{ borderLeft: '3px solid var(--color-primary)', paddingLeft: '16px', margin: '8px 0' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase' }}>{t('coach.daily_motivation')}</div>
              <p style={{ fontSize: '1.05rem', color: 'var(--text-primary)', fontStyle: 'italic', marginTop: '6px', lineHeight: '1.4' }}>
                "{insights.motivation}"
              </p>
            </div>

            {/* Suggestions cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px', marginTop: '12px' }}>
              
              <div style={{
                background: 'var(--bg-elevated)',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid var(--border-color)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary)', fontWeight: '600', fontSize: '0.95rem', marginBottom: '6px' }}>
                  <BrainCircuit size={18} />
                  {t('coach.study_optimization', { exam: t(`profile.exams.${profile?.targetExam || 'OTHER'}.name`) })}
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                  {insights.studyTip}
                </p>
              </div>

              <div style={{
                background: 'var(--bg-elevated)',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid var(--border-color)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-calm)', fontWeight: '600', fontSize: '0.95rem', marginBottom: '6px' }}>
                  <Heart size={18} />
                  {t('coach.coping_rest')}
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                  {insights.breakTip}
                </p>
              </div>

              <div style={{
                background: 'var(--bg-elevated)',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid var(--border-color)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-success)', fontWeight: '600', fontSize: '0.95rem', marginBottom: '6px' }}>
                  <AlertCircle size={18} />
                  {t('coach.coping_strategies')}
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                  {insights.coping}
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Mindfulness Breathing Guide Panel */}
      <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', minHeight: '420px' }}>
        <h3 style={{ color: 'var(--text-primary)', fontSize: '1.25rem', marginBottom: '6px', width: '100%', textAlign: 'left' }}>
          {t('coach.breathing_title')}
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '32px', width: '100%', textAlign: 'left' }}>
          {t('coach.breathing_sub')}
        </p>

        {/* Breathing Animation Circle */}
        <div style={{
          position: 'relative',
          width: '180px',
          height: '180px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '32px'
        }}>
          {/* Animated pulsing outer halo */}
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: 'radial-gradient(circle, var(--color-calm-glow) 0%, transparent 70%)',
            transform: `scale(${getCircleScale()})`,
            transition: 'transform 4s ease-in-out',
            opacity: breathingActive ? 0.7 : 0.3
          }} />

          {/* Core circle */}
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--color-calm), #0891b2)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(6, 182, 212, 0.4)',
            zIndex: 2,
            transform: `scale(${getCircleScale() * 0.8 + 0.2})`,
            transition: 'transform 4s ease-in-out'
          }}>
            <span style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--text-primary)', textShadow: '0 2px 4px rgba(0,0,0,0.2)', textAlign: 'center', padding: '0 4px', lineHeight: '1.2' }}>
              {breathingActive ? getBreathPhaseLabel(breathPhase) : t('coach.idle')}
            </span>
            {breathingActive && (
              <span style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '2px' }}>
                {secondsLeft}s
              </span>
            )}
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', zIndex: 3 }}>
          {breathingActive ? (
            <button className="btn btn-secondary" onClick={() => setBreathingActive(false)}>
              <Pause size={16} />
              {t('coach.pause')}
            </button>
          ) : (
            <button className="btn btn-primary" style={{ background: 'var(--color-calm)' }} onClick={() => setBreathingActive(true)}>
              <Play size={16} fill="#fff" />
              {t('coach.guided_breath')}
            </button>
          )}

          <button className="btn btn-secondary" onClick={resetBreathing} style={{ padding: '12px' }}>
            <RotateCcw size={16} />
          </button>
        </div>

        {cycleCount > 0 && (
          <div style={{ marginTop: '20px', fontSize: '0.85rem', color: 'var(--color-success)', fontWeight: '600' }}>
            {t('coach.completed_cycles', { count: cycleCount })}
          </div>
        )}
      </div>

    </div>
  );
}

