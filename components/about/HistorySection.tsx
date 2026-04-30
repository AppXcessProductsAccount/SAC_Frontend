"use client";

import { motion } from "framer-motion";

export default function HistorySection({ content }: { content?: any }) {
    const title = content?.title || "A Legacy of Spiritual Upliftment";
    const descriptionBlocks = content?.description_blocks || [
        "The SELF AWARENESS CENTRE (SAC) was founded on 1st December 1988 in Kuala Lumpur by Co-Founders, Gnanaguru Paranjothi Subramaniam and Madam Sakuntala S. Suppiah.",
        "Originally located in Brickfields, Kuala Lumpur, SAC has grown from a single center into a widespread fellowship with branches in Johor Bahru, Penang, Ipoh, and Singapore.",
        "SAC is an Institute for Human Resources Development and Spiritual Upliftment. It is a non-religious, non-communal and non-political organisation dedicated to conducting Transformational, Motivational and Spiritual related programs."
    ];
    const sideCard = content?.side_card || {
        title: "Our Core Modules",
        text: "The Core to our program module is the 7-Day Transformational Journey (7DTJ). To further supplement and spiritually uplift the individual, profound meditation techniques are introduced.",
        items: [
            "7-Day Transformational Journey (7DTJ)",
            "Heart Centre (Anahatha) Meditation",
            "Kundalini Yoga Discourse (KYD)",
            "Prosperity & Abundance (EPA)"
        ]
    };

    return (
        <section className="relative py-20 bg-[#eeebf0] overflow-hidden">
            {/* Background Texture with Seamless Mask Effect */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/upcoming_event.png"
                    alt="Section Background"
                    className="w-full h-full object-cover opacity-80"
                    style={{
                        maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
                        WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)'
                    }}
                />
            </div>

            <div className="relative z-10 max-w-[1400px] mx-auto px-8 md:px-12">
                <div className="grid lg:grid-cols-2 gap-16 items-start">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-[32px] md:text-[48px] font-serif text-[#101848] mb-8 leading-tight">
                            {title}
                        </h2>
                        <div className="space-y-6 text-[16px] md:text-[18px] text-[#233252]/80 font-sans leading-relaxed">
                            {descriptionBlocks.map((p: string, idx: number) => (
                                <p key={idx}>{p}</p>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="bg-white/40 backdrop-blur-sm p-8 md:p-12 rounded-[32px] border border-white/60 shadow-xl"
                    >
                        <h3 className="text-2xl font-serif text-[#101848] mb-6">{sideCard.title}</h3>
                        <p className="text-[#233252]/70 mb-8 leading-relaxed">
                            {sideCard.text}
                        </p>
                        <div className="space-y-4">
                            {sideCard.items?.map((item: string, idx: number) => (
                                <div key={idx} className="flex items-center gap-3 text-[#101848] font-bold">
                                    <div className="w-2 h-2 rounded-full bg-[#101848]" />
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
