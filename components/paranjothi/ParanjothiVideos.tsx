"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function ParanjothiVideos({ content }: { content?: any }) {
    const title = content?.title || "Transformational Insights";
    const subtitle = content?.subtitle || "";
    const rawVideos = content?.videos || [];
    const videos = Array.isArray(rawVideos) ? rawVideos : [rawVideos];

    return (
        <section className="relative py-14 md:py-24 bg-[#eeebf0]">
            <div className="absolute inset-0 z-0">
                <Image
                    src="/upcoming_event.png"
                    alt="Texture"
                    fill
                    className="object-cover opacity-30"
                />
            </div>

            <div className="relative z-10 max-w-[1400px] mx-auto px-8 md:px-12">
                <div className="text-center mb-16">
                    <h2 className="text-[28px] sm:text-[42px] md:text-[56px] font-serif text-[#101848] mb-4">{title}</h2>
                    {subtitle && <p className="text-gray-600 max-w-2xl mx-auto font-sans">{subtitle}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {videos.map((src: string, index: number) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="relative aspect-video rounded-3xl overflow-hidden shadow-xl border-4 border-white/60 group"
                        >
                            <iframe 
                                className="w-full h-full"
                                src={src} 
                                title={`YouTube video player ${index + 1}`} 
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                allowFullScreen
                            ></iframe>
                            <div className="absolute inset-0 bg-[#101848]/10 pointer-events-none group-hover:opacity-0 transition-opacity" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
