import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { cmsApi } from "@/lib/cms-api";
import { resolveMediaUrl as getFullUrl } from "@/lib/api/config";

export default function ProgramsSection() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const programs = await cmsApi.getPrograms();
                setData(programs);
            } catch (error) {
                console.error("Failed to fetch programs:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return null;

    const programsData = data || {
        title: "Nurturing Your Path\nto Enlightenment",
        description: "Our programs are designed to guide you through different stages of self-discovery and spiritual growth.",
        button_text: "Join Our Programs",
        background_image_url: "/header_below.png",
        card1_title: "Self Awareness\nFoundation",
        card1_image_url: "/herobelow_1.png",
        card2_title: "Advanced\nMindfulness",
        card2_image_url: "/herobelow_2.png"
    };

    return (
        <section className="relative w-full h-auto overflow-hidden bg-[#eeebf0] py-16 md:py-24" id="programs">
            {/* Background Texture Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src={getFullUrl(programsData.background_image_url)}
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
                    <h2 className="text-[32px] md:text-[40px] font-serif text-[#101848] leading-[1.2] mb-6 drop-shadow-sm whitespace-pre-line">
                        {programsData.title}
                    </h2>
                    
                    <p className="text-[14px] md:text-[16px] text-[#233252]/90 font-sans font-medium mb-8 leading-relaxed">
                        {programsData.description}
                    </p>

                    <button className="bg-[#101848] text-white px-12 py-4 rounded-[12px] font-sans font-medium text-[16px] hover:bg-[#1b1b2b] transition-all shadow-lg hover:shadow-xl">
                        {programsData.button_text}
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
                                src={getFullUrl(programsData.card1_image_url)}
                                alt={programsData.card1_title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/10 transition-opacity group-hover:opacity-0" />
                            
                            {/* Card Content Overlay */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-white/5 border border-white/10">
                                <h3 className="text-xl md:text-2xl font-serif text-[#101848] drop-shadow-sm text-center whitespace-pre-line">
                                    {programsData.card1_title}
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
                                src={getFullUrl(programsData.card2_image_url)}
                                alt={programsData.card2_title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/10 transition-opacity group-hover:opacity-0" />
                            
                            {/* Card Content Overlay */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-white/5 border border-white/10">
                                <h3 className="text-xl md:text-2xl font-serif text-[#101848] drop-shadow-sm text-center whitespace-pre-line">
                                    {programsData.card2_title}
                                </h3>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
