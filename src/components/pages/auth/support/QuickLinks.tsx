'use client'

import React from 'react';
import { HelpCircle, ExternalLink } from 'lucide-react';
import { SupportLink } from '@/services/support.service';
import { useLanguageStore } from '@/store/languageStore';

interface QuickLinksProps {
    links: SupportLink[];
    isLoading: boolean;
}

export const QuickLinks: React.FC<QuickLinksProps> = ({ links, isLoading }) => {
    const { t } = useLanguageStore();
    return (
        <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-6 shadow-xl space-y-4">
            <h4 className="font-satoshi font-black text-sm text-white border-b border-white/[0.03] pb-3 flex items-center space-x-2">
                <HelpCircle className="h-4.5 w-4.5 text-primary-400" />
                <span>{t('support.links.title')}</span>
            </h4>
            {isLoading ? (
                <p className="text-xs text-slate-500 animate-pulse">{t('support.links.loading')}</p>
            ) : (
                <div className="space-y-3">
                    {links && links.map(link => (
                        <a
                            key={link.id}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-3 rounded-xl bg-black/20 border border-white/5 hover:border-white/10 text-xs font-bold text-slate-300 hover:text-white transition group"
                        >
                            <span>{link.name}</span>
                            <ExternalLink className="h-3.5 w-3.5 text-slate-500 group-hover:text-primary-400 transition" />
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
};
