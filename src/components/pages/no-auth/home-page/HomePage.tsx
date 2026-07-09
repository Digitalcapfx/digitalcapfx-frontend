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
        <>
            <div className="max-w-screen-2xl mx-auto">
                <HeroSection />
            </div>
            <RatesMarquee />
            <TrustedMarquee />
            <div className="max-w-screen-2xl mx-auto">
                <FeaturesSection />
                <HowItWorksSection />
            </div>
            <ReviewsSection />
            <div className="max-w-screen-2xl mx-auto">
                <ComparisonSection />
            </div>
            <FaqSection />
            <div className="max-w-screen-2xl mx-auto">
                <CtaSection />
                <NewsletterSection />
            </div>
        </>
    )
}

export default HomePage