"use client";

import { motion } from "framer-motion";

export default function SocietySection({ content, type }: { content?: any, type?: 'SASM' | 'SASS' }) {
    const malaysiaBranches = content?.branches || [
        "SASM Kuala Lumpur/Selangor",
        "SASM Johor",
        "SASM Penang",
        "SASM Perak"
    ];

    const sasmValues = content?.values || [
        { 
            title: "Compassion to Humanity", 
            desc: "The attributes of compassion that guide our service to mankind." 
        },
        { 
            title: "Innate Harmony", 
            desc: "Peace beyond all understanding and Calm in the midst of Chaos." 
        },
        { 
            title: "Healing Presence", 
            desc: "To feel free of the guilt and shame associated with our negative thoughts, feelings, and actions." 
        },
        { 
            title: "Unconditional Love", 
            desc: "That which sees no barrier to race, colour, creed, religion, caste, and gender." 
        }
    ];

    const title = content?.title || (type === 'SASS' ? "Self Awareness Society Singapore (SASS)" : "Self Awareness Society Malaysia (SASM)");
    const subtitle = content?.subtitle || (type === 'SASS' ? "Section 3: SAS Singapore" : "Section 2: SAS Malaysia");
    const registrationDate = content?.registration_date || (type === 'SASS' ? "3 December 1996" : "26 May 1999");
    const description = content?.description || content?.who_we_are || "SAS was established with the distinct objective of opening the path for the further spiritual enhancement of its members.";
    const tagline = content?.tagline || (type === 'SASS' ? "Service Beyond Self" : "");
    const objective = content?.what_we_do || "SAS seeks to build a community where we can all venture down a road of human growth together.";

    const renderSASM = () => (
        <div className="mb-32 last:mb-0">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-left mb-16"
            >
                <span className="text-[#101848]/60 font-sans font-bold tracking-[0.3em] uppercase text-xs mb-4 block">
                    {subtitle}
                </span>
                <h2 className="text-[24px] sm:text-[36px] md:text-[52px] font-serif text-[#101848] mb-6">{title}</h2>
                <div className="flex items-center gap-3 mb-6">
                    <span className="material-icons text-[#101848]/40">verified</span>
                    <span className="text-sm font-sans text-[#233252]/60 uppercase tracking-widest">Registered: {registrationDate}</span>
                </div>
                <p className="text-[18px] text-[#233252]/80 font-sans max-w-4xl leading-relaxed mb-8">
                    {description}
                </p>
                
                <div className="flex flex-wrap gap-4 mb-12">
                    {malaysiaBranches.map((branch: string, idx: number) => (
                        <span key={idx} className="bg-white/60 backdrop-blur-sm px-6 py-3 rounded-full border border-white/60 text-[#101848] font-medium text-sm">
                            {branch}
                        </span>
                    ))}
                </div>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {sasmValues.map((val: any, idx: number) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: idx * 0.1 }}
                        className="bg-white/40 backdrop-blur-md p-8 rounded-[32px] border border-white/60 shadow-sm hover:shadow-md transition-all group"
                    >
                        <h4 className="text-xl font-serif text-[#101848] mb-4">{val.title}</h4>
                        <p className="text-[#233252]/70 text-sm font-sans leading-relaxed">{val.desc}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );

    const renderSASS = () => (
        <div className="last:mb-0">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <span className="text-[#101848]/60 font-sans font-bold tracking-[0.3em] uppercase text-xs mb-4 block">
                    {subtitle}
                </span>
                <h2 className="text-[24px] sm:text-[36px] md:text-[52px] font-serif text-[#101848] mb-6">{title}</h2>
                <div className="grid lg:grid-cols-2 gap-12">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <span className="material-icons text-[#101848]/40">verified</span>
                            <span className="text-sm font-sans text-[#233252]/60 uppercase tracking-widest">Registered: {registrationDate}</span>
                        </div>
                        {tagline && <p className="text-[18px] text-[#233252]/80 font-sans leading-relaxed italic">"{tagline}"</p>}
                        <p className="text-[17px] text-[#233252]/80 font-sans leading-relaxed">
                            {description}
                        </p>
                    </div>
                    <div className="bg-[#101848] text-white p-10 rounded-[40px] shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <span className="material-icons text-[80px]">groups</span>
                        </div>
                        <h4 className="text-xl font-serif mb-4 relative z-10">Our Objective</h4>
                        <p className="text-white/80 font-sans text-sm leading-relaxed relative z-10">
                            {objective}
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );

    return (
        <section className="relative py-12 md:py-20 bg-[#eeebf0] overflow-hidden">
            <div className="absolute inset-0 z-0">
                <img
                    src={content?.image_url || "/upcoming_event.png"}
                    alt="Section Background"
                    className="w-full h-full object-cover opacity-80"
                    style={{
                        maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
                        WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)'
                    }}
                />
            </div>

            <div className="relative z-10 max-w-[1400px] mx-auto px-8 md:px-12">
                {(!type || type === 'SASM') && renderSASM()}
                {(!type || type === 'SASS') && renderSASS()}
            </div>
        </section>
    );
}
