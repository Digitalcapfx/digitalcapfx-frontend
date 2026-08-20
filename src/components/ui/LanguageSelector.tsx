'use client'

import React from 'react'
import { Select } from '@/components/ui/Select'
import { useLanguageStore, Language } from '@/store/languageStore'
import { cn } from '@/lib/utils'

interface LanguageSelectorProps {
    className?: string;
    compact?: boolean;
}

const LANGUAGE_OPTIONS = [
    { value: 'en', label: '🇺🇸 EN' },
    { value: 'fr', label: '🇫🇷 FR' },
    { value: 'es', label: '🇪🇸 ES' },
    { value: 'zh', label: '🇨🇳 ZH' }
];

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ className, compact = false }) => {
    const { language, setLanguage } = useLanguageStore();

    return (
        <div className={cn("relative select-none shrink-0", compact ? "w-[85px]" : "w-[100px]", className)}>
            <Select
                options={LANGUAGE_OPTIONS}
                value={language}
                onChange={(val) => setLanguage(val as Language)}
                searchable={false}
                className="h-[36px] text-[10px] uppercase font-mono px-2.5 py-1 bg-black/40 border border-white/10 hover:border-white/20 rounded-xl"
            />
        </div>
    );
};

export default LanguageSelector;
