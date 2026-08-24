"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { cmsApi } from "@/lib/cms-api";
import { resolveMediaUrl as getFullUrl } from "@/lib/api/config";

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

    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        const element = document.getElementById(id);
        // No such section on this page — let the browser follow the href instead of
        // swallowing the click (the old version always preventDefault'd, so
        // "Programs" and "Contact" were dead links everywhere).
        if (!element) return;
        e.preventDefault();

        // The header is pinned, so clear its measured height or the target lands under it.
        const navHeight = parseInt(
            getComputedStyle(document.documentElement).getPropertyValue("--nav-h"),
            10
        ) || 80;

        window.scrollTo({
            top: element.getBoundingClientRect().top + window.scrollY - navHeight - 12,
            behavior: "smooth"
        });
    };

    const quickLinks = [
        { label: "Home", id: "home", href: "/" },
        { label: "Programs", id: "programs", href: "/programs" },
        { label: "Events", id: "events", href: "/#events" },
        { label: "Enlightenment", id: "enlightenment", href: "/#enlightenment" },
        { label: "Testimonials", id: "testimonials", href: "/#testimonials" },
        { label: "Contact", id: "contact", href: "/contact" },
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
        background_image_url: "/testimonial.png"
    };

    return (
        <footer className="relative w-full overflow-hidden min-h-[350px] flex items-center py-10 md:py-12 selection:bg-white/10">
            {/* Every word in this footer is white, and marble is near-white, so the
                plate has to sit under a heavy navy wash. At the old /40 the text
                landed on a mid-grey at roughly 2:1 contrast — unreadable. */}
            <div className="absolute inset-0 z-0 bg-[#101848]/[0.88] backdrop-blur-[2px]"></div>

            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative z-10 w-full max-w-[1400px] mx-auto px-5 sm:px-8 md:px-12"
            >
                {/* 4-up only from `lg` — four columns at the 768px `md` breakpoint left
                    each one ~150px wide, wrapping every address onto five lines. */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-0 items-stretch">

                    {/* Column 1: SAS & SASM Info */}
                    <div className="flex flex-col lg:pr-12 lg:pb-8 lg:border-r lg:border-white/10 h-full">
                        <div className="space-y-8 flex-grow">
                            <div>
                                <h3 className="text-[16px] font-serif text-white mb-3 uppercase tracking-[0.1em]">
                                    Self Awareness Society (SAS)
                                </h3>
                                <div className="text-white/60 text-[12px] font-sans space-y-2 leading-relaxed">
                                    <p className="flex flex-wrap justify-between gap-x-3 border-b border-white/5 pb-1">
                                        <span className="text-white/40 text-[10px] uppercase">Founding Patron</span>
                                        <span>Paranjothi Subramaniam</span>
                                    </p>
                                    <p className="flex flex-wrap justify-between gap-x-3 border-b border-white/5 pb-1">
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
                    <div className="flex flex-col items-center justify-center lg:pb-6 lg:border-r lg:border-white/10 h-full">
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
                    <div className="flex flex-col lg:pl-12 lg:pr-12 lg:pb-8 lg:border-r lg:border-white/10 h-full">
                        <h3 className="text-[18px] md:text-[20px] font-serif text-white mb-5 md:mb-6 border-b border-white/10 pb-2">
                            Quick Links
                        </h3>
                        <div className="flex flex-col gap-y-3">
                            {quickLinks.map((link) => (
                                <a
                                    key={link.id}
                                    href={link.href}
                                    onClick={(e) => scrollToSection(e, link.id)}
                                    className="text-white/60 hover:text-white transition-colors font-sans text-xs tracking-wide w-fit"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Column 4: Contact Info / Branches */}
                    <div className="flex flex-col lg:pl-12 lg:pb-8 h-full">
                        <h3 className="text-[18px] md:text-[20px] font-serif text-white mb-5 md:mb-6 border-b border-white/10 pb-2">
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
                <div className="mt-10 md:mt-16 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-white/30 text-[10px] font-sans tracking-widest uppercase text-center md:text-left">
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
