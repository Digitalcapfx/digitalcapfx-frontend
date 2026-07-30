'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import {
    Search,
    FileText,
    Clock,
    Send,
    Sparkles,
    ChevronRight
} from 'lucide-react'
import { toast } from 'sonner'

interface Article {
    id: string
    category: 'FX' | 'Compliance' | 'Treasury' | 'Engineering' | 'Business' | 'Payments'
    categoryColor: string
    categoryBg: string
    gradient: string
    title: string
    authorName: string
    authorInitials: string
    authorBg: string
    readTime: string
}

const ARTICLES: Article[] = [
    {
        id: '1',
        category: 'FX',
        categoryColor: 'text-cyan-400',
        categoryBg: 'bg-cyan-500/10 border-cyan-500/20',
        gradient: 'from-cyan-900/40 via-blue-900/20 to-transparent',
        title: 'How to Lock FX Rates and Protect Your Business From Currency Volatility',
        authorName: 'Sarah Okonkwo',
        authorInitials: 'SO',
        authorBg: 'bg-cyan-500',
        readTime: '5 min',
    },
    {
        id: '2',
        category: 'Compliance',
        categoryColor: 'text-emerald-400',
        categoryBg: 'bg-emerald-500/10 border-emerald-500/20',
        gradient: 'from-emerald-900/40 via-teal-900/20 to-transparent',
        title: 'KYB Explained: What Every Fintech Founder Needs to Know in 2026',
        authorName: 'Aisha Balogun',
        authorInitials: 'AB',
        authorBg: 'bg-emerald-500',
        readTime: '6 min',
    },
    {
        id: '3',
        category: 'Treasury',
        categoryColor: 'text-purple-400',
        categoryBg: 'bg-purple-500/10 border-purple-500/20',
        gradient: 'from-purple-900/40 via-indigo-900/20 to-transparent',
        title: 'Multi-Currency Treasury: A Practical Guide for Growing African Businesses',
        authorName: 'Kofi Asante',
        authorInitials: 'KA',
        authorBg: 'bg-purple-500',
        readTime: '7 min',
    },
    {
        id: '4',
        category: 'Engineering',
        categoryColor: 'text-amber-400',
        categoryBg: 'bg-amber-500/10 border-amber-500/20',
        gradient: 'from-amber-900/40 via-orange-900/20 to-transparent',
        title: 'Building a Payment API That Handles 10,000 TPS Without Breaking',
        authorName: 'Remi Adebayo',
        authorInitials: 'RA',
        authorBg: 'bg-amber-500',
        readTime: '10 min',
    },
    {
        id: '5',
        category: 'Business',
        categoryColor: 'text-rose-400',
        categoryBg: 'bg-rose-500/10 border-rose-500/20',
        gradient: 'from-rose-900/40 via-red-900/20 to-transparent',
        title: 'Why Flutterwave, Wave, and MFS Africa All Chose DigitalCap FX for Their Treasury',
        authorName: 'David Mensah',
        authorInitials: 'DM',
        authorBg: 'bg-rose-500',
        readTime: '4 min',
    },
    {
        id: '6',
        category: 'Payments',
        categoryColor: 'text-blue-400',
        categoryBg: 'bg-blue-500/10 border-blue-500/20',
        gradient: 'from-blue-900/40 via-sky-900/20 to-transparent',
        title: 'SWIFT vs API-Based Payments: Which Should Your Business Use in 2026?',
        authorName: 'Sarah Okonkwo',
        authorInitials: 'SO',
        authorBg: 'bg-blue-500',
        readTime: '6 min',
    },
    {
        id: '7',
        category: 'FX',
        categoryColor: 'text-cyan-400',
        categoryBg: 'bg-cyan-500/10 border-cyan-500/20',
        gradient: 'from-cyan-900/40 via-blue-900/20 to-transparent',
        title: 'Understanding Interbank FX Rates: The Institutional Advantage Explained',
        authorName: 'Ahmed Al-Rashid',
        authorInitials: 'AR',
        authorBg: 'bg-cyan-500',
        readTime: '5 min',
    },
    {
        id: '8',
        category: 'Compliance',
        categoryColor: 'text-emerald-400',
        categoryBg: 'bg-emerald-500/10 border-emerald-500/20',
        gradient: 'from-emerald-900/40 via-teal-900/20 to-transparent',
        title: 'AML Obligations for African Businesses Operating in the UK',
        authorName: 'Aisha Balogun',
        authorInitials: 'AB',
        authorBg: 'bg-emerald-500',
        readTime: '8 min',
    },
    {
        id: '9',
        category: 'Engineering',
        categoryColor: 'text-amber-400',
        categoryBg: 'bg-amber-500/10 border-amber-500/20',
        gradient: 'from-amber-900/40 via-orange-900/20 to-transparent',
        title: 'Webhook Reliability at Scale: Lessons from Processing $2B in Payments',
        authorName: 'Remi Adebayo',
        authorInitials: 'RA',
        authorBg: 'bg-amber-500',
        readTime: '9 min',
    },
]

const CATEGORIES = ['All', 'Payments', 'Treasury', 'Compliance', 'FX', 'Engineering', 'Business']

