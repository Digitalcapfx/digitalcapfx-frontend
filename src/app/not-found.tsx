'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Home, Compass } from 'lucide-react'
import NoAuthLayout from '@/components/pages/no-auth/layout/NoAuthLayout'

export default function NotFound() {
  const router = useRouter()

  return (
    <NoAuthLayout>
      <div className="relative min-h-[calc(100vh-200px)] flex flex-col items-center justify-center py-16 px-4 text-center overflow-hidden">
        {/* Ambient background glow effects */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-8">

          {/* Animated 404 Visual Badge */}
          <div className="relative inline-flex items-center justify-center">
            {/* Glowing outer ring */}
            <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-primary-500/20 via-cyan-500/30 to-purple-500/20 blur-xl opacity-75 animate-pulse" style={{ animationDuration: '4s' }} />

            <div className="relative flex items-center justify-center gap-3 bg-[#0C1224] border border-[#1E293B] shadow-2xl rounded-3xl px-8 py-4 backdrop-blur-md">
              <div className="w-10 h-10 rounded-2xl bg-primary-500/15 border border-primary-500/30 flex items-center justify-center text-primary-400">
                <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: '15s' }} />
              </div>
              <span className="font-mono text-5xl md:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400">
                404
              </span>
              <span className="text-[10px] font-bold tracking-widest text-primary-400 uppercase font-mono bg-primary-500/10 border border-primary-500/20 px-2.5 py-1 rounded-full">
                Not Found
              </span>
            </div>
          </div>

          {/* Heading & Subtitle */}
          <div className="space-y-3">
            <h1 className="text-3xl md:text-5xl font-black text-white font-satoshi tracking-tight leading-tight">
              Lost in the Digital Financial Sphere?
            </h1>
            <p className="text-slate-400 text-sm md:text-base font-sans max-w-lg mx-auto leading-relaxed">
              The page you are looking for has been moved, deleted, or doesn't exist on the DigitalCap FX portal.
            </p>
          </div>

          {/* Navigation Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-2xl text-xs font-bold bg-[#131B30] border border-white/10 text-slate-200 hover:text-white hover:bg-white/10 hover:border-white/20 transition duration-200 shadow-md cursor-pointer active:scale-95"
            >
              <ArrowLeft className="w-4 h-4 text-slate-400" />
              <span>Go Back</span>
            </button>

            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-2xl text-xs font-bold bg-brand-gradient text-white hover:opacity-95 shadow-lg shadow-primary-500/20 transition duration-200 cursor-pointer active:scale-95"
            >
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>

            {/* <Link
              href="/overview"
              className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-2xl text-xs font-bold bg-[#131B30] border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500/50 transition duration-200 shadow-md cursor-pointer active:scale-95"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>User Dashboard</span>
            </Link> */}
          </div>

        </div>
      </div>
    </NoAuthLayout>
  )
}
