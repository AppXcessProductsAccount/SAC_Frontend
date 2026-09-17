"use client";

import { motion } from "framer-motion";

/**
 * ONE continuous, gently animated backdrop behind the whole site.
 *
 * A warm ivory base lifted by slowly drifting navy and gold light pools and a
 * faint grain. Purely decorative and pointer-inert, painted at -z-10 so any page
 * that leaves its <main>/sections transparent shows it through. `fixed` keeps it
 * anchored to the viewport while content scrolls over it.
 *
 * Motion is disabled automatically for users who prefer reduced motion (framer
 * respects the OS setting via the reduced-motion media query on transitions with
 * repeat), and the pools are large and slow so they never distract from content.
 */
export default function PageBackground() {
    return (
        <div aria-hidden="true" className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
            <div className="absolute inset-0 bg-[#F7F5F0]" />

            {/* Drifting light pools */}
            <motion.div
                className="absolute -top-40 -left-40 w-[42rem] h-[42rem] rounded-full blur-3xl"
                style={{ background: "radial-gradient(circle, rgba(16,24,72,0.14), transparent 65%)" }}
                animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
                transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute top-1/4 -right-40 w-[40rem] h-[40rem] rounded-full blur-3xl"
                style={{ background: "radial-gradient(circle, rgba(201,162,39,0.13), transparent 65%)" }}
                animate={{ x: [0, -50, 0], y: [0, 60, 0] }}
                transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute -bottom-48 left-1/3 w-[46rem] h-[46rem] rounded-full blur-3xl"
                style={{ background: "radial-gradient(circle, rgba(16,24,72,0.10), transparent 65%)" }}
                animate={{ x: [0, 40, 0], y: [0, -40, 0] }}
                transition={{ duration: 38, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Faint grain so large flat areas do not band */}
            <div
                className="absolute inset-0 opacity-[0.035] mix-blend-multiply"
                style={{
                    backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                }}
            />
        </div>
    );
}
