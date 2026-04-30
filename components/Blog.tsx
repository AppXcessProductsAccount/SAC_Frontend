"use client";

import { useState, useEffect } from "react";
import { cmsApi } from "@/lib/cms-api";
import AmbientBackground from "./AmbientBackground";
import { motion } from "framer-motion";

interface BlogPost {
    title: string;
    excerpt: string;
    date: string;
    image_url: string;
    category: string;
}

export default function Blog() {
    const [posts, setPosts] = useState<BlogPost[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await cmsApi.getBlogPosts();
                setPosts(data);
            } catch (error) {
                console.error("Failed to fetch blog posts:", error);
                setPosts([
                    {
                        title: "The Science of Deep Breathing",
                        excerpt: "How 5 minutes of mindful breathwork can reset your entire nervous system and lower cortisol levels.",
                        date: "March 12, 2024",
                        image_url: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                        category: "Science",
                    },
                    {
                        title: "Finding Stillness in Chaos",
                        excerpt: "Practical tips for maintaining a meditation practice during life's most demanding seasons.",
                        date: "March 15, 2024",
                        image_url: "https://images.unsplash.com/photo-1499209974431-9dac3adaf471?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                        category: "Lifestyle",
                    },
                    {
                        title: "The Art of Mindful Eating",
                        excerpt: "Transforming your relationship with food through presence, gratitude, and sensory awareness.",
                        date: "March 18, 2024",
                        image_url: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                        category: "Nutrition",
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
        hidden: { opacity: 0, scale: 0.95, y: 30 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" as const },
        },
    };

    return (
        <section className="py-24 px-6 relative overflow-hidden bg-white" id="blog">
            <div className="max-w-7xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6"
                >
                    <div className="max-w-xl text-left">
                        <h2 className="text-3xl md:text-5xl font-bold text-secondary mb-4">
                            Mindful Reading
                        </h2>
                        <p className="text-slate-600 text-lg">
                            Insights and wisdom to support your journey toward a more conscious life.
                        </p>
                    </div>
                    <button className="text-[var(--site-primary)] font-bold flex items-center gap-2 hover:translate-x-1 transition-transform group">
                        Explore All <span className="material-icons">arrow_forward</span>
                    </button>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid md:grid-cols-3 gap-8"
                >
                    {posts.map((post, index) => (
                        <motion.article
                            key={index}
                            variants={itemVariants}
                            className="bg-white border border-slate-100 overflow-hidden rounded-xl group hover:shadow-lg transition-all shadow-sm"
                        >
                            <div className="aspect-[16/10] overflow-hidden relative">
                                <img
                                    alt={post.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    src={post.image_url}
                                />
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold text-[var(--site-primary)] shadow-sm">
                                    {post.category}
                                </div>
                            </div>
                            <div className="p-6 text-left">
                                <div className="text-[var(--site-primary)]/60 text-xs font-medium mb-3">
                                    {post.date}
                                </div>
                                <h3 className="text-xl font-bold text-secondary mb-4 group-hover:text-[var(--site-primary)] transition-colors line-clamp-2">
                                    {post.title}
                                </h3>
                                <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3">
                                    {post.excerpt}
                                </p>
                                <button className="text-secondary text-sm font-bold flex items-center gap-2 group/btn hover:text-[var(--site-primary)] transition-colors">
                                    Read More{" "}
                                    <span className="material-icons text-sm group-hover/btn:translate-x-1 transition-transform">
                                        east
                                    </span>
                                </button>
                            </div>
                        </motion.article>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
