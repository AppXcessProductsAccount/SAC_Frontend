"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { resolveMediaUrl as getFullUrl } from "@/lib/api/config";

export default function ContactUsClassic({ data }: { data: any }) {
    const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
    const [redirectUrl, setRedirectUrl] = useState("");

    useEffect(() => {
        // Check if we just returned from a successful submission
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            if (params.get("success") === "true") {
                setStatus("success");
            }

            // Construct the redirect URL back to this page with success param
            const url = new URL(window.location.href);
            url.searchParams.set("success", "true");
            url.hash = "contact";
            setRedirectUrl(url.toString());
        }
    }, []);

    return (
        <section className="relative py-16 md:py-24 lg:py-32 px-6 overflow-hidden min-h-[500px] flex items-center bg-white" id="contact">
            {/* Background Image Layer with Seamless Mask Effect */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/sectionbackground.png"
                    alt="Contact Background"
                    fill
                    className="object-cover opacity-80"
                    priority
                />
            </div>

            <div className="relative z-10 max-w-[1400px] mx-auto w-full">
                <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                    
                    {/* Left Side: Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="space-y-8 lg:pt-8"
                    >
                        <div>
                            <span className="text-[#101848]/60 font-sans font-semibold tracking-[0.2em] uppercase text-xs mb-3 block">
                                Connect With Us
                            </span>
                            <h2 className="text-[24px] sm:text-[36px] md:text-[52px] font-serif text-[#101848] leading-[1.1] mb-6 whitespace-pre-line">
                                {data.title}
                            </h2>
                            <p className="text-[#233252]/80 text-[18px] md:text-[20px] leading-relaxed font-sans max-w-lg">
                                {data.subtitle}
                            </p>
                        </div>

                        <div className="space-y-6 pt-4">
                            <div className="flex items-center gap-4 sm:gap-6 group w-full max-w-[450px] bg-white/40 backdrop-blur-md border border-white/60 px-5 sm:px-7 py-4 sm:py-5 rounded-2xl shadow-sm hover:bg-white/60 transition-all duration-300">
                                <div className="w-14 h-14 rounded-full border border-[#101848]/20 bg-white/80 flex items-center justify-center text-[#101848] group-hover:bg-[#101848] group-hover:text-white transition-all duration-300 shadow-sm flex-shrink-0">
                                    <span className="material-icons text-2xl">alternate_email</span>
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-[#101848]/50 text-[11px] font-bold uppercase tracking-widest mb-0.5">Email us</span>
                                    <span className="font-sans font-bold text-[#101848] text-[15px] sm:text-[18px] md:text-[20px] tracking-tight break-all">{data.email}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 sm:gap-6 group w-full max-w-[450px] bg-white/40 backdrop-blur-md border border-white/60 px-5 sm:px-7 py-4 sm:py-5 rounded-2xl shadow-sm hover:bg-white/60 transition-all duration-300">
                                <div className="w-14 h-14 rounded-full border border-[#101848]/20 bg-white/80 flex items-center justify-center text-[#101848] group-hover:bg-[#101848] group-hover:text-white transition-all duration-300 shadow-sm flex-shrink-0">
                                    <span className="material-icons text-2xl">self_improvement</span>
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-[#101848]/50 text-[11px] font-bold uppercase tracking-widest mb-0.5">Support</span>
                                    <span className="font-sans font-bold text-[#101848] text-[18px] md:text-[20px] tracking-tight">{data.support_text}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Side: Form */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="relative overflow-hidden rounded-[24px] shadow-[0_20px_50px_rgba(16,24,72,0.12)]">
                            {/* Form Background Image */}
                            <div className="absolute inset-0 z-0">
                                <Image
                                    src={getFullUrl(data.form_background_image_url)}
                                    alt="Form Background"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]"></div>
                            </div>

                            <div className="relative z-10 p-5 sm:p-8 md:p-12">
                                {status === "success" ? (
                                    <div className="text-center py-12 space-y-6">
                                        <div className="w-20 h-20 bg-green-500/10 text-green-600 rounded-full flex items-center justify-center mx-auto">
                                            <span className="material-icons text-2xl md:text-4xl">done_all</span>
                                        </div>
                                        <h3 className="text-[28px] font-serif text-[#101848]">Message Received</h3>
                                        <p className="text-[#101848]/60 font-sans">We'll get back to you with peace and clarity shortly.</p>
                                        <button 
                                            onClick={() => {
                                                setStatus("idle");
                                                window.history.replaceState({}, '', window.location.pathname);
                                            }}
                                            className="text-[#101848] font-sans font-bold uppercase text-xs tracking-widest border-b border-[#101848] pb-1 hover:opacity-70 transition-opacity"
                                        >
                                            Send another message
                                        </button>
                                    </div>
                                ) : (
                                    <form 
                                        action="https://forms.zohopublic.com/sacportal4811/form/ContactInquiryForm/formperma/9NVqoRkojeqCe1_O1IZWuDzCergG0nCNwMwg8LZi3CE/htmlRecords/submit" 
                                        name="form" 
                                        method="POST" 
                                        acceptCharset="UTF-8" 
                                        encType="multipart/form-data" 
                                        id="form"
                                        className="space-y-5"
                                        onSubmit={() => setStatus("submitting")}
                                    >
                                        {/* Zoho Hidden Fields */}
                                        <input type="hidden" name="zf_referrer_name" value="" />
                                        <input type="hidden" name="zf_redirect_url" value={redirectUrl} />
                                        <input type="hidden" name="zc_gad" value="" />

                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-[11px] font-sans font-bold uppercase tracking-widest text-[#101848]/60 ml-1">First Name</label>
                                                <input 
                                                    required
                                                    name="Name_First"
                                                    type="text" 
                                                    maxLength={255}
                                                    className="w-full bg-white/40 border border-[#101848]/10 rounded-xl px-4 sm:px-5 py-3 text-[#101848] placeholder:text-[#101848]/30 focus:outline-none focus:ring-2 focus:ring-[#101848]/10 transition-all font-sans" 
                                                    placeholder="First name"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[11px] font-sans font-bold uppercase tracking-widest text-[#101848]/60 ml-1">Last Name</label>
                                                <input 
                                                    required
                                                    name="Name_Last"
                                                    type="text" 
                                                    maxLength={255}
                                                    className="w-full bg-white/40 border border-[#101848]/10 rounded-xl px-4 sm:px-5 py-3 text-[#101848] placeholder:text-[#101848]/30 focus:outline-none focus:ring-2 focus:ring-[#101848]/10 transition-all font-sans" 
                                                    placeholder="Last name"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-[11px] font-sans font-bold uppercase tracking-widest text-[#101848]/60 ml-1">Email Address</label>
                                                <input 
                                                    required
                                                    name="Email"
                                                    type="email" 
                                                    maxLength={255}
                                                    className="w-full bg-white/40 border border-[#101848]/10 rounded-xl px-4 sm:px-5 py-3 text-[#101848] placeholder:text-[#101848]/30 focus:outline-none focus:ring-2 focus:ring-[#101848]/10 transition-all font-sans" 
                                                    placeholder="Enter email"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[11px] font-sans font-bold uppercase tracking-widest text-[#101848]/60 ml-1">Phone Number</label>
                                                <div className="flex gap-2">
                                                    <input 
                                                        required
                                                        name="PhoneNumber_countrycodeval"
                                                        type="text" 
                                                        maxLength={10}
                                                        className="w-20 bg-white/40 border border-[#101848]/10 rounded-xl px-3 py-3 text-[#101848] placeholder:text-[#101848]/30 focus:outline-none focus:ring-2 focus:ring-[#101848]/10 transition-all font-sans" 
                                                        placeholder="+1"
                                                    />
                                                    <input 
                                                        required
                                                        name="PhoneNumber_countrycode"
                                                        type="text" 
                                                        maxLength={20}
                                                        className="flex-1 bg-white/40 border border-[#101848]/10 rounded-xl px-4 sm:px-5 py-3 text-[#101848] placeholder:text-[#101848]/30 focus:outline-none focus:ring-2 focus:ring-[#101848]/10 transition-all font-sans" 
                                                        placeholder="Number"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[11px] font-sans font-bold uppercase tracking-widest text-[#101848]/60 ml-1">Subject</label>
                                            <input 
                                                required
                                                name="SingleLine"
                                                type="text" 
                                                maxLength={255}
                                                className="w-full bg-white/40 border border-[#101848]/10 rounded-xl px-4 sm:px-5 py-3 text-[#101848] placeholder:text-[#101848]/30 focus:outline-none focus:ring-2 focus:ring-[#101848]/10 transition-all font-sans" 
                                                placeholder="What is this regarding?"
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[11px] font-sans font-bold uppercase tracking-widest text-[#101848]/60 ml-1">Your Message</label>
                                            <textarea 
                                                name="MultiLine"
                                                rows={3} 
                                                maxLength={65535}
                                                className="w-full bg-white/40 border border-[#101848]/10 rounded-xl px-4 sm:px-5 py-3 text-[#101848] placeholder:text-[#101848]/30 focus:outline-none focus:ring-2 focus:ring-[#101848]/10 transition-all font-sans resize-none" 
                                                placeholder="Tell us what's on your mind..."
                                            />
                                        </div>

                                        <button 
                                            type="submit"
                                            disabled={status === "submitting"}
                                            className="w-full bg-[#101848] text-white py-4 rounded-[12px] font-sans font-bold uppercase tracking-widest text-sm hover:bg-[#1b1b2b] transition-all shadow-xl disabled:opacity-50 mt-2"
                                        >
                                            {status === "submitting" ? "Sending..." : "Begin Connection"}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}

