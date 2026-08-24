"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    X, 
    User, 
    Briefcase, 
    MapPin, 
    Calendar, 
    Users, 
    Loader2, 
    CheckCircle2, 
    AlertCircle,
    Heart
} from "lucide-react";
import { userApi } from "@/lib/api/user";
import { useAuth } from "@/hooks/useAuth";

interface CompleteProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CompleteProfileModal({ isOpen, onClose }: CompleteProfileModalProps) {
    const { user, tokens, updateUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Form states
    const [fullName, setFullName] = useState("");
    const [nickname, setNickname] = useState("");
    const [gender, setGender] = useState("");
    const [dob, setDob] = useState("");
    const [occupation, setOccupation] = useState("");
    const [address, setAddress] = useState("");

    useEffect(() => {
        if (user) {
            setFullName(user.full_name || "");
            setNickname(user.nickname || "");
            setGender(user.gender || "");
            setDob(user.dob || "");
            setOccupation(user.occupation || "");
            setAddress(user.address || "");
        }
    }, [user, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!tokens?.access_token) return;

        setLoading(true);
        setError(null);
        try {
            const updatedUser = await userApi.updateMe(tokens.access_token, {
                full_name: fullName,
                nickname,
                gender,
                dob,
                occupation,
                address
            });
            updateUser(updatedUser);
            setSuccess(true);
            setTimeout(() => {
                onClose();
                setSuccess(false);
            }, 1500);
        } catch (err: any) {
            setError(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[1100] overflow-y-auto overscroll-contain">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            />

            {/* Wrapper scrolls: this form is ~8 fields tall and was previously
                centred in a non-scrolling fixed layer, so the lower half of the
                form and the save button were unreachable on a phone. */}
            <div className="relative min-h-full flex items-center justify-center p-3 sm:p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative w-full max-w-md bg-white border border-black/5 shadow-2xl overflow-hidden rounded-[24px] sm:rounded-[32px]"
            >
                <div className="p-5 sm:p-6">
                    <div className="flex justify-between items-start mb-6">
                        <div className="space-y-1">
                            <h2 className="text-xl font-bold tracking-tight text-black">Complete Profile</h2>
                            <p className="text-xs text-black/50 uppercase tracking-widest font-bold">Recommended Step</p>
                        </div>
                        <button onClick={onClose} className="p-1 hover:bg-black/5 rounded transition-colors">
                            <X size={20} className="text-black" />
                        </button>
                    </div>

                    <AnimatePresence mode="wait">
                        {success ? (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="py-10 flex flex-col items-center text-center space-y-3"
                            >
                                <CheckCircle2 className="text-black w-10 h-10" />
                                <h3 className="text-lg font-bold text-black">Saved Successfully</h3>
                                <p className="text-sm text-black/60">Your profile is now up to date.</p>
                            </motion.div>
                        ) : (
                            <motion.form 
                                key="form"
                                onSubmit={handleSubmit} 
                                className="space-y-4"
                            >
                                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
                                    {/* Full Name */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-black/70 uppercase">Full Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50 border border-black/5 focus:border-black focus:outline-none transition-all text-sm rounded-2xl"
                                            placeholder="Your Full Name"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-black/70 uppercase">Nickname</label>
                                            <input
                                                type="text"
                                                value={nickname}
                                                onChange={(e) => setNickname(e.target.value)}
                                                className="w-full px-4 py-3 bg-gray-50 border border-black/5 focus:border-black focus:outline-none transition-all text-sm rounded-2xl"
                                                placeholder="Your nick name"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-black/70 uppercase">Gender</label>
                                            <select
                                                required
                                                value={gender}
                                                onChange={(e) => setGender(e.target.value)}
                                                className="w-full px-4 py-3 bg-gray-50 border border-black/5 focus:border-black focus:outline-none transition-all text-sm appearance-none rounded-2xl"
                                            >
                                                <option value="" disabled>Select</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-black/70 uppercase">Date of Birth</label>
                                            <input
                                                type="date"
                                                required
                                                value={dob}
                                                onChange={(e) => setDob(e.target.value)}
                                                className="w-full px-4 py-3 bg-gray-50 border border-black/5 focus:border-black focus:outline-none transition-all text-sm rounded-2xl"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-black/70 uppercase">Occupation <span className="text-red-500">*</span></label>
                                            <input
                                                type="text"
                                                required
                                                value={occupation}
                                                onChange={(e) => setOccupation(e.target.value)}
                                                className="w-full px-4 py-3 bg-gray-50 border border-black/5 focus:border-black focus:outline-none transition-all text-sm rounded-2xl"
                                                placeholder="Professional"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-black/70 uppercase">Address <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            required
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50 border border-black/5 focus:border-black focus:outline-none transition-all text-sm rounded-2xl"
                                            placeholder="Residential address"
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className="flex items-center gap-2 p-3 bg-black text-white text-xs font-medium">
                                        <AlertCircle size={14} />
                                        {error}
                                    </div>
                                )}

                                <div className="flex items-center justify-between pt-4 border-t border-black/5">
                                    <button 
                                        type="button" 
                                        onClick={onClose}
                                        className="text-black/40 hover:text-black text-xs font-bold uppercase tracking-wider transition-colors"
                                    >
                                        Skip
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-8 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-black/90 transition-all disabled:opacity-50 flex items-center gap-2 rounded-full"
                                    >
                                        {loading ? <Loader2 className="animate-spin" size={14} /> : "Update Profile"}
                                    </button>
                                </div>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
            </div>
        </div>
    );
}
