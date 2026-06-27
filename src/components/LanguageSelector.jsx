import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi' },
  { code: 'bn', name: 'Bengali' },
  { code: 'ta', name: 'Tamil' },
  { code: 'te', name: 'Telugu' },
  { code: 'kn', name: 'Kannada' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'mr', name: 'Marathi' },
  { code: 'gu', name: 'Gujarati' },
  { code: 'pa', name: 'Punjabi' }
];

export default function LanguageSelector() {
  const { i18n } = useTranslation();

  return (
    <div style={{
      position: 'fixed',
      top: '16px',
      right: '16px',
      zIndex: 1001,
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-color)',
      borderRadius: '8px',
      padding: '6px 10px',
      boxShadow: 'var(--glass-shadow)'
    }}>
      <Globe size={16} color="var(--color-calm)" />
      <select
        value={i18n.language || 'en'}
        onChange={(event) => i18n.changeLanguage(event.target.value)}
        aria-label="Select language"
        style={{
          background: 'transparent',
          border: 'none',
          color: 'var(--text-primary)',
          fontSize: '0.84rem',
          fontWeight: 700,
          cursor: 'pointer',
          outline: 'none',
          fontFamily: 'var(--font-sans)'
        }}
      >
        {LANGUAGES.map((lang) => (
          <option
            key={lang.code}
            value={lang.code}
            style={{
              background: 'var(--bg-surface)',
              color: 'var(--text-primary)'
            }}
          >
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
}

