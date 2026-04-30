"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import CloudAnimation from "./CloudAnimation";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
    const slides = content?.slides || HERO_SLIDES;
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        if (!slides || slides.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [slides]);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

    if (!slides || slides.length === 0) return null;

    return (
        <section className="relative w-full h-[600px] md:h-[750px] overflow-hidden bg-[#eeebf0]" id="home">
            <AnimatePresence mode="wait">
                <motion.div
                    key={slides[currentSlide].id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0"
                >
                    <Image
                        src={slides[currentSlide].image_url || slides[currentSlide].image}
                        alt={slides[currentSlide].title}
                        fill
                        className="object-cover object-center"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/30" />
                </motion.div>
            </AnimatePresence>

            <CloudAnimation />

            <div className="absolute inset-0 z-10 flex items-center justify-start px-8 md:px-24">
                <AnimatePresence mode="wait">
                    <motion.div 
                        key={slides[currentSlide].id}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="max-w-3xl"
                    >
                        <h1 
                            className="text-[42px] md:text-[68px] font-serif text-white leading-[1.1] mb-6 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] whitespace-pre-line"
                        >
                            {slides[currentSlide].title}
                        </h1>
                        
                        <p className="text-[18px] md:text-[22px] text-white/95 font-sans font-medium mb-10 leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)] max-w-xl">
                            {slides[currentSlide].subtitle}
                        </p>

                        <a 
                            href={slides[currentSlide].link}
                            className="inline-block bg-[#101848] text-white px-10 py-4 rounded-[12px] font-sans font-medium text-[16px] uppercase tracking-wider hover:bg-[#1b1b2b] transition-all shadow-xl hover:scale-105"
                        >
                            {slides[currentSlide].button_text}
                        </a>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation Arrows */}
            <div className="absolute bottom-10 right-8 md:right-24 z-20 flex gap-4">
                <button 
                    onClick={prevSlide}
                    className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/25 transition-all"
                >
                    <ChevronLeft size={24} />
                </button>
                <button 
                    onClick={nextSlide}
                    className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/25 transition-all"
                >
                    <ChevronRight size={24} />
                </button>
            </div>

            {/* Indicators */}
            <div className="absolute bottom-10 left-8 md:left-24 z-20 flex gap-2">
                {slides.map((_: any, index: number) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`h-1 transition-all duration-500 rounded-full ${index === currentSlide ? "w-12 bg-white" : "w-4 bg-white/30"}`}
                    />
                ))}
            </div>
        </section>
    );
}
