'use client'

import React, { useEffect } from 'react'
import { AlertCircle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

interface PageErrorProps {
    error: Error & { digest?: string }
    reset: () => void
}

export const PageError: React.FC<PageErrorProps> = ({ error, reset }) => {
    useEffect(() => {
        console.error('Portal error boundary caught:', error)
    }, [error])

    return (
        <div className="w-full min-h-[50vh] flex flex-col items-center justify-center p-6 text-center select-none bg-[#0C1224]/30 border border-[#131B30] rounded-3xl animate-in fade-in duration-300">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/25 flex items-center justify-center text-rose-455 mb-4">
                <AlertCircle className="h-6 w-6" />
            </div>

            <h3 className="font-satoshi font-black text-base text-white mb-2">
                Unable to load request
            </h3>
            <p className="text-slate-455 text-xs font-sans max-w-sm mb-6 leading-relaxed">
                Something went wrong while fetching this page's compliance data or wallet balance information.
            </p>

            <div className="flex space-x-3 select-none">
                <button
                    onClick={() => reset()}
                    className="flex items-center space-x-1.5 bg-primary-500 hover:bg-primary-450 text-white font-bold text-xs px-4.5 py-3 rounded-xl shadow-lg transition duration-200 cursor-pointer active:scale-95"
                >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Try Again</span>
                </button>
                <Link
                    href="/dashboard"
                    className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-750 text-slate-400 font-bold text-xs px-4.5 py-3 rounded-xl border border-white/5 transition duration-200 cursor-pointer active:scale-95"
                >
                    <Home className="h-3.5 w-3.5" />
                    <span>Go Dashboard</span>
                </Link>
            </div>
        </div>
    )
}

export default PageError
