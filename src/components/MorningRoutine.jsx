import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Sun, Wind, Activity, Brain, Salad, Droplets, Smartphone,
  Heart, Music, BookOpen, Zap, Clock, ChevronDown, ChevronUp,
  Sparkles, RefreshCw, CheckCircle2
} from 'lucide-react';

// ── Motivational quotes pool ─────────────────────────────────
const MORNING_QUOTES = [
  { text: "Every morning we are born again. What we do today matters most.", author: "Buddha" },
  { text: "Rise up, start fresh see the bright opportunity in each new day.", author: "Unknown" },
  { text: "The morning was full of sunlight and hope.", author: "Kate Chopin" },
  { text: "An hour of morning is worth two in the evening.", author: "Benjamin Franklin" },
  { text: "With the new day comes new strength and new thoughts.", author: "Eleanor Roosevelt" },
  { text: "Morning is an important time of day, because how you spend your morning can often tell you what kind of day you are going to have.", author: "Lemony Snicket" },
  { text: "Start each day with a grateful heart.", author: "Unknown" },
];

// ── Adaptive routine generation ──────────────────────────────
function generateRoutine(stress, sleep, mood, exam, energy) {
  const isHighStress  = stress >= 7;
  const isPoorSleep   = sleep <= 5;
  const isLowEnergy   = energy === 'low';
  const isHighEnergy  = energy === 'high';

  // Wake up time adapts to sleep quality
  const baseWake = isPoorSleep ? '7:00 AM' : '6:30 AM';
  const baseMin  = isPoorSleep ? 7 * 60 : 6 * 60 + 30;

  const offset = (mins) => {
    const total = baseMin + mins;
    const h = Math.floor(total / 60);
    const m = total % 60;
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hr12 = h > 12 ? h - 12 : h;
    return `${hr12}:${m.toString().padStart(2, '0')} ${ampm}`;
  };

  return [
    {
      id: 'wake',
      time: offset(0),
      icon: '☀️',
      color: 'linear-gradient(135deg, #f59e0b, #d97706)',
      title: 'Wake Up & Hydrate',
      activities: [
        '💧 Drink one full glass of water immediately',
        isHighStress
          ? '📵 No phone or social media for the first 30 minutes'
          : '📵 Avoid checking phone for the first 15 minutes',
        isPoorSleep ? '🌬️ Open windows — let in fresh air & natural light' : '🌅 Step outside for 2 minutes of sunlight',
      ],
      duration: '5 min',
      tip: isPoorSleep
        ? 'Poor sleep detected — gentle start is key. Avoid stimulants for 90 min after waking.'
        : 'Hydration kick-starts your metabolism and brain function.',
      stressAdapted: isHighStress || isPoorSleep,
    },
    {
      id: 'mindfulness',
      time: offset(10),
      icon: '🧘',
      color: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
      title: isHighStress ? 'Deep Mindfulness Practice' : 'Mindfulness (Quick)',
      activities: isHighStress
        ? [
            '🌬️ 4-7-8 Breathing: Inhale 4s, hold 7s, exhale 8s — repeat 5 times',
            '🙏 Gratitude practice: Write 3 specific things you\'re grateful for',
            '💬 Affirmations: "I am calm. I am capable. Today I will grow."',
            '🔇 2 minutes of complete silence — just observe your breath',
          ]
        : [
            '🌬️ Box Breathing: 4s in, 4s hold, 4s out — 3 rounds',
            '🙏 Name ONE thing you\'re grateful for this morning',
            '💬 One positive affirmation for today',
          ],
      duration: isHighStress ? '10 min' : '5 min',
      tip: isHighStress
        ? 'High stress detected — extended breathing will activate your parasympathetic nervous system.'
        : 'Short mindfulness sessions are just as effective when done consistently.',
      stressAdapted: isHighStress,
    },
    {
      id: 'body',
      time: offset(isHighStress ? 25 : 20),
      icon: '🏃',
      color: 'linear-gradient(135deg, #10b981, #059669)',
      title: isLowEnergy || isHighStress ? 'Gentle Body Activation' : 'Body Activation',
      activities: isLowEnergy || isHighStress
        ? [
            '🤸 Neck rolls — 5 circles each direction',
            '💪 Shoulder shrugs & chest opener stretch',
            '🦵 Standing quad & hamstring stretch',
            '🧘 Child\'s pose — 30 seconds',
            '🦶 Ankle circles — seated',
          ]
        : isHighEnergy
        ? [
            '⚡ Jumping jacks — 30 reps',
            '🏃 Brisk jog in place — 2 minutes',
            '💪 Push-ups — 10 reps',
            '🤸 Full-body stretch sequence',
            '🦵 Lunges — 10 each leg',
          ]
        : [
            '🤸 Full-body stretching — 5 min',
            '🏃 Light jog in place or brisk walk',
            '💪 Shoulder & back mobility exercises',
            '🧘 Light yoga — sun salutation sequence',
          ],
      duration: isLowEnergy ? '10 min' : '15 min',
      tip: isLowEnergy
        ? 'Low energy today — gentle movement is better than none. It will naturally boost your energy.'
        : 'Morning movement increases BDNF — a brain protein that enhances learning.',
      stressAdapted: isLowEnergy || isHighStress || isHighEnergy,
    },
    {
      id: 'brain',
      time: offset(isHighStress ? 40 : 40),
      icon: '🧠',
      color: 'linear-gradient(135deg, #38bdf8, #0ea5e9)',
      title: 'Brain Warm-Up',
      activities: exam === 'JEE' || exam === 'NEET' || exam === 'GATE'
        ? [
            '📐 Solve 3 mental math problems (no calculator)',
            '🔢 Number pattern challenge',
            '📝 Recall: Write 5 formulas from memory',
            '💡 Read one motivational quote & reflect on it',
          ]
        : exam === 'UPSC' || exam === 'IAS'
        ? [
            '📰 Read 1 newspaper headline & summarize in 2 sentences',
            '🗺️ Recall yesterday\'s key study points',
            '🎯 Set today\'s 3 most important study goals',
            '💡 Vocabulary: Learn 2 new words',
          ]
        : [
            '🧩 Quick puzzle or brain teaser (5 min)',
            '📝 Write down 3 goals for today',
            '🔁 Spaced repetition: Review yesterday\'s material',
            '💡 Read one motivational quote & reflect',
          ],
      duration: '10 min',
      tip: `Tailored for ${exam || 'your exam'} — cognitive warm-up primes your prefrontal cortex for deep study.`,
      stressAdapted: false,
    },
    {
      id: 'breakfast',
      time: offset(55),
      icon: '🥗',
      color: 'linear-gradient(135deg, #f59e0b, #ef4444)',
      title: 'Nourishing Breakfast',
      activities: isHighStress
        ? [
            '🫐 Berries (blueberries/strawberries) — rich in antioxidants for stress',
            '🥣 Oats with banana — steady energy, reduces cortisol',
            '🥜 Handful of walnuts or almonds — brain-boosting omega-3s',
            '🍵 Green tea or warm water with lemon — NOT coffee on an empty stomach',
          ]
        : isPoorSleep
        ? [
            '🥚 2 eggs — protein + choline for memory consolidation',
            '🍌 Banana — natural sugars + potassium for alertness',
            '🥛 Warm milk or yogurt — melatonin precursors for tonight',
            '🍞 Whole grain toast — complex carbs for sustained focus',
          ]
        : [
            '🥚 Protein-rich breakfast — eggs, paneer, or Greek yogurt',
            '🍇 Fresh fruits — natural sugars for quick brain energy',
            '🥜 Mixed nuts — healthy fats for sustained concentration',
            '💧 2 glasses of water before and after eating',
          ],
      duration: '20 min',
      tip: isHighStress
        ? 'Anti-stress foods detected — these choices actively reduce cortisol levels before your study session.'
        : 'Never skip breakfast before studying — your brain uses 20% of your body\'s energy.',
      stressAdapted: isHighStress || isPoorSleep,
    },
  ];
}

