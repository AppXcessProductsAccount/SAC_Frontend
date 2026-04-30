import Image from "next/image";
import { motion } from "framer-motion";

export default function HeaderBelow() {
    return (
        <section className="relative w-full h-auto overflow-hidden bg-[#eeebf0] py-16 md:py-24" id="programs">
            {/* Background Texture Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/header_below.png"
                    alt="Section Background"
                    className="w-full h-full object-cover opacity-80"
                />
            </div>
            
            <div className="relative z-10 max-w-[1400px] mx-auto px-8 md:px-12 flex flex-col lg:flex-row items-start gap-12 lg:gap-20 pt-12 md:pt-16">
                {/* Left Content */}
                <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="lg:w-[40%] text-center flex flex-col items-center"
                >
                    <h2 className="text-[32px] md:text-[40px] font-serif text-[#101848] leading-[1.2] mb-6 drop-shadow-sm">
                        Experience Profound <br /> Transformation
                    </h2>
                    
                    <p className="text-[14px] md:text-[16px] text-[#233252]/90 font-sans font-medium mb-8 leading-relaxed">
                        At Self Awareness Centre, embark on a journey of inner awakening through our transformative programs and holistic practices designed to guide you towards self realization and true peace.
                    </p>

                    <button className="bg-[#101848] text-white px-12 py-4 rounded-[12px] font-sans font-medium text-[16px] hover:bg-[#1b1b2b] transition-all shadow-lg hover:shadow-xl">
                        Learn More
                    </button>
                </motion.div>

                {/* Right Cards */}
                <div className="lg:w-[60%] flex flex-col md:flex-row gap-6">
                    {/* Card 1 */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative flex-1 group"
                    >
                        <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
                            <Image
                                src="/herobelow_1.png"
                                alt="7-Day Transformation Journey"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/10 transition-opacity group-hover:opacity-0" />
                            
                            {/* Card Content Overlay */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-white/5 border border-white/10">
                                <h3 className="text-xl md:text-2xl font-serif text-[#101848] drop-shadow-sm text-center">
                                    7-Day Transformation <br /> Journey
                                </h3>
                            </div>
                        </div>
                    </motion.div>

                    {/* Card 2 */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="relative flex-1 group"
                    >
                        <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
                            <Image
                                src="/herobelow_2.png"
                                alt="Yoga and Meditation Classes"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/10 transition-opacity group-hover:opacity-0" />
                            
                            {/* Card Content Overlay */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-white/5 border border-white/10">
                                <h3 className="text-xl md:text-2xl font-serif text-[#101848] drop-shadow-sm text-center">
                                    Yoga and Meditation <br /> Classes
                                </h3>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
