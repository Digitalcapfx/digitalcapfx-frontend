'use client'

import React, { useState } from 'react'
import { Laptop, Smartphone } from 'lucide-react'
import { useSettingsStore } from '@/store/settingsStore'
import { toast } from 'sonner'
import ToggleSwitch from './ToggleSwitch'

export const SecurityTab: React.FC = () => {
    const { 
        twoFactor, 
        toggleTwoFactor, 
        loginNotif, 
        toggleLoginNotif, 
        sessionTimeout, 
        toggleSessionTimeout, 
        sessions, 
        revokeSession, 
        revokeAllOthers
    } = useSettingsStore();

    const [passwordForm, setPasswordForm] = useState({
        current: '',
        newPassword: '',
        confirm: ''
    });

    const handlePasswordUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!passwordForm.current || !passwordForm.newPassword || !passwordForm.confirm) {
            toast.error('Please fill in all password fields.');
            return;
        }
        if (passwordForm.newPassword !== passwordForm.confirm) {
            toast.error('New passwords do not match.');
            return;
        }
        toast.success('Password updated successfully!');
        setPasswordForm({ current: '', newPassword: '', confirm: '' });
    };

    return (
        <div className="space-y-6">
            
            {/* Authentication toggles */}
            <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-6.5 shadow-xl space-y-5">
                <h3 className="font-satoshi font-black text-sm text-white select-none border-b border-white/[0.03] pb-3 text-left">
                    Authentication
                </h3>
                
                <div className="space-y-4">
                    <div className="flex items-center justify-between py-1 border-b border-white/[0.02] last:border-b-0 pb-3">
                        <div className="text-left space-y-0.5 max-w-[80%]">
                            <span className="font-bold text-white text-xs block">Two-Factor Authentication</span>
                            <span className="text-[10px] text-slate-550 font-semibold block leading-relaxed select-none">
                                Authenticator app or SMS required on every login
                            </span>
                        </div>
                        <ToggleSwitch checked={twoFactor} onChange={toggleTwoFactor} />
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-white/[0.02] last:border-b-0 pb-3">
                        <div className="text-left space-y-0.5 max-w-[80%]">
                            <span className="font-bold text-white text-xs block">Login notifications</span>
                            <span className="text-[10px] text-slate-555 font-semibold block leading-relaxed select-none">
                                Email me when a new device signs in
                            </span>
                        </div>
                        <ToggleSwitch checked={loginNotif} onChange={toggleLoginNotif} />
                    </div>

                    <div className="flex items-center justify-between py-1 last:border-b-0">
                        <div className="text-left space-y-0.5 max-w-[80%]">
                            <span className="font-bold text-white text-xs block">Session timeout (15 min)</span>
                            <span className="text-[10px] text-slate-555 font-semibold block leading-relaxed select-none">
                                Auto-logout after 15 minutes of inactivity
                            </span>
                        </div>
                        <ToggleSwitch checked={sessionTimeout} onChange={toggleSessionTimeout} />
                    </div>
                </div>
            </div>

            {/* Change Password form */}
            <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-6.5 shadow-xl space-y-5">
                <h3 className="font-satoshi font-black text-sm text-white select-none border-b border-white/[0.03] pb-3 text-left">
                    Change Password
                </h3>
                <form onSubmit={handlePasswordUpdate} className="space-y-4 text-left">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-555 uppercase tracking-wider block">Current password</label>
                        <input 
                            type="password"
                            value={passwordForm.current}
                            onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                            placeholder="••••••••"
                            className="bg-black/35 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-700 focus:outline-none focus:border-primary-500/50 w-full font-mono"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-555 uppercase tracking-wider block">New password</label>
                        <input 
                            type="password"
                            value={passwordForm.newPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                            placeholder="Min 12 characters"
                            className="bg-black/35 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-750 focus:outline-none focus:border-primary-500/50 w-full font-sans"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-555 uppercase tracking-wider block">Confirm new password</label>
                        <input 
                            type="password"
                            value={passwordForm.confirm}
                            onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                            placeholder="Re-enter password"
                            className="bg-black/35 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-750 focus:outline-none focus:border-primary-500/50 w-full font-sans"
                        />
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            className="bg-primary-500 hover:bg-primary-450 text-white font-bold text-xs px-5 py-3.5 rounded-xl shadow-lg transition duration-200 cursor-pointer active:scale-95"
                        >
                            Update Password
                        </button>
                    </div>
                </form>
            </div>

            {/* Active Sessions log list */}
            <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-6.5 shadow-xl space-y-5">
                <div className="flex justify-between items-center select-none border-b border-white/[0.03] pb-3">
                    <h3 className="font-satoshi font-bold text-sm text-white">Active Sessions</h3>
                    {sessions.length > 1 && (
                        <button 
                            onClick={revokeAllOthers}
                            className="text-[10px] font-extrabold text-rose-400 hover:text-rose-350 cursor-pointer transition select-none uppercase tracking-wider bg-transparent border-none"
                        >
                            Revoke all others
                        </button>
                    )}
                </div>

                <div className="space-y-4">
                    {sessions.map((session) => {
                        const IsMac = session.os.toLowerCase().includes('mac');
                        return (
                            <div key={session.id} className="flex justify-between items-center py-1.5 border-b border-white/[0.02] last:border-b-0 pb-3.5 last:pb-0">
                                <div className="flex items-center space-x-3.5 text-left">
                                    <div className="w-9 h-9 rounded-xl bg-slate-800/60 border border-white/5 flex items-center justify-center text-slate-400 shrink-0">
                                        {IsMac ? <Laptop className="h-4.5 w-4.5" /> : <Smartphone className="h-4.5 w-4.5" />}
                                    </div>
                                    <div>
                                        <div className="flex items-center space-x-2">
                                            <span className="font-bold text-white text-xs block">{session.device} • {session.os}</span>
                                            {session.isCurrent && (
                                                <span className="text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 select-none">
                                                    Current
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-[9.5px] text-slate-500 font-semibold block mt-0.5">{session.location} • {session.ip}</span>
                                    </div>
                                </div>

                                <div className="text-right flex items-center space-x-3 text-xs">
                                    <span className="font-bold text-slate-550 text-[10px] select-none">{session.time}</span>
                                    {!session.isCurrent && (
                                        <button 
                                            onClick={() => revokeSession(session.id)}
                                            className="text-[10px] font-bold text-rose-400 hover:text-rose-350 cursor-pointer transition select-none uppercase tracking-wider bg-transparent border-none"
                                        >
                                            Revoke
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

        </div>
    );
};

export default SecurityTab;
