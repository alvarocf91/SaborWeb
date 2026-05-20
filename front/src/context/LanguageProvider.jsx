import { createContext, useCallback, useEffect, useState } from 'react';
import es from '../locales/es.json';

export const LanguageContext = createContext();

const translations = { es };

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(() => {
        return 'es';
    });

    useEffect(() => {
        localStorage.setItem('language', 'es');
        setLanguage('es');
    }, []);

    const t = useCallback((key, params = {}) => {
        const keys = key.split('.');
        let value = translations.es;

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return key;
            }
        }

        if (typeof value !== 'string') {
            return value;
        }

        return Object.entries(params).reduce((text, [param, replacement]) => {
            return text.replaceAll(`{${param}}`, replacement ?? '');
        }, value);
    }, []);

    const toggleLanguage = useCallback(() => {
        setLanguage('es');
        localStorage.setItem('language', 'es');
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
