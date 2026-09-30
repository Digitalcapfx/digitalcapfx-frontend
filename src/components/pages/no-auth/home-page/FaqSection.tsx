'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLanguageStore } from '@/store/languageStore'

// Change #3: Removed crypto/stablecoin FAQs. Change #4: Removed FDIC claim.
// Rewritten to focus on B2B cross-border payments and compliance.
const FaqSection = () => {
    const { t } = useLanguageStore();
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const FAQ_ITEMS = [
        {
            question: t('faq.q1', { defaultValue: 'Mes fonds sont-ils en sécurité avec Digitalcap FX ?' }),
            answer: t('faq.a1', { defaultValue: 'Oui. Les fonds des clients sont détenus dans des comptes ségrégués auprès de nos partenaires bancaires. Nous utilisons un chiffrement 256-bit et une authentification renforcée pour protéger chaque transaction.' }),
        },
        {
            question: t('faq.q2', { defaultValue: 'Quelles devises puis-je détenir et convertir ?' }),
            answer: t('faq.a2', { defaultValue: 'Nous prenons en charge le XAF, XOF, USD, EUR, GBP, CNY et d\'autres devises internationales. Les conversions sont effectuées aux taux du marché en temps réel.' }),
        },
        {
            question: t('faq.q3', { defaultValue: 'Comment payer un fournisseur en Chine ?' }),
            answer: t('faq.a3', { defaultValue: 'Après avoir créé votre compte et complété la vérification KYC/KYB, vous pouvez alimenter votre compte en XAF, convertir en USD ou CNY, ajouter les coordonnées de votre fournisseur, télécharger la facture et envoyer le paiement. Le suivi se fait en temps réel.' }),
        },
        {
            question: t('faq.q4', { defaultValue: 'Y a-t-il des frais cachés ?' }),
            answer: t('faq.a4', { defaultValue: 'Non. Tous les taux de conversion et frais de transaction sont affichés de manière transparente avant chaque confirmation de paiement.' }),
        },
        {
            question: t('faq.q5', { defaultValue: 'Quel est le délai de traitement des paiements ?' }),
            answer: t('faq.a5', { defaultValue: 'Les conversions de devises sont quasi instantanées. Les paiements internationaux vers les fournisseurs sont généralement traités sous 24 à 48 heures ouvrées selon le corridor.' }),
        },
        {
            question: t('faq.q6', { defaultValue: 'Comment ouvrir un compte entreprise ?' }),
            answer: t('faq.a6', { defaultValue: 'Cliquez sur \"Ouvrir un Compte Entreprise\" et suivez les étapes de vérification KYC/KYB en ligne. La procédure est entièrement digitale et prend généralement moins de 10 minutes.' }),
        },
        {
            question: t('faq.q7', { defaultValue: 'Digitalcap FX est-elle une institution réglementée ?' }),
            answer: t('faq.a7', { defaultValue: 'Digitalcap FX opère en conformité avec les réglementations applicables. Pour plus de détails sur notre cadre réglementaire, nos licences et nos procédures de conformité, consultez notre page Conformité & Réglementation.' }),
        },
    ];

    const toggleOpen = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="faq" className='bg-[#0C1224]'>
            <div className="py-14 lg:py-24 text-center space-y-12">

                {/* Header */}
                <div className="space-y-4 max-w-3xl mx-auto flex flex-col items-center">
                    <div className="inline-flex items-center space-x-2 bg-primary-500/10 border border-primary-500/20 px-3 py-1.5 rounded-full select-none">
                        <span className="text-[10px] font-bold tracking-wider text-primary-400 uppercase">
                            {t('faq.badge', { defaultValue: '❓ Questions & Réponses' })}
                        </span>
                    </div>
                    <h2 className="font-satoshi font-black text-3xl sm:text-4xl lg:text-[48px] leading-[1.15] text-white tracking-tight">
                        {t('faq.title', { defaultValue: 'Questions' })} <span className="bg-brand-gradient bg-clip-text text-transparent">{t('faq.titleHighlight', { defaultValue: 'fréquentes' })}</span>
                    </h2>
                    <p className="text-slate-400 text-sm sm:text-base max-w-lg font-sans">
                        {t('faq.subtitle', { defaultValue: "Tout ce que vous devez savoir sur Digitalcap FX. Vous ne trouvez pas la réponse ? Contactez notre équipe." })}
                    </p>
                </div>

                {/* Accordion Lists */}
                <div className="max-w-3xl mx-auto px-4 md:px-8 space-y-4 text-left">
                    {FAQ_ITEMS.map((item, idx) => {
                        const isOpen = openIndex === idx;
                        return (
                            <div
                                key={idx}
                                className="glass-panel border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 hover:bg-white/[0.03] transition-all duration-300 shadow shadow-black/20"
                            >
                                <button
                                    onClick={() => toggleOpen(idx)}
                                    className="w-full px-6 py-5 flex items-center justify-between font-satoshi font-bold text-base text-white focus:outline-none select-none text-left"
                                >
                                    <span>{item.question}</span>
                                    <div className="p-1.5 rounded-full bg-white/5 border border-white/10 text-slate-400 group-hover:text-white flex items-center justify-center">
                                        {isOpen ? (
                                            <ChevronUp className="h-4 w-4" />
                                        ) : (
                                            <ChevronDown className="h-4 w-4" />
                                        )}
                                    </div>
                                </button>

                                {/* Animated Answer height drawer */}
                                <div className={cn(
                                    "grid transition-all duration-300 ease-in-out",
                                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                                )}>
                                    <div className="overflow-hidden">
                                        <p className="px-6 pb-6 text-sm text-slate-400 leading-relaxed font-sans border-t border-white/5 pt-4">
                                            {item.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

        </section>
    )
}

export default FaqSection
