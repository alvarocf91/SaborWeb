import { createContext, useCallback, useEffect, useState } from 'react';
import en from '../locales/en.json';
import es from '../locales/es.json';

export const LanguageContext = createContext();

const translations = { en, es };

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem('language') || 'es';
    });

    useEffect(() => {
        localStorage.setItem('language', language);
    }, [language]);

    const t = useCallback((key) => {
        const keys = key.split('.');
        let value = translations[language];

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return key;
            }
        }

        return value;
    }, [language]);

    const toggleLanguage = useCallback(() => {
        setLanguage(prev => prev === 'en' ? 'es' : 'en');
    }, []);

    const value = {
        language,
        setLanguage,
        t,
        toggleLanguage,
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};
