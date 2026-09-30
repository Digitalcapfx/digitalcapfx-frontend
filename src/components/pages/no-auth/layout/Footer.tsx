import React from 'react'
import Link from 'next/link'
import { Mail, Shield } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'
import { useLanguageStore } from '@/store/languageStore'

// Custom inline SVG icons for brands not present in this lucide-react version
const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
        <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
    </svg>
);

const SOCIAL_LINKS = [
    { icon: TwitterIcon, href: '#', label: 'Twitter' },
    { icon: GithubIcon, href: '#', label: 'GitHub' },
    { icon: LinkedinIcon, href: '#', label: 'LinkedIn' },
    { icon: Mail, href: '#', label: 'Email' },
];

// Change #5: Added Conformité & Réglementation section in footer
const FOOTER_SECTIONS = [
    {
        titleKey: 'footer.product',
        title: 'Produit',
        links: [
            { labelKey: 'footer.features', label: 'Fonctionnalités', href: '#features' },
            { labelKey: 'footer.supplierPayments', label: 'Paiements Fournisseurs', href: '#how-it-works' },
            { labelKey: 'footer.exchangeRates', label: 'Taux de Change', href: '#' },
            { labelKey: 'footer.virtualCards', label: 'Cartes Virtuelles', href: '#' },
        ],
    },
    {
        titleKey: 'footer.company',
        title: 'Entreprise',
        links: [
            { labelKey: 'footer.aboutUs', label: 'À Propos', href: '/about' },
            { labelKey: 'footer.careers', label: 'Carrières', href: '/careers' },
            { labelKey: 'footer.blog', label: 'Blog', href: '/blog' },
            { labelKey: 'footer.pressKit', label: 'Presse', href: '/press-kit' },
            { labelKey: 'footer.contact', label: 'Contact', href: '/contact' },
        ],
    },
    {
        titleKey: 'footer.compliance',
        title: 'Conformité & Réglementation',
        links: [
            { labelKey: 'footer.compliancePage', label: 'Cadre Réglementaire', href: '/compliance' },
            { labelKey: 'footer.kycKyb', label: 'Procédures KYC/KYB', href: '/compliance#kyc' },
            { labelKey: 'footer.amlCft', label: 'Politique LCB-FT', href: '/compliance#aml' },
            { labelKey: 'footer.dataProtection', label: 'Protection des Données', href: '/compliance#data' },
            { labelKey: 'footer.complaints', label: 'Réclamations', href: '/compliance#complaints' },
        ],
    },
    {
        titleKey: 'footer.legal',
        title: 'Légal',
        links: [
            { labelKey: 'footer.privacyPolicy', label: 'Politique de Confidentialité', href: '/privacy' },
            { labelKey: 'footer.termsOfService', label: 'Conditions d\'Utilisation', href: '/terms' },
            { labelKey: 'footer.cookiePolicy', label: 'Politique de Cookies', href: '#cookie-policy' },
        ],
    },
];

// Change #4: Removed "FDIC Insured" and "SOC 2 Certified" — unsubstantiated claims.
// Only display verifiable security measures.
const COMPLIANCE_ITEMS = [
    { labelKey: 'footer.encryption', label: 'Chiffrement 256-bit' },
    { labelKey: 'footer.segregation', label: 'Fonds Ségrégués' },
    { labelKey: 'footer.amlCompliant', label: 'Conformité LCB-FT' },
];

const Footer = () => {
    const { t } = useLanguageStore();

    return (
        <footer className="w-full bg-[#050816] text-slate-400 mt-auto">
            {/* Top Grid Section */}
            <section className="mx-auto px-4 md:px-8 py-16 grid grid-cols-12 gap-8 lg:gap-12">

                {/* Brand Column — Change #1: Updated tagline for B2B positioning */}
                <div className="col-span-12 lg:col-span-4 space-y-6">
                    <Logo href="/" size="md" />
                    <p className="text-sm leading-relaxed text-slate-400 max-w-sm font-sans">
                        {t('footer.tagline', { defaultValue: 'Paiements internationaux pour les entreprises africaines. Collectez en monnaie locale, convertissez et payez vos fournisseurs dans le monde entier.' })}
                    </p>
                    <div className="flex items-center space-x-3">
                        {SOCIAL_LINKS.map((social) => {
                            const IconComponent = social.icon;
                            return (
                                <Link
                                    key={social.label}
                                    href={social.href}
                                    aria-label={social.label}
                                    className="p-2.5 rounded-full border border-white/10 text-slate-400 hover:text-white transition duration-200 bg-white/5 hover:bg-white/10 hover:border-white/20 inline-flex items-center justify-center"
                                >
                                    <IconComponent className="h-4 w-4" />
                                </Link>
                            )
                        })}
                    </div>
                </div>

                {/* Navigation Sections */}
                <div className="col-span-12 lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {FOOTER_SECTIONS.map((section) => (
                        <div key={section.title} className="space-y-4">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-satoshi">
                                {t(section.titleKey, { defaultValue: section.title })}
                            </h4>
                            <ul className="space-y-3">
                                {section.links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-slate-400 hover:text-white transition duration-200 font-sans"
                                        >
                                            {t(link.labelKey, { defaultValue: link.label })}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

            </section>

            {/* Middle Compliance Section — Change #4: Only verifiable claims */}
            <section className="border-t border-white/5">
                <div className="mx-auto px-4 md:px-8 py-8">
                    <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
                        {COMPLIANCE_ITEMS.map((item) => (
                            <div key={item.label} className="flex items-center space-x-2 text-xs font-medium text-slate-400">
                                <Shield className="h-5 w-5 text-emerald-500 fill-emerald-500/10" />
                                <span className="font-sans">{t(item.labelKey, { defaultValue: item.label })}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Bottom Copy/Legal Section */}
            <section className="border-t border-white/5 bg-black/20">
                <div className="mx-auto px-4 md:px-8 py-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-slate-500 font-sans">
                        © {new Date().getFullYear()} Digitalcap FX. {t('footer.allRights', { defaultValue: 'Tous droits réservés.' })}
                    </p>
                    <div className="flex items-center space-x-6">
                        <Link href="/privacy" className="text-xs text-slate-500 hover:text-slate-400 font-sans transition">
                            {t('footer.privacy', { defaultValue: 'Confidentialité' })}
                        </Link>
                        <Link href="/terms" className="text-xs text-slate-500 hover:text-slate-400 font-sans transition">
                            {t('footer.terms', { defaultValue: 'Conditions' })}
                        </Link>
                        <Link href="/compliance" className="text-xs text-slate-500 hover:text-slate-400 font-sans transition">
                            {t('footer.complianceLink', { defaultValue: 'Conformité' })}
                        </Link>
                    </div>
                </div>
            </section>

        </footer>
    )
}

export default Footer