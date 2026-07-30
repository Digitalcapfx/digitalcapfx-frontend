import type { Metadata } from 'next'
import BlogPage from '@/components/pages/no-auth/blog/BlogPage'

export const metadata: Metadata = {
  title: 'Blog & Insights for Global Businesses | DigitalCap FX',
  description:
    'Expert perspectives on payments, FX, treasury management, API engineering, and regulatory compliance for businesses operating at scale.',
}

export default function Page() {
  return <BlogPage />
}
