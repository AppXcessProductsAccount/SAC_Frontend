"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

const MODERN_SLIDES = [
    {
        id: 1,
        title: "Meditation\nand Medicine",
        pill: "Medical",
        tagline: "Stay healthy with Med + Med",
        description: "Meditation is a tool for the mind to achieve different states of being. Out of thousands of types of meditation, we offer a core of the most simple and effective practices.",
        image: "/section1_slide1.png"
    },
    {
        id: 2,
        title: "7 Day Transformational\nJourney Program",
        pill: "Journey",
        tagline: "Inner peace and self-realization",
        description: "A profound path designed to help you discover your inner peace and spiritual potential. Awaken the dormant energy resting at the base of your spine.",
        image: "/hero_slider_7dtj.png"
    },
    {
        id: 3,
        title: "Heart Centre\nMeditation",
        pill: "Anahatha",
        tagline: "Awaken to unconditional love",
        description: "Learn practices that activate the heart chakra, fostering deep compassion for yourself and humanity through ancient breathing rhythms.",
        image: "/hero_slider_anahatha.png"
    },
    {
        id: 4,
        title: "Free Online\nPreview",
        pill: "Preview",
        tagline: "Experience the essence anywhere",
        description: "Not sure where to begin? Join our free online preview sessions and experience the profound stillness our teachers deliver from the comfort of your home.",
        image: "/hero_slider_preview.png"
    }
];

