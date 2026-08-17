"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import CloudAnimation from "./CloudAnimation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "./ThemeProvider";

const HERO_SLIDES = [
    {
        id: 1,
        title: "7 Day Transformational\nJourney Program",
        subtitle: "A profound path to inner peace and self-realization.",
        image: "/section1_slide1.png",
        link: "/programs/7dtj",
        button_text: "Join Program"
    },
    {
        id: 2,
        title: "Heart Centre Meditation\n+ Anahatha Chakra",
        subtitle: "Awaken your heart to unconditional love and compassion.",
        image: "/hero_slider_anahatha.png",
        link: "/programs/heart-centre",
        button_text: "Explore Meditation"
    },
    {
        id: 3,
        title: "Kundalini Yoga Meditation\n+ Ajna Chakra",
        subtitle: "Unlock the spiritual energy within and sharpen your intuition.",
        image: "/hero_slider_kundalini.png",
        link: "/programs/kundalini",
        button_text: "Learn More"
    },
    {
        id: 4,
        title: "Free Online Preview",
        subtitle: "Experience the essence of our teachings from anywhere.",
        image: "/hero_slider_preview.png",
        link: "/programs/preview",
        button_text: "Watch Now"
    }
];

export default function HeroClassic({ content }: { content?: any }) {
    const { theme } = useTheme();
    const slides = content?.slides?.length ? content.slides : HERO_SLIDES;
    const [currentSlide, setCurrentSlide] = useState(0);
    const touchStartX = useRef<number | null>(null);

    // Guard against a shrinking CMS slide array leaving the index out of range.
    const safeIndex = Math.min(currentSlide, Math.max(slides.length - 1, 0));
    const slide = slides[safeIndex];

    useEffect(() => {
        if (!slides || slides.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

    // Touch swipe — the arrows are small and bottom-anchored on phones.
    const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
    const onTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX.current === null) return;
        const delta = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(delta) > 50) delta < 0 ? nextSlide() : prevSlide();
        touchStartX.current = null;
    };

    if (!slides || slides.length === 0 || !slide) return null;

    return (
        <section
            id="home"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            /* The modern navbar is a floating pill with nothing behind it, so the slide
               has to run underneath it or the page opens with a band of empty grey above
               the image. The classic navbar paints its own textured header instead, and
               tucking under that would just hide the top of the slide — hence the theme
               check rather than an unconditional pull-up. --nav-h is measured from the
               real navbar, so this lands flush on every breakpoint. */
            style={theme === "modern" ? { marginTop: "calc(var(--nav-h) * -1)" } : undefined}
            /* svh (not vh) so mobile browser chrome collapsing doesn't resize the hero
               mid-scroll. min/max keep it sane on short landscape phones and 4K. */
            className="relative w-full h-[88svh] min-h-[520px] max-h-[780px] md:h-[80svh] md:min-h-[600px] md:max-h-[820px] overflow-hidden bg-[#eeebf0]"
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={slide.id ?? safeIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0"
                >
                    <Image
                        src={slide.image_url || slide.image}
                        alt=""
                        aria-hidden="true"
                        fill
                        sizes="100vw"
                        /* Portrait phones crop hard with object-center; biasing the
                           focal point upward keeps subjects/horizon in frame. */
                        className="object-cover object-[50%_30%] md:object-center"
                        priority
                    />
                </motion.div>
            </AnimatePresence>

            {/* Legibility scrim: directional on desktop (text sits left), bottom-up on
                mobile. A flat 30% black was not enough contrast on the brighter slides. */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/20 md:bg-gradient-to-r md:from-black/75 md:via-black/40 md:to-black/5" />

            <CloudAnimation />

            {/* z-30 keeps the copy above the drifting clouds (z-20), which previously
                washed straight over the headline. */}
            <div className="absolute inset-0 z-30 flex items-center justify-start px-5 sm:px-8 md:px-16 lg:px-24 pb-24 md:pb-28">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={slide.id ?? safeIndex}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="max-w-3xl"
                    >
                        <h1 className="text-[30px] sm:text-[40px] md:text-[54px] lg:text-[68px] font-serif text-white leading-[1.12] mb-4 md:mb-6 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] whitespace-pre-line text-balance">
                            {slide.title}
                        </h1>

                        <p className="text-[15px] sm:text-[18px] md:text-[22px] text-white/95 font-sans font-medium mb-6 md:mb-10 leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)] max-w-xl">
                            {slide.subtitle}
                        </p>

                        <a
                            href={slide.link}
                            className="inline-block bg-[#101848] text-white px-7 sm:px-10 py-3.5 sm:py-4 rounded-[12px] font-sans font-medium text-[14px] sm:text-[16px] uppercase tracking-wider hover:bg-[#1b1b2b] transition-all shadow-xl hover:scale-105"
                        >
                            {slide.button_text}
                        </a>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation Arrows — hidden on phones where swiping is the gesture */}
            <div className="hidden sm:flex absolute bottom-8 md:bottom-10 right-6 md:right-16 lg:right-24 z-30 gap-3 md:gap-4">
                <button
                    onClick={prevSlide}
                    aria-label="Previous slide"
                    className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/25 transition-all"
                >
                    <ChevronLeft size={22} />
                </button>
                <button
                    onClick={nextSlide}
                    aria-label="Next slide"
                    className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/25 transition-all"
                >
                    <ChevronRight size={22} />
                </button>
            </div>

            {/* Indicators */}
            <div className="absolute bottom-8 md:bottom-10 left-5 sm:left-8 md:left-16 lg:left-24 z-30 flex gap-2">
                {slides.map((_: any, index: number) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        aria-label={`Go to slide ${index + 1}`}
                        aria-current={index === safeIndex}
                        className="py-2 group"
                    >
                        <span
                            className={`block h-1 transition-all duration-500 rounded-full ${index === safeIndex ? "w-10 md:w-12 bg-white" : "w-4 bg-white/40 group-hover:bg-white/70"}`}
                        />
                    </button>
                ))}
            </div>
        </section>
    );
}
