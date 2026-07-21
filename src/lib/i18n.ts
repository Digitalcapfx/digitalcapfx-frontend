import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

const resources = {
  en: {
    translation: {
        'nav.overview': 'Overview',
        'nav.wallets': 'Wallets',
        'nav.exchange': 'Exchange',
        'nav.cards': 'Cards',
        'nav.activity': 'Activity',
        'nav.referrals': 'Referrals',
        'nav.support': 'Support Desk',
        'nav.vtu': 'Airtime & Bills',
        'nav.settings': 'Settings',
        'nav.signout': 'Sign out',
        'action.send': 'Send',
        'action.sendmoney': 'Send Money',
        'action.receive': 'Receive',
        'action.instant': 'Instant',
        'action.provision': 'Provision Wallet',
        'action.refresh': 'Refresh',
        'section.fiat': 'Fiat Accounts',
        'section.crypto': 'On-Chain Crypto Wallets',
        'section.instant': 'Instant USD',
        'section.outflow': 'Outflow Breakdown',
        'section.recent': 'Recent Activity',
        'section.portfolio': 'Portfolio Allocation',
        'section.overview': 'Overview Dashboard',
        'live.rates': 'Live Rates',
        'welcome.back': 'Welcome back',
        'portfolio.total': 'Total Portfolio',
        'portfolio.estimated': 'Estimated value in USD',
        'activity.loading': 'Loading transaction logs...',
        'activity.empty.title': 'No transactions yet',
        'activity.empty.subtitle': 'Your activity will appear here',
        'wallets.subtitle': 'Manage fiat and on-chain crypto wallets',
        'wallets.search': 'Search wallets...',
        'wallets.empty.fiat': 'No matching fiat accounts found',
        'wallets.empty.crypto': 'No provisioned on-chain crypto wallets found'
    }
  },
  fr: {
    translation: {
        'nav.overview': 'Aperçu',
        'nav.wallets': 'Portefeuilles',
        'nav.exchange': 'Échange',
        'nav.cards': 'Cartes',
        'nav.activity': 'Activité',
        'nav.referrals': 'Parrainages',
        'nav.support': 'Assistance',
        'nav.vtu': 'Recharges & Factures',
        'nav.settings': 'Paramètres',
        'nav.signout': 'Se déconnecter',
        'action.send': 'Envoyer',
        'action.sendmoney': "Envoyer de l'argent",
        'action.receive': 'Recevoir',
        'action.instant': 'Instantané',
        'action.provision': 'Créer Portefeuille',
        'action.refresh': 'Rafraîchir',
        'section.fiat': 'Comptes Fiat',
        'section.crypto': 'Portefeuilles Crypto On-Chain',
        'section.instant': 'USD Instantané',
        'section.outflow': 'Répartition des Sorties',
        'section.recent': 'Activité Récente',
        'section.portfolio': 'Allocation Portefeuille',
        'section.overview': 'Tableau de Bord',
        'live.rates': 'Tarifs en direct',
        'welcome.back': 'Bon retour',
        'portfolio.total': 'Portefeuille Total',
        'portfolio.estimated': 'Valeur estimée en USD',
        'activity.loading': 'Chargement des transactions...',
        'activity.empty.title': 'Aucune transaction pour le moment',
        'activity.empty.subtitle': 'Votre activité apparaîtra ici',
        'wallets.subtitle': 'Gérez vos comptes fiat et crypto sur la chaîne',
        'wallets.search': 'Rechercher...',
        'wallets.empty.fiat': 'Aucun compte fiat trouvé',
        'wallets.empty.crypto': 'Aucun portefeuille crypto trouvé'
    }
  },
  es: {
    translation: {
        'nav.overview': 'Resumen',
        'nav.wallets': 'Carteras',
        'nav.exchange': 'Intercambio',
        'nav.cards': 'Tarjetas',
        'nav.activity': 'Actividad',
        'nav.referrals': 'Referencias',
        'nav.support': 'Soporte',
        'nav.vtu': 'Saldo & Facturas',
        'nav.settings': 'Ajustes',
        'nav.signout': 'Cerrar sesión',
        'action.send': 'Enviar',
        'action.sendmoney': 'Enviar dinero',
        'action.receive': 'Recibir',
        'action.instant': 'Instantáneo',
        'action.provision': 'Provisionar Cartera',
        'action.refresh': 'Refrescar',
        'section.fiat': 'Cuentas Fiat',
        'section.crypto': 'Carteras Cripto en la Cadena',
        'section.instant': 'USD Instantáneo',
        'section.outflow': 'Desglose de Salidas',
        'section.recent': 'Actividad Reciente',
        'section.portfolio': 'Asignación de Cartera',
        'section.overview': 'Resumen de Panel',
        'live.rates': 'Tasas en vivo',
        'welcome.back': 'Bienvenido de nuevo',
        'portfolio.total': 'Cartera Total',
        'portfolio.estimated': 'Valor estimado en USD',
        'activity.loading': 'Cargando transacciones...',
        'activity.empty.title': 'Aún no hay transacciones',
        'activity.empty.subtitle': 'Su actividad aparecerá aquí',
        'wallets.subtitle': 'Gestione sus cuentas fiat y carteras de criptomonedas',
        'wallets.search': 'Buscar carteras...',
        'wallets.empty.fiat': 'No se encontraron cuentas fiat',
        'wallets.empty.crypto': 'No se encontraron carteras cripto'
    }
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng'
    }
  })

export default i18n
