"use client";

import { motion } from "framer-motion";

export default function SACSection({ content }: { content?: any }) {
    const branches = content?.branches || [
        { city: "Johor Bahru", date: "July 1992" },
        { city: "Butterworth, Penang", date: "September 1993" },
        { city: "Ipoh, Perak", date: "June 1994" },
        { city: "Singapore", date: "September 1994" }
    ];

    const programs = content?.core_programs || [
        "7-Day Transformational Journey (7DTJ)",
        "Heart Centre (Anahatha) Meditation",
        "Kundalini Yoga Discourse (KYD)",
        "Enhancing Prosperity and Abundance (EPA)"
    ];

    const advancedPrograms = content?.advanced_programs || [
        { name: "Soul Nourishment", duration: "15 Day" },
        { name: "Shadows In Dark – The Dance Of Opposites", duration: "15 Days" },
        { name: "Divine Revelations – God Philosophy", duration: "8 Days" }
    ];

    const title = content?.title || "Self Awareness Centre (SAC)";
    const subtitle = content?.subtitle || "Established 1988";
    const tagline = content?.tagline || "An Institute for Human Resources Development and Spiritual Upliftment";
    const history = content?.history || "The SELF AWARENESS CENTRE (SAC) was founded on 1st December 1988 in Kuala Lumpur by Co-Founders, Gnanaguru Paranjothi Subramaniam and Madam Sakuntala S. Suppiah. Originally located in Brickfields, Kuala Lumpur. Now it is located at Taman Desa, Jalan Klang Lama, Kuala Lumpur.";
    const philosophy = content?.philosophy || "SAC is a non-religious, non-communal and non-political organisation. We conduct Transformational, Motivational and Spiritual related programs designed to uplift the individual.";

    return (
        <section className="relative py-24 bg-[#eeebf0] overflow-hidden">
            {/* Background Texture with Seamless Mask Effect */}
            <div className="absolute inset-0 z-0">
                <img
                    src={content?.background_image_url || "/upcoming_event.png"}
                    alt="Section Background"
                    className="w-full h-full object-cover opacity-80"
                    style={{
                        maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
                        WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)'
                    }}
                />
            </div>
            <div className="max-w-[1400px] mx-auto px-8 md:px-12 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-start">
                    {/* Left Column: History & Founders */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-[#101848]/60 font-sans font-bold tracking-[0.3em] uppercase text-xs mb-4 block">
                            {subtitle}
                        </span>
                        <h2 className="text-[42px] md:text-[56px] font-serif text-[#101848] leading-[1.1] mb-8">
                            {title}
                        </h2>
                        <div className="space-y-6 text-[18px] text-[#233252]/80 font-sans leading-relaxed">
                            <p className="font-semibold text-[#101848]">
                                {tagline}
                            </p>
                            <p>
                                {history}
                            </p>
                            <div className="bg-[#101848]/5 p-8 rounded-[40px] border border-[#101848]/10 mt-8">
                                <h4 className="text-[#101848] font-serif text-xl mb-4 font-bold">Expanding Our Reach</h4>
                                <p className="text-sm mb-6">Due to popular demand, SAC established several branches across the region:</p>
                                <div className="grid grid-cols-2 gap-4">
                                    {branches.map((branch: any, i: number) => (
                                        <div key={i} className="flex flex-col">
                                            <span className="text-[#101848] font-bold text-sm">{branch.city}</span>
                                            <span className="text-[#233252]/60 text-xs">{branch.date}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column: Mission & Programs */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="space-y-10"
                    >
                        <div className="bg-[#101848] text-white p-12 rounded-[60px] shadow-2xl relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="text-2xl font-serif mb-6">Our Core Philosophy</h3>
                                <p className="text-white/80 font-sans leading-relaxed mb-6">
                                    {philosophy}
                                </p>
                                <div className="space-y-4">
                                    <h4 className="text-white font-bold text-sm uppercase tracking-wider">Program Modules</h4>
                                    <div className="grid gap-3">
                                        {programs.map((p: string, i: number) => (
                                            <div key={i} className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl border border-white/10">
                                                <span className="material-icons text-xs">auto_awesome</span>
                                                <span className="text-sm font-medium">{p}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-6 mt-10">
                            <h3 className="text-2xl font-serif text-[#101848]">Advanced Spiritual Journey</h3>
                            <p className="text-[17px] text-[#233252]/80 font-sans leading-relaxed">
                                To embark further into the spiritual journey, higher level Spiritual Conferences have been designed perfectly in our program module:
                            </p>
                            <div className="grid gap-2">
                                {advancedPrograms.map((p: any, i: number) => (
                                    <div key={i} className="text-sm font-medium text-[#101848]/80">• {p.name} ({p.duration})</div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Regular Activities - Full Width Bottom Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="mt-20 bg-[#eeebf0] p-10 md:p-16 rounded-[60px] border border-white shadow-sm flex flex-col md:flex-row items-center gap-12"
                >
                    <div className="md:w-1/3">
                        <div className="w-16 h-16 rounded-2xl bg-[#101848] flex items-center justify-center mb-6 shadow-lg shadow-[#101848]/20">
                            <span className="material-icons text-white text-3xl">event_repeat</span>
                        </div>
                        <h3 className="text-3xl font-serif text-[#101848]">Regular Activities</h3>
                        <p className="text-[#101848]/60 font-sans font-bold tracking-widest text-[10px] uppercase mt-2">Consistent Spiritual Practice</p>
                    </div>
                    <div className="md:w-2/3 flex flex-col md:flex-row gap-8 items-start">
                        <div className="flex-1">
                            <p className="text-[18px] text-[#233252]/80 font-sans leading-relaxed">
                                Special Group Meditation with our Spiritual Master, <span className="font-bold text-[#101848]">Gnanaguru Paranjothi Subramaniam</span>, is conducted at all branches on a regular basis with philosophical insights and Q & A sessions being the highlights.
                            </p>
                            <p className="text-[18px] text-[#233252]/80 font-sans leading-relaxed mt-4">
                                To further consolidate and practice the principles learned, Group Meditation together with Yoga & Eye and Pranayamam exercises are conducted on a weekly basis on Thursdays.
                            </p>
                        </div>
                        {content?.image_url && (
                            <div className="w-full md:w-1/3 aspect-video rounded-[30px] overflow-hidden shadow-xl flex-shrink-0">
                                <img src={content.image_url} alt={title} className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
