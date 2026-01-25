"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { detectGeoLocation } from './geo';
import { useEffect, useState } from 'react';
import translations from './translations.json';

export type Language = 'en' | 'ar' | 'fr' | 'es' | 'pt' | 'de' | 'it' | 'tr';
export type Currency = 'USD' | 'EUR' | 'MAD' | 'AED' | 'TRY' | 'CHF';
export type TranslationKey = keyof typeof translations['en'];

// Type-safe translations object
const typedTranslations = translations as Record<Language, Record<TranslationKey, string>>;

interface LanguageState {
    language: Language;
    currency: Currency;
    setLanguage: (lang: Language) => void;
    setCurrency: (curr: Currency) => void;
    _hasHydrated: boolean;
    setHasHydrated: (state: boolean) => void;
    initializeGeoSettings: () => Promise<void>;
}

export const useLanguageStore = create<LanguageState>()(
    persist(
        (set, get) => ({
            language: 'en',
            currency: 'USD',
            _hasHydrated: false,
            setLanguage: (lang) => {
                set({ language: lang });
                if (typeof document !== 'undefined') {
                    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
                    document.documentElement.lang = lang;
                }
            },
            setCurrency: (currency) => set({ currency }),
            setHasHydrated: (state) => set({ _hasHydrated: state }),
            initializeGeoSettings: async () => {
                // Only auto-detect if not already set by user (initial visit)
                const storage = localStorage.getItem('language-storage');
                if (storage) {
                    const parsed = JSON.parse(storage);
                    if (parsed.state?.language !== 'en' || parsed.state?.currency !== 'USD') {
                        // User already changed something, don't override
                        return;
                    }
                }

                const geo = await detectGeoLocation();
                if (geo) {
                    const validLangs: Language[] = ['en', 'ar', 'fr', 'es', 'pt', 'de', 'it', 'tr'];
                    const validCurrencies: Currency[] = ['USD', 'EUR', 'MAD', 'AED', 'TRY', 'CHF'];

                    const updates: Partial<LanguageState> = {};
                    if (validLangs.includes(geo.languageCode as Language)) {
                        updates.language = geo.languageCode as Language;
                    }
                    if (validCurrencies.includes(geo.currencyCode as Currency)) {
                        updates.currency = geo.currencyCode as Currency;
                    }

                    if (Object.keys(updates).length > 0) {
                        set(updates);
                        if (updates.language && typeof document !== 'undefined') {
                            document.documentElement.dir = updates.language === 'ar' ? 'rtl' : 'ltr';
                            document.documentElement.lang = updates.language;
                        }
                    }
                }
            }
        }),
        {
            name: 'language-storage',
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
        }
    )
);

export function useTranslation() {
    const { language, _hasHydrated } = useLanguageStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Sync document dir on mount
        if (_hasHydrated) {
            document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
            document.documentElement.lang = language;
        }
    }, [_hasHydrated, language]);

    const t = (key: TranslationKey | string, variables?: Record<string, string>) => {
        // During SSR or before hydration, use 'en'
        const lang = (mounted && _hasHydrated) ? language : 'en';

        const langTranslations = typedTranslations[lang] || typedTranslations['en'];
        const fallbackTranslations = typedTranslations['en'];

        let translation = langTranslations[key as TranslationKey] || fallbackTranslations[key as TranslationKey] || key;

        if (variables) {
            Object.entries(variables).forEach(([k, v]) => {
                translation = translation.replace(`{${k}}`, v);
            });
        }

        return translation;
    };

    return { t, language: mounted ? language : 'en', mounted };
}
