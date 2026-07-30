import type { Metadata } from 'next'
import BlogPage from '@/components/pages/no-auth/blog/BlogPage'

export const metadata: Metadata = {
  title: 'Blog & Insights for Global Businesses | DigitalCap FX',
  description:
    'Expert perspectives on payments, FX, treasury management, API engineering, and regulatory compliance for businesses operating at scale.',
  openGraph: {
    title: 'Blog & Insights | DigitalCap FX',
    description:
      'Explore expert insights on cross-border payments, interbank FX rates, KYB/AML compliance, and treasury infrastructure.',
  },
}

export default function Page() {
  return <BlogPage />
}