export default function HeroModern({ content }: { content?: any }) {
    const slides = content?.slides || MODERN_SLIDES;
    const containerRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [slides.length]);

    // Move text from left to right as user scrolls down
    const textX = useTransform(scrollYProgress, [0, 1], [0, 400]);
    // Move the background downwards smoothly to create true Parallax that stays within the Hero boundaries
    const bgY = useTransform(scrollYProgress, [0, 1], ["0vh", "60vh"]);

    const slide = slides[currentSlide];

    return (
        <section ref={containerRef} className="relative w-full h-[100vh] min-h-[600px] max-h-[850px] font-sans -mt-[120px]">
            {/* PARALLAX BACKGROUND CAROUSEL (Absolutely positioned so it doesn't leak globally) */}
            <motion.div 
                style={{ y: bgY }}
                className="absolute top-0 left-0 w-full h-[120vh] z-0 pointer-events-none bg-[#eeebf0]"
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={slide.id}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="absolute inset-0"
                    >
                        <Image 
                            src={slide.image} 
                            alt={slide.title}
                            fill
                            className="object-cover object-center"
                            priority
                        />
                    </motion.div>
                </AnimatePresence>
            </motion.div>

            {/* BOTTOM LEFT STEPPED WHITE BLOB */}
            <motion.div 
                style={{ x: textX }}
                className="absolute bottom-0 left-0 z-40 flex flex-col items-start"
            >
                {/* Step 1 - Added z-20 and -mb-[1px] to overlap Step 2 by 1 pixel, removing the horizontal crack */}
                <div className="bg-white rounded-tr-[24px] md:rounded-tr-[32px] pl-6 md:pl-16 pr-6 md:pr-8 py-3.5 relative w-max shadow-[0_-10px_30px_rgba(255,255,255,1)] z-20 -mb-[1px]">
                    {/* Left trailing tail - Overlapped by 1px right to prevent vertical crack */}
                    <div className="absolute top-0 bottom-[-1px] right-[calc(100%-1px)] w-[100vw] bg-white shadow-[0_-10px_30px_rgba(255,255,255,1)]" />
                    
                    <AnimatePresence mode="wait">
                        <motion.div 
                            key={slide.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.5 }}
                            className="flex items-center gap-2.5 md:gap-3 relative z-10"
                        >
                            <span className="px-3 py-1 rounded-full border border-gray-300 bg-white text-[#101848] text-[10px] md:text-xs font-bold tracking-wide">
                                {slide.pill}
                            </span>
                            <span className="text-[#101848]/60 text-[11px] md:text-[12px] font-semibold">
                                {slide.tagline}
                            </span>
                        </motion.div>
                    </AnimatePresence>
                    {/* Concave Curve to next step */}
                    <svg className="absolute bottom-0 -right-[23px] md:-right-[29px] w-[24px] h-[24px] md:w-[30px] md:h-[30px] z-10" viewBox="0 0 40 40">
                        <path d="M0,40 L0,0 C0,22.091 17.909,40 40,40 L0,40 Z" fill="white" />
                    </svg>
                </div>

                {/* Step 2 - z-10 layer rests under the 1px overlap */}
                <div className="bg-white rounded-tr-[32px] md:rounded-tr-[40px] pl-6 md:pl-16 pr-8 md:pr-12 pt-0 pb-6 relative w-max min-w-[300px] z-10">
                    {/* Left trailing tail - Overlapped by 1px right to safely fuse without cracks */}
                    <div className="absolute top-0 bottom-0 right-[calc(100%-1px)] w-[100vw] bg-white" />
                    
                    <AnimatePresence mode="wait">
                        <motion.h1 
                            key={slide.id}
                            initial={{ opacity: 0, filter: "blur(10px)" }}
                            animate={{ opacity: 1, filter: "blur(0px)" }}
                            exit={{ opacity: 0, filter: "blur(10px)" }}
                            transition={{ duration: 0.6 }}
                            className="text-[42px] md:text-[54px] lg:text-[75px] font-sans text-[#1b1b2b] leading-[1] tracking-tight whitespace-pre-line relative z-10"
                        >
                            {slide.title}
                        </motion.h1>
                    </AnimatePresence>

                    {/* Indicators below text */}
                    <div className="absolute bottom-1 right-8 md:right-12 flex gap-1.5 z-20">
                        {slides.map((_: any, index: number) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`h-1 transition-all duration-500 rounded-full ${index === currentSlide ? "w-8 bg-[#1b1b2b]" : "w-3 bg-gray-200 hover:bg-gray-300"}`}
                            />
                        ))}
                    </div>

                    {/* Concave Curve to next step */}
                    <svg className="absolute bottom-0 -right-[23px] md:-right-[29px] w-[24px] h-[24px] md:w-[30px] md:h-[30px] z-10" viewBox="0 0 40 40">
                        <path d="M0,40 L0,0 C0,22.091 17.909,40 40,40 L0,40 Z" fill="white" />
                    </svg>
                </div>                
            </motion.div>

            {/* BOTTOM RIGHT GLASS CARD */}
            <motion.div 
                className="absolute bottom-12 right-6 md:right-16 z-40 w-[240px] md:w-[280px]"
            >
                <div className="bg-white/50 backdrop-blur-3xl p-5 md:p-6 rounded-[20px] md:rounded-[24px] border border-white/60 shadow-xl relative overflow-hidden">
                     {/* Water drop graphic simulation */}
                     <div className="absolute -top-8 -right-3 w-12 h-16 opacity-90 pointer-events-none">
                         <div className="w-8 h-12 bg-gradient-to-br from-white via-white/70 to-transparent border border-white/80 rounded-[40%] rounded-br-full rounded-bl-[60%] rotate-[20deg] shadow-[0_10px_20px_rgba(0,0,0,0.15)] drop-shadow-xl ml-auto mt-2 backdrop-blur-md" />
                     </div>
                    
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={slide.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h3 className="text-[14px] md:text-[16px] font-bold text-[#1b1b2b] mb-2 md:mb-3 leading-[1.2] pr-2 tracking-tight">
                                {slide.tagline}
                            </h3>
                            <p className="text-[#1b1b2b]/60 text-[10px] md:text-[11px] leading-relaxed font-semibold">
                                {slide.description}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </motion.div>
            
        </section>
    );
}
