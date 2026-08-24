"use client";

import React from "react";
import { motion } from "framer-motion";

export default function ParanjothiBio({ content }: { content?: any }) {
    const rawParagraphs = content?.paragraphs || [];
    const paragraphs = Array.isArray(rawParagraphs) ? rawParagraphs : [rawParagraphs];
    const quote = content?.quote || "";

    return (
        <section className="relative py-10 md:py-14 bg-white/40 backdrop-blur-md border-y border-white/60">
            <div className="max-w-[1400px] mx-auto px-5 sm:px-8 md:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    {/* Split paragraphs into two columns if possible */}
                    <div className="space-y-6 text-[#233252]/80 leading-relaxed text-lg">
                        {paragraphs.slice(0, Math.ceil(paragraphs.length / 2)).map((p: string, i: number) => (
                            <motion.p 
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                {p}
                            </motion.p>
                        ))}
                    </div>

                    <div className="space-y-6 text-[#233252]/80 leading-relaxed text-lg">
                        {paragraphs.slice(Math.ceil(paragraphs.length / 2)).map((p: string, i: number) => (
                            <motion.p 
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                            >
                                {p}
                            </motion.p>
                        ))}
                        {quote && (
                            <motion.p 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="font-serif italic text-2xl text-[#101848] pt-4 border-l-4 border-[#101848]/20 pl-8"
                            >
                                “{quote}”
                            </motion.p>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
