import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { UpcomingProgramsContent } from "./UpcomingPrograms";

interface Props {
    content: UpcomingProgramsContent | null;
}

export default function UpcomingProgramsClassic({ content }: Props) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Fallback data
    const displayData = {
        title: content?.title || "Upcoming Programs",
        subtitle: content?.subtitle || "Join our transformative journeys and experience profound spiritual growth across various locations.",
        programs: content?.programs || [
            {
                id: 1,
                title: "Self Awareness Workshop",
                date_text: "May 15–17, 2024",
                image_url: "/event_workshop.png",
                tags: ["Spirituality", "Self-Growth"],
                location: "Kuala Lumpur"
            },
            {
                id: 2,
                title: "Full Moon Meditation",
                date_text: "June 3, 2024",
                image_url: "/event_meditation.png",
                tags: ["Meditation", "Wellness"],
                location: "Singapore"
            },
            {
                id: 3,
                title: "Jungle Retreat",
                date_text: "June 20–23, 2024",
                image_url: "/event_retreat.png",
                tags: ["Nature", "Retreat"],
                location: "Penang"
            }
        ]
    };

    // We add the preview item if it's not already there (UX choice to keep consistency)
    const events = [
        {
            id: 'preview',
            title: "Free Online Preview",
            date_text: "Anytime",
            image_url: "/hero_slider_preview.png",
            tags: ["Experimental", "Online"],
            location: "Virtual",
            isPreview: true
        },
        ...displayData.programs
    ];

    const nextSlide = () => {
        if (currentIndex < events.length - 1) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const prevSlide = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    return (
        <section className="relative w-full overflow-hidden bg-white pt-24 pb-32" id="events">
            {/* Background Texture */}
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
                {/* Section Header */}
                <div className="flex flex-col mb-12">
                    <motion.h2
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="text-[42px] md:text-[54px] font-bold text-[#101848] mb-4 leading-tight"
                    >
                        {displayData.title}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-[18px] text-[#233252]/60 font-sans max-w-xl"
                    >
                        {displayData.subtitle}
                    </motion.p>
                </div>

                {/* Slider Container */}
                <div className="relative mt-8">
                    <motion.div
                        ref={scrollContainerRef}
                        className="flex gap-6 overflow-x-visible cursor-grab active:cursor-grabbing"
                        animate={{ x: `-${currentIndex * (350 + 24)}px` }} // card width (350) + gap (24)
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                        {events.map((event, index) => (
                            <motion.div
                                key={event.id}
                                className="relative flex-shrink-0 w-[350px] aspect-[3/4] rounded-[32px] overflow-hidden shadow-2xl group border border-white/20"
                            >
                                <Image
                                    src={event.image_url}
                                    alt={event.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />

                                {/* Overlay Top: Tags */}
                                <div className="absolute top-6 left-6 flex gap-2 z-20">
                                    {event.tags.map((tag: string, i: number) => (
                                        <span key={i} className="bg-black/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-[12px] font-sans font-medium uppercase tracking-wider border border-white/10">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                {/* Bottom Info Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                                <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                                    <h3 className="text-2xl font-bold text-white mb-2 leading-tight">
                                        {event.title}
                                    </h3>
                                    <div className="flex flex-col gap-1">
                                        <p className="text-white/70 font-sans text-sm uppercase tracking-widest font-semibold italic">
                                            {event.date_text}
                                        </p>
                                        <div className="flex items-center gap-1 text-white/50 text-[12px] font-sans uppercase tracking-[0.1em]">
                                            <span className="material-symbols-outlined text-[14px]">location_on</span>
                                            {event.location || "Upcoming Centres"}
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <Link
                                        href={event.isPreview ? "/programs#preview" : "/programs"}
                                        className="absolute bottom-8 right-8 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-[#101848] transition-all group/btn shadow-lg"
                                    >
                                        <Plus size={24} className="transition-transform group-hover/btn:rotate-90" />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Bottom Controls */}
                <div className="mt-16 flex items-center justify-between">
                    <Link
                        href="/programs"
                        className="flex items-center gap-2 group text-[#101848] font-bold text-[16px] font-sans uppercase tracking-widest"
                    >
                        View All Programs
                        <ChevronRight className="transition-transform group-hover:translate-x-1" size={20} />
                    </Link>

                    <div className="flex gap-4">
                        <button
                            onClick={prevSlide}
                            disabled={currentIndex === 0}
                            className={`p-4 rounded-full border transition-all ${currentIndex === 0 ? "border-[#101848]/10 text-[#101848]/20" : "border-[#101848]/20 text-[#101848] hover:bg-[#101848] hover:text-white shadow-md active:scale-95"}`}
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            onClick={nextSlide}
                            disabled={currentIndex >= events.length - 3} // roughly showing 3 cards
                            className={`p-4 rounded-full border transition-all ${currentIndex >= events.length - 3 ? "border-[#101848]/10 text-[#101848]/20" : "border-[#101848]/20 text-[#101848] hover:bg-[#101848] hover:text-white shadow-md active:scale-95"}`}
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
