import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  MessageSquare, Send, Sparkles, Volume2, VolumeX,
  Heart, Phone, AlertTriangle, Shield, Mic, Wind,
  Moon, Sun, Salad, BookOpen, ChevronRight, X, Zap
} from 'lucide-react';

// ── Crisis keyword detection ────────────────────────────────
const CRISIS_PHRASES = [
  'want to die', 'want to kill myself', 'end my life', 'dont want to live',
  "don't want to live", 'kill myself', 'life is meaningless', 'no point living',
  'better off without me', 'everyone would be better', 'hurting myself',
  'self harm', 'suicide', 'suicidal', 'मरना चाहता', 'मर जाना', 'जीना नहीं',
  'खुद को नुकसान', 'मरना है', 'মরতে চাই', 'বাঁচতে চাই না', 'செத்துவிட',
  'ജീവൻ അവസാനിപ്പിക്കാൻ', 'నాకు చనిపోవాలని', 'ನನ್ನ ಜೀವ ತೆಗೆದುಕೊಳ್ಳಲು',
  'मला मरायचं', 'ਮਰਨਾ ਚਾਹੁੰਦਾ', 'મરી જવું'
];

// ── High-stress keywords ────────────────────────────────────
const HIGH_STRESS_PHRASES = [
  'overwhelmed', 'breaking down', 'can\'t take it', 'cant take it', 'panic attack',
  'having a panic', 'crying', 'hopeless', 'helpless', 'worthless', 'failure',
  'give up', 'giving up', 'drop out', 'quit', 'hate myself', 'terrible',
  'परेशान', 'टूट रहा', 'हार मान', 'बहुत तनाव', 'রোকতে পারছি না', 'ভেঙে পড়েছি',
  'விட்டுவிடலாம்', 'ছেড়ে দিচ্ছি', 'हार गया', 'थक गया हूं'
];

const STRESS_PHRASES = [
  'stressed', 'stress', 'pressure', 'anxious', 'anxiety', 'nervous', 'worried',
  'marks', 'scores', 'exam', 'test', 'results', 'rank', 'competition',
  'तनाव', 'चिंता', 'दबाव', 'परीक्षा', 'মানসিক চাপ', 'চিন্তিত', 'টেনশন',
  'மன அழுத்தம்', 'பயம்', 'ఒత్తిడి', 'ఆందోళన', 'ಒತ್ತಡ', 'ಆತಂಕ',
  'സമ്മർദ്ദം', 'ഉത്കണ്ഠ', 'तणाव', 'चिंता', 'ਤਣਾਅ', 'ਚਿੰਤਾ'
];

const TIRED_PHRASES = [
  'tired', 'exhausted', 'no sleep', 'can\'t sleep', 'sleepy', 'fatigue',
  'drained', 'no energy', 'burnt out', 'burnout', 'overworked',
  'थका', 'नींद नहीं', 'थकान', 'ক্লান্ত', 'ঘুমাতে পারছি না',
  'சோர்வு', 'தூக்கமில்லை', 'అలసట', 'నిద్ర', 'ದಣಿವು', 'ನಿದ್ದೆ',
  'ക്ഷീണം', 'ഉറക്കം', 'थकलो', 'झोप नाही', 'ਥੱਕਿਆ', 'ਨੀਂਦ'
];

const LONELY_PHRASES = [
  'alone', 'lonely', 'no one understands', 'nobody cares', 'isolated', 'no friends',
  'missing home', 'homesick', 'miss my family', 'feel empty',
  'अकेला', 'कोई नहीं', 'একা', 'কেউ বোঝে না', 'தனிமை', 'ఒంటరిగా', 'ಒಂಟಿ',
  'ഒറ്റയ്ക്ക്', 'एकटा', 'ਇਕੱਲਾ'
];

