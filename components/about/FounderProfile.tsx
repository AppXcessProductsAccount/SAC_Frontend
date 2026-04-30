"use client";

import { motion } from "framer-motion";

export default function FounderProfile({ content }: { content?: any }) {
    const founders = content?.founders || [
        {
            name: "Gnanaguru Paranjothi Subramaniam",
            role: "Co-Founder",
            bio: "A spiritual visionary dedicated to human resource development and the upliftment of the soul through profound meditation techniques.",
            image: "/about_secondary.png"
        },
        {
            name: "Madam Sakuntala S. Suppiah",
            role: "Co-Founder",
            bio: "Instrumental in establishing the Self Awareness Centre as a sanctuary for those seeking inner peace and spiritual growth.",
            image: "/about_main.png"
        }
    ];

    const title = content?.title || "Our Visionary Leadership";
    const subtitle = content?.subtitle || "The Hearts Behind SAC";

    return (
        <section className="relative py-24 bg-[#eeebf0] overflow-hidden">
            {/* Background Texture with Seamless Mask Effect */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/upcoming_event.png"
                    alt="Section Background"
                    className="w-full h-full object-cover opacity-60"
                    style={{
                        maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
                        WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)'
                    }}
                />
            </div>

            <div className="relative z-10 max-w-[1400px] mx-auto px-8 md:px-12">
                <div className="text-center mb-16">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-[#101848]/60 font-sans font-bold tracking-[0.3em] uppercase text-xs mb-4 block"
                    >
                        {subtitle}
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-[42px] md:text-[56px] font-serif text-[#101848] leading-[1.1]"
                    >
                        {title}
                    </motion.h2>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                    {founders.map((founder: any, idx: number) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: idx * 0.2 }}
                            className="bg-white/40 backdrop-blur-md p-10 rounded-[48px] border border-white/60 shadow-xl flex flex-col items-center text-center group hover:bg-white/60 transition-all duration-500"
                        >
                            <div className="w-48 h-48 rounded-full overflow-hidden mb-8 ring-4 ring-white/80 shadow-lg group-hover:scale-105 transition-transform duration-500">
                                <img
                                    src={founder.image}
                                    alt={founder.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <h3 className="text-3xl font-serif text-[#101848] mb-2">{founder.name}</h3>
                            <p className="text-[#101848]/60 font-sans font-bold tracking-widest uppercase text-xs mb-6">
                                {founder.role}
                            </p>
                            <p className="text-[#233252]/80 font-sans leading-relaxed text-lg italic">
                                "{founder.bio}"
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
