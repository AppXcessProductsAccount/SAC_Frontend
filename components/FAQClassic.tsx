import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FAQContent } from "./FAQ";

export default function FAQClassic({ data }: { data: FAQContent | null }) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const displayData = {
        title: data?.title || "Frequently Asked Questions",
        faqs: data?.faqs || []
    };

    return (
        <section className="relative py-12 bg-[#eeebf0] overflow-hidden" id="faq">
            {/* Background Texture with Seamless Mask Effect */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/upcoming_event.png"
                    alt="Section Background"
                    className="w-full h-full object-cover opacity-80"
                    style={{
                        maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
                        WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)'
                    }}
                />
            </div>
            
            <div className="relative z-10 max-w-3xl mx-auto px-5 sm:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-10 md:mb-16"
                >
                    <h2 className="text-[26px] sm:text-[32px] md:text-[42px] font-serif text-[#101848] mb-4 text-balance">
                        {displayData.title}
                    </h2>
                    <div className="w-16 h-[1px] bg-[#101848]/20 mx-auto"></div>
                </motion.div>

                <div className="space-y-4">
                    {displayData.faqs.map((item, index) => (
                        <div key={index} className="border-b border-[#101848]/10 pb-4">
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                aria-expanded={openIndex === index}
                                className="w-full flex justify-between items-center gap-4 py-4 text-left group"
                            >
                                <span className="text-[16px] sm:text-[18px] md:text-[20px] font-serif text-[#101848] group-hover:text-[#233252] transition-colors">
                                    {item.question}
                                </span>
                                <motion.div
                                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="text-[#101848]/40 shrink-0"
                                >
                                    <ChevronDown size={22} />
                                </motion.div>
                            </button>
                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <p className="text-[14px] md:text-[15px] text-[#233252]/70 font-sans leading-relaxed pb-4 pr-0 md:pr-12">
                                            {item.answer}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
