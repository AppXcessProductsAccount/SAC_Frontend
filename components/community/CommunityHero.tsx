"use client";

import { motion } from "framer-motion";

export default function CommunityHero({ content }: { content?: any }) {
    const title = content?.title || "Partners in Spiritual\nUpliftment.";
    const subtitle = content?.subtitle || "Fellowship & Cooperation";
    const description = content?.description || "\"SAS Malaysia and Singapore are collaborative partners dedicated to opening the path for the further spiritual enhancement of our members.\"";

    return (
        <section className="relative py-10 md:py-14 lg:py-20 overflow-hidden text-center">

            <div className="relative z-10 max-w-4xl mx-auto px-6">
                <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-[#101848]/60 font-sans font-bold tracking-[0.3em] uppercase text-xs mb-6 block"
                >
                    {subtitle}
                </motion.span>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-[28px] sm:text-[42px] md:text-[68px] font-serif text-[#101848] leading-[1.1] mb-8 whitespace-pre-line"
                >
                    {title}
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-[18px] md:text-[22px] text-[#233252]/80 font-sans italic leading-relaxed max-w-2xl mx-auto"
                >
                    {description}
                </motion.p>
            </div>
        </section>
    );
}
