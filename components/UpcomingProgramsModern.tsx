import { resolveMediaUrl } from "@/lib/api/config";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { MoveRight, MoveLeft, ArrowRight } from "lucide-react";
import { UpcomingProgramsContent } from "./UpcomingPrograms";

interface Props {
    content: UpcomingProgramsContent | null;
}

export default function UpcomingProgramsModern({ content }: Props) {
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

    /* Every card here comes from the CMS. A "Free Online Preview" card used to be
       prepended in code, so it showed on the site whether or not such a session was
       running, and no admin edit could change or remove it. */
    const events = displayData.programs;

    /* Native scroll-snap rail. The old version animated the track by a fixed
       340+24px per step while the cards were 280px wide below `md`, so every
       tap over-scrolled by ~84px and the list drifted further out of alignment
       with each press. Measuring the rendered card removes the mismatch. */
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

    // Split title for the modern layout effect
    const titleParts = displayData.title.split(' ');
    const lastWord = titleParts.pop();
    const firstPart = titleParts.join(' ');

    return (
        <section className="relative w-full overflow-hidden py-10 md:py-14 font-sans" id="events">
            <div className="max-w-[1500px] mx-auto px-5 md:px-8">

                {/* Header Layout: Text on Left, Controls on Right */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-6">
                    <div>
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-[30px] sm:text-[36px] md:text-[48px] lg:text-[56px] text-[#1b1b2b] leading-tight tracking-tight flex flex-wrap items-baseline gap-x-2"
                        >
                            <span className="font-light">{firstPart}</span>
                            <span className="font-bold">{lastWord}.</span>
                        </motion.h2>
                    </div>

                    {/* Hidden on phones — the rail is swipeable there */}
                    <div className="hidden sm:flex gap-3 shrink-0">
                        <button
                            onClick={() => scrollByCard(-1)}
                            disabled={!canScrollPrev}
                            aria-label="Previous programs"
                            className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all ${!canScrollPrev ? "bg-gray-100 text-[#1b1b2b]/30 cursor-not-allowed" : "bg-[#f5f6f6] text-[#1b1b2b] shadow-[0_10px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.1)] hover:scale-105 active:scale-95"}`}
                        >
                            <MoveLeft size={22} strokeWidth={1.5} />
                        </button>
                        <button
                            onClick={() => scrollByCard(1)}
                            disabled={!canScrollNext}
                            aria-label="Next programs"
                            className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all ${!canScrollNext ? "bg-gray-100 text-[#1b1b2b]/30 cursor-not-allowed" : "bg-[#f5f6f6] text-[#1b1b2b] shadow-[0_10px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.1)] hover:scale-105 active:scale-95"}`}
                        >
                            <MoveRight size={22} strokeWidth={1.5} />
                        </button>
                    </div>
                </div>

                {/* Slider Container */}
                <div className="relative mt-8 md:mt-10">
                    <div
                        ref={trackRef}
                        className="flex gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-2 -mx-5 px-5 md:mx-0 md:px-0"
                    >
                        {events.map((event) => (
                            <div
                                key={event.id}
                                data-card
                                className="relative snap-start flex-shrink-0 w-[78vw] max-w-[340px] sm:w-[300px] md:w-[340px] h-[400px] md:h-[460px] bg-[#f5f6f6] rounded-[24px] md:rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500 group flex flex-col"
                            >
                                {/* Image Container */}
                                <div className="relative w-full h-[60%] overflow-hidden rounded-b-[48px] shadow-sm">
                                    <Image
                                        src={resolveMediaUrl(event.image_url)}
                                        alt={event.title}
                                        fill
                                        sizes="(max-width: 640px) 78vw, 340px"
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    {/* Glass Morphic Tag */}
                                    <div className="absolute top-5 left-5 md:top-6 md:left-6 z-20 flex gap-2 pr-5">
                                        <span className="bg-white/20 backdrop-blur-xl text-white px-4 py-1.5 rounded-full text-[12px] font-bold tracking-wide shadow-sm border border-white/20">
                                            {event.tags?.[0] || 'Wellness'}
                                        </span>
                                    </div>
                                </div>
                                
                                {/* Content Area */}
                                <div className="p-6 md:p-8 flex flex-col justify-between flex-1 min-h-0">
                                    <div>
                                        <p className="text-[#101848]/50 uppercase tracking-widest text-[11px] font-bold mb-3 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                                            {event.date_text}
                                        </p>
                                        <h3 className="text-[20px] md:text-[26px] font-bold text-[#1b1b2b] leading-[1.1] mb-2 tracking-tight group-hover:text-blue-900 transition-colors line-clamp-2">
                                            {event.title}
                                        </h3>
                                        <div className="flex items-center gap-1.5 text-[#1b1b2b]/60 text-[13px] font-medium mt-3">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                            {event.location || "Virtual"}
                                        </div>
                                    </div>

                                    {/* Link Container */}
                                    <div className="mt-4 md:mt-6 flex justify-end">
                                        <Link
                                            href={event.isPreview ? "/programs#preview" : "/programs"}
                                            aria-label={`View ${event.title}`}
                                            className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-[#1b1b2b] group-hover:bg-[#1b1b2b] group-hover:text-white transition-all shadow-sm group/btn"
                                        >
                                            <ArrowRight size={20} className="transition-transform group-hover/btn:-rotate-45" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* View All Button at bottom */}
                <div className="mt-10 md:mt-16 text-center">
                    <Link 
                        href="/programs" 
                        className="inline-flex items-center gap-3 bg-white border border-gray-200 text-[#1b1b2b] px-8 py-4 rounded-full font-bold text-[14px] shadow-sm hover:shadow-md hover:border-gray-300 transition-all group"
                    >
                        View all programs
                        <div className="w-1.5 h-1.5 rounded-full bg-[#1b1b2b]" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
