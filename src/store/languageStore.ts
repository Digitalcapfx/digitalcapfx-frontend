'use client'

import i18n from '@/lib/i18n'
import { useTranslation } from 'react-i18next'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Language = 'en' | 'fr' | 'es' | 'zh'

interface LanguageStoreState {
    language: Language
    setLanguage: (lang: Language) => void
}

export const useLanguageBaseStore = create<LanguageStoreState>()(
    persist(
        (set) => {
            const getInitialLang = (): Language => {
                if (typeof window !== 'undefined') {
                    const saved = localStorage.getItem('i18nextLng') || localStorage.getItem('digitalfx_language')
                    if (saved) {
                        const code = saved.split('-')[0] as Language
                        if (['en', 'fr', 'es', 'zh'].includes(code)) return code
                    }
                }
                return ((i18n.language || 'en').split('-')[0]) as Language
            }

            const initialLang = getInitialLang()
            if (typeof window !== 'undefined' && initialLang !== i18n.language) {
                i18n.changeLanguage(initialLang)
            }

            i18n.on('languageChanged', (lng) => {
                const lang = (lng.split('-')[0]) as Language
                set({ language: lang })
                if (typeof window !== 'undefined') {
                    localStorage.setItem('i18nextLng', lang)
                }
            })

            return {
                language: initialLang,
                setLanguage: (lang: Language) => {
                    if (typeof window !== 'undefined') {
                        localStorage.setItem('i18nextLng', lang)
                        localStorage.setItem('digitalfx_language', lang)
                    }
                    i18n.changeLanguage(lang)
                    set({ language: lang })
                }
            }
        },
        {
            name: 'digitalfx_language'
        }
    )
)

export function useLanguageStore() {
    const { t: i18nT, i18n: i18nInstance } = useTranslation()
    const { language, setLanguage } = useLanguageBaseStore()

    const currentLang = ((i18nInstance?.language || language || 'en').split('-')[0]) as Language

    return {
        language: currentLang,
        setLanguage: (lang: Language) => {
            if (typeof window !== 'undefined') {
                localStorage.setItem('i18nextLng', lang)
                localStorage.setItem('digitalfx_language', lang)
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
