'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface SessionItem {
    id: string;
    device: string;
    os: string;
    location: string;
    ip: string;
    time: string;
    isCurrent?: boolean;
}

export interface ProfileDetails {
    firstName: string;
    lastName: string;
    dob: string;
    country: string;
    address: string;
    nationality: string;
    occupation: string;
    phoneNumber: string;
}

interface SettingsState {
    profile: ProfileDetails;
    twoFactor: boolean;
    loginNotif: boolean;
    sessionTimeout: boolean;
    sessions: SessionItem[];
    addressVerificationStatus: 'pending' | 'uploading' | 'complete';
    notifications: {
        transferNotif: boolean;
        fxAlerts: boolean;
        cardSpendAlerts: boolean;
        verificationStatus: boolean;
        securityAlerts: boolean;
        darkMode: boolean;
        weeklySummary: boolean;
        productUpdates: boolean;
    };
    toast: { message: string; type: 'success' | 'error' } | null;
    
    updateProfile: (details: Partial<ProfileDetails>) => void;
    toggleTwoFactor: () => void;
    toggleLoginNotif: () => void;
    toggleSessionTimeout: () => void;
    revokeSession: (id: string) => void;
    revokeAllOthers: () => void;
    uploadAddressDoc: () => void;
    toggleNotification: (key: string) => void;
    showToast: (message: string, type?: 'success' | 'error') => void;
    clearToast: () => void;
}

const INITIAL_SESSIONS: SessionItem[] = [
    { id: '1', device: 'Chrome', os: 'macOS', location: 'Lagos, Nigeria', ip: '102.89.23.44', time: 'Now', isCurrent: true },
    { id: '2', device: 'Safari', os: 'iPhone 15', location: 'Lagos, Nigeria', ip: '41.209.75.122', time: 'Jun 24 09:15' },
    { id: '3', device: 'Chrome', os: 'Windows', location: 'Abuja, Nigeria', ip: '197.210.54.91', time: 'Jun 22 11:30' },
];

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            profile: {
                firstName: 'Teena',
                lastName: 'Xavier',
                dob: '1900-12-03',
                country: 'Nigeria',
                address: '1 Ozumba Mbadiwe Avenue, Victoria Island, Lagos',
                nationality: 'Nigeria',
                occupation: 'UI/UX Designer',
                phoneNumber: '+234 810 000 0000'
            },
            twoFactor: true,
            loginNotif: true,
            sessionTimeout: false,
            sessions: INITIAL_SESSIONS,
            addressVerificationStatus: 'pending',
            notifications: {
                transferNotif: true,
                fxAlerts: true,
                cardSpendAlerts: true,
                verificationStatus: true,
                securityAlerts: true,
                darkMode: true,
                weeklySummary: false,
                productUpdates: false,
            },
            toast: null,

            updateProfile: (details) => set((state) => {
                const updated = { ...state.profile, ...details };
                return { profile: updated, toast: { message: 'Profile updated successfully!', type: 'success' } };
            }),
            toggleTwoFactor: () => set((state) => ({ twoFactor: !state.twoFactor })),
            toggleLoginNotif: () => set((state) => ({ loginNotif: !state.loginNotif })),
            toggleSessionTimeout: () => set((state) => ({ sessionTimeout: !state.sessionTimeout })),
            revokeSession: (id) => set((state) => ({
                sessions: state.sessions.filter((s) => s.id !== id),
                toast: { message: 'Session revoked successfully.', type: 'success' }
            })),
            revokeAllOthers: () => set((state) => ({
                sessions: state.sessions.filter((s) => s.isCurrent),
                toast: { message: 'All other active sessions revoked.', type: 'success' }
            })),
            uploadAddressDoc: () => {
                set({ addressVerificationStatus: 'uploading' });
                setTimeout(() => {
                    set({ 
                        addressVerificationStatus: 'complete',
                        toast: { message: 'Document uploaded and verified successfully!', type: 'success' }
                    });
                }, 1800);
            },
            toggleNotification: (key) => set((state) => {
                const k = key as keyof typeof state.notifications;
                const updatedNotifs = { ...state.notifications, [k]: !state.notifications[k] };
                return { notifications: updatedNotifs };
            }),
            showToast: (message, type = 'success') => set({ toast: { message, type } }),
            clearToast: () => set({ toast: null }),
        }),
        {
            name: 'settings-storage',
            partialize: (state) => ({
                profile: state.profile,
                twoFactor: state.twoFactor,
                loginNotif: state.loginNotif,
                sessionTimeout: state.sessionTimeout,
                sessions: state.sessions,
                addressVerificationStatus: state.addressVerificationStatus,
                notifications: state.notifications,
            })
        }
    )
)
