'use client'

import React, { useState } from 'react'
import { Send } from 'lucide-react'
import { toast } from 'sonner'

export const NewsletterSection: React.FC = () => {
    const [email, setEmail] = useState('')

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault()
        if (!email || !email.includes('@')) return
        toast.success('Thank you for subscribing to DigitalCap FX updates!')
        setEmail('')
    }

    return (
        <div className="py-10 px-4 md:px-8 bg-[#030612] text-left font-sans select-none">
            <div className="max-w-7xl mx-auto bg-[#090E1E] border border-white/10 rounded-2xl p-6 md:p-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    <div className="lg:col-span-6 space-y-1">
                        <h3 className="text-xl font-bold text-white">Stay in the loop</h3>
                        <p className="text-slate-400 text-xs">
                            Get product updates, market insights, and exclusive offers. No spam, ever.
                        </p>
                    </div>

                    <form onSubmit={handleSubscribe} className="lg:col-span-6 flex flex-col sm:flex-row gap-2.5">
                        <input
                            type="email"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-primary-500 transition placeholder-slate-500 font-sans"
                            required
                        />
                        <button
                            type="submit"
                            className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl flex items-center justify-center space-x-2 transition shrink-0 cursor-pointer"
                        >
                            <span>Subscribe</span>
                            <Send className="h-3.5 w-3.5" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default NewsletterSection
