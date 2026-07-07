'use client'

import React from 'react'
import PortfolioCard from './PortfolioCard'
import QuickActions from './QuickActions'
import WalletCarousel from '../wallet/WalletCarousel'
import CashflowStats from './CashflowStats'
import CardCreator from './CardCreator'
import PhoneSend from '../_components/PhoneSend'
import RecentActivity from './RecentActivity'

const Dashboard: React.FC = () => {
    return (
        <div className="space-y-8">
            
            {/* Welcome greeting */}
            <div className="text-left space-y-1 select-none">
                <span className="text-xs font-semibold text-slate-500 font-sans block">Welcome back</span>
                <h2 className="text-2xl font-black text-white font-satoshi flex items-center space-x-1.5">
                    <span>Xavier Peter</span>
                    <span>👋</span>
                </h2>
            </div>

            {/* Total Portfolio value Card */}
            <PortfolioCard />

            {/* Horizontal quick actions */}
            <QuickActions />

            {/* Horizontal scroll currencies */}
            <WalletCarousel />

            {/* Bottom grid splits */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Cashflow Statistics panel */}
                <CashflowStats />

                {/* Your Card Creator box */}
                <CardCreator />
            </div>

            {/* Phone Send widget */}
            <PhoneSend />

            {/* Recent Activity list table */}
            <RecentActivity />

        </div>
    )
}

export default Dashboard;
