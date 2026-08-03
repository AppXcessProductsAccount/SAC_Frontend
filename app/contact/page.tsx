"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { cmsApi } from "@/lib/cms-api";

export default function ContactPage() {
    const [sections, setSections] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

    useEffect(() => {
        const fetchSections = async () => {
            try {
                // 1. Discovery: Find the Contact page (ID 6)
                const pages = await cmsApi.getPages();
                const contactPage = pages.find((p: any) => 
                    p.id === 6 || p.name.toLowerCase() === "contact"
                );

                if (contactPage) {
                    // 2. Navigation: List sections
                    const sectionList = await cmsApi.getPageSections(contactPage.id);
                    
                    // 3. Content: Fetch detailed content for each section
                    const detailedSections = await Promise.all(
                        sectionList.map(async (section: any) => {
                            try {
                                const fullContent = await cmsApi.getSpecificSection(
                                    contactPage.id, 
                                    section.section_id
                                );
                                return { ...section, content: fullContent };
                            } catch (e) {
                                console.warn(`Failed to fetch content for ${section.section_id}`, e);
                                return section;
                            }
                        })
                    );
                    setSections(detailedSections);
                }
            } catch (err) {
                console.error("Failed to fetch contact page sections:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSections();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus("submitting");
        
        const formData = new FormData(e.currentTarget);
        const payload = {
            full_name: formData.get("full_name"),
            phone: formData.get("phone"),
            email: formData.get("email"),
            address: formData.get("address"),
            subject: formData.get("subject"),
            message: formData.get("message"),
        };

        try {
            await cmsApi.submitContactForm(payload);
            setStatus("success");
        } catch (error) {
            console.error("Submission failed:", error);
            setStatus("idle");
            alert("Failed to send message. Please try again later.");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white">
                <div className="w-16 h-16 border-4 border-[#101848]/10 border-t-[#101848] rounded-full animate-spin mb-4"></div>
                <p className="text-[#101848]/60 font-serif italic text-lg animate-pulse">Loading Sacred Space...</p>
            </div>
        );
    }

    // Find the contact section data
    const contactSection = sections.find(s => s.section_id === "contact");
    const data = contactSection?.content || {
        hero: {
            title: "Contact Us",
            subtitle: "Reach out and find the stillness you've been searching for. Our doors and hearts are open to all seekers.",
            background_image_url: "/testimonial.png"
        },
        content: {
            background_image_url: "/upcoming_event.png",
            locations_header: "SASS | SASM - Locations",
            locations_subheader: "Our Spiritual Centers",
            singapore: {
                name: "Self Awareness Society, Singapore",
                address: "320D King George’s Avenue, King George’s Building, Singapore 208564 (Level 5)",
                landmark: "(Near Lavender MRT)",
                phone: "+65 6291 1949",
                mobile: "+65 9129 1053",
                email: "admin@selfawareness.com.sg"
            },
            malaysia: []
        },
        form: {
            title: "Send an Inquiry",
            background_image_url: "/card_bg.png"
        }
    };

    const { hero, content, form } = data;

    return (
        <main className="bg-[#eeebf0] min-h-screen selection:bg-[#101848]/10 font-sans">
            <Navbar />

            {/* Hero Section */}
            <section className="relative py-14 md:py-24 bg-white overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image 
                        src={hero.background_image_url || "/testimonial.png"} 
                        alt="Hero Background" 
                        fill 
                        className="object-cover"
                        priority 
                    />
                    <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px]"></div>
                    <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#eeebf0] to-transparent z-10"></div>
                </div>
                <div className="relative z-20 max-w-4xl mx-auto px-6 text-center">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[#101848]/60 font-sans font-bold tracking-[0.3em] uppercase text-xs mb-4 block"
                    >
                        Get in Touch
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-[28px] sm:text-[42px] md:text-[64px] font-serif text-[#101848] leading-tight mb-6"
                    >
                        {hero.title}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-[18px] md:text-[20px] text-[#233252]/70 font-sans max-w-2xl mx-auto italic"
                    >
                        {hero.subtitle}
                    </motion.p>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-14 md:py-24 px-6 relative overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image 
                        src={content.background_image_url || "/upcoming_event.png"} 
                        alt="Content Background" 
                        fill 
                        className="object-cover opacity-60"
                    />
                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#eeebf0] to-transparent z-10"></div>
                </div>
                <div className="relative z-10 max-w-[1400px] mx-auto">
                    <div className="grid lg:grid-cols-[1.2fr_1fr] gap-16">
                        
                        {/* Locations List */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-12"
                        >
                            <div className="border-b border-[#101848]/10 pb-4">
                                <h2 className="text-[28px] md:text-[36px] font-serif text-[#101848]">{content.locations_header}</h2>
                                <p className="text-[#101848]/40 font-sans text-xs uppercase tracking-widest mt-2">{content.locations_subheader}</p>
                            </div>

                            {/* Singapore */}
                            {content.singapore && (
                                <div className="bg-white/60 backdrop-blur-md p-8 rounded-[32px] border border-white/80 shadow-sm">
                                    <h3 className="text-xl font-serif text-[#101848] mb-4">{content.singapore.name}</h3>
                                    <div className="space-y-4 text-sm md:text-base text-[#233252]/80 font-sans leading-relaxed">
                                        <p className="flex gap-3">
                                            <span className="material-icons text-[#101848]/40 text-lg">location_on</span>
                                            <span>{content.singapore.address} <br/> <span className="text-xs italic text-[#101848]/60">{content.singapore.landmark}</span></span>
                                        </p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                            {content.singapore.phone && (
                                                <p className="flex items-center gap-3">
                                                    <span className="material-icons text-[#101848]/40 text-lg">phone</span>
                                                    <span>Phone: {content.singapore.phone}</span>
                                                </p>
                                            )}
                                            {content.singapore.mobile && (
                                                <p className="flex items-center gap-3">
                                                    <span className="material-icons text-[#101848]/40 text-lg">phone_android</span>
                                                    <span>Mobile: {content.singapore.mobile}</span>
                                                </p>
                                            )}
                                        </div>
                                        <p className="flex items-center gap-3">
                                            <span className="material-icons text-[#101848]/40 text-lg">email</span>
                                            <span className="font-bold text-[#101848]">{content.singapore.email}</span>
                                        </p>
                                        {content.singapore.google_map_url && (
                                            <div className="pt-4">
                                                <a 
                                                    href={content.singapore.google_map_url} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 text-[#101848] font-bold text-[10px] uppercase tracking-widest hover:opacity-70 transition-opacity"
                                                >
                                                    <span className="material-icons text-xs">map</span>
                                                    Google Map
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Malaysia Grid */}
                            <div className="grid md:grid-cols-2 gap-6">
                                {content.malaysia?.map((loc: any, idx: number) => (
                                    <div key={idx} className="bg-white/40 p-6 rounded-[24px] border border-white/60 hover:bg-white/60 transition-all">
                                        <h4 className="text-lg font-serif text-[#101848] mb-4 border-b border-[#101848]/5 pb-2">{loc.name}</h4>
                                        <div className="space-y-3 text-xs md:text-sm text-[#233252]/70 font-sans">
                                            <p className="flex gap-2">
                                                <span className="material-icons text-xs text-[#101848]/40">location_on</span>
                                                {loc.address}
                                            </p>
                                            <div className="space-y-1">
                                                {loc.tel && <p>Tel: {loc.tel}</p>}
                                                {loc.fax && <p>Fax: {loc.fax}</p>}
                                                {loc.hp && <p>Hp: {loc.hp}</p>}
                                            </div>
                                            <p className="text-[#101848] font-bold">{loc.email}</p>
                                            <div className="pt-2 space-y-2">
                                                {loc.contacts?.map((c: any, i: number) => (
                                                    <p key={i} className="flex flex-col border-l-2 border-[#101848]/10 pl-3">
                                                        <span className="text-[10px] uppercase opacity-50 tracking-wider">Contact</span>
                                                        <span className="font-bold">{c.name}</span>
                                                        <span>{c.mobile}</span>
                                                    </p>
                                                ))}
                                            </div>
                                            {loc.google_map_url && (
                                                <div className="pt-4">
                                                    <a 
                                                        href={loc.google_map_url} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-2 text-[#101848] font-bold text-[10px] uppercase tracking-widest hover:opacity-70 transition-opacity"
                                                    >
                                                        <span className="material-icons text-xs">map</span>
                                                        Google Map
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="sticky top-32 bg-white rounded-[40px] shadow-[0_20px_50px_rgba(16,24,72,0.1)] p-8 md:p-12 overflow-hidden border border-white">
                                <div className="absolute inset-0 z-0 opacity-5">
                                    <Image src={form.background_image_url || "/card_bg.png"} alt="bg" fill className="object-cover" />
                                </div>
                                <div className="relative z-10">
                                    <h3 className="text-[28px] font-serif text-[#101848] mb-8">{form.title}</h3>
                                    
                                    {status === "success" ? (
                                        <div className="text-center py-12 space-y-6">
                                            <div className="w-20 h-20 bg-green-500/10 text-green-600 rounded-full flex items-center justify-center mx-auto">
                                                <span className="material-icons text-2xl md:text-4xl">done_all</span>
                                            </div>
                                            <h3 className="text-[28px] font-serif text-[#101848]">{form.success_message || "Message Received"}</h3>
                                            <p className="text-[#101848]/60 font-sans">{form.success_subtitle || "We'll get back to you with peace and clarity shortly."}</p>
                                            <button 
                                                onClick={() => setStatus("idle")}
                                                className="text-[#101848] font-sans font-bold uppercase text-xs tracking-widest border-b border-[#101848] pb-1 hover:opacity-70 transition-opacity"
                                            >
                                                Send another message
                                            </button>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSubmit} className="space-y-5">
                                            <div className="space-y-1.5">
                                                <label className="text-[11px] font-sans font-bold uppercase tracking-widest text-[#101848]/60 ml-1">Full Name</label>
                                                <input required name="full_name" type="text" className="w-full bg-[#f5f6f6] border border-transparent rounded-xl px-5 py-4 text-[#101848] focus:bg-white focus:border-[#101848]/10 transition-all font-sans" placeholder="Your name" />
                                            </div>
                                            
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div className="space-y-1.5">
                                                    <label className="text-[11px] font-sans font-bold uppercase tracking-widest text-[#101848]/60 ml-1">Phone</label>
                                                    <input required name="phone" type="tel" className="w-full bg-[#f5f6f6] border border-transparent rounded-xl px-5 py-4 text-[#101848] focus:bg-white focus:border-[#101848]/10 transition-all font-sans" placeholder="Number" />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-[11px] font-sans font-bold uppercase tracking-widest text-[#101848]/60 ml-1">Email</label>
                                                    <input required name="email" type="email" className="w-full bg-[#f5f6f6] border border-transparent rounded-xl px-5 py-4 text-[#101848] focus:bg-white focus:border-[#101848]/10 transition-all font-sans" placeholder="Email address" />
                                                </div>
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-[11px] font-sans font-bold uppercase tracking-widest text-[#101848]/60 ml-1">Address</label>
                                                <input required name="address" type="text" className="w-full bg-[#f5f6f6] border border-transparent rounded-xl px-5 py-4 text-[#101848] focus:bg-white focus:border-[#101848]/10 transition-all font-sans" placeholder="Your current address" />
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-[11px] font-sans font-bold uppercase tracking-widest text-[#101848]/60 ml-1">Subject</label>
                                                <input required name="subject" type="text" className="w-full bg-[#f5f6f6] border border-transparent rounded-xl px-5 py-4 text-[#101848] focus:bg-white focus:border-[#101848]/10 transition-all font-sans" placeholder="What is this regarding?" />
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-[11px] font-sans font-bold uppercase tracking-widest text-[#101848]/60 ml-1">Message</label>
                                                <textarea required name="message" rows={3} className="w-full bg-[#f5f6f6] border border-transparent rounded-xl px-5 py-4 text-[#101848] focus:bg-white focus:border-[#101848]/10 transition-all font-sans resize-none" placeholder="Tell us what's on your mind..." />
                                            </div>

                                            <button 
                                                type="submit"
                                                disabled={status === "submitting"}
                                                className="w-full bg-[#101848] text-white py-5 rounded-[16px] font-sans font-bold uppercase tracking-widest text-xs hover:bg-[#1b1b2b] transition-all shadow-xl disabled:opacity-50 mt-2"
                                            >
                                                {status === "submitting" ? "Sending..." : (form.submit_button_text || "Begin Connection")}
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
