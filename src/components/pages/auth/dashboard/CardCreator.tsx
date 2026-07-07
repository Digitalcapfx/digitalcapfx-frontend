'use client'

import React from 'react'
import { Plus } from 'lucide-react'

const CardCreator: React.FC = () => {
    return (
        <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-6 text-left flex flex-col justify-between shadow-xl min-h-[260px]">
            <div className="flex justify-between items-center select-none mb-4">
                <h3 className="font-satoshi font-bold text-base text-white">Your Card</h3>
                <button className="text-xs font-semibold text-primary-400 hover:text-primary-350 hover:underline">
                    Manage
                </button>
            </div>

            <div className="flex-grow flex items-center justify-center">
                <div className="border border-dashed border-white/10 rounded-2xl p-8 w-full h-full flex flex-col items-center justify-center space-y-3 cursor-pointer hover:border-primary-500/40 transition duration-300 select-none group">
                    <div className="w-10 h-10 rounded-full bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-primary-400 group-hover:scale-105 transition-transform duration-300">
                        <Plus className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-400 group-hover:text-white transition-colors duration-200">
                        Create virtual card
                    </span>
                </div>
            </div>
        </div>
    );
};

export default CardCreator;
