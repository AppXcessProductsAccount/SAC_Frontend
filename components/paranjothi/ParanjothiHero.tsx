"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function ParanjothiHero({ content }: { content?: any }) {
    const subtitle = content?.subtitle || "ABOUT THE PROGRAM DIRECTOR";
    const title = content?.title || "Gnanaguru Paranjothi Subramaniam";
    const image = content?.image || "/director_paranjothi.png";
    const description = content?.description || "Gnanaguru Paranjothi Subramaniam is the Spiritual Master, Co-Founder & Program Director of Self Awareness Centre (SAC)...";

    return (
        <section className="relative py-10 md:py-14 lg:py-20 overflow-hidden">
            <div className="absolute inset-0 z-0">
                <Image
                    src="/header_bg.png"
                    alt="Background"
                    fill
                    className="object-cover opacity-40"
                    priority
                />
            </div>

            <div className="relative z-10 max-w-[1400px] mx-auto px-5 sm:px-8 md:px-12">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="w-full lg:w-[45%] relative"
                    >
                        <div className="relative aspect-[4/5] rounded-[48px] overflow-hidden shadow-2xl border-8 border-white/60">
                            <Image
                                src={image}
                                alt={title}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#101848]/40 to-transparent" />
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="w-full lg:w-[55%]"
                    >
                        <span className="text-[#101848]/60 font-bold tracking-[0.3em] uppercase text-xs mb-4 block">
                            {subtitle}
                        </span>
                        <h1 className="text-[28px] sm:text-[48px] md:text-[64px] font-serif text-[#101848] leading-[1.1] mb-8">
                            {title}
                        </h1>
                        <p className="text-lg text-[#233252]/90 leading-relaxed font-medium">
                            {description}
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
