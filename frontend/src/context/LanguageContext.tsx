import React, { createContext, useContext, useState, useEffect } from 'react';
import { LanguageCapability } from '../types';
import { MOCK_LANGUAGES } from '../services/api';
import { TRANSLATIONS, TranslationDict } from '../i18n/translations';

interface LanguageContextType {
  currentLanguage: string;
  setLanguage: (langCode: string) => void;
  availableLanguages: LanguageCapability[];
  t: (key: keyof TranslationDict | string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<string>(() => {
    return localStorage.getItem('jansahayak_lang') || 'en';
  });

  const setLanguage = (code: string) => {
    setCurrentLanguage(code);
    localStorage.setItem('jansahayak_lang', code);
    // Set document lang attribute for accessibility
    document.documentElement.lang = code;
  };

  useEffect(() => {
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);

  const t = (key: keyof TranslationDict | string): string => {
    const dict = TRANSLATIONS[currentLanguage] || TRANSLATIONS['en'];
    const val = (dict as any)?.[key];
    if (val) return val;
    return (TRANSLATIONS['en'] as any)?.[key] || (key as string);
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        availableLanguages: MOCK_LANGUAGES,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};
