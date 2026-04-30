"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function EnlightenmentClassic({ data }: { data: any }) {
    return (
        <section className="relative py-32 px-6 overflow-hidden min-h-[500px] flex items-center bg-white" id="enlightenment">
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
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    
                    {/* Content Side */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="space-y-8"
                    >
                        <div>
                            <span className="text-[#101848]/60 font-sans font-semibold tracking-[0.2em] uppercase text-xs mb-3 block">
                                {data.label || "Wisdom & Knowledge"}
                            </span>
                            <h2 className="text-[30px] md:text-[42px] font-serif text-[#101848] leading-[1.1] mb-4 whitespace-pre-line">
                                {data.title}
                            </h2>
                        </div>

                        <div className="relative pt-2">
                            {/* Decorative Quote Mark */}
                            <span className="absolute -left-3 -top-4 text-[90px] text-[#101848]/5 font-serif leading-none select-none">"</span>
                            <p className="text-[#233252]/80 text-[16px] md:text-[18px] leading-relaxed font-sans italic relative z-10 max-w-lg">
                                {data.content}
                            </p>
                        </div>

                        <div className="flex items-center gap-5 pt-8 border-t border-[#101848]/10 bg-white/40 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-white/20">
                            <div className="w-16 h-16 rounded-full border-2 border-[#101848]/30 bg-[#101848]/10 flex items-center justify-center p-1 flex-shrink-0">
                                <div className="w-full h-full rounded-full border border-[#101848]/50 flex items-center justify-center">
                                    <span className="material-icons text-[#101848] text-2xl">spa</span>
                                </div>
                            </div>
                            <div>
                                <h4 className="font-serif text-[22px] text-[#101848] leading-tight font-bold">{data.founder_name}</h4>
                                <p className="text-[#101848]/80 text-sm font-sans font-semibold tracking-wide mt-1 uppercase">{data.founder_role}</p>
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
                            <iframe
                                src={data.video_url}
                                title={data.title}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
