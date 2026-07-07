'use client'

import React, { useState, useEffect } from 'react'
import { useSettingsStore } from '@/store/settingsStore'

export const ProfileTab: React.FC = () => {
    const { profile, updateProfile } = useSettingsStore();
    
    const [firstName, setFirstName] = useState(profile.firstName);
    const [lastName, setLastName] = useState(profile.lastName);
    const [dob, setDob] = useState(profile.dob);
    const [country, setCountry] = useState(profile.country);
    const [address, setAddress] = useState(profile.address);
    const [nationality, setNationality] = useState(profile.nationality);
    const [occupation, setOccupation] = useState(profile.occupation);
    const [phoneNumber, setPhoneNumber] = useState(profile.phoneNumber);

    // Keep fields in sync with store (in case of hydration delays)
    useEffect(() => {
        setFirstName(profile.firstName);
        setLastName(profile.lastName);
        setDob(profile.dob);
        setCountry(profile.country);
        setAddress(profile.address);
        setNationality(profile.nationality);
        setOccupation(profile.occupation);
        setPhoneNumber(profile.phoneNumber);
    }, [profile]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateProfile({
            firstName,
            lastName,
            dob,
            country,
            address,
            nationality,
            occupation,
            phoneNumber
        });
    };

    return (
        <div className="bg-[#0C1224] border border-[#131B30] rounded-3xl p-6 md:p-8 shadow-xl">
            <h3 className="font-satoshi font-black text-lg text-white mb-6 select-none border-b border-white/[0.03] pb-3 text-left">
                My Profile
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-5 text-left">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-550 uppercase tracking-wider block">First name</label>
                        <input 
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="bg-black/35 border border-white/10 rounded-xl px-4.5 py-3 text-xs text-white focus:outline-none focus:border-primary-500/50 w-full font-sans font-semibold"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-555 uppercase tracking-wider block">Last Name</label>
                        <input 
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="bg-black/35 border border-white/10 rounded-xl px-4.5 py-3 text-xs text-white focus:outline-none focus:border-primary-500/50 w-full font-sans font-semibold"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-555 uppercase tracking-wider block">Date of Birth</label>
                        <input 
                            type="date"
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                            className="bg-black/35 border border-white/10 rounded-xl px-4.5 py-3 text-xs text-white focus:outline-none focus:border-primary-500/50 w-full font-mono font-semibold"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-555 uppercase tracking-wider block">Country</label>
                        <input 
                            type="text"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            className="bg-black/35 border border-white/10 rounded-xl px-4.5 py-3 text-xs text-white focus:outline-none focus:border-primary-500/50 w-full font-sans font-semibold"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-555 uppercase tracking-wider block">Physical address</label>
                    <input 
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="bg-black/35 border border-white/10 rounded-xl px-4.5 py-3 text-xs text-white focus:outline-none focus:border-primary-500/50 w-full font-sans font-semibold"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-555 uppercase tracking-wider block">Nationality</label>
                        <input 
                            type="text"
                            value={nationality}
                            onChange={(e) => setNationality(e.target.value)}
                            className="bg-black/35 border border-white/10 rounded-xl px-4.5 py-3 text-xs text-white focus:outline-none focus:border-primary-500/50 w-full font-sans font-semibold"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-555 uppercase tracking-wider block">Occupation</label>
                        <input 
                            type="text"
                            value={occupation}
                            onChange={(e) => setOccupation(e.target.value)}
                            className="bg-black/35 border border-white/10 rounded-xl px-4.5 py-3 text-xs text-white focus:outline-none focus:border-primary-500/50 w-full font-sans font-semibold"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-555 uppercase tracking-wider block">Phone number</label>
                    <input 
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="bg-black/35 border border-white/10 rounded-xl px-4.5 py-3 text-xs text-white focus:outline-none focus:border-primary-500/50 w-full font-mono font-semibold"
                    />
                </div>

                <div className="flex items-center space-x-3.5 pt-4 text-left">
                    <button
                        type="submit"
                        className="bg-primary-500 hover:bg-primary-450 text-white font-bold text-xs px-5 py-3.5 rounded-xl shadow-lg transition duration-200 cursor-pointer active:scale-95"
                    >
                        Save Changes
                    </button>
                    <button
                        type="button"
                        className="bg-slate-800 hover:bg-slate-750 text-slate-400 font-bold text-xs px-5 py-3.5 rounded-xl border border-white/5 transition duration-200 cursor-pointer active:scale-95"
                    >
                        Cancel
                    </button>
                </div>

            </form>
        </div>
    );
};

export default ProfileTab;
