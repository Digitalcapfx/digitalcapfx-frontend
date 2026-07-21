'use client'

import React from 'react'
import { useSettingsStore } from '@/store/settingsStore'
import ToggleSwitch from './ToggleSwitch'
import { useLanguageStore } from '@/store/languageStore'

export const NotificationsTab: React.FC = () => {
    const { notifications, toggleNotification } = useSettingsStore();
    const { t } = useLanguageStore();

    return (
        <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-6 md:p-8 shadow-xl text-left">
            <h3 className="font-satoshi font-black text-sm text-white mb-6 select-none border-b border-white/[0.03] pb-3">
                {t('settings.notifications.title')}
            </h3>
            
            <div className="space-y-6">
                
                {/* TRANSACTION ALERTS */}
                <div className="space-y-4">
                    <span className="text-[9px] font-bold text-slate-550 tracking-wider uppercase block font-mono select-none">
                        {t('settings.notifications.transactionAlerts')}
                    </span>
                    
                    <div className="flex items-center justify-between py-1 border-b border-white/[0.02] last:border-b-0 pb-3">
                        <div className="text-left space-y-0.5 max-w-[80%]">
                            <span className="font-bold text-white text-xs block">{t('settings.notifications.transferNotif')}</span>
                            <span className="text-[10px] text-slate-555 font-semibold block leading-relaxed select-none">
                                {t('settings.notifications.transferNotifDesc')}
                            </span>
                        </div>
                        <ToggleSwitch 
                            checked={notifications.transferNotif} 
                            onChange={() => toggleNotification('transferNotif')} 
                        />
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-white/[0.02] last:border-b-0 pb-3">
                        <div className="text-left space-y-0.5 max-w-[80%]">
                            <span className="font-bold text-white text-xs block">{t('settings.notifications.fxAlerts')}</span>
                            <span className="text-[10px] text-slate-555 font-semibold block leading-relaxed select-none">
                                {t('settings.notifications.fxAlertsDesc')}
                            </span>
                        </div>
                        <ToggleSwitch 
                            checked={notifications.fxAlerts} 
                            onChange={() => toggleNotification('fxAlerts')} 
                        />
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-white/[0.02] last:border-b-0 pb-3">
                        <div className="text-left space-y-0.5 max-w-[80%]">
                            <span className="font-bold text-white text-xs block">{t('settings.notifications.cardSpendAlerts')}</span>
                            <span className="text-[10px] text-slate-555 font-semibold block leading-relaxed select-none">
                                {t('settings.notifications.cardSpendAlertsDesc')}
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
                        {t('settings.notifications.systemCompliance')}
                    </span>
                    
                    <div className="flex items-center justify-between py-1 border-b border-white/[0.02] last:border-b-0 pb-3">
                        <div className="text-left space-y-0.5 max-w-[80%]">
                            <span className="font-bold text-white text-xs block">{t('settings.notifications.verificationStatus')}</span>
                            <span className="text-[10px] text-slate-555 font-semibold block leading-relaxed select-none">
                                {t('settings.notifications.verificationStatusDesc')}
                            </span>
                        </div>
                        <ToggleSwitch 
                            checked={notifications.verificationStatus} 
                            onChange={() => toggleNotification('verificationStatus')} 
                        />
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-white/[0.02] last:border-b-0 pb-3">
                        <div className="text-left space-y-0.5 max-w-[80%]">
                            <span className="font-bold text-white text-xs block">{t('settings.notifications.securityAlerts')}</span>
                            <span className="text-[10px] text-slate-555 font-semibold block leading-relaxed select-none">
                                {t('settings.notifications.securityAlertsDesc')}
                            </span>
                        </div>
                        <ToggleSwitch 
                            checked={notifications.securityAlerts} 
                            onChange={() => toggleNotification('securityAlerts')} 
                        />
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-white/[0.02] last:border-b-0 pb-3">
                        <div className="text-left space-y-0.5 max-w-[80%]">
                            <span className="font-bold text-white text-xs block">{t('settings.notifications.darkMode')}</span>
                            <span className="text-[10px] text-slate-555 font-semibold block leading-relaxed select-none">
                                {t('settings.notifications.darkModeDesc')}
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
                        {t('settings.notifications.reportsMarketing')}
                    </span>
                    
                    <div className="flex items-center justify-between py-1 border-b border-white/[0.02] last:border-b-0 pb-3">
                        <div className="text-left space-y-0.5 max-w-[80%]">
                            <span className="font-bold text-white text-xs block">{t('settings.notifications.weeklySummary')}</span>
                            <span className="text-[10px] text-slate-555 font-semibold block leading-relaxed select-none">
                                {t('settings.notifications.weeklySummaryDesc')}
                            </span>
                        </div>
                        <ToggleSwitch 
                            checked={notifications.weeklySummary} 
                            onChange={() => toggleNotification('weeklySummary')} 
                        />
                    </div>

                    <div className="flex items-center justify-between py-1 last:border-b-0">
                        <div className="text-left space-y-0.5 max-w-[80%]">
                            <span className="font-bold text-white text-xs block">{t('settings.notifications.productUpdates')}</span>
                            <span className="text-[10px] text-slate-555 font-semibold block leading-relaxed select-none">
                                {t('settings.notifications.productUpdatesDesc')}
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
