"use client";

import { resolveMediaUrl } from "@/lib/api/config";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useIsDesktop, usePrefersReducedMotion } from "@/hooks/useMediaQuery";

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
    const slides = content?.slides?.length ? content.slides : MODERN_SLIDES;
    const containerRef = useRef<HTMLElement>(null);
    const isDesktop = useIsDesktop();
    const reduceMotion = usePrefersReducedMotion();
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const [currentSlide, setCurrentSlide] = useState(0);
    const touchStartX = useRef<number | null>(null);

    const safeIndex = Math.min(currentSlide, Math.max(slides.length - 1, 0));
    const slide = slides[safeIndex];

    useEffect(() => {
        if (slides.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const nextSlide = () => setCurrentSlide((p) => (p + 1) % slides.length);
    const prevSlide = () => setCurrentSlide((p) => (p - 1 + slides.length) % slides.length);

    const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
    const onTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX.current === null) return;
        const delta = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(delta) > 50) delta < 0 ? nextSlide() : prevSlide();
        touchStartX.current = null;
    };

    // Title drift is a desktop flourish — on a phone it pushed the headline
    // straight off the right edge.
    const textX = useTransform(scrollYProgress, [0, 1], [0, isDesktop && !reduceMotion ? 320 : 0]);

    // Background is 130% of the hero and travels from -15% to 0% of its own
    // height. That range is chosen so the image ALWAYS covers 0%–100% of the
    // section at every scroll position: no uncovered strip at either edge, and
    // the section clips the remainder instead of bleeding onto the next section.
    const bgY = useTransform(scrollYProgress, [0, 1], reduceMotion ? ["0%", "0%"] : ["-15%", "0%"]);

    if (!slide) return null;

    return (
        <section
            ref={containerRef}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            /* `overflow-hidden` is the fix for the parallax layer escaping the hero
               and sliding over the section below.
               The negative margin tucks the hero under the transparent sticky navbar;
               it is driven by --nav-h so it stays correct at every breakpoint instead
               of the old hard-coded -120px (which over-pulled by ~40px on mobile). */
            style={{ marginTop: "calc(var(--nav-h) * -1)" }}
            className="relative w-full h-[100svh] min-h-[600px] max-h-[900px] font-sans overflow-hidden"
        >
            {/* PARALLAX BACKGROUND CAROUSEL */}
            <motion.div
                style={{ y: bgY }}
                className="absolute top-0 left-0 w-full h-[130%] z-0 pointer-events-none bg-[#eeebf0]"
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={slide.id ?? safeIndex}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="absolute inset-0"
                    >
                        <Image
                            src={resolveMediaUrl(slide.image_url || slide.image)}
                            alt=""
                            aria-hidden="true"
                            fill
                            sizes="100vw"
                            className="object-cover object-[50%_35%] md:object-center"
                            priority
                        />
                    </motion.div>
                </AnimatePresence>
            </motion.div>

            {/* Scrim so the white pill/tagline text stays readable over bright slides */}
            <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-black/25 via-transparent to-black/30" />

            {/* BOTTOM LEFT STEPPED WHITE BLOB */}
            <motion.div
                style={{ x: textX }}
                className="absolute bottom-0 left-0 z-40 flex flex-col items-start max-w-full"
            >
                {/* Step 1 - z-20 and -mb-[1px] overlap Step 2 to remove the horizontal crack */}
                <div className="bg-white rounded-tr-[24px] md:rounded-tr-[32px] pl-5 sm:pl-6 md:pl-16 pr-5 md:pr-8 py-3 md:py-3.5 relative w-max max-w-[calc(100vw-40px)] shadow-[0_-10px_30px_rgba(255,255,255,1)] z-20 -mb-[1px]">
                    {/* Left trailing tail - overlapped by 1px to prevent a vertical crack */}
                    <div className="absolute top-0 bottom-[-1px] right-[calc(100%-1px)] w-[100vw] bg-white shadow-[0_-10px_30px_rgba(255,255,255,1)]" />

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={slide.id ?? safeIndex}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.5 }}
                            className="flex items-center gap-2 md:gap-3 relative z-10 min-w-0"
                        >
                            <span className="px-2.5 md:px-3 py-1 rounded-full border border-gray-300 bg-white text-[#101848] text-[10px] md:text-xs font-bold tracking-wide shrink-0">
                                {slide.pill}
                            </span>
                            <span className="text-[#101848]/60 text-[10px] sm:text-[11px] md:text-[12px] font-semibold truncate">
                                {slide.tagline}
                            </span>
                        </motion.div>
                    </AnimatePresence>
                    {/* Concave curve into the next step */}
                    <svg className="absolute bottom-0 -right-[23px] md:-right-[29px] w-[24px] h-[24px] md:w-[30px] md:h-[30px] z-10" viewBox="0 0 40 40" aria-hidden="true">
                        <path d="M0,40 L0,0 C0,22.091 17.909,40 40,40 L0,40 Z" fill="white" />
                    </svg>
                </div>

                {/* Step 2 - rests under the 1px overlap */}
                <div className="bg-white rounded-tr-[32px] md:rounded-tr-[40px] pl-5 sm:pl-6 md:pl-16 pr-6 sm:pr-8 md:pr-12 pt-0 pb-6 relative w-max max-w-[calc(100vw-32px)] min-w-[240px] md:min-w-[300px] z-10">
                    {/* Left trailing tail */}
                    <div className="absolute top-0 bottom-0 right-[calc(100%-1px)] w-[100vw] bg-white" />

                    <AnimatePresence mode="wait">
                        <motion.h1
                            key={slide.id ?? safeIndex}
                            initial={{ opacity: 0, filter: "blur(10px)" }}
                            animate={{ opacity: 1, filter: "blur(0px)" }}
                            exit={{ opacity: 0, filter: "blur(10px)" }}
                            transition={{ duration: 0.6 }}
                            className="text-[30px] sm:text-[38px] md:text-[54px] lg:text-[75px] font-sans text-[#1b1b2b] leading-[1.05] md:leading-[1] tracking-tight whitespace-pre-line relative z-10"
                        >
                            {slide.title}
                        </motion.h1>
                    </AnimatePresence>

                    {/* Indicators below text */}
                    <div className="absolute bottom-1 right-5 md:right-12 flex gap-1.5 z-20">
                        {slides.map((_: any, index: number) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                aria-label={`Go to slide ${index + 1}`}
                                aria-current={index === safeIndex}
                                className="py-1.5"
                            >
                                <span
                                    className={`block h-1 transition-all duration-500 rounded-full ${index === safeIndex ? "w-8 bg-[#1b1b2b]" : "w-3 bg-gray-200 hover:bg-gray-300"}`}
                                />
                            </button>
                        ))}
                    </div>

                    {/* Concave curve into the next step */}
                    <svg className="absolute bottom-0 -right-[23px] md:-right-[29px] w-[24px] h-[24px] md:w-[30px] md:h-[30px] z-10" viewBox="0 0 40 40" aria-hidden="true">
                        <path d="M0,40 L0,0 C0,22.091 17.909,40 40,40 L0,40 Z" fill="white" />
                    </svg>
                </div>
            </motion.div>

            {/* GLASS DESCRIPTION CARD
                Mobile: docked under the navbar at the top — at `bottom-12` it sat
                directly on top of the white title blob on any phone-width screen.
                Desktop: original bottom-right placement. */}
            <div className="absolute z-40 top-[calc(var(--nav-h)+12px)] left-4 right-4 w-auto md:top-auto md:left-auto md:bottom-12 md:right-10 lg:right-16 md:w-[280px]">
                <div className="bg-white/50 backdrop-blur-3xl p-4 sm:p-5 md:p-6 rounded-[20px] md:rounded-[24px] border border-white/60 shadow-xl relative overflow-hidden">
                    {/* Water drop graphic simulation */}
                    <div className="absolute -top-8 -right-3 w-12 h-16 opacity-90 pointer-events-none">
                        <div className="w-8 h-12 bg-gradient-to-br from-white via-white/70 to-transparent border border-white/80 rounded-[40%] rounded-br-full rounded-bl-[60%] rotate-[20deg] shadow-[0_10px_20px_rgba(0,0,0,0.15)] drop-shadow-xl ml-auto mt-2 backdrop-blur-md" />
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={slide.id ?? safeIndex}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h3 className="text-[13px] sm:text-[14px] md:text-[16px] font-bold text-[#1b1b2b] mb-1.5 md:mb-3 leading-[1.2] pr-6 tracking-tight">
                                {slide.tagline}
                            </h3>
                            <p className="text-[#1b1b2b]/60 text-[10px] md:text-[11px] leading-relaxed font-semibold line-clamp-3 md:line-clamp-none">
                                {slide.description}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

        </section>
    );
}
