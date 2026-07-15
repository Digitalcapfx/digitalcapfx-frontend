import { SupportHeader } from '@/components/pages/auth/support/SupportHeader';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Support Desk | DigitalCapFx',
  description: 'Search FAQs or open support tickets',
};

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6 mx-auto text-left">
      <SupportHeader />
      {children}
    </div>
  );
}
