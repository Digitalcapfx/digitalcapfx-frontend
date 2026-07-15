import TicketsView from '@/components/pages/auth/support/TicketsView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Support Tickets | DigitalCapFx',
  description: 'Manage active compliance support tickets',
};

export default function Page() {
  return <TicketsView />;
}
