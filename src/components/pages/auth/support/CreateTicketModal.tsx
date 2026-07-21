'use client'

import React, { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useLanguageStore } from '@/store/languageStore';
import { Select } from '@/components/ui/Select';

interface CreateTicketModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (payload: { subject: string; category: string; message: string }) => void;
    isPending: boolean;
}

export const CreateTicketModal: React.FC<CreateTicketModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    isPending
}) => {
    const { t } = useLanguageStore();

    const [form, setForm] = useState({
        subject: '',
        category: 'general',
        message: ''
    });

    const categoryOptions = [
        { value: 'general', label: t('support.faq.cat.general') },
        { value: 'account', label: t('support.faq.cat.account') },
        { value: 'payment', label: t('support.faq.cat.payment') },
        { value: 'kyc', label: t('support.create.categoryKyc') },
        { value: 'technical', label: t('support.faq.cat.technical') },
        { value: 'card', label: t('support.create.categoryCards') }
    ];

    if (!isOpen) return null;

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.subject || !form.message) return;
        onSubmit(form);
    };

    return (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-[8px] z-[999] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-6.5 max-w-sm w-full shadow-2xl relative space-y-5 text-left animate-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4.5 right-4.5 p-1 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="space-y-1">
                    <h4 className="font-satoshi font-black text-base text-white flex items-center space-x-2">
                        <MessageSquare className="h-5 w-5 text-primary-400" />
                        <span>{t('support.create.title')}</span>
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-normal">
                        {t('support.create.subtitle')}
                    </p>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-555 uppercase tracking-wider block">{t('support.create.subjectLabel')}</label>
                        <input
                            type="text"
                            required
                            value={form.subject}
                            onChange={(e) => setForm({ ...form, subject: e.target.value })}
                            placeholder={t('support.create.subjectPlaceholder')}
                            className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-700 focus:outline-none focus:border-primary-500/50 w-full"
                        />
                    </div>

                    <Select
                        label={t('support.create.categoryLabel')}
                        options={categoryOptions}
                        value={form.category}
                        onChange={(val) => setForm({ ...form, category: val })}
                        searchable={false}
                    />

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-555 uppercase tracking-wider block">{t('support.create.messageLabel')}</label>
                        <textarea
                            required
                            rows={4}
                            value={form.message}
                            onChange={(e) => setForm({ ...form, message: e.target.value })}
                            placeholder={t('support.create.messagePlaceholder')}
                            className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-700 focus:outline-none focus:border-primary-500/50 w-full resize-none font-sans"
                        />
                    </div>

                    <div className="flex space-x-3 pt-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                            className="w-1/2 rounded-xl h-11 text-xs"
                        >
                            {t('support.create.btn.cancel')}
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            isLoading={isPending}
                            className="w-1/2 rounded-xl h-11 text-xs"
                        >
                            {t('support.create.btn.submit')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
