import { ActivityPage } from '@/components/pages/auth/activity/ActivityPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Activity Logs | DigitalCapFx',
  description: 'View your account activity audit logs',
};

export default function Page() {
  return <ActivityPage />;
}
