import type { Metadata } from 'next'
import AboutUsPage from '@/components/pages/no-auth/about-us/AboutUsPage'

export const metadata: Metadata = {
  title: 'About Us | Building Africa\'s Financial Infrastructure',
  description:
    'DigitalCap FX is building the next-generation financial infrastructure for Sub-Saharan Africa. Learn about our mission, vision, leadership team, and platform impact.',
}

export default function Page() {
  return <AboutUsPage />
}
