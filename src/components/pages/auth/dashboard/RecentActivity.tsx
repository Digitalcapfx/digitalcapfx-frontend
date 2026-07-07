'use client'

import React from 'react'
import { RefreshCw } from 'lucide-react'

const RecentActivity: React.FC = () => {
    return (
        <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-6 text-left shadow-xl space-y-6">
            
            {/* Header split */}
            <div className="flex justify-between items-center select-none">
                <h3 className="font-satoshi font-bold text-base text-white">Recent Activity</h3>
                <button className="text-xs font-semibold text-primary-400 hover:text-primary-350 hover:underline">
                    See all &gt;
                </button>
            </div>

            {/* Empty state container */}
            <div className="py-12 border border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center space-y-3 select-none">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-500">
                    <RefreshCw className="h-5 w-5 animate-spin-slow" />
                </div>
                <div className="text-center space-y-0.5">
                    <h4 className="text-xs font-bold text-white font-satoshi">No transactions yet</h4>
                    <p className="text-[11px] text-slate-550 font-sans">Your activity will appear here</p>
                </div>
            </div>

        </div>
    );
};

export default RecentActivity;
