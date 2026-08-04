import type { Metadata } from 'next'
import TermsOfServicePage from '@/components/pages/no-auth/terms/TermsOfServicePage'

export const metadata: Metadata = {
  title: 'Terms of Service | DigitalCap FX',
  description:
    'Terms of Service for DigitalCap FX SARL governing multi-currency accounts, foreign exchange, cross-border transfers, virtual cards, and digital assets.',
  openGraph: {
    title: 'Terms of Service | DigitalCap FX',
    description:
      'Official Terms of Service for DigitalCap FX SARL electronic money institution platform under the laws of Cameroon, OHADA, CEMAC & WAEMU.',
  },
}

export default function Page() {
  return <TermsOfServicePage />
}
