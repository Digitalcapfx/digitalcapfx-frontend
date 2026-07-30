'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
    MessageSquare,
    Mail,
    Handshake,
    ArrowRight,
    MapPin,
    Clock,
    Send,
    Sparkles,
    CheckCircle2,
    Globe
} from 'lucide-react'
import { toast } from 'sonner'

export default function ContactPage() {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [country, setCountry] = useState('')
    const [message, setMessage] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [newsletterEmail, setNewsletterEmail] = useState('')

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!firstName.trim() || !lastName.trim()) {
            toast.error('Please enter your first and last name.')
            return
        }

        if (!email.trim() || !email.includes('@')) {
            toast.error('Please enter a valid email address.')
            return
        }

        if (!message.trim()) {
            toast.error('Please enter your message details.')
            return
        }

        setIsSubmitting(true)

        setTimeout(() => {
            setIsSubmitting(false)
            toast.success('Thank you for contacting DigitalCap FX! Our team will get back to you shortly.')
            setFirstName('')
            setLastName('')
            setEmail('')
            setPhone('')
            setCountry('')
            setMessage('')
        }, 1200)
    }

    const handleNewsletterSubscribe = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newsletterEmail || !newsletterEmail.includes('@')) {
            toast.error('Please enter a valid email address.')
            return
        }
        toast.success('Thank you for subscribing to DigitalCap FX updates!')
        setNewsletterEmail('')
    }

    return (
        <div className="w-full text-white flex flex-col font-sans relative overflow-x-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[140px] pointer-events-none"></div>
            <div className="absolute top-[600px] right-1/4 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none"></div>

            <main className="flex-grow">
                {/* 1. HERO SECTION */}
                <div className="relative py-10 md:py-16 px-4 md:px-8 max-w-7xl mx-auto text-center space-y-5">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 bg-primary-500/10 border border-primary-500/20 rounded-full">
                        <Sparkles className="h-3 w-3 text-primary-400" />
                        <span className="text-[11px] font-bold text-primary-400 uppercase tracking-widest">
                            GET IN TOUCH
                        </span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                        Let's build{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-cyan-400 to-blue-500">
                            together.
                        </span>
                    </h1>

                    <p className="text-slate-400 text-xs sm:text-sm md:text-base leading-relaxed max-w-xl mx-auto font-sans">
                        Whether you're ready to sign up, need help with our API, or want to explore a partnership — we'd love to hear from you.
                    </p>
                </div>

                {/* 2. THREE CONTACT CHANNELS CARDS */}
                <div className="py-6 px-4 md:px-8 max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
                        {/* Card 1: Sales */}
                        <div className="bg-[#0C1224] border border-white/10 rounded-2xl p-6 space-y-4 hover:border-primary-500/40 transition duration-300 shadow-xl group">
                            <div className="w-10 h-10 rounded-xl bg-primary-500/15 border border-primary-500/30 flex items-center justify-center text-primary-400 group-hover:scale-105 transition duration-300">
                                <MessageSquare className="h-5 w-5" />
                            </div>

                            <div className="space-y-1">
                                <h3 className="text-base font-bold text-white">Sales</h3>
                                <p className="text-slate-400 text-xs leading-relaxed">
                                    Ready to get started or need a custom quote?
                                </p>
                            </div>

                            <a
                                href="mailto:sales@digitalcapfx.com"
                                className="inline-flex items-center space-x-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition"
                            >
                                <span>sales@digitalcapfx.com</span>
                                <ArrowRight className="h-3.5 w-3.5" />
                            </a>
                        </div>

                        {/* Card 2: Support */}
                        <div className="bg-[#0C1224] border border-white/10 rounded-2xl p-6 space-y-4 hover:border-cyan-500/40 transition duration-300 shadow-xl group">
                            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition duration-300">
                                <Mail className="h-5 w-5" />
                            </div>

                            <div className="space-y-1">
                                <h3 className="text-base font-bold text-white">Support</h3>
                                <p className="text-slate-400 text-xs leading-relaxed">
                                    Technical help, account issues, or billing questions.
                                </p>
                            </div>

                            <a
                                href="mailto:support@digitalcapfx.com"
                                className="inline-flex items-center space-x-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition"
                            >
                                <span>support@digitalcapfx.com</span>
                                <ArrowRight className="h-3.5 w-3.5" />
                            </a>
                        </div>

                        {/* Card 3: Partnerships */}
                        <div className="bg-[#0C1224] border border-white/10 rounded-2xl p-6 space-y-4 hover:border-emerald-500/40 transition duration-300 shadow-xl group">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition duration-300">
                                <Handshake className="h-5 w-5" />
                            </div>

                            <div className="space-y-1">
                                <h3 className="text-base font-bold text-white">Partnerships</h3>
                                <p className="text-slate-400 text-xs leading-relaxed">
                                    Interested in becoming a technology or channel partner?
                                </p>
                            </div>

                            <a
                                href="mailto:partners@digitalcapfx.com"
                                className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition"
                            >
                                <span>partners@digitalcapfx.com</span>
                                <ArrowRight className="h-3.5 w-3.5" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* 3. CONTACT FORM & SIDEBAR INFO */}
                <div className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* LEFT COLUMN: Contact Form Card */}
                        <div className="lg:col-span-7 bg-[#090E1E] border border-white/10 rounded-3xl p-6 sm:p-8 md:p-10 space-y-6 shadow-2xl">
                            <div className="space-y-1">
                                <span className="text-[10px] font-bold text-primary-400 uppercase tracking-widest block font-mono">
                                    SEND A MESSAGE
                                </span>
                                <h2 className="text-2xl md:text-3xl font-extrabold text-white">
                                    Talk to us
                                </h2>
                            </div>

                            <form onSubmit={handleFormSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5 text-left">
                                        <label className="text-xs font-semibold text-slate-300 block">First name *</label>
                                        <input
                                            type="text"
                                            placeholder="Peter"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            className="w-full bg-[#050816] border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-primary-500 transition placeholder-slate-600 font-sans"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-1.5 text-left">
                                        <label className="text-xs font-semibold text-slate-300 block">Last name *</label>
                                        <input
                                            type="text"
                                            placeholder="Adeyemi"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            className="w-full bg-[#050816] border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-primary-500 transition placeholder-slate-600 font-sans"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5 text-left">
                                    <label className="text-xs font-semibold text-slate-300 block">Email *</label>
                                    <input
                                        type="email"
                                        placeholder="you@company.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-[#050816] border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-primary-500 transition placeholder-slate-600 font-sans"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5 text-left">
                                        <label className="text-xs font-semibold text-slate-300 block">Phone</label>
                                        <input
                                            type="tel"
                                            placeholder="+234 800 000 0000"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="w-full bg-[#050816] border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-primary-500 transition placeholder-slate-600 font-sans"
                                        />
                                    </div>

                                    <div className="space-y-1.5 text-left">
                                        <label className="text-xs font-semibold text-slate-300 block">Country</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Nigeria / Ivory Coast"
                                            value={country}
                                            onChange={(e) => setCountry(e.target.value)}
                                            className="w-full bg-[#050816] border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-primary-500 transition placeholder-slate-600 font-sans"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5 text-left">
                                    <label className="text-xs font-semibold text-slate-300 block">Message *</label>
                                    <textarea
                                        rows={4}
                                        placeholder="Tell us about your business, your volume, and what you're looking to achieve..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        className="w-full bg-[#050816] border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-primary-500 transition placeholder-slate-600 font-sans resize-none"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-gradient-to-r from-cyan-400 via-primary-500 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white font-bold text-xs sm:text-sm py-3.5 rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-primary-500/20 transition-all duration-200 disabled:opacity-50"
                                >
                                    <span>{isSubmitting ? 'Sending Message...' : 'Send Message'}</span>
                                    <ArrowRight className="h-4 w-4" />
                                </button>
                            </form>
                        </div>

                        {/* RIGHT COLUMN: Response Times, Offices, Map Stack */}
                        <div className="lg:col-span-5 space-y-6">
                            {/* Card 1: RESPONSE TIMES */}
                            <div className="bg-[#090E1E] border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl">
                                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block font-mono">
                                    RESPONSE TIMES
                                </span>

                                <div className="space-y-3 divide-y divide-white/5 text-xs">
                                    <div className="flex items-center justify-between pt-1">
                                        <span className="text-slate-300 font-medium">Sales enquiries</span>
                                        <span className="text-cyan-400 font-mono font-bold">&lt; 4 hours</span>
                                    </div>

                                    <div className="flex items-center justify-between pt-3">
                                        <span className="text-slate-300 font-medium">Technical support</span>
                                        <span className="text-emerald-400 font-mono font-bold">&lt; 1 hour</span>
                                    </div>

                                    <div className="flex items-center justify-between pt-3">
                                        <span className="text-slate-300 font-medium">Partnerships</span>
                                        <span className="text-cyan-400 font-mono font-bold">&lt; 24 hours</span>
                                    </div>

                                    <div className="flex items-center justify-between pt-3">
                                        <span className="text-slate-300 font-medium">General enquiries</span>
                                        <span className="text-slate-400 font-mono">1 business day</span>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2: OUR OFFICES */}
                            <div className="bg-[#090E1E] border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl">
                                <span className="text-[10px] font-bold text-primary-400 uppercase tracking-widest block font-mono">
                                    OUR OFFICES
                                </span>

                                <div className="space-y-4 text-xs">
                                    {/* Lagos */}
                                    <div className="flex items-start space-x-3">
                                        <span className="text-base leading-none">🇳🇬</span>
                                        <div className="space-y-0.5">
                                            <h4 className="font-bold text-white">Lagos, Nigeria</h4>
                                            <p className="text-slate-400 text-[11px]">1 Ozumba Mbadiwe Ave, Victoria Island</p>
                                        </div>
                                    </div>

                                    {/* London */}
                                    <div className="flex items-start space-x-3">
                                        <span className="text-base leading-none">🇬🇧</span>
                                        <div className="space-y-0.5">
                                            <h4 className="font-bold text-white">London, United Kingdom</h4>
                                            <p className="text-slate-400 text-[11px]">1 Canada Square, Canary Wharf</p>
                                        </div>
                                    </div>

                                    {/* Dubai */}
                                    <div className="flex items-start space-x-3">
                                        <span className="text-base leading-none">🇦🇪</span>
                                        <div className="space-y-0.5">
                                            <h4 className="font-bold text-white">Dubai, UAE</h4>
                                            <p className="text-slate-400 text-[11px]">DIFC, Gate Village Building 5</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Card 3: GLOBAL MAP PIN */}
                            <div className="bg-gradient-to-br from-[#0C162E] to-[#081024] border border-primary-500/20 rounded-3xl p-6 text-center space-y-3 relative overflow-hidden shadow-xl">
                                <div className="w-10 h-10 rounded-full bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto shadow-md">
                                    <MapPin className="h-5 w-5 animate-bounce" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-xs font-bold text-white">Lagos • London • Dubai</h4>
                                    <p className="text-[10px] text-cyan-400 font-mono uppercase tracking-wider">3 global offices</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. STAY IN THE LOOP (NEWSLETTER) SECTION */}
                <div className="py-10 px-4 md:px-8 bg-[#030612]">
                    <div className="max-w-7xl mx-auto bg-[#090E1E] border border-white/10 rounded-2xl p-6 md:p-10">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                            <div className="lg:col-span-6 space-y-1">
                                <h3 className="text-xl font-bold text-white">Stay in the loop</h3>
                                <p className="text-slate-400 text-xs">
                                    Get product updates, market insights, and exclusive offers. No spam, ever.
                                </p>
                            </div>

                            <form onSubmit={handleNewsletterSubscribe} className="lg:col-span-6 flex flex-col sm:flex-row gap-2.5">
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    value={newsletterEmail}
                                    onChange={(e) => setNewsletterEmail(e.target.value)}
                                    className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-primary-500 transition placeholder-slate-500 font-sans"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl flex items-center justify-center space-x-2 transition shrink-0"
                                >
                                    <span>Subscribe</span>
                                    <Send className="h-3.5 w-3.5" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
