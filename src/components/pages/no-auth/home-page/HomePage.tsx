import React from 'react'
import HeroSection from './HeroSection'
import RatesMarquee from './RatesMarquee'
import TrustedMarquee from './TrustedMarquee'
import FeaturesSection from './FeaturesSection'
import HowItWorksSection from './HowItWorksSection'
import ReviewsSection from './ReviewsSection'
import ComparisonSection from './ComparisonSection'
import FaqSection from './FaqSection'
import CtaSection from './CtaSection'
import NewsletterSection from './NewsletterSection'

const HomePage = () => {
    return (
        <div className="max-w-7xl mx-auto">
            <HeroSection />
            <RatesMarquee />
            <TrustedMarquee />
            <FeaturesSection />
            <HowItWorksSection />
            <ReviewsSection />
            <ComparisonSection />
            <FaqSection />
            <CtaSection />
            <NewsletterSection />
        </div>
    )
}

export default HomePage