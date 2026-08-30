'use client';

import React from 'react';
import Image from 'next/image';
import { 
  Wrench, 
  RefreshCw, 
  ShieldCheck, 
  Server, 
  Lock, 
  Activity, 
  Sparkles,
  Zap
} from 'lucide-react';

interface MaintenanceScreenProps {
  message?: string;
  onRefresh?: () => void;
  isChecking?: boolean;
}

export const MaintenanceScreen: React.FC<MaintenanceScreenProps> = ({
  message,
  onRefresh,
  isChecking = false,
}) => {
  const displayMessage =
    message ||
    'The service is currently undergoing scheduled maintenance. Please check back later.';

  return (
    <div className="min-h-screen w-full bg-[#050816] text-white flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden select-none">
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-[140px] pointer-events-none animate-pulse" style={{ animationDuration: '6s' }} />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-amber-500/10 rounded-full blur-[110px] pointer-events-none" />

      {/* Cyber Grid Background Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ 
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)', 
          backgroundSize: '28px 28px' 
        }} 
      />

      <div className="relative z-10 max-w-xl w-full flex flex-col items-center text-center space-y-6 sm:space-y-8 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Brand Logo Header */}
        <div className="flex items-center justify-center space-x-3 mb-2">
          <Image
            src="/DFXLogo.svg"
            alt="DigitalCap FX Logo"
            width={170}
            height={38}
            className="h-8 sm:h-10 w-auto object-contain brightness-110 contrast-125"
            priority
          />
        </div>

        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 shadow-lg shadow-amber-500/10">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          <span className="text-[11px] font-mono font-bold tracking-widest uppercase">
            Scheduled System Upgrade
          </span>
        </div>

        {/* Central Visual Hologram */}
        <div className="relative flex items-center justify-center my-2">
          {/* Glowing orbital elements */}
          <div className="absolute w-32 h-32 sm:w-36 sm:h-36 rounded-full border border-amber-500/20 animate-spin" style={{ animationDuration: '20s' }} />
          <div className="absolute w-40 h-40 sm:w-44 sm:h-44 rounded-full border border-dashed border-cyan-500/20 animate-spin" style={{ animationDuration: '30s', animationDirection: 'reverse' }} />
          
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-b from-[#131B30] to-[#0C1224] border border-[#1E293B] shadow-2xl flex items-center justify-center text-amber-400 group">
            <div className="absolute inset-0 rounded-3xl bg-amber-500/10 blur-md opacity-50 group-hover:opacity-100 transition duration-300" />
            <Wrench className="w-9 h-9 sm:w-10 sm:h-10 relative z-10 text-amber-400 animate-bounce" style={{ animationDuration: '3s' }} />
          </div>
        </div>

        {/* Main Content Info */}
        <div className="space-y-3 px-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white font-satoshi tracking-tight leading-snug">
            We’ll Be Right Back
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm font-sans max-w-md mx-auto leading-relaxed">
            {displayMessage}
          </p>
        </div>

        {/* Action Controls */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isChecking}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-11 px-6 rounded-2xl text-xs font-bold bg-brand-gradient text-white hover:opacity-95 shadow-lg shadow-primary-500/25 transition duration-200 cursor-pointer active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
              <span>{isChecking ? 'Checking Status...' : 'Check Status Again'}</span>
            </button>
          )}
        </div>

        {/* Telemetry Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full pt-4">
          <div className="bg-[#0C1224]/80 border border-white/5 rounded-2xl p-3.5 text-left flex items-start space-x-3 backdrop-blur-md">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200">System Enhancements</p>
              <p className="text-[11px] text-slate-400 leading-tight mt-0.5">Upgrading FX execution speed & liquidity pipelines</p>
            </div>
          </div>

          <div className="bg-[#0C1224]/80 border border-white/5 rounded-2xl p-3.5 text-left flex items-start space-x-3 backdrop-blur-md">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200">Wallet Funds Protected</p>
              <p className="text-[11px] text-slate-400 leading-tight mt-0.5">All multi-currency accounts and crypto vaults are safe</p>
            </div>
          </div>
        </div>

        {/* Security Footer */}
        <div className="pt-4 border-t border-white/5 flex flex-wrap items-center justify-center gap-2 text-[10px] text-slate-500 font-mono">
          <Lock className="w-3 h-3 text-slate-500" />
          <span>DigitalCap FX Global Neo-Bank Platform</span>
          <span className="hidden sm:inline">•</span>
          <span className="flex items-center gap-1">
            <Activity className="w-3 h-3 text-amber-500" />
            <span>Operational Monitor Active</span>
          </span>
        </div>

      </div>
    </div>
  );
};

export default MaintenanceScreen;
