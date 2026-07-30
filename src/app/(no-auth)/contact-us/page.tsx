import type { Metadata } from 'next'
import ContactPage from '@/components/pages/no-auth/contact/ContactPage'

export const metadata: Metadata = {
  title: 'Contact Us | Let\'s Build Together',
  description:
    'Get in touch with DigitalCap FX. Reach our sales, technical support, or partnerships team, or visit our offices in Lagos, London, and Dubai.',
}

export default function Page() {
  return <ContactPage />
}
