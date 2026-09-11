'use client'

import i18n from '@/lib/i18n'
import { useTranslation } from 'react-i18next'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Language = 'en' | 'fr' | 'es' | 'zh'

const VALID_LANGS: Language[] = ['en', 'fr', 'es', 'zh']

export const getStoredLanguage = (): Language => {
    if (typeof window !== 'undefined') {
        try {
            const i18nSaved = localStorage.getItem('i18nextLng')
            if (i18nSaved) {
                const code = i18nSaved.split('-')[0].toLowerCase() as Language
                if (VALID_LANGS.includes(code)) return code
            }
            const storeSaved = localStorage.getItem('digitalfx_language')
            if (storeSaved) {
                try {
                    const parsed = JSON.parse(storeSaved)
                    const code = (parsed?.state?.language || '').split('-')[0].toLowerCase() as Language
                    if (VALID_LANGS.includes(code)) return code
                } catch {
                    const code = storeSaved.split('-')[0].toLowerCase() as Language
                    if (VALID_LANGS.includes(code)) return code
                }
            }
        } catch {}
    }
    const current = ((i18n.language || 'fr').split('-')[0]).toLowerCase() as Language
    return VALID_LANGS.includes(current) ? current : 'fr'
}

interface LanguageStoreState {
    language: Language
    setLanguage: (lang: Language) => void
}

export const useLanguageBaseStore = create<LanguageStoreState>()(
    persist(
        (set) => ({
            language: getStoredLanguage(),
            setLanguage: (lang: Language) => {
                if (typeof window !== 'undefined') {
                    try {
                        localStorage.setItem('i18nextLng', lang)
                        localStorage.setItem('digitalfx_language', JSON.stringify({ state: { language: lang }, version: 0 }))
                    } catch {}
                }
                i18n.changeLanguage(lang)
                set({ language: lang })
            }
        }),
        {
            name: 'digitalfx_language',
            onRehydrateStorage: () => (state) => {
                if (state?.language && VALID_LANGS.includes(state.language)) {
                    if (i18n.language !== state.language) {
                        i18n.changeLanguage(state.language)
                    }
                }
            }
        }
    )
)

export function useLanguageStore() {
    const { t: i18nT, i18n: i18nInstance } = useTranslation()
    const { language, setLanguage } = useLanguageBaseStore()

    const currentLang = ((language || i18nInstance?.language || getStoredLanguage()).split('-')[0]) as Language

    return {
        language: VALID_LANGS.includes(currentLang) ? currentLang : 'fr',
        setLanguage: (lang: Language) => {
            if (typeof window !== 'undefined') {
                try {
                    localStorage.setItem('i18nextLng', lang)
                    localStorage.setItem('digitalfx_language', JSON.stringify({ state: { language: lang }, version: 0 }))
                } catch {}
            }
            i18n.changeLanguage(lang)
            setLanguage(lang)
        },
        t: (key: string, options?: any) => {
            return i18nT(key, options) as string
        }
    }
}

export default useLanguageStore
