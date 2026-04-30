import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { MoveRight, MoveLeft, ArrowRight } from "lucide-react";
import { UpcomingProgramsContent } from "./UpcomingPrograms";

interface Props {
    content: UpcomingProgramsContent | null;
}

export default function UpcomingProgramsModern({ content }: Props) {
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

    // We add the preview item
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

    // Split title for the modern layout effect
    const titleParts = displayData.title.split(' ');
    const lastWord = titleParts.pop();
    const firstPart = titleParts.join(' ');

    return (
        <section className="relative w-full overflow-hidden bg-white py-12 md:py-20 font-sans" id="events">
            <div className="max-w-[1500px] mx-auto px-4 md:px-8">
                
                {/* Header Layout: Text on Left, Controls on Right */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
                    <div>
                        <motion.h2 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-[36px] md:text-[48px] lg:text-[56px] text-[#1b1b2b] leading-tight tracking-tight flex items-baseline gap-2"
                        >
                            <span className="font-light">{firstPart}</span>
                            <span className="font-bold">{lastWord}.</span>
                        </motion.h2>
                    </div>

                    <div className="flex gap-3">
                        <button 
                            onClick={prevSlide}
                            disabled={currentIndex === 0}
                            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${currentIndex === 0 ? "bg-gray-100 text-[#1b1b2b]/30 cursor-not-allowed" : "bg-[#f5f6f6] text-[#1b1b2b] shadow-[0_10px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.1)] hover:scale-105 active:scale-95"}`}
                        >
                            <MoveLeft size={24} strokeWidth={1.5} />
                        </button>
                        <button 
                            onClick={nextSlide}
                            disabled={currentIndex >= events.length - 2} // display 2 or 3 items
                            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${currentIndex >= events.length - 2 ? "bg-gray-100 text-[#1b1b2b]/30 cursor-not-allowed" : "bg-[#f5f6f6] text-[#1b1b2b] shadow-[0_10px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.1)] hover:scale-105 active:scale-95"}`}
                        >
                            <MoveRight size={24} strokeWidth={1.5} />
                        </button>
                    </div>
                </div>

                {/* Slider Container */}
                <div className="relative mt-8 md:mt-10 overflow-visible">
                    <motion.div 
                        ref={scrollContainerRef}
                        className="flex gap-4 md:gap-6 overflow-x-visible cursor-grab active:cursor-grabbing"
                        animate={{ x: `-${currentIndex * (340 + 24)}px` }} // Scaled width (340px) + gap
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                        {events.map((event, index) => (
                            <motion.div 
                                key={event.id}
                                className="relative flex-shrink-0 w-[280px] md:w-[340px] h-[400px] md:h-[460px] bg-[#f5f6f6] rounded-[24px] md:rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500 group flex flex-col"
                            >
                                {/* Image Container */}
                                <div className="relative w-full h-[60%] overflow-hidden rounded-b-[48px] shadow-sm">
                                    <Image
                                        src={event.image_url}
                                        alt={event.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    {/* Glass Morphic Tag */}
                                    <div className="absolute top-6 left-6 z-20 flex gap-2">
                                        <span className="bg-white/20 backdrop-blur-xl text-white px-4 py-1.5 rounded-full text-[12px] font-bold tracking-wide shadow-sm border border-white/20">
                                            {event.tags?.[0] || 'Wellness'}
                                        </span>
                                    </div>
                                </div>
                                
                                {/* Content Area */}
                                <div className="p-8 flex flex-col justify-between flex-1">
                                    <div>
                                        <p className="text-[#101848]/50 uppercase tracking-widest text-[11px] font-bold mb-3 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                                            {event.date_text}
                                        </p>
                                        <h3 className="text-[22px] md:text-[26px] font-bold text-[#1b1b2b] leading-[1.1] mb-2 tracking-tight group-hover:text-blue-900 transition-colors">
                                            {event.title}
                                        </h3>
                                        <div className="flex items-center gap-1.5 text-[#1b1b2b]/60 text-[13px] font-medium mt-3">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                            {event.location || "Virtual"}
                                        </div>
                                    </div>

                                    {/* Link Container */}
                                    <div className="mt-6 flex justify-end">
                                        <Link 
                                            href={event.isPreview ? "/programs#preview" : "/programs"}
                                            className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-[#1b1b2b] group-hover:bg-[#1b1b2b] group-hover:text-white transition-all shadow-sm group/btn"
                                        >
                                            <ArrowRight size={20} className="transition-transform group-hover/btn:-rotate-45" />
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* View All Button at bottom */}
                <div className="mt-16 text-center">
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
