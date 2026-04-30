"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface CloudProps {
    delay: number;
    duration: number;
    top: string;
    scale: number;
    opacity: number;
    yOffset: number[];
}

const Cloud = ({ delay, duration, top, scale, opacity, yOffset }: CloudProps) => (
    <motion.div
        initial={{ x: "-100%", opacity: 0 }}
        animate={{ 
            x: "200%", 
            y: yOffset,
            opacity: [0, opacity, opacity, 0] 
        }}
        transition={{ 
            duration, 
            delay, 
            repeat: Infinity, 
            ease: "linear" 
        }}
        className="absolute pointer-events-none filter blur-[2px]"
        style={{ top, scale, zIndex: 5 }}
    >
        <div className="relative w-[600px] h-[400px]">
            <Image
                src="/11506828.png"
                alt="Cloud"
                fill
                className="object-contain opacity-70"
                priority
            />
        </div>
    </motion.div>
);

export default function CloudAnimation() {
    const cloudsProps: CloudProps[] = [
        { delay: 0, duration: 50, top: "5%", scale: 0.8, opacity: 0.4, yOffset: [0, 20, 0] },
        { delay: 10, duration: 65, top: "25%", scale: 1.3, opacity: 0.3, yOffset: [0, -30, 0] },
        { delay: 25, duration: 60, top: "45%", scale: 1.0, opacity: 0.5, yOffset: [0, 15, 0] },
        { delay: 40, duration: 80, top: "15%", scale: 1.6, opacity: 0.2, yOffset: [0, 40, 0] },
        { delay: 15, duration: 55, top: "35%", scale: 0.9, opacity: 0.45, yOffset: [0, -15, 0] },
    ];

    return (
        <div className="absolute inset-0 z-20 overflow-hidden pointer-events-none">
            {cloudsProps.map((props, index) => (
                <Cloud key={index} {...props} />
            ))}
        </div>
    );
}
