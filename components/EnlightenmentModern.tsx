"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import { toYouTubeEmbedUrl, withEmbedParams } from "@/lib/youtube";

export default function EnlightenmentModern({ data }: { data: any }) {
    const [isVideoActive, setIsVideoActive] = useState(false);

    // Editors paste watch/share links; YouTube refuses to frame those.
    const embedUrl = toYouTubeEmbedUrl(data.video_url);

    return (
        <section className="relative w-full bg-white py-12 md:py-20 px-4 md:px-8 font-sans" id="enlightenment">
            <div className="max-w-[1500px] mx-auto grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6 lg:gap-12 items-center">
                
                {/* LEFT CELL - Content Block */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative w-full h-full min-h-[400px] rounded-[24px] md:rounded-[40px] overflow-hidden bg-[#f5f6f6] shadow-sm p-8 md:p-14 flex flex-col justify-between"
                >
                    {/* The Text Block */}
                    <div>
                        <span className="text-[#101848]/50 font-sans font-bold tracking-[0.2em] uppercase text-[10px] md:text-xs mb-4 block">
                            {data.label || "Wisdom & Knowledge"}
                        </span>
                        
                        <div className="relative inline-block mb-8">
                            <h2 className="text-[24px] sm:text-[36px] md:text-[48px] lg:text-[56px] font-sans text-[#1b1b2b] leading-[1.1] tracking-tight relative z-10 whitespace-pre-line">
                                {data.title}
                            </h2>
                            {/* Decorative Curve */}
                            <svg className="absolute -bottom-4 left-0 w-[140px] opacity-70" viewBox="0 0 100 20" preserveAspectRatio="none">
                                <path d="M0,15 Q30,-5 100,15" fill="none" stroke="#e0e2e5" strokeWidth="4" strokeLinecap="round" />
                            </svg>
                        </div>

                        <p className="text-[#1b1b2b]/70 text-[13px] md:text-[15px] font-medium leading-relaxed max-w-lg">
                            {data.content}
                        </p>
                    </div>
                    
                    {/* Founder Info Card (Bento sub-card style) */}
                    <div className="flex items-center gap-4 bg-white p-4 md:p-5 rounded-[20px] md:rounded-[24px] shadow-sm mt-12 self-start border border-gray-100">
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gray-50 flex items-center justify-center p-1 flex-shrink-0 shadow-inner">
                            <div className="w-full h-full rounded-full border border-gray-200 flex items-center justify-center bg-white">
                                <span className="material-icons text-[#1b1b2b]/70 text-xl">spa</span>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold text-[14px] md:text-[16px] text-[#1b1b2b] leading-tight">{data.founder_name}</h4>
                            <p className="text-[#1b1b2b]/50 text-[10px] md:text-[11px] font-bold tracking-wide mt-1 uppercase">{data.founder_role}</p>
                        </div>
                    </div>
                </motion.div>

                {/* RIGHT CELL - Video Block */}
                <motion.div 
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative w-full aspect-video bg-black rounded-[24px] md:rounded-[32px] overflow-hidden shadow-lg border border-gray-100 group"
                >
                    {embedUrl ? (
                        <iframe
                            src={isVideoActive ? withEmbedParams(embedUrl, { autoplay: 1 }) : embedUrl}
                            title={data.title}
                            className={`w-full h-full absolute inset-0 transition-opacity duration-700 ${isVideoActive ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-80'}`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-white/40 text-sm">
                            Video unavailable
                        </div>
                    )}

                    {/* Interactive Play Overlay to prevent iframe wheel capture glitches */}
                    {embedUrl && !isVideoActive && (
                        <div 
                            className="absolute inset-0 z-10 cursor-pointer flex items-center justify-center group/play transition-colors hover:bg-black/20"
                            onClick={() => setIsVideoActive(true)}
                        >
                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-2xl transition-all duration-300 group-hover/play:scale-110 group-hover/play:bg-white/40">
                                <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-white border-b-[8px] border-b-transparent ml-1 md:ml-2 md:border-t-[10px] md:border-b-[10px] md:border-l-[18px]" />
                            </div>
                        </div>
                    )}
                </motion.div>

            </div>
        </section>
    );
}
