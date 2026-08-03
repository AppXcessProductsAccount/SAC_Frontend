"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
    Calendar, 
    MapPin, 
    ArrowRight, 
    Loader2,
    AlertCircle,
    Clock,
    Sparkles
} from "lucide-react";
import { Program } from "@/lib/api/programs";

interface Props {
    programs: Program[];
    loading: boolean;
    error: string | null;
    onRegister: (program: Program) => void;
}

export default function ProgramsListModern({ programs, loading, error, onRegister }: Props) {
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-16 md:py-24 lg:py-32 space-y-6">
                <div className="relative">
                    <Loader2 className="w-12 h-12 animate-spin text-[#1b1b2b]" />
                    <Sparkles className="absolute -top-2 -right-2 w-5 h-5 text-blue-400 animate-pulse" />
                </div>
                <p className="text-[#1b1b2b]/50 font-bold uppercase tracking-[0.2em] text-[10px]">Assembling Journeys</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-14 md:py-24 bg-[#f5f6f6] rounded-[48px] border border-gray-100 shadow-sm px-6">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-100">
                    <AlertCircle className="w-10 h-10 text-red-500" />
                </div>
                <h3 className="text-2xl font-bold text-[#1b1b2b] tracking-tight">Sync failed</h3>
                <p className="text-gray-500 mt-3 max-w-xs mx-auto text-sm font-medium">{error}</p>
                <button 
                    onClick={() => window.location.reload()}
                    className="mt-10 px-10 py-4 bg-[#1b1b2b] text-white rounded-full font-black uppercase tracking-[0.2em] text-[10px] hover:bg-black transition-all hover:scale-105 active:scale-95"
                >
                    Retry Sync
                </button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {programs.map((program, index) => (
                <motion.div
                    key={program.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="group relative bg-[#f5f6f6] rounded-[40px] p-8 md:p-10 border border-gray-100 hover:bg-white hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-700 flex flex-col justify-between"
                >
                    <div className="space-y-8">
                        {/* Top Header */}
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black text-[#1b1b2b]/30 uppercase tracking-[0.2em]">
                                CID: {program.class_id}
                            </span>
                            <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-[#1b1b2b] shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                                <Sparkles size={18} />
                            </div>
                        </div>

                        {/* Title Section */}
                        <div className="space-y-3">
                            <h3 className="text-2xl md:text-3xl font-bold text-[#1b1b2b] leading-[1.1] tracking-tight group-hover:text-blue-700 transition-colors">
                                {program.program_name}
                            </h3>
                            <p className="text-[#1b1b2b]/50 text-xs font-medium leading-relaxed max-w-xs">
                                Experience transformative growth at {program.city}.
                            </p>
                        </div>

                        {/* Info Bento Grid */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-4 bg-white/50 rounded-3xl border border-white group-hover:bg-white transition-all">
                                <Calendar size={16} className="text-blue-500 mb-2" />
                                <span className="block text-[9px] font-black uppercase text-[#1b1b2b]/30 tracking-widest">Duration</span>
                                <span className="text-[11px] font-bold text-[#1b1b2b] truncate block mt-1">{program.date_range}</span>
                            </div>
                            <div className="p-4 bg-white/50 rounded-3xl border border-white group-hover:bg-white transition-all">
                                <MapPin size={16} className="text-purple-500 mb-2" />
                                <span className="block text-[9px] font-black uppercase text-[#1b1b2b]/30 tracking-widest">Location</span>
                                <span className="text-[11px] font-bold text-[#1b1b2b] truncate block mt-1">{program.city}</span>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Action */}
                    <div className="mt-12 flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black text-[#1b1b2b]/20 uppercase tracking-[0.2em]">Starting At</span>
                            <span className="text-lg font-bold text-[#1b1b2b]">RM {program.price.toFixed(2)}</span>
                        </div>
                        <button 
                            onClick={() => onRegister(program)}
                            className="w-14 h-14 rounded-[20px] bg-[#1b1b2b] text-white flex items-center justify-center hover:bg-black hover:scale-110 active:scale-95 transition-all shadow-xl shadow-black/10 group/btn"
                        >
                            <ArrowRight size={24} className="transition-transform group-hover/btn:-rotate-45" />
                        </button>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
