import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../App';
import {
  Home, BookOpen, Brain, Calendar, BarChart2, MessageSquare, Heart,
  LogOut, FileText, ChevronRight, Activity, Moon, ShieldCheck, Sun,
  Sunrise, Settings2, Sparkles, Clock, Target
} from 'lucide-react';

import JournalSection from './JournalSection';
import AICoach from './AICoach';
import AIStudyPlan from './AIStudyPlan';
import ProgressAnalytics from './ProgressAnalytics';
import WithYouAIChat from './WithYouAIChat';
import SafeCircle from './SafeCircle';
import RiskDetector from './RiskDetector';
import WellnessReport from './WellnessReport';
import MorningRoutine from './MorningRoutine';
import Settings from './Settings';

function MetricCard({ label, value, helper, icon, color, progress }) {
  return (
    <div className="glass-panel metric-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'flex-start' }}>
        <div>
          <div className="metric-label">{label}</div>
          <div className="metric-value" style={{ marginTop: '8px' }}>{value}</div>
        </div>
        <div className="icon-circle" style={{ width: 42, height: 42, background: `${color}18`, color }}>
          {icon}
        </div>
      </div>
      <div className="progress-track" aria-hidden="true">
        <div className="progress-fill" style={{ '--target-width': `${progress}%`, background: color }} />
      </div>
      <div className="metric-sub">{helper}</div>
    </div>
  );
}

function EnergyWidget({ value, onChange }) {
  const levels = [
    { id: 'low', label: 'Low' },
    { id: 'medium', label: 'Medium' },
    { id: 'high', label: 'High' },
  ];

  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      {levels.map((level) => (
        <button
          key={level.id}
          type="button"
          className={`energy-btn ${value === level.id ? 'selected' : ''}`}
          onClick={() => onChange(level.id)}
        >
          {level.label}
        </button>
      ))}
    </div>
  );
}

