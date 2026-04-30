"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Calendar,
    MapPin,
    Clock,
    CheckCircle2,
    AlertCircle,
    Loader2,
    ArrowRight,
    Search,
    Filter,
    X,
    FileText,
    History,
    ExternalLink,
    BookmarkCheck,
    CreditCard
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { programsApi, RegistrationResponse } from "@/lib/api/programs";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import RegistrationDetailsModal from "@/components/registrations/RegistrationDetailsModal";

export default function MyRegistrationsPage() {
    const { tokens, isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();
    const [registrations, setRegistrations] = useState<RegistrationResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [payingId, setPayingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [selectedRegistration, setSelectedRegistration] = useState<RegistrationResponse | null>(null);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push("/");
            return;
        }

        if (tokens?.access_token) {
            const fetchData = async () => {
                try {
                    const [regsData, programsData] = await Promise.all([
                        programsApi.myRegistrations(tokens.access_token),
                        programsApi.listPrograms()
                    ]);

                    // Map program details to registrations
                    const enrichedRegs = regsData.map(reg => ({
                        ...reg,
                        program: programsData.find(p => p.id === reg.program_id)
                    }));

                    setRegistrations(enrichedRegs);
                } catch (err: any) {
                    setError(err.message || "Failed to load registrations");
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }
    }, [tokens, isAuthenticated, authLoading, router]);

    const handlePayBalance = async (regId: string) => {
        if (!tokens?.access_token) return;

        setPayingId(regId);
        try {
            const { payment_url } = await programsApi.payBalance(regId, tokens.access_token);
            window.location.href = payment_url;
        } catch (err: any) {
            alert(err.message || "Failed to initiate payment");
        } finally {
            setPayingId(null);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'confirmed': return 'bg-green-50 text-green-600 border-green-100';
            case 'pending': return 'bg-yellow-50 text-yellow-600 border-yellow-100';
            case 'cancelled': return 'bg-red-50 text-red-600 border-red-100';
            default: return 'bg-gray-50 text-gray-600 border-gray-100';
        }
    };

    if (authLoading) return null;

    return (
        <main className="bg-[#f8f9fa] min-h-screen text-[#1b1b2b] font-sans">
            <Navbar />

            <section className="relative pt-20 pb-2 overflow-hidden bg-white">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col md:flex-row md:items-center justify-between gap-6"
                    >
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-blue-600 font-bold text-[10px] uppercase tracking-[0.2em]">
                                <BookmarkCheck size={14} />
                                User Dashboard
                            </div>
                            <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#101848] tracking-tight">
                                My Registrations
                            </h1>
                            <p className="text-gray-400 text-sm font-medium">
                                Manage your spiritual journeys and view your history.
                            </p>
                        </div>

                        <div className="shrink-0">
                            <div className="px-5 py-2.5 bg-[#101848]/5 rounded-2xl border border-[#101848]/10 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-[#101848] flex items-center justify-center text-white">
                                    <History size={20} />
                                </div>
                                <div>
                                    <span className="text-[9px] font-black text-[#101848]/40 uppercase tracking-widest block">Total</span>
                                    <span className="text-xl font-bold text-[#101848] leading-none">{registrations.length}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <section className="py-4 max-w-7xl mx-auto px-6">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                        <p className="text-gray-500 font-medium">Loading your journey...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-20 bg-white rounded-[32px] border border-gray-100 shadow-sm">
                        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-800">Error Loading Data</h3>
                        <p className="text-gray-500 mt-2">{error}</p>
                    </div>
                ) : registrations.length === 0 ? (
                    <div className="text-center py-32 bg-white rounded-[40px] border border-dashed border-gray-200">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <History className="test-black w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-serif font-bold text-[#101848]">No registrations yet</h3>
                        <p className="text-gray-500 mt-2 max-w-xs mx-auto">
                            You haven't signed up for any programs. Begin your transformation today!
                        </p>
                        <Link
                            href="/programs"
                            className="mt-8 inline-flex items-center gap-2 px-8 py-3 bg-[#101848] text-white rounded-full font-bold shadow-lg shadow-blue-900/10 hover:bg-blue-800 transition-all"
                        >
                            Explore Programs
                            <ArrowRight size={18} />
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
                        {registrations.map((reg, index) => (
                            <motion.div
                                key={reg.id}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 p-4 flex flex-col justify-between group h-full relative overflow-hidden"
                            >
                                {/* Decorative Gradient Overlay */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-gray-50 to-transparent opacity-50 -z-0 pointer-events-none" />

                                <div className="relative z-10 space-y-4">
                                    {/* Card Header: IDs & Status */}
                                    <div className="flex justify-between items-start">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black text-[#101848]/30 uppercase tracking-widest">
                                                ID: {reg.program?.class_id || reg.id.split('-')[0].toUpperCase()}
                                            </span>
                                            <span className="text-[9px] font-bold text-[#101848]/20">
                                                Registration: {new Date(reg.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <div className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${getStatusColor(reg.status)}`}>
                                                {reg.status}
                                            </div>
                                            {reg.status.toLowerCase() !== 'cancelled' && (
                                                <div className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border flex items-center gap-1 ${
                                                    reg.payment_status?.toLowerCase() === 'completed' ? 'bg-green-50 text-green-600 border-green-100' :
                                                    reg.payment_status?.toLowerCase() === 'partial' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                    'bg-yellow-50 text-yellow-600 border-yellow-100'
                                                }`}>
                                                    <CreditCard size={10} />
                                                    {reg.payment_status === 'Pending' && reg.status === 'Pending' ? 'Awaiting' : (reg.payment_status || 'Unpaid')}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Program Main Info */}
                                    <div className="space-y-2">
                                        <h3 className="text-base font-bold text-[#101848] leading-tight group-hover:text-blue-700 transition-colors">
                                            {reg.program?.program_name || "Program Session"}
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                                            <div className="flex items-center gap-1.5 text-gray-500 text-[10px] font-medium">
                                                <div className="w-5 h-5 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                                                    <Calendar size={11} />
                                                </div>
                                                {reg.program?.date_range || "Date TBD"}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-gray-500 text-[10px] font-medium">
                                                <div className="w-5 h-5 rounded-lg bg-purple-50 flex items-center justify-center text-purple-500">
                                                    <MapPin size={11} />
                                                </div>
                                                {reg.program?.city || "Location TBD"}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Compact Payment Info Grid */}
                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="p-2 bg-gray-50 rounded-xl border border-black/5 flex flex-col items-center">
                                            <span className="text-[7px] font-black uppercase tracking-widest text-black/20">Paid</span>
                                            <span className="text-[11px] font-bold text-green-600">RM {reg.amount_paid.toFixed(0)}</span>
                                        </div>
                                        {reg.balance_amount > 0 && (
                                            <>
                                                <div className="p-2 bg-gray-50 rounded-xl border border-black/5 flex flex-col items-center">
                                                    <span className="text-[7px] font-black uppercase tracking-widest text-black/20">Bal</span>
                                                    <span className="text-[11px] font-bold text-red-500">RM {reg.balance_amount.toFixed(0)}</span>
                                                </div>
                                                <div className="p-2 bg-gray-50 rounded-xl border border-black/5 flex flex-col items-center">
                                                    <span className="text-[7px] font-black uppercase tracking-widest text-black/20">Due</span>
                                                    <span className="text-[11px] font-bold text-[#101848]">
                                                        {reg.due_date ? new Date(reg.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : "-"}
                                                    </span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Actions Row */}
                                <div className="pt-3 flex items-center gap-2 relative z-10">
                                    <button 
                                        onClick={() => setSelectedRegistration(reg)}
                                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-gray-50 text-[#101848] rounded-xl font-bold text-[10px] hover:bg-gray-100 transition-all group/btn"
                                    >
                                        Details
                                        <FileText size={12} className="text-gray-400 group-hover/btn:text-[#101848]" />
                                    </button>
                                    {reg.balance_amount > 0 && reg.status.toLowerCase() !== 'cancelled' && (
                                        <button
                                            onClick={() => handlePayBalance(reg.id)}
                                            disabled={payingId === reg.id}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#101848] text-white rounded-2xl font-bold text-xs hover:bg-black transition-all shadow-lg shadow-blue-900/10 disabled:opacity-70"
                                        >
                                            {payingId === reg.id ? <Loader2 className="animate-spin" size={14} /> : "Pay Now"}
                                            <ArrowRight size={14} />
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </section>

            <RegistrationDetailsModal
                registration={selectedRegistration}
                onClose={() => setSelectedRegistration(null)}
            />

            <Footer />
        </main>
    );
}
