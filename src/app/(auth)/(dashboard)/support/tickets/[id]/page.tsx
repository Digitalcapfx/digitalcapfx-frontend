import TicketsView from '@/components/pages/auth/support/TicketsView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Support Conversation | DigitalCapFx',
  description: 'Discuss ticket issues with compliance agents',
};

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <TicketsView ticketId={id} />;
}