const STUDY_PHRASES = [
  'study', 'studying', 'revision', 'concentrate', 'focus', 'syllabus',
  'chapter', 'notes', 'distracted', 'procrastinating', 'motivation',
  'पढ़ाई', 'अध्ययन', 'পড়াশোনা', 'মনোযোগ', 'படிப்பு', 'చదువు', 'ಓದು', 'പഠനം'
];

const MOOD_GOOD_PHRASES = [
  'happy', 'great', 'good', 'amazing', 'wonderful', 'excited', 'motivated',
  'confident', 'proud', 'achieved', 'cleared', 'passed', 'scored well',
  'खुश', 'अच्छा', 'খুশি', 'ভালো', 'மகிழ்ச்சி', 'సంతోషంగా', 'ಖುಷಿ', 'സന്തോഷം'
];

// ── Suggestion chips config ─────────────────────────────────
const SUGGESTION_CHIPS = [
  { icon: '😔', text: "I'm feeling overwhelmed" },
  { icon: '😴', text: "I can't sleep well" },
  { icon: '📚', text: "Help me focus on studies" },
  { icon: '🌬️', text: "Guide me through breathing" },
  { icon: '💙', text: "I'm feeling lonely" },
  { icon: '🎉', text: "I achieved something today!" },
];

// ── Response engine ─────────────────────────────────────────
function buildResponse(text, profile, baselineMetrics, recentAnalysis) {
  const t = text.toLowerCase();
  const name = profile?.name || profile?.displayName || 'friend';
  const exam = profile?.targetExam || 'your exam';
  const stress  = baselineMetrics?.stressLevel  ?? 5;
  const sleep   = baselineMetrics?.sleepHours   ?? 7;
  const study   = baselineMetrics?.studyHours   ?? 6;
  const mood    = baselineMetrics?.moodToday    ?? 'Neutral';

  // ── CRISIS — immediate high-priority ──
  if (CRISIS_PHRASES.some(p => t.includes(p))) {
    return {
      type: 'crisis',
      text: `${name}, I'm so glad you said something to me. 💙

What you're feeling right now is real, and I want you to know — your life matters deeply, to me, and to the people who love you.

Please don't carry this alone. Right now, the most important thing is to let someone who loves you know how you're feeling. You don't have to explain everything — even just saying "I need you" is enough.

I'm right here with you. Can we reach out to someone you trust together?`,
      showTrustedContacts: true,
      showHelpline: true,
    };
  }

  // ── HIGH STRESS / BREAKING DOWN ──
  if (HIGH_STRESS_PHRASES.some(p => t.includes(p))) {
    return {
      type: 'high_stress',
      text: `Oh ${name}, I can hear how much you're carrying right now. 💙 That sounds genuinely exhausting — and it makes complete sense that you feel this way.

You don't have to solve everything at once. Right now, can we try just three small things?

🌬️ **Take 3 slow, deep breaths** — breathe in for 4 seconds, hold for 4, then out for 4. This alone signals your nervous system to calm down.

💧 **Drink a glass of water.** When we're overwhelmed, we often forget to hydrate, and it makes everything feel worse.

📱 **Put your phone down for 5 minutes.** Step outside or look at the sky. You deserve a reset.

${stress >= 7 ? '\n⚠️ Your stress levels have been quite high lately. Would it help to talk to someone you trust — like your mom, dad, or a close friend?' : ''}

You're not weak for feeling this way. You're human, and this pressure is real. I'm here. 💜`,
      showTrustedContacts: stress >= 7,
    };
  }

  // ── LONELY / ISOLATED ──
  if (LONELY_PHRASES.some(p => t.includes(p))) {
    return {
      type: 'lonely',
      text: `${name}, feeling alone when you're working so hard is one of the hardest things — and I want you to know: you are not alone right now. I'm here with you. 💙

Loneliness during exam preparation is incredibly common. You're spending so much time studying that social connections can feel distant. But this doesn't mean no one cares — it means you're in a season of your life that demands a lot.

Here are some gentle things that might help:
🤗 **Text one person you care about** — even a simple "thinking of you" can create a real connection.
🚶 **Step outside for 10 minutes** — being around life, even strangers in a park, eases isolation.
📔 **Write in your journal** — getting your feelings out of your head and onto paper brings relief.

${sleep < 6 ? '\n😴 I also noticed you haven\'t been sleeping much. Poor sleep makes loneliness feel much heavier than it actually is.' : ''}

You matter more than you know. The people in your life — family, friends — would want to hear from you. Is there anyone you feel comfortable reaching out to? 💜`,
      showTrustedContacts: true,
    };
  }

  // ── TIRED / SLEEP ISSUES ──
  if (TIRED_PHRASES.some(p => t.includes(p))) {
    return {
      type: 'tired',
      text: `I completely understand, ${name}. When you're this tired, everything feels ten times harder — even simple things feel impossible. That's not weakness, that's your body speaking to you. 💙

Sleep is not a luxury for a student — it's when your brain actually processes and stores everything you've studied. Without it, you're working against yourself.

Here's what I gently suggest:

🌙 **Tonight, try to sleep by 10:30 PM** — even if you haven't finished everything. A rested brain tomorrow will do more than an exhausted one tonight.
📵 **No screen for 30 minutes before bed** — the blue light keeps your brain wired.
🧘 **Try a 5-minute body scan meditation** — lie down and slowly relax each part of your body from head to toe.
🍵 **Warm milk or chamomile tea** before bed — it genuinely helps.

${study >= 8 ? '\n📚 You\'ve been studying a lot of hours. Your brain needs recovery time just like your muscles do after exercise.' : ''}

Tomorrow will feel different when you\'re rested. I believe in you. 🌟`,
    };
  }

  // ── STRESSED / ANXIOUS / EXAM PRESSURE ──
  if (STRESS_PHRASES.some(p => t.includes(p))) {
    return {
      type: 'stressed',
      text: `I hear you, ${name}. Exam pressure can feel like a weight that never goes away — and it's completely valid to feel stressed right now. ${exam} preparation is genuinely challenging, and the fact that you're still pushing forward shows incredible strength. 💪

Let's bring that stress down a little together:

🌬️ **Box Breathing** (try this right now): Inhale for 4 counts... hold for 4... exhale for 4... hold for 4. Repeat 4 times. This is used by athletes and surgeons to calm their nerves.

🎯 **The "One Thing" rule**: Instead of thinking about the entire syllabus, ask yourself — "What is ONE thing I can do in the next 20 minutes?" Just one. That's all.

✅ **Write down your worries**: Put them on paper. Research shows that writing worries down reduces their power over your mind by up to 40%.

${sleep < 6 ? '\n😴 Also, your sleep has been low. Even a 20-minute power nap today can help restore focus significantly.' : ''}

You're not behind. You're exactly where you need to be right now. Keep going — I'm cheering for you every step of the way. 💜`,
    };
  }

  // ── STUDY HELP ──
  if (STUDY_PHRASES.some(p => t.includes(p))) {
    return {
      type: 'study',
      text: `Of course, ${name}! Let's make your study session as effective as possible. 📚

Here's what science says about optimal studying for competitive exams like ${exam}:

⏱️ **Pomodoro Method**: Study for 25 focused minutes, then take a 5-minute break. After 4 rounds, take a 20-30 minute break. This preserves attention and prevents mental fatigue.

🧠 **Active Recall over Re-reading**: Instead of re-reading notes, close the book and try to recall what you just read. This is 2-3x more effective for long-term memory.

✍️ **Teach-back technique**: Explain a concept out loud as if you're teaching someone else. If you can't explain it simply, you don't know it well enough yet.

🎯 **Prioritize by weak areas**: Spend 60% of your study time on topics where you score below 70%. Strong topics can be maintained in 10-15 minutes.

${stress >= 6 ? '\n⚡ One important thing: your stress is elevated. Studying while very stressed actually reduces retention. Start with 5 minutes of slow breathing before opening your books.' : ''}

Would you like me to help you create a study schedule for today? 💜`,
    };
  }

  // ── GOOD MOOD / POSITIVE ──
  if (MOOD_GOOD_PHRASES.some(p => t.includes(p))) {
    return {
      type: 'positive',
      text: `${name}, that absolutely makes my heart happy! 🎉✨

This moment deserves to be celebrated — not rushed past. You've been working incredibly hard, and moments like this are proof that your efforts are paying off.

Here's what I'd encourage you to do right now:

🌟 **Write this down** in your journal — future-you will need to read this on a hard day.
🙏 **Share it with someone you love** — call your mom, dad, or a close friend. Joy multiplies when it's shared!
🌿 **Take a 10-minute walk outside** — let your body celebrate too.
🎯 **Use this energy** — channel this momentum into your next study session. Positive emotions improve learning significantly.

You deserve every bit of this feeling. Remember this when things feel hard — because you've proven you can do this. 💜 Keep going!`,
    };
  }

  // ── BREATHING REQUEST ──
  if (t.includes('breath') || t.includes('breathing') || t.includes('calm') || t.includes('relax') || t.includes('सांस') || t.includes('শ্বাস')) {
    return {
      type: 'breathing',
      text: `Of course, ${name}. Let's do this together, right now. 🌬️

**Box Breathing — 4 rounds:**

Sit comfortably, close your eyes if you can, and follow along:

**Round 1:**
→ Breathe IN slowly for 4 seconds... 1... 2... 3... 4
→ HOLD for 4 seconds... 1... 2... 3... 4
→ Breathe OUT slowly for 4 seconds... 1... 2... 3... 4
→ HOLD for 4 seconds... 1... 2... 3... 4

Repeat this 3 more times.

💙 This technique activates your parasympathetic nervous system — it physically counteracts your body's stress response. It's used by Navy SEALs, surgeons, and elite athletes before high-pressure moments.

After 4 rounds, notice how your shoulders have dropped, your jaw has unclenched, and your mind feels a little quieter.

How are you feeling now? I'm right here with you. 💜`,
    };
  }

  // ── DEFAULT warm fallback ──
  return {
    type: 'general',
    text: `I'm here, ${name}. 💙 Whatever you're carrying right now — whether it's study pressure, exam anxiety, loneliness, or just a tough day — you don't have to face it alone.

I want you to know a few things:

💪 **You're stronger than you feel right now.** The fact that you're still here, still trying, still showing up — that matters.

🌱 **Hard seasons don't last forever.** This pressure, this exam journey — it is temporary. What you're building in yourself through this process — discipline, resilience, focus — that stays with you for life.

💜 **You matter beyond your marks.** Your worth is not defined by your rank or your scores. You are so much more than that.

Tell me more about what's on your mind. I'm genuinely here to listen, understand, and help you find a way through. What would feel most helpful right now?`,
  };
}

