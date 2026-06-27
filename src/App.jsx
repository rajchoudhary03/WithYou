import React, { useState, useEffect, createContext, useContext } from 'react';
import AuthView from './components/AuthView';
import ProfileSetup from './components/ProfileSetup';
import InitialAssessment from './components/InitialAssessment';
import Dashboard from './components/Dashboard';
import LanguageSelector from './components/LanguageSelector';

// ── Theme Context ──────────────────────────────────────────────
export const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {}
});

export const useTheme = () => useContext(ThemeContext);

// ── App Component ──────────────────────────────────────────────
function App() {
  const [step, setStep] = useState('auth');
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [baselineMetrics, setBaselineMetrics] = useState(null);
  const [recentAnalysis, setRecentAnalysis] = useState(null);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('withyou-theme') || 'light';
  });

  // Apply theme to <html> on mount and change
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('withyou-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setStep('profile');
  };

  const handleProfileComplete = (profileData) => {
    setProfile(profileData);
    setStep('assessment');
  };

  const handleAssessmentComplete = (assessmentData) => {
    setBaselineMetrics(assessmentData);
    setStep('dashboard');
  };

  const handleJournalAnalyzed = (analysisResult, journalText) => {
    setRecentAnalysis(analysisResult);
    setBaselineMetrics((prev) => {
      if (!prev) return prev;
      let updatedStress = prev.stressLevel;
      let updatedMood = prev.moodToday;
      if (analysisResult.burnoutKey === 'high') {
        updatedStress = Math.min(updatedStress + 2, 10);
        updatedMood = 'Exhausted';
      } else if (analysisResult.burnoutKey === 'moderate') {
        updatedStress = Math.min(updatedStress + 1, 9);
        updatedMood = 'Anxious';
      } else {
        updatedStress = Math.max(updatedStress - 1, 2);
        updatedMood = 'Focused';
      }
      return { ...prev, stressLevel: updatedStress, moodToday: updatedMood };
    });
  };

  const handleLogout = () => {
    setStep('auth');
    setUser(null);
    setProfile(null);
    setBaselineMetrics(null);
    setRecentAnalysis(null);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className="app-container">
        {/* Global Language Selector — top right */}
        <LanguageSelector />

        {step === 'auth' && (
          <AuthView onLoginSuccess={handleLoginSuccess} />
        )}
        {step === 'profile' && (
          <ProfileSetup user={user} onProfileComplete={handleProfileComplete} />
        )}
        {step === 'assessment' && (
          <InitialAssessment profile={profile} onAssessmentComplete={handleAssessmentComplete} />
        )}
        {step === 'dashboard' && (
          <Dashboard
            profile={profile}
            baselineMetrics={baselineMetrics}
            recentAnalysis={recentAnalysis}
            onJournalAnalyzed={handleJournalAnalyzed}
            onLogout={handleLogout}
          />
        )}
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
