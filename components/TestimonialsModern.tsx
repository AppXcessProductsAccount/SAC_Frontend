import { motion } from "framer-motion";
import { TestimonialsContent } from "./Testimonials";

interface Props {
    content: TestimonialsContent | null;
}

export default function TestimonialsModern({ content }: Props) {
    const getInitials = (name: string) => {
        if (!name) return "?";
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    const displayData = {
        title: content?.title || "Voices of Serenity",
        subtitle: content?.subtitle || "Practitioner Stories",
        testimonials: content?.testimonials || []
    };

    // Split title for effect
    const titleParts = displayData.title.split(' ');
    const lastWord = titleParts.pop();
    const firstPart = titleParts.join(' ');

    return (
        <section className="relative w-full py-10 md:py-14 px-5 md:px-8 font-sans" id="testimonials">
            <div className="max-w-[1500px] mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mb-12 md:mb-16 lg:px-6"
                >
                    <span className="text-[#101848]/50 font-sans font-bold tracking-[0.2em] uppercase text-[10px] md:text-xs mb-4 block">
                        {displayData.subtitle}
                    </span>
                    <h2 className="text-[30px] sm:text-[36px] md:text-[48px] lg:text-[56px] font-sans text-[#1b1b2b] leading-[1.1] tracking-tight relative z-10 flex flex-wrap items-baseline gap-x-2">
                        <span className="font-light">{firstPart}</span>
                        <span className="font-bold">{lastWord}.</span>
                    </h2>
                    {/* Decorative Curve */}
                    <div className="relative mt-2">
                        <svg className="absolute top-0 left-0 w-[120px] opacity-70" viewBox="0 0 100 20" preserveAspectRatio="none">
                            <path d="M0,5 Q30,15 100,5" fill="none" stroke="#e0e2e5" strokeWidth="4" strokeLinecap="round" />
                        </svg>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {displayData.testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: index * 0.15 }}
                            className="relative w-full min-h-[320px] md:min-h-[350px] rounded-[24px] md:rounded-[40px] bg-[#f5f6f6] shadow-sm p-6 sm:p-8 md:p-12 flex flex-col justify-between group hover:shadow-md transition-shadow duration-500 overflow-hidden"
                        >
                            {/* Decorative ambient corner blur */}
                            <div className="absolute -top-10 -right-10 w-[150px] h-[150px] bg-white opacity-40 rounded-full blur-3xl pointer-events-none transition-transform duration-700 group-hover:scale-150" />
                            
                            {/* Quote Content */}
                            <div className="relative z-10 mb-6 md:mb-8">
                                <span className="block text-[#1b1b2b]/10 font-serif text-[60px] leading-[0.5] mb-4 select-none">"</span>
                                <p className="text-[14px] md:text-[17px] text-[#1b1b2b]/80 leading-[1.75] font-medium pr-2">
                                    {testimonial.quote}
                                </p>
                            </div>

                            {/* Author Info Card (Bento Sub-Card) */}
                            <div className="flex items-center gap-4 bg-white p-4 rounded-[20px] shadow-sm self-start border border-gray-100 relative z-10 w-full max-w-[280px]">
                                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center p-1 flex-shrink-0 shadow-inner">
                                    <div className="w-full h-full rounded-full border border-gray-200 flex items-center justify-center bg-white">
                                        <span className="text-[#1b1b2b]/70 font-sans font-bold text-[13px]">
                                            {getInitials(testimonial.author_name)}
                                        </span>
                                    </div>
                                </div>
                                <div className="overflow-hidden">
                                    <h4 className="font-bold text-[14px] md:text-[15px] text-[#1b1b2b] leading-tight truncate">{testimonial.author_name}</h4>
                                    <p className="text-[#1b1b2b]/50 text-[10px] md:text-[11px] font-bold tracking-wide mt-1 uppercase truncate">{testimonial.author_role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
