'use client'

import React, { useState } from 'react'
import { Laptop, Smartphone, Shield, Key, RefreshCw, X, AlertCircle } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { securityService } from '@/services/security.service'
import { toast } from 'sonner'
import ToggleSwitch from './ToggleSwitch'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export const SecurityTab: React.FC = () => {
    const queryClient = useQueryClient();

    // Query 1: 2FA & Biometrics Status
    const securityQuery = useQuery({
        queryKey: ['securityStatus'],
        queryFn: () => securityService.getSecurityStatus(),
    });

    // Query 2: Active Device Sessions
    const devicesQuery = useQuery({
        queryKey: ['activeDevices'],
        queryFn: () => securityService.getActiveDevices(),
    });

    // Form inputs state for PIN change
    const [pinForm, setPinForm] = useState({
        currentPin: '',
        newPin: '',
        confirmPin: ''
    });

    // Modals state
    const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
    const [isDisableModalOpen, setIsDisableModalOpen] = useState(false);
    const [otpCode, setOtpCode] = useState('');
    const [setupData, setSetupData] = useState<{ secret: string; otpUri: string } | null>(null);

    // Mutations for 2FA setup & activation
    const setup2FAMutation = useMutation({
        mutationFn: () => securityService.setup2FA(),
        onSuccess: (res) => {
            if (res?.success && res?.data) {
                setSetupData(res.data);
                setIsSetupModalOpen(true);
            } else {
                toast.error('Failed to initialize 2FA setup parameters.');
            }
        },
        onError: (err: any) => {
            console.error('2FA setup error:', err);
            const msg = err.response?.data?.error?.message || '2FA is already enabled or cannot be set up.';
            toast.error(msg);
        }
    });

    const confirm2FAMutation = useMutation({
        mutationFn: (code: string) => securityService.confirm2FA(code),
        onSuccess: (res) => {
            toast.success('Two-factor authentication activated successfully!');
            setIsSetupModalOpen(false);
            setOtpCode('');
            setSetupData(null);
            queryClient.invalidateQueries({ queryKey: ['securityStatus'] });
        },
        onError: (err: any) => {
            console.error('Confirm 2FA error:', err);
            const msg = err.response?.data?.error?.message || 'Invalid confirmation code.';
            toast.error(msg);
        }
    });

    const disable2FAMutation = useMutation({
        mutationFn: (code: string) => securityService.disable2FA(code),
        onSuccess: (res) => {
            toast.success('Two-factor authentication disabled.');
            setIsDisableModalOpen(false);
            setOtpCode('');
            queryClient.invalidateQueries({ queryKey: ['securityStatus'] });
        },
        onError: (err: any) => {
            console.error('Disable 2FA error:', err);
            const msg = err.response?.data?.error?.message || 'Invalid deactivation code.';
            toast.error(msg);
        }
    });

    // Mutation for changing Security PIN
    const changePinMutation = useMutation({
        mutationFn: (payload: { currentPin: string; newPin: string }) =>
            securityService.changePin(payload.currentPin, payload.newPin),
        onSuccess: () => {
            toast.success('Security PIN updated successfully!');
            setPinForm({ currentPin: '', newPin: '', confirmPin: '' });
        },
        onError: (err: any) => {
            console.error('Change PIN error:', err);
            const msg = err.response?.data?.error?.message || 'Failed to update PIN. Verify current details.';
            toast.error(msg);
        }
    });

    // Mutations for active device session revocations
    const revokeDeviceMutation = useMutation({
        mutationFn: (id: string) => securityService.revokeDevice(id),
        onSuccess: () => {
            toast.success('Session revoked successfully.');
            queryClient.invalidateQueries({ queryKey: ['activeDevices'] });
        },
        onError: () => toast.error('Failed to revoke device session.')
    });

    const revokeAllOthersMutation = useMutation({
        mutationFn: () => securityService.revokeAllOtherDevices(),
        onSuccess: () => {
            toast.success('All other active device sessions revoked.');
            queryClient.invalidateQueries({ queryKey: ['activeDevices'] });
        },
        onError: () => toast.error('Failed to revoke other device sessions.')
    });

    // Handlers
    const handle2FAToggle = () => {
        const isEnabled = securityQuery.data?.data?.twoFactorEnabled;
        if (isEnabled) {
            setIsDisableModalOpen(true);
        } else {
            setup2FAMutation.mutate();
        }
    };

    const handlePinUpdateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const { currentPin, newPin, confirmPin } = pinForm;

        if (!currentPin || !newPin || !confirmPin) {
            toast.error('All PIN fields are required.');
            return;
        }

        if (newPin.length !== 6 || currentPin.length !== 6) {
            toast.error('PINs must be exactly 6 digits.');
            return;
        }

        if (newPin !== confirmPin) {
            toast.error('New PIN confirmation does not match.');
            return;
        }

        changePinMutation.mutate({ currentPin, newPin });
    };

    const status = securityQuery.data?.data || { twoFactorEnabled: false };
    const sessionsList = devicesQuery.data?.success && Array.isArray(devicesQuery.data.data) 
        ? devicesQuery.data.data 
        : [];

    return (
        <div className="space-y-6">
            
            {/* 1. Two Factor Toggle card */}
            <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-6.5 shadow-xl space-y-5">
                <h3 className="font-satoshi font-black text-sm text-white select-none border-b border-white/[0.03] pb-3 text-left">
                    Authentication
                </h3>
                
                <div className="space-y-4">
                    <div className="flex items-center justify-between py-1 border-b border-white/[0.02] last:border-b-0 pb-3">
                        <div className="text-left space-y-0.5 max-w-[80%]">
                            <span className="font-bold text-white text-xs block">Two-Factor Authentication</span>
                            <span className="text-[10px] text-slate-500 font-semibold block leading-relaxed select-none">
                                Authenticator app confirmation required on every portal login
                            </span>
                        </div>
                        {securityQuery.isLoading ? (
                            <RefreshCw className="h-4.5 w-4.5 text-slate-600 animate-spin" />
                        ) : (
                            <ToggleSwitch checked={status.twoFactorEnabled} onChange={handle2FAToggle} />
                        )}
                    </div>
                </div>
            </div>

            {/* 2. Change PIN form */}
            <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-6.5 shadow-xl space-y-5">
                <h3 className="font-satoshi font-black text-sm text-white select-none border-b border-white/[0.03] pb-3 text-left">
                    Security PIN
                </h3>
                <form onSubmit={handlePinUpdateSubmit} className="space-y-4 text-left">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Current PIN</label>
                            <input 
                                type="password"
                                maxLength={6}
                                value={pinForm.currentPin}
                                onChange={(e) => setPinForm({ ...pinForm, currentPin: e.target.value.replace(/\D/g, '') })}
                                placeholder="******"
                                className="bg-black/35 border border-white/10 rounded-xl px-4 py-3.5 text-xs text-white placeholder-slate-700 focus:outline-none focus:border-primary-500/50 w-full font-mono font-semibold"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">New PIN</label>
                            <input 
                                type="password"
                                maxLength={6}
                                value={pinForm.newPin}
                                onChange={(e) => setPinForm({ ...pinForm, newPin: e.target.value.replace(/\D/g, '') })}
                                placeholder="******"
                                className="bg-black/35 border border-white/10 rounded-xl px-4 py-3.5 text-xs text-white placeholder-slate-700 focus:outline-none focus:border-primary-500/50 w-full font-mono font-semibold"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Confirm New PIN</label>
                            <input 
                                type="password"
                                maxLength={6}
                                value={pinForm.confirmPin}
                                onChange={(e) => setPinForm({ ...pinForm, confirmPin: e.target.value.replace(/\D/g, '') })}
                                placeholder="******"
                                className="bg-black/35 border border-white/10 rounded-xl px-4 py-3.5 text-xs text-white placeholder-slate-700 focus:outline-none focus:border-primary-500/50 w-full font-mono font-semibold"
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={changePinMutation.isPending}
                            className="rounded-xl h-[44px] text-xs font-bold px-6"
                        >
                            {changePinMutation.isPending ? 'Updating PIN...' : 'Update PIN'}
                        </Button>
                    </div>
                </form>
            </div>

            {/* 3. Active Sessions list */}
            <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-6.5 shadow-xl space-y-5">
                <div className="flex justify-between items-center select-none border-b border-white/[0.03] pb-3">
                    <h3 className="font-satoshi font-bold text-sm text-white">Active Sessions</h3>
                    {sessionsList.filter(s => !s.isCurrent).length > 0 && (
                        <button 
                            onClick={() => revokeAllOthersMutation.mutate()}
                            disabled={revokeAllOthersMutation.isPending}
                            className="text-[10px] font-extrabold text-rose-400 hover:text-rose-350 cursor-pointer transition select-none uppercase tracking-wider bg-transparent border-none disabled:opacity-50"
                        >
                            {revokeAllOthersMutation.isPending ? 'Revoking...' : 'Revoke all others'}
                        </button>
                    )}
                </div>

                <div className="space-y-4">
                    {devicesQuery.isLoading ? (
                        <div className="py-6 flex items-center justify-center space-x-2 text-xs text-slate-500">
                            <RefreshCw className="h-4 w-4 animate-spin text-primary-400" />
                            <span>Loading active sessions...</span>
                        </div>
                    ) : sessionsList.length === 0 ? (
                        <p className="text-xs text-slate-600 py-2">No active sessions found.</p>
                    ) : (
                        sessionsList.map((session) => {
                            const isCurrent = session.isCurrent;
                            const isDesktop = session.deviceName.toLowerCase().includes('mac') || session.deviceName.toLowerCase().includes('windows');
                            
                            return (
                                <div key={session.id} className="flex justify-between items-center py-1.5 border-b border-white/[0.02] last:border-b-0 pb-3.5 last:pb-0">
                                    <div className="flex items-center space-x-3.5 text-left">
                                        <div className="w-9 h-9 rounded-xl bg-slate-800/60 border border-white/5 flex items-center justify-center text-slate-400 shrink-0">
                                            {isDesktop ? <Laptop className="h-4.5 w-4.5" /> : <Smartphone className="h-4.5 w-4.5" />}
                                        </div>
                                        <div>
                                            <div className="flex items-center space-x-2">
                                                <span className="font-bold text-white text-xs block">
                                                    {session.deviceName}
                                                </span>
                                                {isCurrent && (
                                                    <span className="text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 select-none">
                                                        Current
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-[9.5px] text-slate-500 font-semibold block mt-0.5">
                                                IP: {session.deviceIp} • Created: {new Date(session.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="text-right flex items-center space-x-3 text-xs">
                                        <span className="font-bold text-slate-500 text-[10px] select-none font-mono">
                                            {new Date(session.lastUsedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        {!isCurrent && (
                                            <button 
                                                onClick={() => revokeDeviceMutation.mutate(session.id)}
                                                disabled={revokeDeviceMutation.isPending}
                                                className="text-[10px] font-bold text-rose-400 hover:text-rose-350 cursor-pointer transition select-none uppercase tracking-wider bg-transparent border-none disabled:opacity-50"
                                            >
                                                Revoke
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Modal 1: 2FA Setup Overlay */}
            {isSetupModalOpen && setupData && (
                <div className="fixed inset-0 bg-black/85 backdrop-blur-[8px] z-[999] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-6.5 max-w-sm w-full shadow-2xl relative space-y-5 text-left animate-in zoom-in-95 duration-200">
                        <button 
                            onClick={() => setIsSetupModalOpen(false)} 
                            className="absolute top-4.5 right-4.5 p-1 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition"
                        >
                            <X className="h-5 w-5" />
                        </button>
                        
                        <div className="space-y-1">
                            <h4 className="font-satoshi font-black text-base text-white flex items-center space-x-2">
                                <Shield className="h-5 w-5 text-primary-400" />
                                <span>Set Up 2FA</span>
                            </h4>
                            <p className="text-[11px] text-slate-400 leading-normal">
                                Scan the QR code using Google Authenticator, Duo, or Authy.
                            </p>
                        </div>

                        {/* QR Code Container */}
                        <div className="flex justify-center bg-white/5 border border-white/10 rounded-2xl p-4.5">
                            <img 
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(setupData.otpUri)}`}
                                alt="TOTP QR Code"
                                className="w-44 h-44 rounded-lg bg-white p-1"
                            />
                        </div>

                        {/* Secret text key for copy */}
                        <div className="space-y-1 bg-black/20 border border-white/5 rounded-xl p-3">
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block font-mono">Manual Secret Key</span>
                            <span className="text-[11px] font-bold text-white block select-all font-mono tracking-widest">{setupData.secret}</span>
                        </div>

                        {/* OTP Verification form */}
                        <form 
                            onSubmit={(e) => {
                                e.preventDefault();
                                confirm2FAMutation.mutate(otpCode);
                            }}
                            className="space-y-4"
                        >
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block">Verification code</label>
                                <input 
                                    type="text"
                                    maxLength={6}
                                    value={otpCode}
                                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                                    placeholder="000000"
                                    className="bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-center text-sm font-bold text-white placeholder-slate-700 tracking-[0.4em] focus:outline-none focus:border-primary-500/50 w-full font-mono"
                                />
                            </div>

                            <div className="flex space-x-3">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setIsSetupModalOpen(false)}
                                    className="w-1/2 rounded-xl h-11 text-xs"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={otpCode.length !== 6 || confirm2FAMutation.isPending}
                                    className="w-1/2 rounded-xl h-11 text-xs"
                                >
                                    {confirm2FAMutation.isPending ? 'Activating...' : 'Confirm & Enable'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal 2: 2FA Disable Overlay */}
            {isDisableModalOpen && (
                <div className="fixed inset-0 bg-black/85 backdrop-blur-[8px] z-[999] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-6.5 max-w-sm w-full shadow-2xl relative space-y-5 text-left animate-in zoom-in-95 duration-200">
                        <button 
                            onClick={() => setIsDisableModalOpen(false)} 
                            className="absolute top-4.5 right-4.5 p-1 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition"
                        >
                            <X className="h-5 w-5" />
                        </button>
                        
                        <div className="space-y-1">
                            <h4 className="font-satoshi font-black text-base text-rose-400 flex items-center space-x-2">
                                <AlertCircle className="h-5 w-5 stroke-[2.5]" />
                                <span>Disable 2FA</span>
                            </h4>
                            <p className="text-[11px] text-slate-400 leading-normal">
                                Enter the 6-digit confirmation code from your authenticator app to deactivate Two-Factor Authentication.
                            </p>
                        </div>

                        <form 
                            onSubmit={(e) => {
                                e.preventDefault();
                                disable2FAMutation.mutate(otpCode);
                            }}
                            className="space-y-4"
                        >
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block">Verification code</label>
                                <input 
                                    type="text"
                                    maxLength={6}
                                    value={otpCode}
                                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                                    placeholder="000000"
                                    className="bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-center text-sm font-bold text-white placeholder-slate-700 tracking-[0.4em] focus:outline-none focus:border-primary-500/50 w-full font-mono"
                                />
                            </div>

                            <div className="flex space-x-3">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setIsDisableModalOpen(false)}
                                    className="w-1/2 rounded-xl h-11 text-xs"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={otpCode.length !== 6 || disable2FAMutation.isPending}
                                    className="w-1/2 rounded-xl h-11 text-xs"
                                >
                                    {disable2FAMutation.isPending ? 'Disabling...' : 'Confirm & Disable'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default SecurityTab;
