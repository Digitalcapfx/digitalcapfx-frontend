import type { Metadata } from 'next'
import CareersPage from '@/components/pages/no-auth/careers/CareersPage'

export const metadata: Metadata = {
  title: 'Careers | Build the Future of Global Finance',
  description:
    'Join DigitalCap FX. Remote-first team building financial infrastructure for Sub-Saharan Africa. View open positions in engineering, product, finance, operations, and sales.',
}

export default function Page() {
  return <CareersPage />
}
