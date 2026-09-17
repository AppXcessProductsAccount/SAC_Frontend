"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { PlayCircle, Music2 } from "lucide-react";
import { useHomeVideos } from "@/hooks/useSiteSettings";
import { toYouTubeEmbedUrl } from "@/lib/youtube";
import { toTikTokEmbedUrl } from "@/lib/tiktok";

const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

function Rail({
    eyebrow,
    title,
    accent,
    icon,
    children,
}: {
    eyebrow: string;
    title: string;
    accent: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "-80px" });
    return (
        <motion.div
            ref={ref}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
        >
            <motion.div variants={fadeUp} className="text-center mb-8">
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em]" style={{ color: accent }}>
                    {icon} {eyebrow}
                </span>
                <h3 className="mt-2 font-serif text-3xl md:text-4xl font-semibold text-[#101848]">{title}</h3>
                <div className="mt-3 h-1 w-16 mx-auto rounded-full" style={{ background: accent }} />
            </motion.div>
            {children}
        </motion.div>
    );
}

export default function HomeVideos() {
    const { videos } = useHomeVideos();

    const yt = videos.youtube.map(toYouTubeEmbedUrl).filter(Boolean);
    const tt = videos.tiktok.map(toTikTokEmbedUrl).filter(Boolean);

    if (yt.length === 0 && tt.length === 0) return null;

    return (
        <section className="relative py-16 md:py-24">
            <div className="max-w-6xl mx-auto px-6 space-y-16 md:space-y-24">
                {/* ---------- YouTube ---------- */}
                {yt.length > 0 && (
                    <Rail eyebrow="Watch on YouTube" title="Featured Videos" accent="#E23A2E" icon={<PlayCircle size={16} />}>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {yt.map((src, i) => (
                                <motion.div
                                    key={i}
                                    variants={fadeUp}
                                    whileHover={{ y: -6 }}
                                    className="rounded-2xl overflow-hidden bg-black shadow-[0_14px_45px_-18px_rgba(16,24,72,0.35)] border border-[#101848]/8"
                                >
                                    <div className="relative w-full aspect-video">
                                        <iframe
                                            src={src}
                                            title={`YouTube video ${i + 1}`}
                                            className="absolute inset-0 w-full h-full"
                                            loading="lazy"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </Rail>
                )}

                {/* ---------- TikTok ---------- */}
                {tt.length > 0 && (
                    <Rail eyebrow="Watch on TikTok" title="On TikTok" accent="#101848" icon={<Music2 size={16} />}>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
                            {tt.map((src, i) => (
                                <motion.div
                                    key={i}
                                    variants={fadeUp}
                                    whileHover={{ y: -6 }}
                                    className="w-full max-w-[325px] rounded-2xl overflow-hidden bg-white shadow-[0_14px_45px_-18px_rgba(16,24,72,0.35)] border border-[#101848]/8"
                                >
                                    <iframe
                                        src={src}
                                        title={`TikTok video ${i + 1}`}
                                        className="w-full h-[575px]"
                                        loading="lazy"
                                        allow="encrypted-media; fullscreen"
                                        scrolling="no"
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </Rail>
                )}
            </div>
        </section>
    );
}
