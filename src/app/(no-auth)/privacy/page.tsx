import type { Metadata } from 'next'
import PrivacyPolicyPage from '@/components/pages/no-auth/privacy/PrivacyPolicyPage'

export const metadata: Metadata = {
  title: 'Privacy Policy | DigitalCap FX',
  description:
    'Learn how DigitalCap FX SARL collects, uses, stores, and protects personal data in compliance with Cameroon, CEMAC, and WAEMU regulations.',
  openGraph: {
    title: 'Privacy Policy | DigitalCap FX',
    description:
      'DigitalCap FX Privacy Policy detailing data collection, KYC/AML processing, user rights, and data protection measures.',
  },
}

export default function Page() {
  return <PrivacyPolicyPage />
}
