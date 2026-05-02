import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import './LanguageSwitcher.css';

function LanguageSwitcher() {
  const { language, changeLanguage } = useLanguage();

  return (
    <div className="language-switcher">
      <button
        className={`lang-btn ${language === 'en' ? 'active' : ''}`}
        onClick={() => changeLanguage('en')}
        title="English"
      >
        🇬🇧 EN
      </button>
      <button
        className={`lang-btn ${language === 'nl' ? 'active' : ''}`}
        onClick={() => changeLanguage('nl')}
        title="Nederlands"
      >
        🇳🇱 NL
      </button>
    </div>
  );
}

export default LanguageSwitcher;
