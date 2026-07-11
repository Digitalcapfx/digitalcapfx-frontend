import { ReferralsPage } from '@/components/pages/auth/referrals/ReferralsPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Referrals & Rewards | DigitalFX',
  description: 'Track your referrals rewards points ledger',
};

export default function Page() {
  return <ReferralsPage />;
}
