import Image from "next/image";
import { motion } from "framer-motion";
import { TestimonialsContent } from "./Testimonials";

interface Props {
    content: TestimonialsContent | null;
}

export default function TestimonialsClassic({ content }: Props) {
    const getInitials = (name: string) => {
        if (!name) return "?";
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    const displayData = {
        title: content?.title || "Voices of Serenity",
        subtitle: content?.subtitle || "Practitioner Stories",
        testimonials: content?.testimonials || []
    };

    return (
        <section className="relative py-12 px-6 overflow-hidden min-h-[500px] flex items-center bg-white" id="testimonials">
            {/* Background Image Layer with Seamless Mask Effect */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/upcoming_event.png"
                    alt="Testimonials Background"
                    fill
                    className="object-cover opacity-80"
                    priority
                    style={{
                        maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 100%)',
                        WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 100%)'
                    }}
                />
            </div>

            <div className="relative z-10 max-w-[1400px] mx-auto w-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-12"
                >
                    <span className="text-[#101848]/60 font-sans font-semibold tracking-[0.2em] uppercase text-xs mb-3 block">
                        {displayData.subtitle}
                    </span>
                    <h2 className="text-[30px] md:text-[42px] font-serif text-[#101848] leading-[1.1] mb-4">
                        {displayData.title}
                    </h2>
                    <div className="w-16 h-[1px] bg-[#101848]/20 mx-auto"></div>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8 md:gap-12">
                    {displayData.testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: index * 0.2 }}
                            className="group relative"
                        >
                            {/* Card with subtle texture/background */}
                            <div className="relative bg-white/40 backdrop-blur-md border border-white/50 p-6 md:p-8 rounded-2xl shadow-[0_10px_30px_rgba(16,24,72,0.05)] hover:shadow-[0_20px_50px_rgba(16,24,72,0.1)] transition-all duration-500 h-full flex flex-col justify-between">
                                {/* Decorative Quote Mark */}
                                <span className="absolute -top-3 -left-3 text-[70px] text-[#101848]/5 font-serif leading-none select-none">"</span>
                                
                                <p className="text-[#233252]/85 text-[16px] md:text-[18px] leading-relaxed font-sans italic relative z-10 mb-6 flex-grow">
                                    {testimonial.quote}
                                </p>

                                    <div className="flex items-center gap-3 border-t border-[#101848]/5 pt-5">
                                        <div className="w-10 h-10 rounded-full border border-[#101848]/20 bg-[#101848]/5 flex items-center justify-center flex-shrink-0">
                                            <span className="text-[#101848] font-serif font-bold text-xs">
                                                {getInitials(testimonial.author_name)}
                                            </span>
                                        </div>
                                        <div>
                                            <h4 className="font-serif text-[17px] text-[#101848] leading-tight font-bold">{testimonial.author_name}</h4>
                                            <p className="text-[#101848]/50 text-[12px] font-sans font-medium tracking-wide uppercase mt-0.5">{testimonial.author_role}</p>
                                        </div>
                                    </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
