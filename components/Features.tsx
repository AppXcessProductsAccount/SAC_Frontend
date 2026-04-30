"use client";

import { useState, useEffect } from "react";
import { cmsApi } from "@/lib/cms-api";
import AmbientBackground from "./AmbientBackground";
import { motion } from "framer-motion";

interface Feature {
    icon: string;
    title: string;
    description: string;
}

export default function Features() {
    const [features, setFeatures] = useState<Feature[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await cmsApi.getFeatures();
                setFeatures(data);
            } catch (error) {
                console.error("Failed to fetch features:", error);
                setFeatures([
                    {
                        icon: "self_improvement",
                        title: "Guided Sessions",
                        description: "Personalized meditation paths curated by world-class mindfulness experts to fit your schedule.",
                    },
                    {
                        icon: "nights_stay",
                        title: "Sleep Stories",
                        description: "Fall into a deep, restorative sleep with narrated stories and ambient soundscapes designed for rest.",
                    },
                    {
                        icon: "air",
                        title: "Focus Breathwork",
                        description: "Quick breathing exercises to reset your nervous system and reclaim your focus in minutes.",
                    },
                ]);
            }
        };
        fetchData();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" as const },
        },
    };

    return (
        <section className="py-24 px-6 relative overflow-hidden bg-white" id="about">
            <div className="max-w-7xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <h2 className="text-3xl md:text-5xl font-bold text-secondary mb-4">
                        Mindfulness Made Simple
                    </h2>
                    <p className="text-slate-600 max-w-xl mx-auto text-lg">
                        Tools designed to help you navigate life's stresses with grace and ease.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid md:grid-cols-3 gap-8"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="bg-slate-50 border border-slate-100 p-8 rounded-xl hover:shadow-lg transition-all group shadow-sm hover:border-[var(--site-primary)]/20"
                        >
                            <div className="w-14 h-14 bg-[var(--site-primary)]/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-[var(--site-primary)] transition-colors">
                                <span className="material-icons text-[var(--site-primary)] group-hover:text-white text-3xl">
                                    {feature.icon}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-secondary mb-4">{feature.title}</h3>
                            <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
