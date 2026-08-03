"use client";

import { useState, useEffect } from "react";
import { cmsApi } from "@/lib/cms-api";
import AmbientBackground from "./AmbientBackground";
import { motion } from "framer-motion";

interface Stat {
    number: string;
    label: string;
    icon?: string;
}

export default function Statistics() {
    const [stats, setStats] = useState<Stat[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await cmsApi.getStatistics();
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch statistics:", error);
                setStats([
                    {
                        number: "11K+",
                        label: "Peaceful Souls",
                        icon: "groups",
                    },
                    {
                        number: "4.9/5",
                        label: "App Rating",
                        icon: "star",
                    },
                    {
                        number: "100+",
                        label: "Expert Teachers",
                        icon: "self_improvement",
                    },
                    {
                        number: "95%",
                        label: "Better Sleep",
                        icon: "nights_stay",
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
                staggerChildren: 0.15,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.5 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { type: "spring" as const, stiffness: 100, damping: 20 },
        },
    };

    return (
        <section className="py-14 md:py-24 px-6 relative overflow-hidden bg-white">
            <div className="max-w-7xl mx-auto relative z-10">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className={`grid grid-cols-2 md:grid-cols-${Math.min(stats.length || 4, 4)} gap-12 text-center`}
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="flex flex-col items-center"
                        >
                            {stat.icon && (
                                <span className="material-icons text-3xl text-[var(--site-primary)]/60 mb-4">
                                    {stat.icon}
                                </span>
                            )}
                            <h3 className="text-3xl sm:text-5xl md:text-6xl font-bold text-[var(--site-primary)] mb-4">
                                {stat.number}
                            </h3>
                            <p className="text-xl font-bold text-secondary mb-2">{stat.label}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