// ── Component ────────────────────────────────────────────────
export default function MorningRoutine({ profile, baselineMetrics, energyLevel }) {
  const { t } = useTranslation();
  const [routine, setRoutine] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [completedIds, setCompletedIds] = useState([]);
  const [quote, setQuote] = useState(MORNING_QUOTES[0]);
  const [isGenerating, setIsGenerating] = useState(false);

  const stress  = baselineMetrics?.stressLevel  ?? 5;
  const sleep   = baselineMetrics?.sleepHours   ?? 7;
  const mood    = baselineMetrics?.moodToday    ?? 'Okay';
  const exam    = profile?.examGoal             ?? 'General';
  const energy  = energyLevel                   ?? 'medium';

  useEffect(() => {
    // Pick quote of the day (deterministic by date)
    const dayIndex = new Date().getDate() % MORNING_QUOTES.length;
    setQuote(MORNING_QUOTES[dayIndex]);
    // Generate routine
    setRoutine(generateRoutine(stress, sleep, mood, exam, energy));
  }, [stress, sleep, mood, exam, energy]);

  const handleRegenerate = () => {
    setIsGenerating(true);
    setCompletedIds([]);
    setTimeout(() => {
      setRoutine(generateRoutine(stress, sleep, mood, exam, energy));
      setIsGenerating(false);
    }, 800);
  };

  const toggleComplete = (id) => {
    setCompletedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const completionPct = routine.length > 0 ? Math.round((completedIds.length / routine.length) * 100) : 0;

  return (
    <div className="page-transition" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 className="section-title">
            🌅 {t('morning.title', 'Morning Mind & Body Routine')}
          </h1>
          <p className="section-sub">
            {t('morning.subtitle', 'Your personalized daily wellness routine, adapted to your current state')}
          </p>
        </div>
        <button
          className="btn btn-secondary"
          onClick={handleRegenerate}
          disabled={isGenerating}
          style={{ gap: '6px' }}
        >
          <RefreshCw size={15} style={{ animation: isGenerating ? 'spin 0.8s linear infinite' : 'none' }} />
          {t('morning.regenerate', 'Regenerate')}
        </button>
      </div>

      {/* Quote Card */}
      <div className="quote-card">
        <p style={{ fontStyle: 'italic', fontSize: 'var(--font-size-base)', color: 'var(--text-primary)', fontWeight: 500, lineHeight: 1.6, paddingLeft: '8px', marginBottom: '8px' }}>
          {quote.text}
        </p>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>— {quote.author}</p>
      </div>

      {/* Adaptive Indicators */}
      {(stress >= 7 || sleep <= 5 || energyLevel === 'low') && (
        <div className="glass-panel" style={{ padding: '16px 20px', background: 'linear-gradient(135deg, rgba(251,191,36,0.08), rgba(248,113,113,0.05))', borderColor: 'rgba(251,191,36,0.25)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <Sparkles size={16} color="var(--color-warning)" />
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-warning)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              {t('morning.adaptedLabel', 'Routine Adapted for You')}
            </span>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {stress >= 7 && `⚡ High stress (${stress}/10) — extended mindfulness and gentle exercises selected. `}
            {sleep <= 5 && `😴 Low sleep (${sleep}h) — later wake time and restorative activities chosen. `}
            {energyLevel === 'low' && `🔋 Low energy — lighter physical activities to conserve reserves.`}
          </p>
        </div>
      )}

      {/* Progress Bar */}
      <div className="glass-panel" style={{ padding: '18px 22px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={14} color="var(--color-success)" />
            {t('morning.progress', 'Morning Progress')}
          </span>
          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: completionPct === 100 ? 'var(--color-success)' : 'var(--color-primary)' }}>
            {completedIds.length}/{routine.length} {t('morning.completed', 'completed')} · {completionPct}%
          </span>
        </div>
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{
              '--target-width': `${completionPct}%`,
              background: completionPct === 100
                ? 'linear-gradient(90deg, var(--color-success), var(--color-mint))'
                : 'linear-gradient(90deg, var(--color-primary), var(--color-calm))'
            }}
          />
        </div>
        {completionPct === 100 && (
          <p style={{ fontSize: '0.82rem', color: 'var(--color-success)', fontWeight: 600, marginTop: '8px', textAlign: 'center' }}>
            🎉 {t('morning.allDone', 'Amazing! You\'ve completed your morning routine! Your mind and body are ready.')}
          </p>
        )}
      </div>

      {/* Timeline */}
      <div className="routine-timeline">
        {routine.map((block, idx) => {
          const isCompleted = completedIds.includes(block.id);
          const isExpanded  = expandedId === block.id;

          return (
            <div key={block.id} className="routine-block" style={{ animationDelay: `${idx * 0.08}s` }}>
              {/* Dot */}
              <div
                className="routine-dot"
                style={{
                  background: isCompleted ? 'linear-gradient(135deg, var(--color-success), var(--color-mint))' : block.color,
                  opacity: isCompleted ? 0.75 : 1,
                  cursor: 'pointer'
                }}
                onClick={() => toggleComplete(block.id)}
                title="Click to mark as done"
              >
                {isCompleted ? <CheckCircle2 size={22} color="#fff" /> : block.icon}
              </div>

              {/* Content Card */}
              <div className="routine-content" style={{ opacity: isCompleted ? 0.7 : 1 }}>
                {/* Header Row */}
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', marginBottom: isExpanded ? '14px' : '0' }}
                  onClick={() => setExpandedId(isExpanded ? null : block.id)}
                >
                  <div style={{ display: 'flex', flex: 1, gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                          <Clock size={10} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '3px' }} />
                          {block.time}
                        </span>
                        {block.stressAdapted && (
                          <span className="badge badge-warning" style={{ fontSize: '0.62rem', padding: '2px 7px' }}>
                            <Sparkles size={9} /> Adapted
                          </span>
                        )}
                        {isCompleted && (
                          <span className="badge badge-success" style={{ fontSize: '0.62rem', padding: '2px 7px' }}>
                            ✓ Done
                          </span>
                        )}
                      </div>
                      <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                        {block.title}
                      </h3>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600, background: 'var(--bg-elevated)', padding: '3px 9px', borderRadius: '999px', border: '1px solid var(--border-color)' }}>
                      {block.duration}
                    </span>
                    {isExpanded ? <ChevronUp size={15} color="var(--text-muted)" /> : <ChevronDown size={15} color="var(--text-muted)" />}
                  </div>
                </div>

                {/* Expanded Activities */}
                {isExpanded && (
                  <div style={{ animation: 'fadeSlideIn 0.25s both' }}>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                      {block.activities.map((act, i) => (
                        <li key={i} style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)', display: 'flex', gap: '8px', lineHeight: 1.5, alignItems: 'flex-start' }}>
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>

                    {/* AI Tip */}
                    <div style={{ padding: '10px 14px', background: 'rgba(129,140,248,0.06)', borderRadius: '10px', borderLeft: '3px solid var(--color-primary)', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                      <Brain size={14} color="var(--color-primary)" style={{ marginTop: '2px', flexShrink: 0 }} />
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.6, fontWeight: 500, margin: 0 }}>
                        <strong style={{ color: 'var(--color-primary)' }}>AI Tip: </strong>{block.tip}
                      </p>
                    </div>

                    {/* Mark Done button */}
                    <button
                      onClick={() => toggleComplete(block.id)}
                      className={`btn ${isCompleted ? 'btn-secondary' : 'btn-success'}`}
                      style={{ marginTop: '12px', fontSize: '0.8rem', padding: '8px 16px' }}
                    >
                      <CheckCircle2 size={14} />
                      {isCompleted ? t('morning.markUndone', 'Mark as Undone') : t('morning.markDone', 'Mark as Done')}
                    </button>
                  </div>
                )}

                {/* Collapsed preview */}
                {!isExpanded && (
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '6px', lineHeight: 1.5 }}>
                    {block.activities[0]}
                    {block.activities.length > 1 && ` +${block.activities.length - 1} more activities`}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom summary */}
      <div className="glass-panel" style={{ padding: '20px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(52,211,153,0.05))' }}>
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          🕐 <strong style={{ color: 'var(--color-success)' }}>Total Routine Time: ~60 minutes</strong>
          {' '} · This morning investment boosts your productivity by up to <strong style={{ color: 'var(--color-primary)' }}>35%</strong> for the rest of the day.
        </p>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

