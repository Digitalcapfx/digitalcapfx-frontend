'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Send } from 'lucide-react'

const NewsletterSection = () => {
    const [email, setEmail] = useState('');

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle subscription simulation
        setEmail('');
    };

    return (
        <section id="newsletter">
            <div className="pb-16 max-w-7xl mx-auto">
                <div className="bg-[#0C1224]/40 border border-white/5 rounded-[24px] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">

                    {/* Text Details */}
                    <div className="text-left space-y-1">
                        <h3 className="font-satoshi font-bold text-lg sm:text-xl text-white tracking-tight">
                            Stay in the loop
                        </h3>
                        <p className="text-slate-400 text-xs sm:text-sm font-sans">
                            Get product updates, market insights, and exclusive offers. No spam, ever.
                        </p>
                    </div>

                    {/* Form Wrapper */}
                    <form
                        onSubmit={handleSubscribe}
                        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto shrink-0"
                    >
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            className="bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary-500/50 w-full sm:w-[260px] md:w-[280px] transition font-sans"
                        />
                        <Button
                            type="submit"
                            variant="primary"
                            className="rounded-xl px-6 h-[44px] font-semibold text-xs sm:text-sm shrink-0 whitespace-nowrap"
                            rightIcon={<Send className="h-3.5 w-3.5" />}
                        >
                            Subscribe
                        </Button>
                    </form>

                </div>
            </div>

        </section>
    )
}

export default NewsletterSection
