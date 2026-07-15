import { TeamsPage } from '@/components/pages/auth/teams/TeamsPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Team Management | DigitalFX',
  description: 'Invite and manage your corporate team members',
};

export default function Page() {
  return <TeamsPage />;
}
