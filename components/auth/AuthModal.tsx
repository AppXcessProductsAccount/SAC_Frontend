"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, Loader2, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { authApi } from "@/lib/api/auth";
import { useAuth } from "@/hooks/useAuth";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type Step = "email" | "otp" | "success";

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const { login } = useAuth();
    const [step, setStep] = useState<Step>("email");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [countdown, setCountdown] = useState(0);

    useEffect(() => {
        if (!isOpen) {
            // Reset state when closed
            setTimeout(() => {
                setStep("email");
                setEmail("");
                setOtp("");
                setError(null);
                setLoading(false);
            }, 300);
        }
    }, [isOpen]);

    useEffect(() => {
        let timer: any;
        if (countdown > 0) {
            timer = setInterval(() => setCountdown(c => c - 1), 1000);
        }
        return () => clearInterval(timer);
    }, [countdown]);

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        setError(null);
        try {
            await authApi.sendOtp(email);
            setStep("otp");
            setCountdown(60);
        } catch (err: any) {
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!otp || otp.length < 6) return;

        setLoading(true);
        setError(null);
        try {
            const response = await authApi.verifyOtp(email, otp);
            login(response.user, response.tokens);
            setStep("success");
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (err: any) {
            setError(err.message || "Invalid OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (countdown > 0 || loading) return;
        setLoading(true);
        setError(null);
        try {
            await authApi.sendOtp(email);
            setCountdown(60);
        } catch (err: any) {
            setError(err.message || "Failed to resend OTP.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[1000] overflow-y-auto overscroll-contain">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-[#101848]/20 backdrop-blur-md"
            />

            {/* Modal — wrapper scrolls so the OTP/step content can never be
                clipped out of reach on short or landscape phones. */}
            <div className="relative min-h-full flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-md overflow-hidden rounded-[28px] sm:rounded-[40px] bg-white border border-black/5 shadow-2xl shadow-blue-900/10"
            >
                <button
                    onClick={onClose}
                    className="absolute right-3 top-3 sm:right-6 sm:top-6 p-2 text-black/30 hover:text-black/80 transition-colors rounded-full hover:bg-black/5 z-20"
                >
                    <X size={20} />
                </button>

                <div className="px-6 sm:px-10 py-10 sm:py-12 relative z-10">
                    <AnimatePresence mode="wait">
                        {step === "email" && (
                            <motion.div
                                key="email-step"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-8"
                            >
                                <div className="text-center space-y-3">
                                    <h2 className="text-2xl md:text-4xl font-serif font-bold text-[#101848]">Welcome Back</h2>
                                    <p className="text-black/40 text-sm font-medium">Continue your mindfulness journey</p>
                                </div>

                                <form onSubmit={handleSendOtp} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-[#101848]/60 ml-1">Email Address</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Mail className="h-5 w-5 text-black/20 group-focus-within:text-[#101848] transition-colors" />
                                            </div>
                                            <input
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="block w-full pl-12 pr-4 py-4 bg-gray-50 border border-black/5 rounded-2xl text-[#101848] font-medium placeholder-black/20 focus:outline-none focus:ring-2 focus:ring-[#101848]/5 focus:border-[#101848] transition-all"
                                                placeholder="name@example.com"
                                            />
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="flex items-center gap-3 text-red-600 text-xs bg-red-50 p-4 rounded-2xl border border-red-100 font-medium">
                                            <AlertCircle size={16} />
                                            <span>{error}</span>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full flex items-center justify-center gap-2 py-4 bg-[#101848] text-white font-bold rounded-full shadow-xl shadow-blue-900/10 hover:bg-blue-800 transition-all active:scale-[0.98] disabled:opacity-70"
                                    >
                                        {loading ? (
                                            <Loader2 className="animate-spin" size={20} />
                                        ) : (
                                            <>
                                                Continue
                                                <ArrowRight size={20} />
                                            </>
                                        )}
                                    </button>
                                </form>
                            </motion.div>
                        )}

                        {step === "otp" && (
                            <motion.div
                                key="otp-step"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-8"
                            >
                                <div className="text-center space-y-3">
                                    <h2 className="text-2xl md:text-4xl font-serif font-bold text-[#101848]">Verify Email</h2>
                                    <p className="text-black/40 text-sm font-medium">
                                        Enter the 6-digit code sent to <br/>
                                        <span className="text-[#101848] font-bold">{email}</span>
                                    </p>
                                </div>

                                <form onSubmit={handleVerifyOtp} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-[#101848]/60 ml-1">Verification Code</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Lock className="h-5 w-5 text-black/20 group-focus-within:text-[#101848] transition-colors" />
                                            </div>
                                            <input
                                                type="text"
                                                maxLength={6}
                                                required
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                                className="block w-full pl-12 pr-4 py-4 bg-gray-50 border border-black/5 rounded-2xl text-[#101848] tracking-[0.5em] text-center text-2xl font-black placeholder-black/10 focus:outline-none focus:ring-2 focus:ring-[#101848]/5 focus:border-[#101848] transition-all"
                                                placeholder="000000"
                                            />
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="flex items-center gap-3 text-red-600 text-xs bg-red-50 p-4 rounded-2xl border border-red-100 font-medium">
                                            <AlertCircle size={16} />
                                            <span>{error}</span>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={loading || otp.length < 6}
                                        className="w-full flex items-center justify-center gap-2 py-4 bg-[#101848] text-white font-bold rounded-full shadow-xl shadow-blue-900/10 hover:bg-blue-800 transition-all active:scale-[0.98] disabled:opacity-70"
                                    >
                                        {loading ? (
                                            <Loader2 className="animate-spin" size={20} />
                                        ) : (
                                            "Verify & Login"
                                        )}
                                    </button>

                                    <div className="flex flex-col items-center gap-3 text-sm">
                                        <button
                                            type="button"
                                            onClick={handleResendOtp}
                                            disabled={countdown > 0 || loading}
                                            className="text-[#101848] font-bold hover:underline disabled:text-black/20 transition-all"
                                        >
                                            {countdown > 0 ? `Resend code in ${countdown}s` : "Resend code"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setStep("email")}
                                            className="text-black/30 hover:text-black/60 font-medium text-xs transition-colors"
                                        >
                                            Try a different email
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {step === "success" && (
                            <motion.div
                                key="success-step"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="py-10 flex flex-col items-center text-center space-y-6"
                            >
                                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center border border-green-100 animate-bounce">
                                    <CheckCircle2 className="text-green-600 w-12 h-12" />
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#101848]">Login Successful</h2>
                                    <p className="text-black/40 font-medium">Welcome back to your practice.</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
            </div>
        </div>
    );
}