// ── Crisis Helpline Card ────────────────────────────────────
function HelplineCard() {
  return (
    <div style={{
      margin: '12px 0',
      padding: '14px 18px',
      borderRadius: '14px',
      background: 'rgba(248, 113, 113, 0.08)',
      border: '1.5px solid rgba(248, 113, 113, 0.3)',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Shield size={16} color="var(--color-danger)" />
        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-danger)' }}>
          Crisis Support Resources
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {[
          { label: 'iCall India', number: '9152987821', desc: 'Mon–Sat, 8 AM – 10 PM' },
          { label: 'Vandrevala Foundation', number: '1860-2662-345', desc: '24/7 Free Support' },
          { label: 'NIMHANS Helpline', number: '080-46110007', desc: 'Mental Health Support' },
        ].map(h => (
          <a
            key={h.label}
            href={`tel:${h.number}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 12px',
              borderRadius: '10px',
              background: 'rgba(248, 113, 113, 0.06)',
              border: '1px solid rgba(248, 113, 113, 0.15)',
              textDecoration: 'none',
              transition: 'all 0.2s',
            }}
          >
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>{h.label}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{h.desc}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-danger)', fontSize: '0.78rem', fontWeight: 700 }}>
              <Phone size={13} /> {h.number}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

// ── Trusted Contact Quick Actions ───────────────────────────
function TrustedContactActions({ name }) {
  const [sent, setSent] = useState(null);

  const contacts = [
    { id: 'mom', emoji: '👩', label: 'Mom', message: `Hi Mom, I've been feeling really low lately. I don't need solutions right now — I just need someone to listen. Can we talk when you're free? 💙` },
    { id: 'dad', emoji: '👨', label: 'Dad', message: `Dad, I'm going through a tough time. I miss talking to you. Can you call me when you have a moment? 💙` },
    { id: 'friend', emoji: '👫', label: 'Friend', message: `Hey, I've been struggling a bit lately. Are you free to chat? Just need a friend right now. 💙` },
    { id: 'mentor', emoji: '🎓', label: 'Mentor', message: `Hi Sir/Ma'am, I'm feeling overwhelmed with my preparation and wanted to talk. Could we connect briefly? 🙏` },
  ];

  if (sent) {
    return (
      <div style={{ padding: '14px', borderRadius: '14px', background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.25)', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Heart size={16} color="var(--color-success)" />
        <span style={{ fontSize: '0.82rem', color: 'var(--color-success)', fontWeight: 600 }}>
          Message prepared for {sent}. That took courage. 💙
        </span>
        <button onClick={() => setSent(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <div style={{ margin: '12px 0', padding: '14px 18px', borderRadius: '14px', background: 'rgba(129,140,248,0.08)', border: '1.5px solid rgba(129,140,248,0.25)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <Heart size={15} color="var(--color-primary)" />
        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-primary)' }}>
          Reach out to someone you trust
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        {contacts.map(c => (
          <button
            key={c.id}
            onClick={() => {
              const sms = `sms:?body=${encodeURIComponent(c.message)}`;
              window.open(sms, '_blank');
              setSent(c.label);
            }}
            style={{
              padding: '10px 12px',
              borderRadius: '10px',
              border: '1.5px solid var(--border-color)',
              background: 'var(--bg-elevated)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              transition: 'all 0.2s',
              textAlign: 'left',
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>{c.emoji}</span>
            <div>
              <div style={{ fontWeight: 700 }}>Message {c.label}</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 400 }}>Send caring message</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Message bubble renderer ─────────────────────────────────
function MessageBubble({ msg, isSpeaking, onToggleSpeak }) {
  const isAI = msg.sender === 'withyou';

  // Parse bold markdown **text**
  const renderText = (text) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} style={{ color: isAI ? 'var(--text-primary)' : '#fff' }}>{part.slice(2, -2)}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div style={{
      alignSelf: isAI ? 'flex-start' : 'flex-end',
      maxWidth: isAI ? '82%' : '70%',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      textAlign: 'left',
    }}>
      {/* Avatar row for AI */}
      {isAI && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          <div style={{
            width: '26px', height: '26px', borderRadius: '8px',
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-calm))',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Sparkles size={12} color="#fff" />
          </div>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
            WithYou AI · {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      )}

      {/* Bubble */}
      <div style={{
        padding: '14px 18px',
        borderRadius: isAI ? '4px 18px 18px 18px' : '18px 18px 4px 18px',
        background: isAI
          ? 'linear-gradient(135deg, rgba(30,28,54,0.8), rgba(22,21,42,0.9))'
          : 'linear-gradient(135deg, var(--color-primary), var(--color-primary-deep))',
        border: isAI ? '1px solid var(--border-color)' : 'none',
        color: isAI ? 'var(--text-primary)' : '#fff',
        fontSize: '0.92rem',
        lineHeight: '1.75',
        backdropFilter: isAI ? 'blur(12px)' : 'none',
        boxShadow: isAI
          ? '0 4px 20px rgba(0,0,0,0.2)'
          : '0 4px 20px rgba(99,102,241,0.3)',
        position: 'relative',
      }}>
        <p style={{ margin: 0, whiteSpace: 'pre-line' }}>{renderText(msg.text)}</p>

        {/* Crisis extras */}
        {msg.showCrisisAlert && (
          <div style={{ marginTop: '14px', padding: '12px', borderRadius: '10px', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
            <AlertTriangle size={15} color="var(--color-danger)" style={{ marginTop: '2px', flexShrink: 0 }} />
            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--color-danger)', fontWeight: 600, lineHeight: 1.6 }}>
              If you are in immediate danger, please call <strong>112</strong> (Emergency) or a trusted adult right now.
            </p>
          </div>
        )}

        {/* TTS button */}
        {isAI && (
          <button
            onClick={() => onToggleSpeak(msg.id, msg.text)}
            title={isSpeaking ? 'Stop speaking' : 'Read aloud'}
            style={{
              position: 'absolute',
              bottom: '-12px',
              right: '14px',
              width: '26px', height: '26px',
              borderRadius: '50%',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', padding: 0,
              color: isSpeaking ? 'var(--color-calm)' : 'var(--text-muted)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              transition: 'all 0.2s',
            }}
          >
            {isSpeaking ? <VolumeX size={12} /> : <Volume2 size={12} />}
          </button>
        )}
      </div>

      {/* Inline trusted contacts panel */}
      {msg.showTrustedContacts && isAI && (
        <TrustedContactActions name={msg.userName} />
      )}
      {msg.showHelpline && isAI && <HelplineCard />}

      {/* Timestamp for user messages */}
      {!isAI && (
        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', alignSelf: 'flex-end' }}>
          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      )}
    </div>
  );
}

// ── Main Chat Component ──────────────────────────────────────
export default function WithYouAIChat({ profile, baselineMetrics, recentAnalysis }) {
  const { t, i18n } = useTranslation();
  const [messages, setMessages]         = useState([]);
  const [inputValue, setInputValue]     = useState('');
  const [isTyping, setIsTyping]         = useState(false);
  const [speakingId, setSpeakingId]     = useState(null);
  const [isCrisisMode, setIsCrisisMode] = useState(false);
  const messagesEndRef = useRef(null);

  const exam     = profile?.targetExam || 'JEE';
  const examName = t(`profile.exams.${exam}.name`);
  const userName = profile?.name || profile?.displayName || 'friend';

  // Build contextual welcome
  const buildWelcome = () => {
    const stress = baselineMetrics?.stressLevel ?? 5;
    const sleep  = baselineMetrics?.sleepHours  ?? 7;
    const hour   = new Date().getHours();
    const timeGreet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    let contextNote = '';
    if (stress >= 8) contextNote = `I can see from your recent check-in that you're under significant stress. I want to start by saying — that's completely valid, and I'm here for you. 💙`;
    else if (sleep < 5) contextNote = `I noticed you haven't had much sleep lately. Please be gentle with yourself today. 🌙`;
    else contextNote = `You're doing great by checking in with yourself today. That's a sign of real self-awareness. 🌟`;

    return `${timeGreet}, ${userName}! I'm WithYou — your personal wellness companion. 💜

${contextNote}

I'm here to listen without judgment, help you navigate stress and anxiety, and support you through your ${examName} journey. Whether you want to vent, need study advice, or just want someone to talk to — I'm all ears.

How are you feeling right now? Tell me anything. 😊`;
  };

  useEffect(() => {
    setMessages([{
      id: 'welcome-1',
      sender: 'withyou',
      text: buildWelcome(),
      timestamp: new Date(),
    }]);
  }, [i18n.language, profile?.name, examName]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // TTS Handler
  const handleToggleSpeak = (msgId, text) => {
    if (!('speechSynthesis' in window)) return;
    if (speakingId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
    } else {
      window.speechSynthesis.cancel();
      setSpeakingId(msgId);
      const utterance = new SpeechSynthesisUtterance(text.replace(/\*\*/g, ''));
      const langMap = { en:'en-IN', hi:'hi-IN', bn:'bn-IN', ta:'ta-IN', te:'te-IN', kn:'kn-IN', ml:'ml-IN', mr:'mr-IN', gu:'gu-IN', pa:'pa-IN' };
      const targetLang = langMap[i18n.language] || 'en-IN';
      const voices = window.speechSynthesis.getVoices();
      const match = voices.find(v => v.lang.startsWith(targetLang) || v.lang.startsWith(i18n.language));
      if (match) utterance.voice = match;
      else utterance.lang = targetLang;
      utterance.rate = 0.9;
      utterance.pitch = 1.05;
      utterance.onend  = () => setSpeakingId(null);
      utterance.onerror = () => setSpeakingId(null);
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => () => { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); }, []);

  // Send message
  const handleSend = (e) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Detect crisis for UI mode
    const isCrisis = CRISIS_PHRASES.some(p => inputValue.toLowerCase().includes(p));
    if (isCrisis) setIsCrisisMode(true);

    // Simulate thoughtful response delay (longer = more realistic)
    const delay = isCrisis ? 900 : 1400 + Math.random() * 600;

    setTimeout(() => {
      setIsTyping(false);
      const response = buildResponse(inputValue, profile, baselineMetrics, recentAnalysis);

      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: 'withyou',
        text: response.text,
        timestamp: new Date(),
        showTrustedContacts: response.showTrustedContacts || false,
        showHelpline: response.showHelpline || false,
        showCrisisAlert: isCrisis,
        userName,
      };

      setMessages(prev => [...prev, aiMsg]);
    }, delay);
  };

  const handleChipClick = (chip) => {
    setInputValue(chip.text);
  };

  return (
    <div className="glass-panel page-transition" style={{
      height: 'calc(100vh - 100px)',
      display: 'flex',
      flexDirection: 'column',
      padding: 0,
      overflow: 'hidden',
      border: isCrisisMode ? '1.5px solid rgba(248,113,113,0.4)' : '1px solid var(--border-color)',
      transition: 'border-color 0.4s',
    }}>

      {/* ── Header ── */}
      <div style={{
        padding: '16px 22px',
        borderBottom: `1px solid ${isCrisisMode ? 'rgba(248,113,113,0.25)' : 'var(--border-color)'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: isCrisisMode ? 'rgba(248,113,113,0.04)' : 'rgba(255,255,255,0.01)',
        transition: 'background 0.4s',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px', height: '42px', borderRadius: '13px',
            background: isCrisisMode
              ? 'linear-gradient(135deg, var(--color-danger), #f87171)'
              : 'linear-gradient(135deg, var(--color-primary), var(--color-calm))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: isCrisisMode ? '0 4px 14px rgba(248,113,113,0.3)' : '0 4px 14px var(--color-primary-glow)',
            transition: 'all 0.4s',
          }}>
            {isCrisisMode ? <Heart size={20} color="#fff" /> : <Sparkles size={20} color="#fff" />}
          </div>
          <div>
            <h3 style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 700, margin: 0 }}>
              {t('chat.title', 'WithYou AI Companion')}
            </h3>
            <span style={{ fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px', color: isCrisisMode ? 'var(--color-danger)' : 'var(--color-success)' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
              {isCrisisMode ? 'Crisis Support Mode — I\'m here for you' : t('chat.status', 'Active Wellness Companion')}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {isCrisisMode && (
            <button
              onClick={() => setIsCrisisMode(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.72rem', fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <X size={13} /> Exit crisis mode
            </button>
          )}
          <span className="badge badge-primary" style={{ fontSize: '0.68rem', display: 'flex', gap: '5px' }}>
            <Sparkles size={10} />
            {t('chat.synced', 'AI Synced')}
          </span>
        </div>
      </div>

      {/* ── Messages ── */}
      <div style={{
        flex: 1,
        padding: '24px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '22px',
      }}>
        {messages.map(msg => (
          <MessageBubble
            key={msg.id}
            msg={msg}
            isSpeaking={speakingId === msg.id}
            onToggleSpeak={handleToggleSpeak}
          />
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div style={{ alignSelf: 'flex-start', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              <div style={{ width: '26px', height: '26px', borderRadius: '8px', background: 'linear-gradient(135deg, var(--color-primary), var(--color-calm))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Sparkles size={12} color="#fff" />
              </div>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                WithYou is thinking...
              </span>
            </div>
            <div style={{
              padding: '14px 18px',
              borderRadius: '4px 18px 18px 18px',
              background: 'linear-gradient(135deg, rgba(30,28,54,0.8), rgba(22,21,42,0.9))',
              border: '1px solid var(--border-color)',
              display: 'flex',
              gap: '6px',
              alignItems: 'center',
            }}>
              <span className="dot-blink" />
              <span className="dot-blink" style={{ animationDelay: '0.18s' }} />
              <span className="dot-blink" style={{ animationDelay: '0.36s' }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Suggestion Chips ── */}
      <div style={{
        padding: '0 22px 10px',
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        flexWrap: 'nowrap',
      }}>
        {SUGGESTION_CHIPS.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleChipClick(chip)}
            style={{
              padding: '7px 14px',
              borderRadius: '999px',
              background: 'rgba(129,140,248,0.05)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-secondary)',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
              flexShrink: 0,
              fontFamily: 'var(--font-sans)',
              display: 'flex',
              gap: '5px',
              alignItems: 'center',
              whiteSpace: 'nowrap',
            }}
          >
            <span>{chip.icon}</span>
            {chip.text}
          </button>
        ))}
      </div>

      {/* ── Input Bar ── */}
      <form
        onSubmit={handleSend}
        style={{
          padding: '16px 22px',
          borderTop: `1px solid ${isCrisisMode ? 'rgba(248,113,113,0.2)' : 'var(--border-color)'}`,
          display: 'flex',
          gap: '10px',
          background: 'rgba(0,0,0,0.1)',
          alignItems: 'flex-end',
        }}
      >
        <textarea
          className="glass-input"
          placeholder={isCrisisMode ? "I'm here. Tell me how you're feeling... 💙" : t('chat.placeholder', 'Share anything — I\'m here to listen...')}
          value={inputValue}
          onChange={e => {
            setInputValue(e.target.value);
            e.target.style.height = 'auto';
            e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
          }}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          rows={1}
          style={{
            flex: 1,
            padding: '12px 16px',
            fontSize: '0.92rem',
            resize: 'none',
            minHeight: '46px',
            maxHeight: '120px',
            overflowY: 'auto',
            lineHeight: 1.5,
            borderColor: isCrisisMode ? 'rgba(248,113,113,0.3)' : 'var(--border-color)',
          }}
        />
        <button
          type="submit"
          disabled={!inputValue.trim()}
          className="btn btn-primary"
          style={{ width: '46px', height: '46px', padding: 0, justifyContent: 'center', flexShrink: 0, borderRadius: '12px' }}
        >
          <Send size={17} />
        </button>
      </form>

      {/* Crisis bottom bar */}
      {isCrisisMode && (
        <div style={{
          padding: '10px 22px',
          background: 'rgba(248,113,113,0.06)',
          borderTop: '1px solid rgba(248,113,113,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
        }}>
          <span style={{ fontSize: '0.76rem', color: 'var(--color-danger)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Shield size={13} /> You are not alone. Help is here.
          </span>
          <a href="tel:9152987821" className="btn btn-danger" style={{ fontSize: '0.76rem', padding: '6px 14px' }}>
            <Phone size={12} /> iCall: 9152987821
          </a>
        </div>
      )}
    </div>
  );
}

