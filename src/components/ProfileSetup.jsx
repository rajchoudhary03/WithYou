import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { User, BookOpen, Clock, ArrowRight } from 'lucide-react';

const TARGET_EXAMS = ['JEE', 'NEET', 'UPSC', 'CAT', 'GATE', 'CUET', 'OTHER'];

export default function ProfileSetup({ user, onProfileComplete }) {
  const { t } = useTranslation();
  const [name, setName] = useState(user?.displayName || '');
  const [selectedExam, setSelectedExam] = useState('');
  const [dailyGoalHours, setDailyGoalHours] = useState(8);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedExam) return;

    onProfileComplete({
      name: name || 'Aryan',
      targetExam: selectedExam,
      dailyGoalHours: Number(dailyGoalHours)
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
        <h2 style={{ fontSize: '1.8rem', marginBottom: '8px', color: 'var(--text-primary)' }}>{t('profile.title')}</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
          {t('profile.subtitle')}
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {/* Student Profile Info */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px', textAlign: 'left' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '600' }}>{t('profile.name_label')}</label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '14px' }} />
                <input 
                  type="text" 
                  className="glass-input" 
                  placeholder="Aryan Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{ width: '100%', paddingLeft: '42px' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '600' }}>{t('profile.goal_label')}</label>
              <div style={{ position: 'relative' }}>
                <Clock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '14px' }} />
                <input 
                  type="number" 
                  className="glass-input" 
                  min="1" 
                  max="18"
                  value={dailyGoalHours}
                  onChange={(e) => setDailyGoalHours(e.target.value)}
                  required
                  style={{ width: '100%', paddingLeft: '42px' }}
                />
              </div>
            </div>
          </div>

          {/* Exam Selection */}
          <div style={{ textAlign: 'left' }}>
            <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '600', display: 'block', marginBottom: '12px' }}>
              {t('profile.exam_label')}
            </label>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
              gap: '12px',
              maxHeight: '320px',
              overflowY: 'auto',
              paddingRight: '8px'
            }}>
              {TARGET_EXAMS.map((examId) => {
                const isSelected = selectedExam === examId;
                return (
                  <div 
                    key={examId}
                    onClick={() => setSelectedExam(examId)}
                    style={{
                      padding: '16px',
                      borderRadius: '12px',
                      background: isSelected ? 'var(--color-primary-glow)' : 'var(--bg-surface)',
                      border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--border-color)',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px'
                    }}
                  >
                    <div style={{
                      marginTop: '2px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      border: '2px solid',
                      borderColor: isSelected ? 'var(--color-primary)' : 'var(--text-muted)',
                      background: isSelected ? 'var(--color-primary)' : 'transparent',
                    }}>
                      {isSelected && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fff' }}></div>}
                    </div>

                    <div>
                      <div style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                        {t(`profile.exams.${examId}.name`)}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        {t(`profile.exams.${examId}.desc`)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={!selectedExam}
            style={{ 
              width: '100%', 
              padding: '14px', 
              fontSize: '1rem', 
              marginTop: '12px',
              opacity: selectedExam ? 1 : 0.6,
              cursor: selectedExam ? 'pointer' : 'not-allowed'
            }}
          >
            {t('profile.continue_btn')}
            <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}

