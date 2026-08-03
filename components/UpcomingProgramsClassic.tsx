import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { UpcomingProgramsContent } from "./UpcomingPrograms";

interface Props {
    content: UpcomingProgramsContent | null;
}

export default function UpcomingProgramsClassic({ content }: Props) {
    const trackRef = useRef<HTMLDivElement>(null);
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);

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

    /* The rail is a native horizontally-scrolling, scroll-snapped list.
       The previous implementation translated the track by a hard-coded
       `index * 374px` while cards were a hard-coded 350px wide, so on any
       viewport under ~430px the cards overflowed and were clipped by the
       section's `overflow-hidden`, and the "next" button disabled itself
       three cards early regardless of how many were actually visible.
       Measuring real geometry fixes both, and gives touch swipe for free. */
    const syncArrows = useCallback(() => {
        const el = trackRef.current;
        if (!el) return;
        setCanScrollPrev(el.scrollLeft > 8);
        setCanScrollNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
    }, []);

    useEffect(() => {
        const el = trackRef.current;
        if (!el) return;
        syncArrows();
        el.addEventListener("scroll", syncArrows, { passive: true });
        const ro = new ResizeObserver(syncArrows);
        ro.observe(el);
        return () => {
            el.removeEventListener("scroll", syncArrows);
            ro.disconnect();
        };
    }, [syncArrows, events.length]);

    const scrollByCard = (direction: 1 | -1) => {
        const el = trackRef.current;
        if (!el) return;
        const card = el.querySelector<HTMLElement>("[data-card]");
        const gap = 24;
        const step = card ? card.offsetWidth + gap : el.clientWidth * 0.85;
        el.scrollBy({ left: direction * step, behavior: "smooth" });
    };

    return (
        <section className="relative w-full overflow-hidden bg-white pt-16 pb-20 md:pt-24 md:pb-32" id="events">
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

            <div className="relative z-10 max-w-[1400px] mx-auto px-5 sm:px-8 md:px-12">
                {/* Section Header */}
                <div className="flex flex-col mb-8 md:mb-12">
                    <motion.h2
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="text-[30px] sm:text-[42px] md:text-[54px] font-bold text-[#101848] mb-3 md:mb-4 leading-tight"
                    >
                        {displayData.title}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-[15px] md:text-[18px] text-[#233252]/60 font-sans max-w-xl"
                    >
                        {displayData.subtitle}
                    </motion.p>
                </div>

                {/* Slider Container */}
                <div className="relative mt-6 md:mt-8">
                    <div
                        ref={trackRef}
                        className="flex gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-2 -mx-5 px-5 sm:mx-0 sm:px-0"
                    >
                        {events.map((event) => (
                            <div
                                key={event.id}
                                data-card
                                className="relative snap-start flex-shrink-0 w-[78vw] max-w-[350px] sm:w-[300px] md:w-[350px] aspect-[3/4] rounded-[32px] overflow-hidden shadow-2xl group border border-white/20"
                            >
                                <Image
                                    src={event.image_url}
                                    alt={event.title}
                                    fill
                                    sizes="(max-width: 640px) 78vw, 350px"
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />

                                {/* Overlay Top: Tags */}
                                <div className="absolute top-5 left-5 md:top-6 md:left-6 flex flex-wrap gap-2 z-20 pr-5">
                                    {(event.tags || []).map((tag: string, i: number) => (
                                        <span key={i} className="bg-black/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-[12px] font-sans font-medium uppercase tracking-wider border border-white/10">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                {/* Bottom Info Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-20">
                                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2 leading-tight pr-16">
                                        {event.title}
                                    </h3>
                                    <div className="flex flex-col gap-1 pr-16">
                                        <p className="text-white/70 font-sans text-[13px] md:text-sm uppercase tracking-widest font-semibold italic">
                                            {event.date_text}
                                        </p>
                                        <div className="flex items-center gap-1 text-white/50 text-[11px] md:text-[12px] font-sans uppercase tracking-[0.1em]">
                                            <span className="material-symbols-outlined text-[14px]">location_on</span>
                                            {event.location || "Upcoming Centres"}
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <Link
                                        href={event.isPreview ? "/programs#preview" : "/programs"}
                                        aria-label={`View ${event.title}`}
                                        className="absolute bottom-6 right-6 md:bottom-8 md:right-8 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-[#101848] transition-all group/btn shadow-lg"
                                    >
                                        <Plus size={24} className="transition-transform group-hover/btn:rotate-90" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Controls */}
                <div className="mt-10 md:mt-16 flex items-center justify-between gap-4">
                    <Link
                        href="/programs"
                        className="flex items-center gap-2 group text-[#101848] font-bold text-[13px] md:text-[16px] font-sans uppercase tracking-widest"
                    >
                        View All Programs
                        <ChevronRight className="transition-transform group-hover:translate-x-1" size={20} />
                    </Link>

                    {/* Hidden on phones — the rail is swipeable there */}
                    <div className="hidden sm:flex gap-3 md:gap-4 shrink-0">
                        <button
                            onClick={() => scrollByCard(-1)}
                            disabled={!canScrollPrev}
                            aria-label="Previous programs"
                            className={`p-3 md:p-4 rounded-full border transition-all ${!canScrollPrev ? "border-[#101848]/10 text-[#101848]/20 cursor-not-allowed" : "border-[#101848]/20 text-[#101848] hover:bg-[#101848] hover:text-white shadow-md active:scale-95"}`}
                        >
                            <ChevronLeft size={22} />
                        </button>
                        <button
                            onClick={() => scrollByCard(1)}
                            disabled={!canScrollNext}
                            aria-label="Next programs"
                            className={`p-3 md:p-4 rounded-full border transition-all ${!canScrollNext ? "border-[#101848]/10 text-[#101848]/20 cursor-not-allowed" : "border-[#101848]/20 text-[#101848] hover:bg-[#101848] hover:text-white shadow-md active:scale-95"}`}
                        >
                            <ChevronRight size={22} />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
