"use client";

import { motion } from "framer-motion";

export default function UpcomingEvents({ content }: { content?: any }) {
    const schedule = content?.schedule || [
        { time: "6:45 PM", activity: "Yoga, Eye Exercise & Pranayama" },
        { time: "8:00 PM", activity: "Meditation", note: "Please be seated by 7:45 PM" },
        { time: "8:35 PM", activity: "Showering" },
        { time: "8:50 PM", activity: "Book Reading Session" }
    ];

    const title = content?.title || "Every Thursday\nat Our Centres";
    const subtitle = content?.subtitle || "Weekly Gathering";
    const intro = content?.intro || "Join us every Thursday to recharge yourself through meditation and learn new insights with our fellow members. It's a time for community, growth, and inner peace.";

    return (
        <section className="relative py-14 md:py-24 bg-[#eeebf0] overflow-hidden">
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
            <div className="max-w-[1400px] mx-auto px-5 sm:px-8 md:px-12 relative z-10">
                <div className="grid lg:grid-cols-12 gap-16 items-start">
                    {/* Left Column - Intro */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="lg:col-span-5"
                    >
                        <span className="text-[#101848]/60 font-sans font-bold tracking-[0.3em] uppercase text-xs mb-4 block">
                            {subtitle}
                        </span>
                        <h2 className="text-[28px] sm:text-[42px] md:text-[52px] font-serif text-[#101848] leading-[1.1] mb-8 whitespace-pre-line">
                            {title}
                        </h2>
                        <div className="space-y-6">
                            <p className="text-[18px] text-[#233252]/80 font-sans leading-relaxed">
                                {intro}
                            </p>
                           
                        </div>
                    </motion.div>

                    {/* Right Column - Schedule */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="lg:col-span-7 bg-[#101848] rounded-[32px] sm:rounded-[60px] p-6 sm:p-10 md:p-16 shadow-2xl relative overflow-hidden text-white"
                    >
                        <div className="absolute top-0 right-0 p-6 sm:p-12 opacity-10">
                            <span className="material-icons text-[120px]">schedule</span>
                        </div>
                        
                        <h3 className="text-2xl font-serif mb-10 relative z-10">Thursday Schedule</h3>
                        
                        <div className="space-y-8 relative z-10">
                            {schedule.map((item: any, i: number) => (
                                <div key={i} className="flex gap-8 items-start border-b border-white/5 pb-6 last:border-0 last:pb-0">
                                    <div className="flex-shrink-0 w-24">
                                        <span className="text-white/60 font-sans font-bold text-sm tracking-widest">{item.time}</span>
                                    </div>
                                    <div className="flex-grow">
                                        <h4 className="text-xl font-medium mb-1">{item.activity}</h4>
                                        {item.note && (
                                            <p className="text-white/40 text-sm italic">{item.note}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
