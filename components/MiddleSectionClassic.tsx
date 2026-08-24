import { motion } from "framer-motion";
import Image from "next/image";
import { MiddleSectionContent } from "./MiddleSection";
import { toYouTubeEmbedUrl } from "@/lib/youtube";

interface Props {
    content: MiddleSectionContent | null;
}

export default function MiddleSectionClassic({ content }: Props) {
    // Fallback data if content is not provided
    const displayData = {
        title: content?.title || "7 Day Transformational Journey",
        text: content?.text || "A life-changing program designed to help you discover your inner peace and spiritual potential. Watch our promo video to learn more about the journey that awaits you.",
        // Normalised: editors paste watch/share links, which YouTube refuses to frame.
        youtube_url: toYouTubeEmbedUrl(content?.youtube_url) || toYouTubeEmbedUrl("sGtx4XfL76I"),
        testimonial: {
            text: content?.testimonial?.text || "This journey has completely redefined my perspective on life. The peace I found here is something I carry with me every single day. Truly transformational!",
            author: content?.testimonial?.author || "Sarah Ahmed",
            role: content?.testimonial?.role || "7DTJ Graduate"
        },
        group_meditation: {
            title: content?.group_meditation?.title || "Group Meditation",
            description: content?.group_meditation?.description || "Join our weekly sessions to experience the collective energy of collective consciousness and deep silence."
        }
    };

    return (
        <section className="relative py-10 md:py-14 lg:py-20 overflow-hidden">
            <div className="relative z-10 max-w-[1400px] mx-auto px-5 sm:px-8 md:px-12">
                <div className="grid lg:grid-cols-2 gap-10 md:gap-12 lg:gap-16 items-center">
                    {/* Left: 7DTJ Promo Video */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-[28px] sm:text-[36px] md:text-[48px] font-serif text-[#101848] mb-4 md:mb-6 leading-tight text-balance">
                            {displayData.title}
                        </h2>
                        <p className="text-[15px] md:text-[18px] text-[#233252]/80 font-sans mb-6 md:mb-8 leading-relaxed">
                            {displayData.text}
                        </p>
                        <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black group">
                            <iframe
                                src={displayData.youtube_url}
                                title={displayData.title}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </motion.div>

                    {/* Right: Testimonial & Group Meditation */}
                    <div className="space-y-8 md:space-y-12">
                        {/* Featured Testimonial */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="bg-white p-6 sm:p-8 md:p-10 rounded-3xl shadow-sm border border-[#101848]/5 relative"
                        >
                            <span className="absolute -top-6 left-8 text-[56px] sm:text-[76px] md:text-[100px] text-[#101848]/5 font-serif leading-none pointer-events-none select-none">"</span>
                            <p className="text-[16px] sm:text-[18px] md:text-[20px] text-[#101848] font-serif italic mb-6 relative z-10">
                                {displayData.testimonial.text}
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-[#101848]/10 flex items-center justify-center font-bold text-[#101848]">
                                    {displayData.testimonial.author.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                    <h4 className="font-sans font-bold text-[#101848]">{displayData.testimonial.author}</h4>
                                    <p className="text-sm text-[#233252]/60 uppercase tracking-widest font-semibold">{displayData.testimonial.role}</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Group Meditation Info */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="relative overflow-hidden group rounded-3xl"
                        >
                            {/* `min-h` + in-flow caption, not a fixed `h-[220px]` with the
                                caption absolutely positioned inside it. The title and
                                description are CMS copy of any length; pinned into a fixed
                                220px box they ran past the top of the image and got clipped
                                on narrow screens. The box now grows to fit the words. */}
                            <div className="relative min-h-[220px] sm:min-h-[250px] w-full flex">
                                <Image
                                    src="/event_meditation.png"
                                    alt={displayData.group_meditation.title}
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 700px"
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#101848] via-[#101848]/50 to-transparent" />
                                <div className="relative z-10 mt-auto w-full p-6 md:p-8">
                                    <h3 className="text-xl sm:text-2xl md:text-3xl font-serif text-white mb-2 text-balance">{displayData.group_meditation.title}</h3>
                                    <p className="text-white/80 text-[13px] sm:text-sm md:text-base font-sans max-w-sm">
                                        {displayData.group_meditation.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