export default function Dashboard({ profile, baselineMetrics, recentAnalysis, onJournalAnalyzed, onLogout }) {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('home');
  const [showReport, setShowReport] = useState(false);
  const [energyLevel, setEnergyLevel] = useState('medium');

  const navigationItems = [
    { id: 'home', label: t('dashboard.nav.home', 'Dashboard'), icon: <Home size={18} /> },
    { id: 'morning', label: t('dashboard.nav.morning', 'Morning'), icon: <Sunrise size={18} /> },
    { id: 'journal', label: t('dashboard.nav.journal', 'Journal'), icon: <BookOpen size={18} /> },
    { id: 'coach', label: t('dashboard.nav.coach', 'AI Coach'), icon: <Brain size={18} /> },
    { id: 'study-plan', label: t('dashboard.nav.study_plan', 'Study Plan'), icon: <Calendar size={18} /> },
    { id: 'analytics', label: t('dashboard.nav.analytics', 'Analytics'), icon: <BarChart2 size={18} /> },
    { id: 'chat', label: t('dashboard.nav.chat', 'Chat'), icon: <MessageSquare size={18} /> },
    { id: 'safe-circle', label: t('dashboard.nav.safe_circle', 'SafeCircle'), icon: <Heart size={18} /> },
    { id: 'settings', label: t('settings.title', 'Settings'), icon: <Settings2 size={18} /> },
  ];

  const stress = recentAnalysis?.burnoutKey === 'high' ? 8 : (baselineMetrics?.stressLevel || 5);
  const sleep = baselineMetrics?.sleepHours || 7;
  const study = baselineMetrics?.studyHours || 6;
  const confidence = baselineMetrics?.confidenceScore || 7;
  const mood = baselineMetrics?.moodToday || 'Neutral';
  const dailyGoal = profile?.dailyGoalHours || 8;

  const motivationScore = Math.min(Math.max(confidence + (stress <= 4 ? 1 : stress >= 7 ? -2 : 0), 1), 10);
  const wellnessScore = Math.round(((10 - stress) + motivationScore + Math.min(sleep, 9)) / 2.8);
  const examName = t(`profile.exams.${profile?.targetExam || 'OTHER'}.name`, profile?.targetExam || 'Exam');

  const renderHome = () => (
    <div className="page-transition" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <section className="welcome-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '18px', flexWrap: 'wrap' }}>
          <div style={{ maxWidth: 640 }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 700, marginBottom: 8 }}>
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
            </div>
            <h1 style={{ margin: 0, color: 'var(--text-primary)', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', lineHeight: 1.12 }}>
              Hi {profile?.name || profile?.displayName || 'Student'}, how are you feeling today?
            </h1>
            <p style={{ margin: '12px 0 0', color: 'var(--text-secondary)', maxWidth: 560 }}>
              Keep your study plan and mental wellness in one simple place while preparing for {examName}.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <span className="badge badge-primary">{examName}</span>
            <span className={stress >= 7 ? 'badge badge-danger' : 'badge badge-success'}>
              Stress {stress}/10
            </span>
            <span className="badge badge-calm">Wellness {wellnessScore}/10</span>
          </div>
        </div>
      </section>

      <section className="dashboard-grid">
        <MetricCard
          label={t('dashboard.mood_today', 'Mood today')}
          value={t(`assessment.moods.${mood}`, mood)}
          helper="Update from the journal anytime."
          icon={<Sparkles size={21} />}
          color="var(--color-primary)"
          progress={motivationScore * 10}
        />
        <MetricCard
          label={t('dashboard.stress_score', 'Stress score')}
          value={`${stress}/10`}
          helper={stress >= 7 ? 'High stress. Take a short reset.' : 'Manageable for today.'}
          icon={<Activity size={21} />}
          color={stress >= 7 ? 'var(--color-danger)' : 'var(--color-success)'}
          progress={stress * 10}
        />
        <MetricCard
          label="Wellness score"
          value={`${wellnessScore}/10`}
          helper={wellnessScore >= 7 ? 'You are on a steady path.' : 'A softer routine may help.'}
          icon={<ShieldCheck size={21} />}
          color="var(--color-calm)"
          progress={wellnessScore * 10}
        />
        <MetricCard
          label={t('dashboard.sleep_quality', 'Sleep')}
          value={`${sleep}h`}
          helper={sleep < 6 ? 'Try protecting sleep tonight.' : 'Good recovery window.'}
          icon={<Moon size={21} />}
          color="var(--color-lavender)"
          progress={Math.min((sleep / 9) * 100, 100)}
        />
        <MetricCard
          label={t('dashboard.study_progress', 'Study progress')}
          value={`${study}h`}
          helper={`${Math.round((study / dailyGoal) * 100)}% of your ${dailyGoal}h goal.`}
          icon={<Clock size={21} />}
          color="var(--color-success)"
          progress={Math.min((study / dailyGoal) * 100, 100)}
        />
        <MetricCard
          label={t('dashboard.motivation_score', 'Motivation')}
          value={`${motivationScore}/10`}
          helper={motivationScore >= 7 ? 'Good focus available.' : 'Start with one small task.'}
          icon={<Target size={21} />}
          color="var(--color-warning)"
          progress={motivationScore * 10}
        />
      </section>

      <section className="home-lower-grid">
        <RiskDetector
          baselineMetrics={baselineMetrics}
          recentAnalysis={recentAnalysis}
          onNavigateToSafeCircle={() => setActiveTab('safe-circle')}
        />

        <div className="glass-panel" style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.15rem' }}>{t('dashboard.quick_actions', 'Quick actions')}</h2>
            <p style={{ margin: '6px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Pick one helpful next step.
            </p>
          </div>

          <EnergyWidget value={energyLevel} onChange={setEnergyLevel} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { tab: 'morning', icon: <Sunrise size={16} />, label: 'Start morning routine' },
              { tab: 'journal', icon: <BookOpen size={16} />, label: t('dashboard.shortcuts.journal', 'Write journal') },
              { tab: 'coach', icon: <Brain size={16} />, label: t('dashboard.shortcuts.breathing', 'Get coaching') },
              { tab: 'chat', icon: <MessageSquare size={16} />, label: t('dashboard.shortcuts.vent', 'Talk to AI') },
              { tab: 'safe-circle', icon: <Heart size={16} />, label: t('dashboard.shortcuts.family', 'Contact support') },
            ].map((item) => (
              <button
                key={item.tab}
                type="button"
                className="btn btn-secondary"
                onClick={() => setActiveTab(item.tab)}
                style={{ width: '100%', justifyContent: 'space-between' }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{item.icon}{item.label}</span>
                <ChevronRight size={15} />
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 8px' }}>
          <div className="icon-circle" style={{ width: 40, height: 40, background: 'var(--color-primary)', color: '#fff' }}>
            <Sparkles size={20} />
          </div>
          <div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, lineHeight: 1 }}>WithYou</div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700 }}>AI Wellness</div>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
          {navigationItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            >
              <span>{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button type="button" onClick={toggleTheme} className="nav-item">
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            <span className="nav-label">{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
          </button>
          <button type="button" className="nav-item" onClick={() => setShowReport(true)}>
            <FileText size={16} />
            <span className="nav-label">{t('dashboard.wellness_report', 'Wellness report')}</span>
          </button>
          <button type="button" className="nav-item" onClick={onLogout} style={{ color: 'var(--color-danger)' }}>
            <LogOut size={16} />
            <span className="nav-label">{t('dashboard.sign_out', 'Sign out')}</span>
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        {activeTab === 'home' && renderHome()}
        {activeTab === 'morning' && <MorningRoutine profile={profile} baselineMetrics={baselineMetrics} energyLevel={energyLevel} />}
        {activeTab === 'journal' && <JournalSection currentLogs={baselineMetrics} onJournalAnalyzed={onJournalAnalyzed} />}
        {activeTab === 'coach' && <AICoach profile={profile} baselineMetrics={baselineMetrics} recentAnalysis={recentAnalysis} />}
        {activeTab === 'study-plan' && <AIStudyPlan profile={profile} baselineMetrics={baselineMetrics} recentAnalysis={recentAnalysis} />}
        {activeTab === 'analytics' && <ProgressAnalytics baselineMetrics={baselineMetrics} currentLogs={null} />}
        {activeTab === 'chat' && <WithYouAIChat profile={profile} baselineMetrics={baselineMetrics} recentAnalysis={recentAnalysis} />}
        {activeTab === 'safe-circle' && <SafeCircle profile={profile} baselineMetrics={baselineMetrics} recentAnalysis={recentAnalysis} />}
        {activeTab === 'settings' && <Settings profile={profile} onLogout={onLogout} />}
      </main>

      {showReport && (
        <WellnessReport
          profile={profile}
          baselineMetrics={baselineMetrics}
          recentAnalysis={recentAnalysis}
          onClose={() => setShowReport(false)}
        />
      )}
    </div>
  );
}

