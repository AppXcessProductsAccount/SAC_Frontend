"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { toYouTubeEmbedUrl } from "@/lib/youtube";

export default function EnlightenmentClassic({ data }: { data: any }) {
    // Editors paste watch/share links; YouTube refuses to frame those.
    const embedUrl = toYouTubeEmbedUrl(data.video_url);

    return (
        <section className="relative py-16 md:py-24 lg:py-32 px-5 sm:px-6 md:px-8 overflow-hidden min-h-[500px] flex items-center bg-white" id="enlightenment">
            {/* Background Image Layer with Seamless Mask Effect */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={data.image_url || "/sectionbackground.png"}
                    alt="Enlightenment Background"
                    fill
                    className="object-cover opacity-80"
                    priority
                    style={{
                        maskImage: 'linear-gradient(to bottom, transparent, black 20px, black calc(100% - 20px), transparent)',
                        WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 22px, black calc(100% - 20px), transparent)'
                    }}
                />
            </div>

            <div className="relative z-10 max-w-[1400px] mx-auto w-full">
                <div className="grid lg:grid-cols-2 gap-10 md:gap-12 lg:gap-16 items-center">

                    {/* Content Side */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="space-y-6 md:space-y-8"
                    >
                        <div>
                            <span className="text-[#101848]/60 font-sans font-semibold tracking-[0.2em] uppercase text-xs mb-3 block">
                                {data.label || "Wisdom & Knowledge"}
                            </span>
                            <h2 className="text-[26px] sm:text-[32px] md:text-[42px] font-serif text-[#101848] leading-[1.15] mb-4 whitespace-pre-line text-balance">
                                {data.title}
                            </h2>
                        </div>

                        <div className="relative pt-2">
                            {/* Decorative Quote Mark — kept inside the box so it can't clip
                                against the section edge on narrow screens */}
                            <span className="absolute left-0 -top-4 text-[90px] text-[#101848]/5 font-serif leading-none select-none pointer-events-none">"</span>
                            <p className="text-[15px] md:text-[18px] text-[#233252]/80 leading-relaxed font-sans italic relative z-10 max-w-lg">
                                {data.content}
                            </p>
                        </div>

                        {/* Single `border` declaration — the previous `border-t ... border`
                            pair fought each other and rendered a full box regardless. */}
                        <div className="flex items-center gap-4 sm:gap-5 bg-white/40 backdrop-blur-md p-5 sm:p-6 rounded-2xl shadow-sm border border-white/40">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-[#101848]/30 bg-[#101848]/10 flex items-center justify-center p-1 flex-shrink-0">
                                <div className="w-full h-full rounded-full border border-[#101848]/50 flex items-center justify-center">
                                    <span className="material-icons text-[#101848] text-2xl">spa</span>
                                </div>
                            </div>
                            <div className="min-w-0">
                                <h4 className="font-serif text-[18px] sm:text-[22px] text-[#101848] leading-tight font-bold">{data.founder_name}</h4>
                                <p className="text-[#101848]/80 text-[12px] sm:text-sm font-sans font-semibold tracking-wide mt-1 uppercase">{data.founder_role}</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Video Side */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="relative"
                    >
                        {/* Ornamental Frame for the video */}
                        <div className="absolute -inset-2 md:-inset-4 border border-[#101848]/10 rounded-3xl -rotate-1"></div>
                        <div className="absolute -inset-2 md:-inset-4 border border-[#101848]/5 rounded-3xl rotate-2"></div>
                        
                        <div className="relative aspect-video rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] bg-black border-4 border-white/50">
                            {embedUrl ? (
                                <iframe
                                    src={embedUrl}
                                    title={data.title}
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-white/40 text-sm font-sans">
                                    Video unavailable
                                </div>
                            )}
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
