"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { cmsApi } from "@/lib/cms-api";

export default function Footer() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await cmsApi.getFooterInfo();
                setData(res);
            } catch (error) {
                console.error("Failed to fetch footer info:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const getFullUrl = (url: string) => {
        if (!url) return "";
        if (url.startsWith("/uploads/")) {
            return `${process.env.NEXT_PUBLIC_API_URL}${url}`;
        }
        return url;
    };

    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            const offset = 80;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    };

    const quickLinks = [
        { label: "Home", id: "home" },
        { label: "Programs", id: "programs" },
        { label: "Events", id: "events" },
        { label: "Enlightenment", id: "enlightenment" },
        { label: "Testimonials", id: "testimonials" },
        { label: "Contact", id: "contact" },
    ];

    if (loading) return null;

    const displayData = data || {
        newsletter_title: "Subscribe to Our Newsletter",
        newsletter_description: "Stay updated with our latest workshops, meditation sessions, and spiritual insights.",
        facebook_url: "#",
        instagram_url: "#",
        twitter_url: "#",
        mail_url: "#",
        logo_url: "/logo.png",
        copyright_text: "© 2024 SelfAwareness Inc. All rights reserved.",
        background_image_url: "/footer_bg.png"
    };

    return (
        <footer className="relative w-full overflow-hidden min-h-[350px] flex items-center py-12 md:py-16 selection:bg-white/10">
            {/* Background Texture Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src={getFullUrl(displayData.background_image_url)}
                    alt="Footer Background"
                    className="w-full h-full object-cover"
                />
                {/* Dark Overlay for Readability */}
                <div className="absolute inset-0 bg-[#101848]/40 backdrop-blur-[2px]"></div>
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative z-10 w-full max-w-[1400px] mx-auto px-8 md:px-12"
            >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-0 items-stretch">
                    
                    {/* Column 1: SAS & SASM Info */}
                    <div className="flex flex-col md:pr-12 md:pb-8 md:border-r md:border-white/10 h-full">
                        <div className="space-y-8 flex-grow">
                            <div>
                                <h3 className="text-[16px] font-serif text-white mb-3 uppercase tracking-[0.1em]">
                                    Self Awareness Society (SAS)
                                </h3>
                                <div className="text-white/60 text-[12px] font-sans space-y-2 leading-relaxed">
                                    <p className="flex justify-between border-b border-white/5 pb-1">
                                        <span className="text-white/40 text-[10px] uppercase">Founding Patron</span>
                                        <span>Paranjothi Subramaniam</span>
                                    </p>
                                    <p className="flex justify-between border-b border-white/5 pb-1">
                                        <span className="text-white/40 text-[10px] uppercase">Patron</span>
                                        <span>Sakuntala S. Suppiah</span>
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-[16px] font-serif text-white mb-3 uppercase tracking-[0.1em]">
                                    SAS Malaysia (SASM)
                                </h3>
                                <div className="text-white/60 text-[12px] font-sans space-y-1 leading-relaxed">
                                    <p>Established 26th May 1999</p>
                                    <p className="text-[10px] text-white/40 font-mono tracking-tighter">Reg. No. PPM – 017- 14-26051999</p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Social Icons */}
                        <div className="flex items-center gap-3 mt-8">
                            <a href={displayData.facebook_url} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:bg-white/10 hover:text-white transition-all border border-white/10">
                                <span className="material-icons text-[16px]">facebook</span>
                            </a>
                            <a href={displayData.instagram_url} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:bg-white/10 hover:text-white transition-all border border-white/10">
                                <span className="material-icons text-[16px]">instagram</span>
                            </a>
                            <a href={displayData.mail_url} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:bg-white/10 hover:text-white transition-all border border-white/10">
                                <span className="material-icons text-[16px]">mail</span>
                            </a>
                        </div>
                    </div>

                    {/* Column 2: Logo */}
                    <div className="flex flex-col items-center justify-center md:pb-6 md:border-r md:border-white/10 h-full">
                        <div className="relative w-20 h-20 md:w-28 md:h-28 bg-white rounded-full flex items-center justify-center shadow-2xl overflow-hidden border-4 md:border-6 border-[#101848]/20">
                            <Image
                                src={getFullUrl(displayData.logo_url)}
                                alt="Self Awareness Centre Logo"
                                width={80}
                                height={80}
                                className="w-[85%] h-[85%] object-contain p-2"
                            />
                        </div>
                    </div>

                    {/* Column 3: Quick Links */}
                    <div className="flex flex-col md:pl-12 md:pr-12 md:pb-8 md:border-r md:border-white/10 h-full">
                        <h3 className="text-[20px] font-serif text-white mb-6 border-b border-white/10 pb-2">
                            Quick Links
                        </h3>
                        <div className="flex flex-col gap-y-3">
                            {quickLinks.map((link) => (
                                <a
                                    key={link.id}
                                    href={`#${link.id}`}
                                    onClick={(e) => scrollToSection(e, link.id)}
                                    className="text-white/60 hover:text-white transition-colors font-sans text-xs tracking-wide w-fit"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Column 4: Contact Info / Branches */}
                    <div className="flex flex-col md:pl-12 md:pb-8 h-full">
                        <h3 className="text-[20px] font-serif text-white mb-6 border-b border-white/10 pb-2">
                            Our Centers
                        </h3>
                        <div className="space-y-6">
                            <div className="flex items-start gap-3 text-white/60 group cursor-default">
                                <span className="material-icons text-white/40 group-hover:text-white transition-colors text-[20px]">location_on</span>
                                <div>
                                    <p className="font-sans text-[11px] font-bold text-white/80 uppercase mb-1">HQ - Singapore</p>
                                    <p className="font-sans text-[11px] leading-relaxed tracking-wide">
                                        10 Anson Road, International Plaza, Singapore.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 text-white/60 group cursor-default">
                                <span className="material-icons text-white/40 group-hover:text-white transition-colors text-[20px]">business</span>
                                <div>
                                    <p className="font-sans text-[11px] font-bold text-white/80 uppercase mb-1">Malaysia Branches</p>
                                    <p className="font-sans text-[11px] leading-relaxed tracking-wide">
                                        Kuala Lumpur, Penang, and Johor Bahru.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-white/60 group cursor-default">
                                <span className="material-icons text-white/40 group-hover:text-white transition-colors text-[20px]">chat</span>
                                <a href="https://wa.me/6562225115" className="font-sans text-xs tracking-wide hover:text-white transition-colors">Chat with us on WhatsApp</a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Footer */}
                <div className="mt-12 md:mt-16 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-white/30 text-[10px] font-sans tracking-widest uppercase">
                    <p>{displayData.copyright_text}</p>
                    <div className="flex gap-6">
                        <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </motion.div>
        </footer>
    );
}
