'use client'

import React from 'react'
import PortfolioCard from './PortfolioCard'
import QuickActions from './QuickActions'
import WalletCarousel from '../wallet/WalletCarousel'
import InsightsContainer from './InsightsContainer'
import PhoneSend from '../_components/PhoneSend'
import RecentActivity from './RecentActivity'
import { useQuery } from '@tanstack/react-query'
import { profileService } from '@/services/profile.service'

const Dashboard: React.FC = () => {
    const profileQuery = useQuery({
        queryKey: ['profile'],
        queryFn: () => profileService.getProfile(),
    });

    const firstName = profileQuery.data?.success && profileQuery.data.data?.firstName
        ? profileQuery.data.data.firstName
        : 'User';

    const lastName = profileQuery.data?.success && profileQuery.data.data?.lastName
        ? profileQuery.data.data.lastName
        : '';

    const fullName = `${firstName} ${lastName}`.trim();

    return (
        <div className="space-y-8">
            
            {/* Welcome greeting */}
            <div className="text-left space-y-1 select-none">
                <span className="text-xs font-semibold text-slate-500 font-sans block">Welcome back</span>
                <h2 className="text-2xl font-black text-white font-satoshi flex items-center space-x-1.5">
                    {profileQuery.isLoading ? (
                        <span className="inline-block w-32 h-6 bg-white/5 animate-pulse rounded"></span>
                    ) : (
                        <>
                            <span>{fullName}</span>
                            <span>👋</span>
                        </>
                    )}
                </h2>
            </div>

            {/* Total Portfolio value Card */}
            <PortfolioCard />

            {/* Horizontal quick actions */}
            <QuickActions />

            {/* Horizontal scroll currencies */}
            <WalletCarousel />

            {/* Performance and cashflow stats with unified filter */}
            <InsightsContainer />

            {/* Phone Send widget */}
            <PhoneSend />

            {/* Recent Activity list table */}
            <RecentActivity />

        </div>
    )
}

export default Dashboard;
