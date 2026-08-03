"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";

export default function ContactUsModern({ data }: { data: any }) {
    const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("submitting");
        // Simulate form submission
        setTimeout(() => setStatus("success"), 1500);
    };

    return (
        <section className="relative w-full bg-white py-12 md:py-20 px-4 md:px-8 font-sans" id="contact">
            <div className="max-w-[1500px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-4 md:gap-6">
                
                {/* LEFT CELL - Content */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative w-full rounded-[24px] md:rounded-[40px] overflow-hidden bg-[#f5f6f6] shadow-sm p-8 md:p-14 flex flex-col justify-between"
                >
                    <div className="mb-12">
                        <span className="text-[#101848]/50 font-sans font-bold tracking-[0.2em] uppercase text-[10px] md:text-xs mb-8 block">
                            Connect With Us
                        </span>
                        
                        <div className="relative inline-block mb-8">
                            <h2 className="text-[28px] sm:text-[42px] md:text-[54px] lg:text-[60px] font-sans text-[#1b1b2b] leading-[1.05] tracking-tight whitespace-pre-line relative z-10">
                                {data.title}
                            </h2>
                            {/* Decorative Curve */}
                            <svg className="absolute -bottom-4 left-0 w-[120px] opacity-70" viewBox="0 0 100 20" preserveAspectRatio="none">
                                <path d="M0,15 Q30,-5 100,15" fill="none" stroke="#e0e2e5" strokeWidth="4" strokeLinecap="round" />
                            </svg>
                        </div>
                        
                        <p className="text-[#1b1b2b]/70 text-[15px] md:text-[16px] leading-[1.8] font-medium max-w-sm">
                            {data.subtitle}
                        </p>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-4 bg-white p-4 md:p-5 rounded-[20px] md:rounded-[24px] shadow-sm border border-gray-100 group transition-all">
                            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0 border border-gray-200 group-hover:bg-[#1b1b2b] group-hover:text-white transition-colors duration-300">
                                <span className="material-icons text-[20px]">alternate_email</span>
                            </div>
                            <span className="font-bold text-[14px] md:text-[15px] text-[#1b1b2b] leading-tight">{data.email}</span>
                        </div>
                        <div className="flex items-center gap-4 bg-white p-4 md:p-5 rounded-[20px] md:rounded-[24px] shadow-sm border border-gray-100 group transition-all">
                            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0 border border-gray-200 group-hover:bg-[#1b1b2b] group-hover:text-white transition-colors duration-300">
                                <span className="material-icons text-[20px]">self_improvement</span>
                            </div>
                            <span className="font-bold text-[14px] md:text-[15px] text-[#1b1b2b] leading-tight">{data.support_text}</span>
                        </div>
                    </div>
                </motion.div>

                {/* RIGHT CELL - Form Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="relative w-full rounded-[24px] md:rounded-[40px] overflow-hidden bg-[#f5f6f6] shadow-sm p-8 md:p-14"
                >
                    {/* Decorative ambient corner blur */}
                    <div className="absolute -top-20 -right-20 w-[250px] h-[250px] border-[30px] border-[#e0e2e5]/50 rounded-full blur-3xl opacity-60 pointer-events-none" />

                    <div className="relative z-10 w-full max-w-xl">
                        {status === "success" ? (
                            <div className="text-center py-12 md:py-20 flex flex-col items-center">
                                <div className="w-24 h-24 bg-green-500/10 text-green-600 rounded-full flex items-center justify-center mb-8 border border-green-500/20">
                                    <span className="material-icons text-3xl md:text-5xl">done_all</span>
                                </div>
                                <h3 className="text-[32px] font-sans font-bold text-[#1b1b2b] tracking-tight mb-4">Message Received</h3>
                                <p className="text-[#1b1b2b]/60 font-sans font-medium text-[16px] mb-8">We'll get back to you with peace and clarity shortly.</p>
                                <button 
                                    onClick={() => setStatus("idle")}
                                    className="px-6 py-3 rounded-full border border-[#1b1b2b]/20 text-[#1b1b2b] font-bold text-xs uppercase tracking-widest hover:bg-[#1b1b2b] hover:text-white transition-all duration-300"
                                >
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[11px] font-bold uppercase tracking-widest text-[#1b1b2b]/50 ml-2">Name</label>
                                        <input 
                                            required
                                            type="text" 
                                            className="w-full bg-white border border-gray-200 rounded-[16px] px-6 py-4 text-[#1b1b2b] placeholder:text-[#1b1b2b]/30 focus:outline-none focus:ring-2 focus:ring-[#1b1b2b]/10 transition-all font-medium text-[15px]" 
                                            placeholder="Your name"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[11px] font-bold uppercase tracking-widest text-[#1b1b2b]/50 ml-2">Email</label>
                                        <input 
                                            required
                                            type="email" 
                                            className="w-full bg-white border border-gray-200 rounded-[16px] px-6 py-4 text-[#1b1b2b] placeholder:text-[#1b1b2b]/30 focus:outline-none focus:ring-2 focus:ring-[#1b1b2b]/10 transition-all font-medium text-[15px]" 
                                            placeholder="Your email"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[11px] font-bold uppercase tracking-widest text-[#1b1b2b]/50 ml-2">Message</label>
                                    <textarea 
                                        required
                                        rows={5} 
                                        className="w-full bg-white border border-gray-200 rounded-[16px] px-6 py-4 text-[#1b1b2b] placeholder:text-[#1b1b2b]/30 focus:outline-none focus:ring-2 focus:ring-[#1b1b2b]/10 transition-all font-medium text-[15px] resize-none" 
                                        placeholder="Tell us what's on your mind..."
                                    />
                                </div>
                                <button 
                                    type="submit"
                                    disabled={status === "submitting"}
                                    className="w-full bg-[#1b1b2b] text-white py-5 rounded-[16px] font-bold uppercase tracking-widest text-xs mt-2 hover:bg-black transition-all disabled:opacity-50 shadow-md hover:shadow-xl"
                                >
                                    {status === "submitting" ? "Sending..." : "Begin Connection"}
                                </button>
                            </form>
                        )}
                    </div>
                </motion.div>

            </div>
        </section>
    );
}
