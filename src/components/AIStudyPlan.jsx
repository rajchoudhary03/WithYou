import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, Smile, ShieldAlert } from 'lucide-react';

export default function AIStudyPlan({ profile, baselineMetrics, recentAnalysis }) {
  const { t } = useTranslation();
  const stress = recentAnalysis?.burnoutKey === 'high' ? 8 : (baselineMetrics?.stressLevel || 5);
  const exam = profile?.targetExam || 'JEE';
  const examName = t(`profile.exams.${exam}.name`);

  // Core schedules matching states
  const getScheduleBlocks = () => {
    if (stress >= 7) {
      // De-stress recovery schedule
      return [
        { time: '08:00 AM - 09:00 AM', type: 'health', name: t('study_plan.rec_0_name', 'Mindful Morning & Breathing'), desc: t('study_plan.rec_0_desc', 'Light stretching, healthy breakfast, and 5 minutes of box breathing. NO social media.') },
        { time: '09:00 AM - 10:30 AM', type: 'study', name: t('study_plan.rec_1_name', 'High Priority Revise (Concept Mapping)'), desc: t('study_plan.rec_1_desc', 'Revise key formula sheets or summaries for {{exam}}. Keep focus block limited to 90 mins.', { exam: examName }) },
        { time: '10:30 AM - 11:00 AM', type: 'break', name: t('study_plan.rec_2_name', 'Cognitive Recovery Break'), desc: t('study_plan.rec_2_desc', 'Step away from screen. Drink water, look out a window, and rest your eyes.') },
        { time: '11:00 AM - 12:30 PM', type: 'study', name: t('study_plan.rec_3_name', 'Active Problem Session (Low Stakes)'), desc: t('study_plan.rec_3_desc', 'Solve 10-15 easy to moderate questions. Avoid mock tests to keep confidence high.') },
        { time: '12:30 PM - 02:00 PM', type: 'health', name: t('study_plan.rec_4_name', 'Restorative Lunch & Power Nap'), desc: t('study_plan.rec_4_desc', 'Balanced lunch followed by a 20-30 min power nap to refresh cognitive capacity.') },
        { time: '02:00 PM - 03:30 PM', type: 'study', name: t('study_plan.rec_5_name', 'Interactive Learning / Video Lectures'), desc: t('study_plan.rec_5_desc', 'Passive absorption: watch standard explanation videos. Less strain than problem-solving.') },
        { time: '03:30 PM - 04:30 PM', type: 'break', name: t('study_plan.rec_6_name', 'SafeCircle Chat / Family Time'), desc: t('study_plan.rec_6_desc', 'Talk to Mom, Dad, or a Mentor. Share how your prep is going to release tension.') },
        { time: '04:30 PM - 06:00 PM', type: 'study', name: t('study_plan.rec_7_name', 'Light Summary Notes Writing'), desc: t('study_plan.rec_7_desc', 'Write flashcards or summarize today\'s learnings. Keep study materials minimal.') },
        { time: '06:00 PM onwards', type: 'health', name: t('study_plan.rec_8_name', 'Full Preparation Shutdown & Sleep Alignment'), desc: t('study_plan.rec_8_desc', 'Zero studying. Light reading, sports, or family interaction. Aim for 8 hours sleep.') }
      ];
    } else {
      // Standard optimized peak performance schedule
      return [
        { time: '07:30 AM - 08:30 AM', type: 'health', name: t('study_plan.norm_0_name', 'Morning Routine & Daily Goal Alignment'), desc: t('study_plan.norm_0_desc', 'Set today\'s sub-goals. Align syllabus expectations.') },
        { time: '08:30 AM - 11:00 AM', type: 'study', name: t('study_plan.norm_1_name', 'Deep Focus Block'), desc: t('study_plan.norm_1_desc', 'Master difficult and complex areas of the {{exam}} syllabus. High brain power period.', { exam: examName }) },
        { time: '11:00 AM - 11:30 AM', type: 'break', name: t('study_plan.norm_2_name', 'Active Recovery Break'), desc: t('study_plan.norm_2_desc', 'Light stretch, snack, walk.') },
        { time: '11:30 AM - 01:30 PM', type: 'study', name: t('study_plan.norm_3_name', 'Practice & Review Sprint'), desc: t('study_plan.norm_3_desc', 'Solve MCQ banks under mock conditions. Track error rates.') },
        { time: '01:30 PM - 02:30 PM', type: 'health', name: t('study_plan.norm_4_name', 'Lunch & Relax'), desc: t('study_plan.norm_4_desc', 'Unplug and eat a nutritious meal.') },
        { time: '02:30 PM - 04:30 PM', type: 'study', name: t('study_plan.norm_5_name', 'Sub-Subject / Secondary Concept Work'), desc: t('study_plan.norm_5_desc', 'Read textbooks, revise lecture notes, solve conceptual doubts.') },
        { time: '04:30 PM - 05:00 PM', type: 'break', name: t('study_plan.norm_6_name', 'Short Mindful Break'), desc: t('study_plan.norm_6_desc', '5-minute Box Breathing to discharge stress.') },
        { time: '05:00 PM - 07:00 PM', type: 'study', name: t('study_plan.norm_7_name', 'Active Recall & Spaced Revision'), desc: t('study_plan.norm_7_desc', 'Use flashcards or explain concepts aloud. Check memory retention.') },
        { time: '07:00 PM - 08:00 PM', type: 'break', name: t('study_plan.norm_8_name', 'Exercise / Outdoor Sports'), desc: t('study_plan.norm_8_desc', 'Run, gym, or sports to trigger endorphins and lower cortisol levels.') }
      ];
    }
  };

  const blocks = getScheduleBlocks();

  const getTypeStyles = (type) => {
    switch (type) {
      case 'study':
        return { bg: 'rgba(99, 102, 241, 0.05)', color: 'var(--color-primary)', label: t('study_plan.block_types.study') };
      case 'break':
        return { bg: 'rgba(16, 185, 129, 0.05)', color: 'var(--color-success)', label: t('study_plan.block_types.break') };
      case 'health':
        return { bg: 'rgba(6, 182, 212, 0.05)', color: 'var(--color-calm)', label: t('study_plan.block_types.health') };
      default:
        return { bg: 'rgba(255,255,255,0.02)', color: 'var(--text-primary)', label: 'Schedule' };
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '28px', textAlign: 'left' }}>
      
      {/* Dynamic Banner based on Stress */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px',
        borderRadius: '12px',
        background: stress >= 7 ? 'var(--color-danger-glow)' : 'var(--color-primary-glow)',
        border: '1px solid',
        borderColor: stress >= 7 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(99, 102, 241, 0.2)',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {stress >= 7 ? (
            <ShieldAlert size={24} color="var(--color-danger)" />
          ) : (
            <Smile size={24} color="var(--color-success)" />
          )}
          <div>
            <div style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '1rem' }}>
              {stress >= 7 ? t('study_plan.warning_active') : t('study_plan.normal_active')}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              {stress >= 7 ? t('study_plan.warning_sub') : t('study_plan.normal_sub', { exam: examName })}
            </div>
          </div>
        </div>
      </div>

      <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
        <Calendar size={24} color="var(--color-primary)" /> {t('study_plan.title')}
      </h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>
        {t('study_plan.subtitle')}
      </p>

      {/* Timeline Blocks */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {blocks.map((b, index) => {
          const styles = getTypeStyles(b.type);
          return (
            <div
              key={index}
              style={{
                display: 'grid',
                gridTemplateColumns: '180px 1fr',
                padding: '16px 20px',
                borderRadius: '12px',
                background: styles.bg,
                border: '1px solid var(--border-color)',
                borderLeft: '4px solid',
                borderLeftColor: styles.color,
                transition: 'all var(--transition-fast)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', fontWeight: '600', fontSize: '0.9rem' }}>
                <Clock size={16} style={{ color: styles.color }} />
                {b.time}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <h4 style={{ color: 'var(--text-primary)', fontSize: '1.05rem', fontWeight: '700' }}>{b.name}</h4>
                  <span className="badge" style={{
                    fontSize: '0.7rem',
                    background: 'var(--bg-elevated)',
                    color: styles.color,
                    border: '1px solid var(--border-color)',
                    textTransform: 'none'
                  }}>{styles.label}</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {b.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

