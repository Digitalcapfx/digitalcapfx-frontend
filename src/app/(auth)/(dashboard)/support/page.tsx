import { SupportPage } from '@/components/pages/auth/support/SupportPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Support Desk | DigitalFX',
  description: 'Search FAQs or open support tickets',
};

export default function Page() {
  return <SupportPage />;
}
