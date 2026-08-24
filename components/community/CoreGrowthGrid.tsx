"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CoreGrowthGrid({ content }: { content?: any }) {
    const areas = content?.areas || [
        {
            title: "EDUCATION",
            description: "Lifelong learning is critical to expanding personal horizons. SASS offers exposure to talks and seminars to aid in your education."
        },
        {
            title: "CAREER",
            description: "Success in one's career promotes an enlightened, positive vision of the world. SASS arranges for experienced practitioners to share insights and conducts courses on public speaking, writing and computer skills."
        },
        {
            title: "FAMILY",
            description: "Family is the most important tenant to a happy, healthy life. SASS encourages members to spend special time with their loved ones and pass on enlightening principles to the younger generation."
        },
        {
            title: "HEALTH",
            description: "Modern-life stresses induce many health issues. SASS hosts talks on health matters, medical check-ups and offers demonstrations in yoga and aerobics."
        },
        {
            title: "WEALTH",
            description: "Money must be recognised as an essential transaction tool. SASS guides its members on how to achieve money via healthy routes and how to make the best use of it."
        },
        {
            title: "SOCIAL",
            description: "Extending beyond the family, members are encouraged to contribute to the larger community, reaching out to the less fortunate, the elderly and the ill."
        },
        {
            title: "SPIRITUAL",
            description: "Human growth is not complete without introspection. SASS provides a platform for the promotion of human kinship and exploration of the spiritual self."
        }
    ];

    const title = content?.title || "7 Core Areas for Human Growth";
    const subtitle = content?.subtitle || "Our Path to Potential";

    const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    // Auto-cycle effect
    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            setExpandedIndex((prev) => (prev === null ? 0 : (prev + 1) % areas.length));
        }, 5000);

        return () => clearInterval(interval);
    }, [isAutoPlaying, areas.length]);

    const handleInteraction = (idx: number) => {
        setIsAutoPlaying(false);
        setExpandedIndex(expandedIndex === idx ? null : idx);
    };

    return (
        <section className="relative py-10 md:py-14 overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-5 sm:px-8 md:px-12 relative z-10">
                <div className="text-center mb-10 md:mb-16">
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
                        className="text-[28px] sm:text-[42px] md:text-[56px] font-serif text-[#101848] leading-[1.1]"
                    >
                        {title}
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {areas.map((area: any, idx: number) => {
                        const isExpanded = expandedIndex === idx;
                        return (
                            <motion.div
                                key={idx}
                                layout
                                onClick={() => handleInteraction(idx)}
                                className={`relative cursor-pointer overflow-hidden rounded-[40px] transition-all duration-500 ease-out ${isExpanded ? 'lg:col-span-2 ring-2 ring-[#101848]' : 'bg-[#eeebf0] group'} min-h-[300px] flex flex-col p-8`}
                            >
                                {/* Background Image with Overlay */}
                                <div className="absolute inset-0 z-0">
                                    {area.image_url && (
                                        <img
                                            src={area.image_url}
                                            alt={area.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    )}
                                    <div className={`absolute inset-0 transition-colors duration-500 ${isExpanded ? 'bg-black/60 backdrop-blur-[2px]' : 'bg-black/20 group-hover:bg-black/40'}
                                    `} />
                                </div>

                                <div className="relative z-10 h-full flex flex-col">
                                    <div className="flex justify-between items-start mb-6">
                                        <span className="font-sans font-bold tracking-widest text-xs text-white/60">
                                            AREA 0{idx + 1}
                                        </span>
                                        <motion.div
                                            animate={{ rotate: isExpanded ? 45 : 0 }}
                                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isExpanded ? 'bg-white text-[#101848]' : 'bg-white/20 text-white group-hover:bg-white group-hover:text-[#101848]'}
                                            `}
                                        >
                                            <span className="material-icons text-xl">{isExpanded ? 'close' : 'add'}</span>
                                        </motion.div>
                                    </div>

                                    <h3 className="text-2xl font-serif mb-4 text-white">
                                        {area.title}
                                    </h3>

                                    <AnimatePresence mode="wait">
                                        {isExpanded ? (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="mt-2"
                                            >
                                                <p className="text-white/90 font-sans leading-relaxed text-lg max-w-lg">
                                                    {area.description}
                                                </p>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="mt-auto"
                                            >
                                                <span className="text-white/40 group-hover:text-white/60 text-sm font-medium transition-colors">Click to explore</span>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
