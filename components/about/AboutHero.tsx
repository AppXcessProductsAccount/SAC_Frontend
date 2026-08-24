"use client";

import { motion } from "framer-motion";

export default function AboutHero({ content }: { content?: any }) {
    const badge = content?.badge || "Our Story & Journey";
    const title = content?.title || "Rooted in heritage,\nrefined for today.";
    const description = content?.description || "\"We believe that the things we surround ourselves with should tell a story. Not just of where they came from, but where they are going.\"";

    return (
        <section className="relative py-10 md:py-14 lg:py-20 overflow-hidden text-center">
            {/* Background Texture - Cleaned up to be conditional or neutral */}
            <div className="absolute inset-0 z-0 bg-white/10 opacity-30">
                <div className="w-full h-full bg-gradient-to-b from-transparent via-[#101848]/5 to-transparent" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-6">
                <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-[#101848]/60 font-sans font-bold tracking-[0.3em] uppercase text-xs mb-6 block"
                >
                    {badge}
                </motion.span>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-[28px] sm:text-[42px] md:text-[68px] font-serif text-[#101848] leading-[1.1] mb-8 whitespace-pre-line"
                >
                    {title}
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-[18px] md:text-[22px] text-[#233252]/80 font-sans italic leading-relaxed max-w-2xl mx-auto"
                >
                    {description}
                </motion.p>
            </div>
        </section>
    );
}
