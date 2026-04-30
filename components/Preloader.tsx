"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Preloader() {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <Image
                src="/testimonial.png"
                alt="Background"
                fill
                className="object-cover"
                priority
            />
            {/* Subtle Overlay to ensure visibility */}
            <div className="absolute inset-0 bg-[#eeebf0]/80 backdrop-blur-sm" />

            <div className="relative flex flex-col items-center z-10">
                {/* Logo with breathing animation */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ 
                        opacity: [0.4, 1, 0.4],
                        scale: [0.95, 1, 0.95]
                    }}
                    transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="relative w-32 h-32 mb-8"
                >
                    <Image
                        src="/logo.png"
                        alt="Logo"
                        fill
                        className="object-contain"
                        priority
                    />
                </motion.div>

                {/* Elegant loading line */}
                <div className="w-48 h-[2px] bg-[#101848]/10 overflow-hidden rounded-full">
                    <motion.div 
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{ 
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="w-full h-full bg-[#101848]"
                    />
                </div>
            </div>
        </div>
    );
}
