"use client";

import { motion } from "framer-motion";

export default function OrganizationSection({ content }: { content?: any }) {
    const header = content?.header || {
        title: "Organizational Partnerships",
        subtitle: "Partners in Spiritual Upliftment"
    };

    const organizations = content?.organizations || [
        {
            id: "sasm",
            name: "SAS Malaysia (SASM)",
            theme: "light",
            description: "Registered on 26 May 1999, SASM was established to open the path for further spiritual enhancement of its members across its branches.",
            meta_label: "Our Values",
            list_items: [
                "Compassion to Humanity",
                "Innate Harmony & Peace",
                "Healing Presence",
                "Unconditional Love"
            ]
        },
        {
            id: "sass",
            name: "SAS Singapore (SASS)",
            theme: "dark",
            subtitle: "Service Beyond Self",
            description: "Established on 3 December 1996, SASS is a fellowship for individuals seeking continued growth. We are an open community dedicated to human progress.",
            badges: ["Fellowship for Growth"]
        }
    ];

    return (
        <section className="relative py-10 md:py-14 overflow-hidden">

            <div className="relative z-10 max-w-[1400px] mx-auto px-5 sm:px-8 md:px-12">
                <div className="text-center mb-10 md:mb-16">
                    <h2 className="text-[32px] md:text-[42px] font-serif text-[#101848] mb-4">
                        {header.title}
                    </h2>
                    <p className="text-[#233252]/60 font-sans tracking-widest uppercase text-xs font-bold">
                        {header.subtitle}
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {organizations.map((org: any, idx: number) => (
                        <motion.div
                            key={org.id || idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: idx * 0.2 }}
                            className={`${
                                org.theme === "dark" 
                                ? "bg-[#101848] text-white shadow-xl" 
                                : "bg-white/60 text-[#233252] border border-white/40 shadow-sm"
                            } p-6 sm:p-10 rounded-[40px]`}
                        >
                            <h3 className={`text-2xl font-serif mb-6 ${org.theme === "dark" ? "text-white" : "text-[#101848]"}`}>
                                {org.name}
                            </h3>
                            {org.subtitle && (
                                <p className={`${org.theme === "dark" ? "text-white/60" : "text-[#233252]/60"} font-sans tracking-widest uppercase text-[10px] mb-4`}>
                                    {org.subtitle}
                                </p>
                            )}
                            <div className={`space-y-4 ${org.theme === "dark" ? "text-white/80" : "text-[#233252]/80"} font-sans leading-relaxed`}>
                                <p>{org.description}</p>
                                {org.list_items && (
                                    <div className="pt-4 space-y-3">
                                        <p className={`font-bold ${org.theme === "dark" ? "text-white" : "text-[#101848]"} text-sm uppercase tracking-wider`}>
                                            {org.meta_label || "Our Values"}:
                                        </p>
                                        <ul className="space-y-2 text-sm italic">
                                            {org.list_items.map((item: string, i: number) => (
                                                <li key={i}>• {item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {org.badges && (
                                    <div className="pt-4 flex flex-wrap gap-2">
                                        {org.badges.map((badge: string, i: number) => (
                                            <span key={i} className={`inline-block ${org.theme === "dark" ? "bg-white/10" : "bg-[#101848]/10"} px-4 py-2 rounded-full text-xs font-bold`}>
                                                {badge}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
