'use client'

import React from 'react'
import { useSettingsStore } from '@/store/settingsStore'
import ToggleSwitch from './ToggleSwitch'

export const NotificationsTab: React.FC = () => {
    const { notifications, toggleNotification } = useSettingsStore();

    return (
        <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-6 md:p-8 shadow-xl text-left">
            <h3 className="font-satoshi font-black text-sm text-white mb-6 select-none border-b border-white/[0.03] pb-3">
                Notification Preferences
            </h3>
            
            <div className="space-y-6">
                
                {/* TRANSACTION ALERTS */}
                <div className="space-y-4">
                    <span className="text-[9px] font-bold text-slate-550 tracking-wider uppercase block font-mono select-none">
                        Transaction Alerts
                    </span>
                    
                    <div className="flex items-center justify-between py-1 border-b border-white/[0.02] last:border-b-0 pb-3">
                        <div className="text-left space-y-0.5 max-w-[80%]">
                            <span className="font-bold text-white text-xs block">Transfer notifications</span>
                            <span className="text-[10px] text-slate-555 font-semibold block leading-relaxed select-none">
                                Email and in-app alerts for all transfers
                            </span>
                        </div>
                        <ToggleSwitch 
                            checked={notifications.transferNotif} 
                            onChange={() => toggleNotification('transferNotif')} 
                        />
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-white/[0.02] last:border-b-0 pb-3">
                        <div className="text-left space-y-0.5 max-w-[80%]">
                            <span className="font-bold text-white text-xs block">FX conversion alerts</span>
                            <span className="text-[10px] text-slate-555 font-semibold block leading-relaxed select-none">
                                Alert when FX rates move significantly
                            </span>
                        </div>
                        <ToggleSwitch 
                            checked={notifications.fxAlerts} 
                            onChange={() => toggleNotification('fxAlerts')} 
                        />
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-white/[0.02] last:border-b-0 pb-3">
                        <div className="text-left space-y-0.5 max-w-[80%]">
                            <span className="font-bold text-white text-xs block">Card spend alerts</span>
                            <span className="text-[10px] text-slate-555 font-semibold block leading-relaxed select-none">
                                Notifications for card transactions above $100
                            </span>
                        </div>
                        <ToggleSwitch 
                            checked={notifications.cardSpendAlerts} 
                            onChange={() => toggleNotification('cardSpendAlerts')} 
                        />
                    </div>
                </div>

                {/* SYSTEM & COMPLIANCE */}
                <div className="space-y-4 pt-4 border-t border-white/5">
                    <span className="text-[9px] font-bold text-slate-555 tracking-wider uppercase block font-mono select-none">
                        System & Compliance
                    </span>
                    
                    <div className="flex items-center justify-between py-1 border-b border-white/[0.02] last:border-b-0 pb-3">
                        <div className="text-left space-y-0.5 max-w-[80%]">
                            <span className="font-bold text-white text-xs block">Verification Status</span>
                            <span className="text-[10px] text-slate-555 font-semibold block leading-relaxed select-none">
                                Document expiry, KYC status changes
                            </span>
                        </div>
                        <ToggleSwitch 
                            checked={notifications.verificationStatus} 
                            onChange={() => toggleNotification('verificationStatus')} 
                        />
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-white/[0.02] last:border-b-0 pb-3">
                        <div className="text-left space-y-0.5 max-w-[80%]">
                            <span className="font-bold text-white text-xs block">Security alerts</span>
                            <span className="text-[10px] text-slate-555 font-semibold block leading-relaxed select-none">
                                New logins, API key usage, suspicious activity
                            </span>
                        </div>
                        <ToggleSwitch 
                            checked={notifications.securityAlerts} 
                            onChange={() => toggleNotification('securityAlerts')} 
                        />
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-white/[0.02] last:border-b-0 pb-3">
                        <div className="text-left space-y-0.5 max-w-[80%]">
                            <span className="font-bold text-white text-xs block">Dark Mode</span>
                            <span className="text-[10px] text-slate-555 font-semibold block leading-relaxed select-none">
                                Always on
                            </span>
                        </div>
                        <ToggleSwitch 
                            checked={notifications.darkMode} 
                            onChange={() => toggleNotification('darkMode')} 
                        />
                    </div>
                </div>

                {/* REPORTS & MARKETING */}
                <div className="space-y-4 pt-4 border-t border-white/5">
                    <span className="text-[9px] font-bold text-slate-555 tracking-wider uppercase block font-mono select-none">
                        Reports & Marketing
                    </span>
                    
                    <div className="flex items-center justify-between py-1 border-b border-white/[0.02] last:border-b-0 pb-3">
                        <div className="text-left space-y-0.5 max-w-[80%]">
                            <span className="font-bold text-white text-xs block">Weekly summary</span>
                            <span className="text-[10px] text-slate-555 font-semibold block leading-relaxed select-none">
                                Weekly digest of transactions and FX savings
                            </span>
                        </div>
                        <ToggleSwitch 
                            checked={notifications.weeklySummary} 
                            onChange={() => toggleNotification('weeklySummary')} 
                        />
                    </div>

                    <div className="flex items-center justify-between py-1 last:border-b-0">
                        <div className="text-left space-y-0.5 max-w-[80%]">
                            <span className="font-bold text-white text-xs block">Product updates</span>
                            <span className="text-[10px] text-slate-555 font-semibold block leading-relaxed select-none">
                                New features, pricing changes, webinars
                            </span>
                        </div>
                        <ToggleSwitch 
                            checked={notifications.productUpdates} 
                            onChange={() => toggleNotification('productUpdates')} 
                        />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default NotificationsTab;
