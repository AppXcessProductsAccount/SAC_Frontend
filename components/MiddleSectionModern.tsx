import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { useState } from "react";
import { MiddleSectionContent } from "./MiddleSection";

interface Props {
    content: MiddleSectionContent | null;
}

export default function MiddleSectionModern({ content }: Props) {
    const [isVideoActive, setIsVideoActive] = useState(false);

    // Fallback data if content is not provided
    const displayData = {
        title: content?.title || "7 Day Transformational Journey",
        text: content?.text || "A life-changing program designed to help you discover your inner peace and spiritual potential. Watch our promo video to learn more about the journey that awaits you.",
        youtube_url: content?.youtube_url || "https://www.youtube.com/embed/sGtx4XfL76I",
        testimonial: {
            text: content?.testimonial?.text || "This journey has completely redefined my perspective on life. The peace I found here is something I carry with me every single day.",
            author: content?.testimonial?.author || "Sarah Ahmed",
            role: content?.testimonial?.role || "Graduate"
        },
        group_meditation: {
            title: content?.group_meditation?.title || "Group Meditation",
            description: content?.group_meditation?.description || "Join our weekly sessions to experience the collective energy of collective consciousness and deep silence."
        }
    };

    // Split title for the modern layout effect
    const titleParts = displayData.title.split(' ');
    const lastWord = titleParts.pop();
    const firstPart = titleParts.join(' ');

    return (
        <section className="relative z-10 w-full bg-white py-12 md:py-24 px-4 md:px-8 font-sans shadow-[0_-20px_40px_rgba(0,0,0,0.05)]">
            <div className="max-w-[1500px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-4 md:gap-6">
                
                {/* LEFT CELL - Content & Buttons */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative w-full h-[500px] lg:h-[700px] rounded-[32px] md:rounded-[48px] overflow-hidden bg-[#f5f6f6] shadow-sm p-8 md:p-14 flex flex-col justify-between"
                >
                    {/* The Text Block */}
                    <div>
                        <h2 className="text-[48px] md:text-[64px] lg:text-[75px] font-sans text-[#1b1b2b] leading-[0.95] tracking-tight mb-2">
                            {firstPart}
                        </h2>
                        <div className="relative inline-block mt-2">
                            <h2 className="text-[48px] md:text-[64px] lg:text-[75px] font-sans text-[#1b1b2b] leading-[0.95] tracking-tight relative z-10">
                                {lastWord}
                            </h2>
                            {/* Decorative Wave Scribble */}
                            <svg className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-full max-w-[180px]" viewBox="0 0 100 20" preserveAspectRatio="none">
                                <path d="M0,10 C20,20 30,0 50,10 C70,20 80,0 100,10" fill="none" stroke="#f2d288" strokeWidth="4" strokeLinecap="round" />
                                <path d="M10,15 C30,5 40,25 60,15 C80,5 90,25 100,15" fill="none" stroke="#f2d288" strokeWidth="2" strokeLinecap="round" className="opacity-50" />
                            </svg>
                        </div>

                        <div className="mt-12 md:mt-20">
                            <p className="text-[#1b1b2b]/70 text-[13px] md:text-[15px] max-w-md font-medium leading-relaxed">
                                {displayData.text}
                            </p>
                        </div>
                    </div>
                    
                    {/* Pill Buttons overlapping at the bottom left */}
                    <div className="flex flex-wrap gap-3 mt-auto relative z-10">
                        <button className="flex items-center gap-3 bg-white border border-gray-200 text-[#1b1b2b] px-6 py-3 rounded-full font-bold text-[13px] md:text-[14px] shadow-sm hover:shadow-md transition-all group">
                            Start program
                            <div className="w-1.5 h-1.5 rounded-full bg-[#1b1b2b]" />
                        </button>
                        <button className="flex items-center gap-3 bg-[#1b1b2b] text-white backdrop-blur-sm px-6 py-3 rounded-full font-semibold text-[13px] md:text-[14px] hover:bg-[#1b1b2b]/90 transition-all group">
                            Contact us
                            <div className="w-1.5 h-1.5 rounded-full bg-white opacity-50" />
                        </button>
                    </div>
                </motion.div>

                {/* RIGHT CELLS - Bento Box Flex Column */}
                <div className="flex flex-col gap-4 md:gap-6 h-full">
                    
                    {/* TOP RIGHT CELL - The Promo Video */}
                    <motion.div 
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative flex-1 bg-black rounded-[32px] md:rounded-[48px] overflow-hidden shadow-sm min-h-[300px] group"
                    >
                        <iframe
                            src={`${displayData.youtube_url}${isVideoActive ? "?autoplay=1" : ""}`}
                            title={displayData.title}
                            className={`w-full h-full absolute inset-0 transition-opacity duration-700 ${isVideoActive ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-80'}`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>

                        {/* Interactive Play Overlay to prevent iframe wheel capture glitches */}
                        {!isVideoActive && (
                            <div 
                                className="absolute inset-0 z-10 cursor-pointer flex items-center justify-center group/play transition-colors hover:bg-black/20"
                                onClick={() => setIsVideoActive(true)}
                            >
                                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-2xl transition-all duration-300 group-hover/play:scale-110 group-hover/play:bg-white/40">
                                    <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-white border-b-[8px] border-b-transparent ml-1" />
                                </div>
                            </div>
                        )}
                    </motion.div>

                    {/* BOTTOM RIGHT ROW */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 h-auto md:h-[220px]">
                        
                        {/* Yellow Card - Group Meditation */}
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="bg-[#f8eac9] rounded-[32px] p-8 md:p-10 relative overflow-hidden shadow-sm flex flex-col justify-center"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-white rounded-bl-full translate-x-4 -translate-y-4" />
                            <div className="absolute top-0 right-16 w-16 h-16 bg-[#b2c8f8] rounded-bl-full translate-x-2 -translate-y-2 opacity-80" />

                            <h3 className="text-[22px] md:text-[26px] font-bold text-[#1b1b2b] mb-4 relative z-10 leading-tight">
                                {displayData.group_meditation.title.split(' ').map((word, i) => (
                                    <span key={i}>{word} <br /></span>
                                ))}
                            </h3>
                            <p className="text-[#1b1b2b]/60 text-[12px] md:text-[13px] font-medium leading-relaxed relative z-10">
                                {displayData.group_meditation.description}
                            </p>
                        </motion.div>

                        {/* Green Card - Testimonial */}
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="bg-[#d0dfcd] rounded-[32px] p-8 md:p-10 relative overflow-hidden shadow-sm flex flex-col justify-end"
                        >
                            <span className="absolute -top-4 right-6 text-[120px] text-white/40 font-serif leading-none italic pointer-events-none">"</span>
                            
                            <p className="text-[#1b1b2b]/80 text-[12px] md:text-[13px] font-medium leading-relaxed mb-4 z-10">
                                "{displayData.testimonial.text}"
                            </p>
                            
                            <div className="z-10 mt-auto">
                                <p className="text-[#1b1b2b]/50 text-[11px] uppercase tracking-widest font-bold mb-1">{displayData.testimonial.role}</p>
                                <h4 className="text-[24px] md:text-[32px] font-bold text-[#1b1b2b] tracking-tight">{displayData.testimonial.author}</h4>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </div>
        </section>
    );
}
