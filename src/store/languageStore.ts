import { create } from 'zustand'
import i18n from '@/lib/i18n'

export type Language = 'en' | 'fr' | 'es'

interface LanguageState {
    language: Language
    setLanguage: (lang: Language) => void
    t: (key: string) => string
}

export const useLanguageStore = create<LanguageState>((set) => {
    // Sync initial language state with i18n
    const initialLang = ((i18n.language || 'en').split('-')[0]) as Language

    // Listen to i18next language change events to sync Zustand store state
    i18n.on('languageChanged', (lng) => {
        const lang = (lng.split('-')[0]) as Language
        set({ language: lang })
    })

    return {
        language: initialLang,
        setLanguage: (lang: Language) => {
            i18n.changeLanguage(lang)
        },
        t: (key: string) => {
            return i18n.t(key)
        }
    }
})
