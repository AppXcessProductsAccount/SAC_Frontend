"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    User,
    CreditCard,
    PhoneCall,
    Activity,
    Share2,
    FileText,
    Calendar,
    MapPin,
    ExternalLink,
    ShieldCheck,
    Languages,
    Utensils,
    HeartPulse,
    Clock,
    CheckCircle2,
    AlertCircle,
    Info,
    Sparkles
} from "lucide-react";
import { RegistrationResponse } from "@/lib/api/programs";

interface RegistrationDetailsModalProps {
    registration: RegistrationResponse | null;
    onClose: () => void;
}

export default function RegistrationDetailsModal({ registration, onClose }: RegistrationDetailsModalProps) {
    if (!registration) return null;

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'confirmed':
            case 'completed': return 'text-green-600 bg-green-50 border-green-100';
            case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-100';
            case 'partial': return 'text-blue-600 bg-blue-50 border-blue-100';
            case 'cancelled': return 'text-red-600 bg-red-50 border-red-100';
            default: return 'text-gray-600 bg-gray-50 border-gray-100';
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric'
        });
    };

    const formatFullDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-GB', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[1500] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-[#101848]/20 backdrop-blur-md"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-5xl bg-white rounded-[40px] shadow-2xl flex flex-col border border-black/5 overflow-hidden"
                >
                    {/* Header */}
                    <div className="p-8 md:p-10 flex justify-between items-start border-b border-gray-50">
                        <div className="space-y-1">
                            <span className="text-[10px] font-black test-black uppercase tracking-[0.2em] block">Registration Profile</span>
                            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#101848]">Full Record Details</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 test-black hover:text-gray-800 transition-colors rounded-full hover:bg-gray-50"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Scrollable Content */}
                    <div className="p-8 md:p-10 overflow-y-auto max-h-[75vh]">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                            {/* Column 1: Preferences & Health */}
                            <div className="space-y-8">
                                {/* Personal Preferences */}
                                <div className="space-y-4">
                                    <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] test-black">
                                        <Info size={14} /> Personal Preferences
                                    </h4>
                                    <div className="bg-white border border-gray-100 rounded-[24px] divide-y divide-gray-50 overflow-hidden">
                                        <div className="p-5">
                                            <span className="text-[9px] font-black test-black uppercase tracking-widest block mb-1">Preferred Language</span>
                                            <span className="text-sm font-bold text-gray-800">{registration.preferred_language}</span>
                                        </div>
                                        <div className="p-5">
                                            <span className="text-[9px] font-black test-black uppercase tracking-widest block mb-1">Meal Preference</span>
                                            <span className="text-sm font-bold text-gray-800">{registration.meal_preference}</span>
                                        </div>
                                        <div className="p-5">
                                            <span className="text-[9px] font-black test-black uppercase tracking-widest block mb-1">NRIC (Last 4)</span>
                                            <span className="text-sm font-bold text-gray-800">{registration.nric_last_4}</span>
                                        </div>
                                        <div className="p-5">
                                            <span className="text-[9px] font-black test-black uppercase tracking-widest block mb-1">Status</span>
                                            <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full border ${getStatusColor(registration.status)}`}>
                                                {registration.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Health Info */}
                                <div className="space-y-4">
                                    <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] test-black">
                                        <HeartPulse size={14} className="text-red-400" /> Health Information
                                    </h4>
                                    <div className="p-6 bg-red-50/30 border border-red-100 rounded-[24px]">
                                        <p className="text-sm font-bold text-red-700 leading-relaxed">
                                            {registration.health_issues || "None reported"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Column 2: Payment & Source */}
                            <div className="space-y-8">
                                {/* Payment Summary */}
                                <div className="space-y-4">
                                    <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] test-black">
                                        <CreditCard size={14} /> Payment Summary
                                    </h4>
                                    <div className="bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-sm">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 divide-x divide-gray-50 border-b border-gray-50">
                                            <div className="p-6">
                                                <span className="text-[9px] font-black test-black uppercase tracking-widest block mb-1">Amount Paid</span>
                                                <span className="text-lg font-bold text-green-600">MYR {registration.amount_paid.toFixed(2)}</span>
                                            </div>
                                            <div className="p-6">
                                                <span className="text-[9px] font-black test-black uppercase tracking-widest block mb-1">Balance Due</span>
                                                <span className="text-lg font-bold text-red-500">MYR {registration.balance_amount.toFixed(2)}</span>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 divide-x divide-gray-50">
                                            <div className="p-6">
                                                <span className="text-[9px] font-black test-black uppercase tracking-widest block mb-1">Payment Status</span>
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${registration.payment_status?.toLowerCase() === 'completed' ? 'bg-green-500' :
                                                            registration.payment_status?.toLowerCase() === 'partial' ? 'bg-blue-500' :
                                                                'bg-yellow-500'
                                                        }`} />
                                                    <span className="text-sm font-bold text-gray-800 uppercase tracking-tight">
                                                        {registration.payment_status || 'Pending'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="p-6">
                                                <span className="text-[9px] font-black test-black uppercase tracking-widest block mb-1">Due Date</span>
                                                <span className="text-sm font-bold text-gray-800">{formatDate(registration.due_date)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Source & Referrals */}
                                <div className="space-y-4">
                                    <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] test-black">
                                        <Share2 size={14} /> Source & Referrals
                                    </h4>
                                    <div className="bg-white border border-gray-100 rounded-[24px] divide-y divide-gray-50 overflow-hidden">
                                        <div className="p-5">
                                            <span className="text-[9px] font-black test-black uppercase tracking-widest block mb-1">Discovery Source</span>
                                            <span className="text-sm font-bold text-gray-800">{registration.discovery_source}</span>
                                        </div>
                                        <div className="p-5">
                                            <span className="text-[9px] font-black test-black uppercase tracking-widest block mb-1">Referred By</span>
                                            <span className="text-sm font-bold text-gray-800">{registration.referred_by || "None"}</span>
                                        </div>
                                        {(registration.introducer_name || registration.introducer_phone) && (
                                            <div className="p-5">
                                                <span className="text-[9px] font-black test-black uppercase tracking-widest block mb-1">Introducer</span>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-[#101848]">{registration.introducer_name}</span>
                                                    <span className="text-xs font-medium text-gray-500">{registration.introducer_phone}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Column 3: Emergency & Technical */}
                            <div className="space-y-8">
                                {/* Emergency Contact */}
                                <div className="space-y-4">
                                    <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] test-black">
                                        <PhoneCall size={14} /> Emergency Contact
                                    </h4>
                                    <div className="bg-white border border-gray-100 rounded-[32px] p-6 space-y-6">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-1">
                                                <span className="text-[9px] font-black test-black uppercase tracking-widest block">Contact Name</span>
                                                <span className="text-sm font-bold text-[#101848]">{registration.emergency_contact_name}</span>
                                            </div>
                                            <div className="text-right space-y-1">
                                                <span className="text-[9px] font-black test-black uppercase tracking-widest block">Relation</span>
                                                <span className="text-[10px] font-black test-black uppercase">{registration.emergency_contact_relation}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#101848] shadow-sm">
                                                <PhoneCall size={18} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-black test-black uppercase tracking-widest">Phone Number</span>
                                                <span className="text-sm font-bold text-[#101848]">{registration.emergency_contact_phone}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Technical Metadata */}
                                <div className="space-y-4">
                                    <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] test-black">
                                        <FileText size={14} /> Technical Metadata
                                    </h4>
                                    <div className="bg-gray-50/50 border border-gray-100 rounded-[24px] p-6 space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[9px] font-black test-black uppercase tracking-widest">Applied On</span>
                                            <span className="text-[10px] font-bold text-gray-600">{formatFullDate(registration.created_at)}</span>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[9px] font-black test-black uppercase tracking-widest block">Registration ID</span>
                                            <span className="text-[10px] font-mono test-black break-all">{registration.id}</span>
                                        </div>
                                        {(registration.hitpay_payment_id || registration.payment_request_id) && (
                                            <div className="space-y-1">
                                                <span className="text-[9px] font-black test-black uppercase tracking-widest block">Payment ID</span>
                                                <span className="text-[10px] font-mono test-black break-all">{registration.hitpay_payment_id || registration.payment_request_id}</span>
                                            </div>
                                        )}
                                        {registration.payment_url && (
                                            <div className="pt-2">
                                                <span className="text-[9px] font-black test-black uppercase tracking-widest block mb-2">Checkout Link</span>
                                                <a
                                                    href={registration.payment_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-1"
                                                >
                                                    View Portal <ExternalLink size={10} />
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-8 border-t border-gray-50">
                        <button
                            onClick={onClose}
                            className="w-full py-4 bg-black text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[12px] hover:bg-gray-900 transition-all active:scale-[0.98]"
                        >
                            Close Record
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