export default function BlogPage() {
    const [selectedCategory, setSelectedCategory] = useState('All')
    const [searchQuery, setSearchQuery] = useState('')
    const [newsletterEmail, setNewsletterEmail] = useState('')

    const filteredArticles = useMemo(() => {
        return ARTICLES.filter((art) => {
            const matchesCategory =
                selectedCategory === 'All' || art.category.toLowerCase() === selectedCategory.toLowerCase()
            const matchesQuery =
                art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                art.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                art.category.toLowerCase().includes(searchQuery.toLowerCase())
            return matchesCategory && matchesQuery
        })
    }, [selectedCategory, searchQuery])

    const handleArticleClick = (title: string) => {
        toast.info(`Opening article: "${title}"`)
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
                {/* 1. HERO & SEARCH SECTION */}
                <div className="relative py-10 md:py-16 px-4 md:px-8 max-w-7xl mx-auto text-center space-y-6">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 bg-primary-500/10 border border-primary-500/20 rounded-full">
                        <Sparkles className="h-3 w-3 text-primary-400" />
                        <span className="text-[11px] font-bold text-primary-400 uppercase tracking-widest">
                            BLOG
                        </span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                        Insights for{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-cyan-400 to-blue-500">
                            Global Businesses.
                        </span>
                    </h1>

                    <p className="text-slate-400 text-xs sm:text-sm md:text-base leading-relaxed max-w-xl mx-auto font-sans">
                        Expert perspectives on payments, FX, treasury, and compliance – for businesses operating at scale.
                    </p>

                    {/* Search Input Bar */}
                    <div className="pt-2 max-w-xl mx-auto relative">
                        <div className="relative flex items-center">
                            <Search className="absolute left-4 h-4 w-4 text-slate-400 pointer-events-none" />
                            <input
                                type="text"
                                placeholder="Search articles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-[#080E1E] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-primary-500 transition placeholder-slate-500 font-sans shadow-lg"
                            />
                        </div>
                    </div>
                </div>

                {/* 2. CATEGORY FILTERS & ARTICLE COUNT */}
                <div className="py-6 px-4 md:px-8 max-w-7xl mx-auto">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                        {/* Category Pills */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                            {CATEGORIES.map((cat) => {
                                const isActive = selectedCategory === cat
                                return (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`px-4 py-1.5 rounded-full text-xs font-semibold transition shrink-0 border ${
                                            isActive
                                                ? 'bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-500/20'
                                                : 'bg-[#080E1E] border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                                        }`}
                                    >
                                        {cat}
                                    </button>
                                )
                            })}
                        </div>

                        {/* Article Counter */}
                        <div className="text-xs text-slate-500 font-mono shrink-0">
                            {filteredArticles.length} {filteredArticles.length === 1 ? 'article' : 'articles'}
                        </div>
                    </div>
                </div>

                {/* 3. 9 BLOG ARTICLES GRID */}
                <div className="py-8 px-4 md:px-8 max-w-7xl mx-auto">
                    {filteredArticles.length === 0 ? (
                        <div className="text-center py-16 bg-[#080E1E] border border-white/10 rounded-2xl space-y-3">
                            <FileText className="h-10 w-10 text-slate-500 mx-auto" />
                            <h3 className="text-base font-bold text-white">No articles found</h3>
                            <p className="text-xs text-slate-400">Try adjusting your search query or selected category filter.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredArticles.map((article) => (
                                <div
                                    key={article.id}
                                    onClick={() => handleArticleClick(article.title)}
                                    className="bg-[#0C1224] border border-white/10 rounded-2xl overflow-hidden hover:border-primary-500/40 transition duration-300 shadow-xl group cursor-pointer flex flex-col justify-between"
                                >
                                    <div>
                                        {/* Card Header Placeholder / Graphic */}
                                        <div className={`h-40 bg-gradient-to-b ${article.gradient} p-4 relative flex items-center justify-center border-b border-white/5`}>
                                            <div className={`absolute top-4 left-4 px-2.5 py-0.5 rounded-md border text-[10px] font-bold tracking-wider uppercase font-mono ${article.categoryBg} ${article.categoryColor}`}>
                                                {article.category}
                                            </div>

                                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 group-hover:scale-110 group-hover:text-white transition duration-300">
                                                <FileText className="h-6 w-6" />
                                            </div>
                                        </div>

                                        {/* Card Body */}
                                        <div className="p-6 space-y-3">
                                            <h3 className="text-base font-bold text-white leading-snug group-hover:text-primary-400 transition line-clamp-2">
                                                {article.title}
                                            </h3>
                                        </div>
                                    </div>

                                    {/* Card Footer: Author & Read Time */}
                                    <div className="px-6 pb-6 pt-2 flex items-center justify-between text-xs border-t border-white/5 mt-auto">
                                        <div className="flex items-center space-x-2.5">
                                            <div className={`w-6 h-6 rounded-full ${article.authorBg} flex items-center justify-center text-[10px] font-bold text-white`}>
                                                {article.authorInitials}
                                            </div>
                                            <span className="text-slate-300 text-xs font-medium">{article.authorName}</span>
                                        </div>

                                        <div className="flex items-center space-x-1 text-[11px] text-slate-500 font-mono">
                                            <Clock className="h-3 w-3" />
                                            <span>{article.readTime}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
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
