"use client";

import React, { useEffect, useState, Suspense } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, BookmarkCheck, Calendar, MapPin, Sparkles } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function SuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const regId = searchParams.get("reg_id");
    const [countdown, setCountdown] = useState(10);

    useEffect(() => {
        if (countdown === 0) {
            router.push("/my-registrations");
        }
    }, [countdown, router]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="max-w-2xl mx-auto px-6 py-12 md:py-20 text-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-12 relative"
            >
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 relative z-10">
                    <CheckCircle2 className="w-12 h-12 text-green-600" />
                </div>
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-dashed border-green-200 rounded-full"
                />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
            >
                <div className="flex items-center justify-center gap-2 text-green-600 font-black text-[10px] uppercase tracking-[0.3em]">
                    <Sparkles size={14} />
                    Journey Confirmed
                </div>
                
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold text-[#101848] tracking-tight">
                    Registration Successful
                </h1>
                
                <p className="text-gray-500 text-lg max-w-md mx-auto leading-relaxed">
                    Your spot has been secured. We've sent a confirmation email with all the session details to your inbox.
                </p>

                {regId && (
                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-full border border-black/5 text-[10px] font-black uppercase tracking-widest text-black/30">
                        Reference ID: <span className="text-[#101848]">{regId}</span>
                    </div>
                )}
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-16 flex flex-col items-center gap-6"
            >
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
                    <Link 
                        href="/my-registrations"
                        className="w-full sm:w-auto px-10 py-4 bg-[#101848] text-white font-black uppercase tracking-widest text-[10px] rounded-full shadow-2xl shadow-blue-900/20 hover:bg-black transition-all flex items-center justify-center gap-3"
                    >
                        View My Journey <ArrowRight size={16} />
                    </Link>
                    <Link 
                        href="/"
                        className="w-full sm:w-auto px-10 py-4 bg-white text-[#101848] font-black uppercase tracking-widest text-[10px] rounded-full border border-black/5 hover:bg-gray-50 transition-all flex items-center justify-center gap-3"
                    >
                        Back to Home
                    </Link>
                </div>
                
                <p className="text-black/20 text-[10px] font-black uppercase tracking-widest">
                    Redirecting to dashboard in {countdown}s...
                </p>
            </motion.div>
        </div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <main className="bg-white min-h-screen">
            <Navbar />
            <section className="pt-20 md:pt-32 pb-20">
                <Suspense fallback={
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#101848]"></div>
                    </div>
                }>
                    <SuccessContent />
                </Suspense>
            </section>
            <Footer />
        </main>
    );
}
