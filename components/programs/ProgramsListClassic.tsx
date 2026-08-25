"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    Calendar,
    MapPin,
    ArrowRight,
    Info,
    Loader2,
    AlertCircle
} from "lucide-react";
import { Program } from "@/lib/api/programs";

interface Props {
    programs: Program[];
    loading: boolean;
    error: string | null;
    onRegister: (program: Program) => void;
}

export default function ProgramsListClassic({ programs, loading, error, onRegister }: Props) {
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-12 md:py-20 space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-[#101848]" />
                <p className="text-gray-500 font-medium font-serif italic">Curating sessions for you...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12 md:py-20 bg-white rounded-[32px] border border-gray-100 shadow-sm">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-serif font-bold text-[#101848]">Something went wrong</h3>
                <p className="text-gray-500 mt-2">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-6 px-8 py-3 bg-[#101848] text-white rounded-full font-bold hover:bg-blue-800 transition-colors uppercase tracking-widest text-xs"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="relative">

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
                {programs.map((program, index) => {
                    return (
                        <motion.div
                            key={program.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group bg-white rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-col"
                        >
                            <div className="p-6 pb-0 flex justify-between items-start">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">
                                        ID: {program.class_id}
                                    </span>
                                    <div className="h-1 w-8 bg-blue-600 rounded-full" />
                                </div>
                                <div className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-full border border-green-100">
                                    Available
                                </div>
                            </div>

                            <div className="p-8 flex-1">
                                <h3 className="text-2xl font-serif font-bold text-[#101848] mb-4 group-hover:text-blue-700 transition-colors leading-tight">
                                    {program.program_name}
                                </h3>

                                <div className="space-y-4 mb-8">
                                    <div className="flex items-center gap-3 text-gray-600 group-hover:text-gray-900 transition-colors">
                                        <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                                            <Calendar size={18} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-bold uppercase text-black">Duration</span>
                                            <span className="text-sm font-semibold font-serif">{program.date_range}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 text-gray-600 group-hover:text-gray-900 transition-colors">
                                        <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600">
                                            <MapPin size={18} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-bold uppercase text-black">Location</span>
                                            <span className="text-sm font-semibold font-serif">{program.city}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 mb-8">
                                    <div className="flex gap-2">
                                        <Info size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
                                        <p className="text-xs text-gray-500 leading-relaxed italic font-serif">
                                            {program.address}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="px-8 pb-8">
                                <button
                                    onClick={() => onRegister(program)}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#101848] text-white rounded-[20px] font-bold shadow-lg shadow-blue-900/10 hover:bg-blue-800 transition-all active:scale-[0.98] group/btn uppercase tracking-widest text-xs"
                                >
                                    Register Now
                                    <ArrowRight size={18} className="transition-transform group-hover/btn:translate-x-1" />
                                </button>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
