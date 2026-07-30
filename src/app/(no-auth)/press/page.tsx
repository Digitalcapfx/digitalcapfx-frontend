import type { Metadata } from 'next'
import PressKitPage from '@/components/pages/no-auth/press-kit/PressKitPage'

export const metadata: Metadata = {
  title: 'Press Kit & Media Resources | DigitalCap FX',
  description:
    'Resources for journalists, bloggers, and partners. Download official DigitalCap FX brand assets, logos, press releases, product screenshots, and executive bios.',
}

export default function Page() {
  return <PressKitPage />
}
