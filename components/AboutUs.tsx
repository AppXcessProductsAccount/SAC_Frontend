"use client";

import { useState, useEffect } from "react";
import { cmsApi } from "@/lib/cms-api";
import AmbientBackground from "./AmbientBackground";
import { motion } from "framer-motion";

interface AboutData {
    title: string;
    description: string;
    image_url: string;
    cta_text?: string;
}

export default function AboutUs() {
    const [about, setAbout] = useState<AboutData | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await cmsApi.getAbout();
                setAbout(data);
            } catch (error) {
                console.error("Failed to fetch about section:", error);
                setAbout({
                    title: "Nurturing Your Mind, Body, and Spirit",
                    description: "At SelfAwareness, we believe that mindfulness is not just a practice, but a way of living. Our mission is to provide you with the tools and community support needed to find stillness in an increasingly loud world.",
                    image_url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200",
                    cta_text: "Learn Our Story",
                });
            }
        };
        fetchData();
    }, []);

    if (!about) return null;

    return (
        <section className="py-24 px-6 relative overflow-hidden bg-white" id="about-us">
            <AmbientBackground starCount={25} opacity={0.3} />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center text-left">
                    {/* Image Side */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="relative group"
                    >
                        <div className="absolute -inset-4 bg-[var(--site-primary)]/10 rounded-2xl blur-2xl group-hover:bg-[var(--site-primary)]/20 transition-all duration-700"></div>
                        <div className="relative aspect-video rounded-2xl overflow-hidden border border-[var(--site-secondary)]/5 shadow-xl">
                            <img
                                src={about.image_url}
                                alt="About SelfAwareness"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[var(--site-secondary)]/10 to-transparent"></div>
                        </div>
                    </motion.div>

                    {/* Text Side */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="space-y-8"
                    >
                        <div>
                            <motion.span
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                                className="text-[var(--site-primary)] font-bold tracking-widest uppercase text-xs mb-4 block"
                            >
                                Our Story
                            </motion.span>
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                                className="text-4xl md:text-5xl font-bold text-[var(--site-secondary)] leading-tight"
                            >
                                {about.title}
                            </motion.h2>
                        </div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.7, duration: 1 }}
                            className="text-slate-600 text-lg leading-relaxed"
                        >
                            {about.description}
                        </motion.p>

                        {about.cta_text && (
                            <motion.button
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.9, duration: 0.5 }}
                                className="group flex items-center gap-3 text-[var(--site-secondary)] font-bold hover:text-[var(--site-primary)] transition-colors"
                            >
                                <span className="w-12 h-[2px] bg-[var(--site-primary)] group-hover:w-16 transition-all"></span>
                                {about.cta_text}
                            </motion.button>
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
