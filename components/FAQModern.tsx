import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { FAQContent } from "./FAQ";

export default function FAQModern({ data }: { data: FAQContent | null }) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const displayData = {
        title: data?.title || "Frequently Asked Questions",
        subtitle: data?.subtitle || "GET ANSWERS",
        faqs: data?.faqs || []
    };

    return (
        <section className="relative w-full py-10 md:py-14 px-5 md:px-8 font-sans" id="faq">
            <div className="max-w-[1500px] mx-auto grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-4 md:gap-6">

                {/* LEFT CELL - FAQ Accordion */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative w-full rounded-[24px] md:rounded-[40px] overflow-hidden bg-[#f5f6f6] shadow-sm p-6 sm:p-8 md:p-14"
                >
                    <span className="text-[#101848]/50 font-sans font-bold tracking-[0.2em] uppercase text-[10px] md:text-xs mb-6 md:mb-8 block">
                        {displayData.subtitle}
                    </span>

                    <h2 className="text-[28px] sm:text-[36px] md:text-[42px] font-sans text-[#1b1b2b] font-bold mb-6 md:mb-8 text-balance">
                        {displayData.title}
                    </h2>

                    <div className="border-t border-[#1b1b2b]/10 mt-6 lg:mt-8 relative z-10">
                        {displayData.faqs.map((item, index) => (
                            <div key={index} className="border-b border-[#1b1b2b]/10">
                                <button
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                    aria-expanded={openIndex === index}
                                    className="w-full flex justify-between items-center gap-4 py-5 md:py-8 text-left group"
                                >
                                    <span className="text-[17px] sm:text-[20px] md:text-[24px] font-sans text-[#1b1b2b] font-medium tracking-tight group-hover:text-[#4a4a58] transition-colors leading-[1.25]">
                                        {item.question}
                                    </span>
                                    <div className={`w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border flex items-center justify-center flex-shrink-0 transition-all duration-300 ${openIndex === index ? 'border-[#1b1b2b] bg-[#1b1b2b] text-white shadow-md' : 'border-[#1b1b2b]/20 text-[#1b1b2b] group-hover:bg-white group-hover:shadow-sm bg-transparent'}`}>
                                        {openIndex === index ? (
                                            <Minus size={18} strokeWidth={2} />
                                        ) : (
                                            <Plus size={18} strokeWidth={2} />
                                        )}
                                    </div>
                                </button>
                                <AnimatePresence>
                                    {openIndex === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                            className="overflow-hidden"
                                        >
                                            <p className="text-[#1b1b2b]/70 font-sans text-[14px] md:text-[16px] font-medium leading-relaxed pb-6 md:pb-8 pr-0 md:pr-12 lg:pr-24">
                                                {item.answer}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* RIGHT CELL - Text Information */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="relative w-full rounded-[24px] md:rounded-[40px] overflow-hidden bg-[#f5f6f6] shadow-sm p-6 sm:p-8 md:p-14 flex flex-col gap-8 md:gap-12"
                >
                    <div>
                        <span className="text-[#101848]/50 font-sans font-bold tracking-[0.2em] uppercase text-[10px] md:text-xs mb-4 md:mb-6 block">
                            OUR PURPOSE
                        </span>
                        <p className="text-[14px] md:text-[16px] text-[#1b1b2b]/70 leading-[1.75] font-medium max-w-lg">
                            Our purpose is to make transformative spiritual knowledge accessible to everyone, empowering individuals from all walks of life to leverage the power of inner stillness, alleviate modern stresses, and unlock new boundless opportunities.
                        </p>
                    </div>

                    <div>
                        <span className="text-[#101848]/50 font-sans font-bold tracking-[0.2em] uppercase text-[10px] md:text-xs mb-4 md:mb-6 block">
                            OUR MISSION
                        </span>
                        <p className="text-[14px] md:text-[16px] text-[#1b1b2b]/70 leading-[1.75] font-medium max-w-lg">
                            We strive to foster a global community rooted in profound self-realization by meticulously decoding ancient practices, blending them beautifully with logical sciences, and cultivating harmony around the world.
                        </p>
                    </div>

                    {/* Decorative abstract curves matching the theme engine */}
                    <div className="absolute -bottom-10 -right-10 w-[200px] h-[200px] border-[20px] border-[#e0e2e5]/50 rounded-full blur-3xl opacity-50 z-0 pointer-events-none" />
                </motion.div>

            </div>
        </section>
    );
}
