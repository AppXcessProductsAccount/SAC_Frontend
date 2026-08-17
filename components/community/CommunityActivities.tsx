"use client";

import { motion } from "framer-motion";

export default function CommunityActivities({ content }: { content?: any }) {
    const activities = content?.activities || [
        {
            title: "Transformation Workshops",
            location: "Kuala Lumpur HQ",
            image: "/event_workshop.png",
            description: "Intensive sessions focused on self-discovery and spiritual awakening."
        },
        {
            title: "Inner Silence Retreats",
            location: "Various Locations",
            image: "/event_retreat.png",
            description: "Residential retreats in nature for deep meditative practice."
        },
        {
            title: "Group Meditation",
            location: "All Branches",
            image: "/event_meditation.png",
            description: "Weekly collective practice to amplify energy and peace."
        },
        {
            title: "Spiritual Talk",
            location: "Penang",
            image: "/event_workshop.png",
            description: "Public discourses on wisdom and spiritual principles."
        }
    ];

    const title = content?.title || "Our Community Activities";
    const subtitle = content?.subtitle || " Our Community Activities";
    const description = content?.description || "Witness the diverse ways we help people through workshops, retreats, and community service across our regional branches.";

    return (
        <section className="relative py-14 md:py-24 bg-[#eeebf0] overflow-hidden">
            <div className="absolute inset-0 z-0">
                <img
                    src={content?.image_url || "/sectionbackground.png"}
                    alt="Activities Background"
                    className="w-full h-full object-cover opacity-60"
                    style={{
                        maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
                        WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)'
                    }}
                />
            </div>

            <div className="max-w-[1400px] mx-auto px-5 sm:px-8 md:px-12 relative z-10">
                <div className="mb-10 md:mb-16">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-[#101848]/60 font-sans font-bold tracking-[0.3em] uppercase text-xs mb-4 block"
                    >
                        {subtitle}
                    </motion.span>
                    <h2 className="text-[28px] sm:text-[42px] md:text-[56px] font-serif text-[#101848] leading-[1.1] mb-6">
                        {title}
                    </h2>
                    <p className="text-[18px] text-[#233252]/80 font-sans max-w-2xl leading-relaxed">
                        {description}
                    </p>
                </div>

                {/* Activities Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {activities.map((activity: any, idx: number) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: idx * 0.1 }}
                            className="relative aspect-[4/5] rounded-[40px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 group"
                        >
                            <img
                                src={activity.image_url || activity.image || "/event_workshop.png"}
                                alt={activity.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            
                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

                            {/* Card Content Overlay */}
                            <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                                    <span className="text-[10px] font-bold text-white tracking-widest uppercase">{activity.location}</span>
                                </div>
                                
                                <h3 className="text-3xl font-serif text-white mb-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    {activity.title}
                                </h3>
                                
                                <div className="overflow-hidden h-0 group-hover:h-auto transition-all duration-500 opacity-0 group-hover:opacity-100">
                                    <p className="text-sm text-white/80 leading-relaxed font-sans mb-6">
                                        {activity.description}
                                    </p>
                                </div>

                                <div className="pt-4 flex items-center gap-2 text-white/60 group-hover:text-white transition-colors">
                                    <span className="text-xs font-bold tracking-widest uppercase">Explore Activity</span>
                                    <span className="material-icons text-xl">arrow_right_alt</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
