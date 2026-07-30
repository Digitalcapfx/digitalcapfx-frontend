import type { Metadata } from 'next'
import AboutUsPage from '@/components/pages/no-auth/about-us/AboutUsPage'

export const metadata: Metadata = {
  title: 'About Us | Building Africa\'s Financial Infrastructure',
  description:
    'DigitalCap FX is building the next-generation financial infrastructure for Sub-Saharan Africa. Learn about our mission, vision, leadership team, and platform impact.',
  openGraph: {
    title: 'About Us | DigitalCap FX',
    description:
      'Building Africa\'s financial infrastructure for the next generation. Borderless finance, instant FX, and multi-currency business banking.',
  },
}

export default function Page() {
  return <AboutUsPage />
}
