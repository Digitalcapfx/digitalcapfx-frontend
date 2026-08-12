'use client'

import React from 'react'

export const ActivityChart: React.FC = () => {
    return (
        <div className="relative h-[160px] w-full pt-4">
            {/* Y Axis Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between text-[9px] text-slate-500 select-none pointer-events-none pb-6 font-mono">
                <div className="flex items-center justify-between border-b border-white/[0.02] pb-0.5 w-full"><span>160</span><div className="flex-grow ml-2 border-t border-white/[0.03] border-dashed"></div></div>
                <div className="flex items-center justify-between border-b border-white/[0.02] pb-0.5 w-full"><span>120</span><div className="flex-grow ml-2 border-t border-white/[0.03] border-dashed"></div></div>
                <div className="flex items-center justify-between border-b border-white/[0.02] pb-0.5 w-full"><span>80</span><div className="flex-grow ml-2 border-t border-white/[0.03] border-dashed"></div></div>
                <div className="flex items-center justify-between border-b border-white/[0.02] pb-0.5 w-full"><span>40</span><div className="flex-grow ml-2 border-t border-white/[0.03] border-dashed"></div></div>
                <div className="flex items-center justify-between w-full"><span>0</span><div className="flex-grow ml-2 border-t border-white/[0.03] border-dashed"></div></div>
            </div>

            {/* Path Drawing */}
            <div className="absolute inset-0 pl-8 pb-6 pt-1">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="wave-grad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
                        </linearGradient>
                    </defs>
                    <path
                        d="M 0,80 C 15,75 25,82 40,65 C 55,48 70,55 85,38 C 93,30 97,18 100,10 L 100,100 L 0,100 Z"
                        fill="url(#wave-grad)"
                    />
                    <path
                        d="M 0,80 C 15,75 25,82 40,65 C 55,48 70,55 85,38 C 93,30 97,18 100,10"
                        fill="none"
                        stroke="#3B82F6"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />

                    {/* Interactive Glowing Data Points */}
                    <circle cx="0" cy="80" r="3" className="fill-[#080D1C] stroke-[#3B82F6] stroke-[2]" />
                    <circle cx="40" cy="65" r="3" className="fill-[#080D1C] stroke-[#3B82F6] stroke-[2]" />
                    <circle cx="85" cy="38" r="3" className="fill-[#080D1C] stroke-[#3B82F6] stroke-[2]" />
                    <circle cx="100" cy="10" r="4" className="fill-[#3B82F6] stroke-white stroke-[2]" />
                </svg>
            </div>

            {/* X Axis Labels */}
            <div className="absolute bottom-0 left-8 right-0 flex justify-between text-[9px] text-slate-500 font-mono select-none">
                <span>May 28</span>
                <span>Jun 1</span>
                <span>Jun 5</span>
                <span>Jun 9</span>
                <span>Jun 13</span>
                <span>Jun 17</span>
                <span>Jun 25</span>
            </div>
        </div>
    );
};

export default ActivityChart;
