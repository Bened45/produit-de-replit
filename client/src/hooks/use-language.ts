import { useState, useEffect } from 'react';
import { translations, type Language, type TranslationKey } from '@/lib/i18n';

export function useLanguage() {
  const [language, setLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem('vaccicare-language');
    return (stored as Language) || 'fr';
  });

  useEffect(() => {
    localStorage.setItem('vaccicare-language', language);
  }, [language]);

  const t = (key: TranslationKey): string => {
    return translations[language][key] || key;
  };

  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };

  return {
    language,
    t,
    changeLanguage,
  };
}
