"use client";

import { motion } from "framer-motion";

export default function MissionIntentSection({ content }: { content?: any }) {
    const mission = content?.mission_statement || {
        badge: "Our Mission",
        text: "To honor the link that exists between individual, community, and society. We seek to provide the vehicle by which members realize their full potential."
    };
    const intentHeader = content?.intent_header || {
        title: "The Journey's Intention",
        show_divider: true
    };
    
    const intentions = content?.intentions || [
        { title: "Clear Mind", desc: "To create a mind free of mental blocks." },
        { title: "Positive Attitude", desc: "Looking at life from the right perspective." },
        { title: "Attributes of Compassion", desc: "Getting in tune with the core through meditation." },
        { title: "Spiritual Growth", desc: "Helping in spiritual and psychological upliftment." },
        { title: "Personality Development", desc: "Strengthening the core personality." },
        { title: "Healthy Balance", desc: "Maintaining a balance between mind and soul." }
    ];

    return (
        <section className="relative py-10 md:py-14 overflow-hidden">

            <div className="relative z-10 max-w-[1400px] mx-auto px-5 sm:px-8 md:px-12">
                {/* Mission Wrapper */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                    className="relative bg-[#101848] rounded-[32px] sm:rounded-[60px] p-6 sm:p-12 md:p-20 text-center text-white mb-24 overflow-hidden"
                >
                    <div className="absolute inset-0 opacity-10">
                        <img src="/upcoming_event.png" alt="texture" className="w-full h-full object-cover invert" />
                    </div>
                    <div className="relative z-10">
                        <span className="text-white/40 font-sans font-bold tracking-[0.3em] uppercase text-xs mb-6 block">
                            {mission.badge}
                        </span>
                        <h2 className="text-[28px] md:text-[42px] font-serif mb-8 max-w-4xl mx-auto leading-relaxed">
                            "{mission.text}"
                        </h2>
                    </div>
                </motion.div>

                {/* Journey's Intention Wrapper */}
                <div className="text-center mb-10 md:mb-16">
                    <h2 className="text-[32px] md:text-[42px] font-serif text-[#101848] mb-4">
                        {intentHeader.title}
                    </h2>
                    {intentHeader.show_divider !== false && <div className="w-16 h-[1px] bg-[#101848]/20 mx-auto"></div>}
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {intentions.map((item: any, idx: number) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: idx * 0.1 }}
                            className="bg-white/40 backdrop-blur-sm p-8 rounded-[32px] border border-white/60 hover:bg-white/60 transition-all group"
                        >
                            <h3 className="text-xl font-serif text-[#101848] mb-3 group-hover:scale-105 transition-transform">{item.title}</h3>
                            <p className="text-[#233252]/70 font-sans leading-relaxed">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
