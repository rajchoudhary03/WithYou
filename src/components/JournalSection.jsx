import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BookOpen, Mic, MicOff, Brain, Sparkles, CheckCircle2, RefreshCw } from 'lucide-react';

export default function JournalSection({ onJournalAnalyzed, currentLogs }) {
  const { t } = useTranslation();
  const [journalText, setJournalText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordingIntervalId, setRecordingIntervalId] = useState(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  const startVoiceRecording = () => {
    setIsRecording(true);
    setRecordingDuration(0);
    const interval = setInterval(() => {
      setRecordingDuration(prev => prev + 1);
    }, 1000);
    setRecordingIntervalId(interval);
  };

  const stopVoiceRecording = () => {
    clearInterval(recordingIntervalId);
    setIsRecording(false);
    setIsTranscribing(true);

    // Simulate speech-to-text in the selected language
    setTimeout(() => {
      setIsTranscribing(false);
      const mockTranscripts = [
        t('ai.journal.transcript_0'),
        t('ai.journal.transcript_1'),
        t('ai.journal.transcript_2')
      ];
      const randomText = mockTranscripts[Math.floor(Math.random() * mockTranscripts.length)];
      setJournalText(prev => prev ? prev + "\n" + randomText : randomText);
    }, 1500);
  };

  const analyzeWithGemini = () => {
    if (!journalText.trim()) return;
    setAnalyzing(true);
    setAnalysisResult(null);

    setTimeout(() => {
      setAnalyzing(false);
      
      // Calculate semantic insights and translate on demand
      const lowerText = journalText.toLowerCase();
      let burnoutKey = "low";
      let emotionKey = "calm";
      let anxietyKey = "low";
      let stressTriggersKeys = ["mock"];
      let confidenceKey = "stable";

      // Detect stress markers matching both English and regional words
      const highStressWords = ["overwhelmed", "crash", "exhausted", "tired", "परेशान", "थका", "ক্লান্ত", "சோர்வாக", "అలసట", "ದಣಿವು", "ക്ഷീണം", "ਥੱਕਿਆ"];
      const modStressWords = ["stressed", "pressure", "awake", "तनाव", "চাপ", "அழுத்தம்", "ఒత్తిడి", "ಒತ್ತಡ", "സമ്മർദ്ദം", "ਤਣਾਅ"];

      const matchesHigh = highStressWords.some(w => lowerText.includes(w));
      const matchesMod = modStressWords.some(w => lowerText.includes(w));

      if (matchesHigh) {
        burnoutKey = "high";
        emotionKey = "exhausted";
        anxietyKey = "high";
        stressTriggersKeys.push("sleep", "ratio");
        confidenceKey = "critical";
      } else if (matchesMod) {
        burnoutKey = "moderate";
        emotionKey = "anxious";
        anxietyKey = "moderate";
        stressTriggersKeys.push("expect", "syllabus");
        confidenceKey = "fluctuate";
      }

      const results = {
        burnoutKey,
        emotionKey,
        anxietyKey,
        stressTriggersKeys,
        confidenceKey
      };

      setAnalysisResult(results);
      onJournalAnalyzed(results, journalText);
    }, 2000);
  };

  const formatDuration = (sec) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="glass-panel hero-gradient" style={{ padding: '24px', textAlign: 'left' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
          <BookOpen size={24} color="var(--color-primary)" /> {t('journal.title')}
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          {t('journal.subtitle')}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Input Panel */}
        <div className="glass-panel" style={{ padding: '24px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h4 style={{ color: 'var(--text-primary)', fontSize: '1.1rem' }}>{t('journal.write_record')}</h4>
          
          <div style={{ position: 'relative' }}>
            <textarea
              className="glass-input"
              rows="8"
              placeholder={t('journal.placeholder')}
              value={journalText}
              onChange={(e) => setJournalText(e.target.value)}
              style={{ width: '100%', resize: 'none', fontSize: '0.95rem' }}
            />
          </div>

          {/* Voice Journal Controls */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-elevated)',
            padding: '16px',
            borderRadius: '12px',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {isRecording ? (
                <button
                  type="button"
                  className="btn"
                  onClick={stopVoiceRecording}
                  style={{
                    background: 'var(--color-danger)',
                    color: '#fff',
                    borderRadius: '50%',
                    width: '48px',
                    height: '48px',
                    padding: 0
                  }}
                >
                  <MicOff size={20} />
                </button>
              ) : (
                <button
                  type="button"
                  className="btn"
                  onClick={startVoiceRecording}
                  disabled={isTranscribing}
                  style={{
                    background: 'var(--color-primary)',
                    color: '#fff',
                    borderRadius: '50%',
                    width: '48px',
                    height: '48px',
                    padding: 0
                  }}
                >
                  <Mic size={20} />
                </button>
              )}

              <div>
                <div style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  {isRecording ? t('journal.recording') : isTranscribing ? t('journal.transcribing') : t('journal.voice_journaling')}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {isRecording ? `${t('journal.recording').split(' ')[0]}: ${formatDuration(recordingDuration)}` : t('journal.speak_freely')}
                </div>
              </div>
            </div>

            {isRecording && (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span className="wave-bar"></span>
                <span className="wave-bar"></span>
                <span className="wave-bar"></span>
                <span className="wave-bar"></span>
                <span className="wave-bar"></span>
              </div>
            )}

            {isTranscribing && (
              <RefreshCw size={20} className="pulse-animation" style={{ color: 'var(--color-calm)' }} />
            )}
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={analyzeWithGemini}
            disabled={analyzing || !journalText.trim()}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {analyzing ? (
              <>
                <RefreshCw size={18} className="pulse-animation" />
                {t('journal.running_analysis')}
              </>
            ) : (
              <>
                <Brain size={18} />
                {t('journal.run_analysis')}
              </>
            )}
          </button>
        </div>

        {/* AI Analysis Panel */}
        <div className="glass-panel" style={{ padding: '24px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h4 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="var(--color-warning)" /> {t('journal.ai_results')}
          </h4>

          {analyzing && (
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              color: 'var(--text-secondary)'
            }}>
              <div className="flex-center" style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'var(--color-primary-glow)',
                border: '1px dashed var(--color-primary)'
              }}>
                <RefreshCw size={32} color="var(--color-primary)" className="pulse-animation" />
              </div>
              <p style={{ fontSize: '0.9rem', textAlign: 'center' }}>
                Scanning semantic journals...<br />
                Applying anxiety risk maps...
              </p>
            </div>
          )}

          {!analyzing && !analysisResult && (
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
              textAlign: 'center',
              padding: '40px 20px',
              background: 'var(--bg-elevated)',
              borderRadius: '12px',
              border: '1px dashed var(--border-color)'
            }}>
              <Brain size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
              <p style={{ fontSize: '0.9rem' }}>
                {t('journal.no_analysis')}
              </p>
            </div>
          )}

          {!analyzing && analysisResult && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                padding: '16px',
                borderRadius: '12px',
                background: analysisResult.burnoutKey === 'high' ? 'var(--color-danger-glow)' : 'var(--color-primary-glow)',
                border: '1px solid',
                borderColor: analysisResult.burnoutKey === 'high' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(99, 102, 241, 0.3)'
              }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '700' }}>
                  {t('journal.burnout_level')}
                </div>
                <div style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: '800', 
                  color: analysisResult.burnoutKey === 'high' ? 'var(--color-danger)' : analysisResult.burnoutKey === 'moderate' ? 'var(--color-warning)' : 'var(--color-success)',
                  marginTop: '4px'
                }}>
                  {t(`ai.journal.burnout_${analysisResult.burnoutKey}`)}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ background: 'var(--bg-elevated)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('journal.detected_emotion')}</div>
                  <div style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '0.95rem', marginTop: '2px' }}>{t(`ai.journal.emotion_${analysisResult.emotionKey}`)}</div>
                </div>

                <div style={{ background: 'var(--bg-elevated)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('journal.anxiety_spectrum')}</div>
                  <div style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '0.95rem', marginTop: '2px' }}>{t(`ai.journal.anxiety_${analysisResult.anxietyKey}`)}</div>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '8px' }}>
                  {t('journal.stress_triggers')}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {analysisResult.stressTriggersKeys.map((key) => (
                    <span 
                      key={key} 
                      className="badge" 
                      style={{ 
                        background: 'rgba(245, 158, 11, 0.1)', 
                        color: 'var(--color-warning)',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                        textTransform: 'none'
                      }}
                    >
                      {t(`ai.journal.trigger_${key}`)}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '4px' }}>
                  {t('journal.confidence_profile')}
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{t(`ai.journal.confidence_${analysisResult.confidenceKey}`)}</p>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.8rem',
                color: 'var(--color-success)',
                background: 'rgba(16, 185, 129, 0.05)',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                marginTop: '12px'
              }}>
                <CheckCircle2 size={16} />
                <span>{t('journal.coach_directives')}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

