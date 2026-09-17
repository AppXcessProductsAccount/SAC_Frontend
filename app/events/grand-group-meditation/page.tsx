"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Playfair_Display, Cormorant_Garamond } from "next/font/google";
import { motion, useInView, type Variants } from "framer-motion";
import {
    Calendar,
    MapPin,
    Train,
    Car,
    CarTaxiFront,
    Navigation,
    CalendarPlus,
    Ticket,
    Shirt,
    Phone,
    Users,
    Flower2,
    ArrowRight,
    Star,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useGrandMeditationEvent } from "@/hooks/useSiteSettings";
import { resolveMediaUrl } from "@/lib/api/config";
import type { GrandMeditationContent } from "@/lib/site-settings";

/* New type system for this page: an elegant high-contrast serif for display,
   a refined old-style serif for accents, Manrope (site font) for UI text. */
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["500", "600", "700", "800", "900"], variable: "--font-playfair" });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["500", "600", "700"], style: ["normal", "italic"], variable: "--font-cormorant" });
const DISPLAY = { fontFamily: "var(--font-playfair)" };
const SERIF = { fontFamily: "var(--font-cormorant)" };

/* ---------- date / link helpers (timezone-stable, from admin data) ---------- */
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const pad = (n: number) => String(n).padStart(2, "0");
function parseLocal(s: string) {
    const [d, t] = (s || "").split("T");
    const [y, mo, da] = (d || "2027-01-09").split("-").map(Number);
    const [h, mi] = (t || "15:00").split(":").map(Number);
    return { y, mo, da, h: h || 0, mi: mi || 0 };
}
const dayLabel = (s: string) => { const { y, mo, da } = parseLocal(s); return WEEKDAYS[new Date(Date.UTC(y, mo - 1, da)).getUTCDay()]; };
const dateLabel = (s: string) => { const { y, mo, da } = parseLocal(s); return `${da} ${MONTHS[mo - 1]} ${y}`; };
const timeLabel = (s: string) => { const { h, mi } = parseLocal(s); const suffix = h < 12 ? "AM" : "PM"; return `${((h + 11) % 12) + 1}:${pad(mi)} ${suffix}`; };
function buildLinks(c: GrandMeditationContent) {
    const enc = encodeURIComponent(`${c.venue_name}, ${c.venue_address}`.trim());
    const { y, mo, da, h, mi } = parseLocal(c.starts_at);
    const start = `${y}${pad(mo)}${pad(da)}T${pad(h)}${pad(mi)}00`;
    const endU = new Date(Date.UTC(y, mo - 1, da, h, mi) + c.duration_hours * 3600 * 1000);
    const end = `${endU.getUTCFullYear()}${pad(endU.getUTCMonth() + 1)}${pad(endU.getUTCDate())}T${pad(endU.getUTCHours())}${pad(endU.getUTCMinutes())}00`;
    return {
        maps: `https://www.google.com/maps/search/?api=1&query=${enc}`,
        directions: `https://www.google.com/maps/dir/?api=1&destination=${enc}`,
        embed: `https://www.google.com/maps?q=${enc}&output=embed`,
        calendar:
            "https://calendar.google.com/calendar/render?action=TEMPLATE&text=" +
            encodeURIComponent("Grand Group Meditation with our Guru") +
            `&dates=${start}/${end}&ctz=Asia/Singapore&details=` +
            encodeURIComponent("Self Awareness Society, Singapore — Remembrance Day of Our Spiritual Masters.") +
            `&location=${enc}`,
    };
}

/* ---------- animation ---------- */
const fadeUp: Variants = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } } };
const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } } };

function Reveal({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "-80px" });
    return (
        <motion.section id={id} ref={ref} variants={stagger} initial="hidden" animate={inView ? "show" : "hidden"} className={className}>
            {children}
        </motion.section>
    );
}

function SectionHead({ eyebrow, title, center = false }: { eyebrow: string; title: string; center?: boolean }) {
    return (
        <motion.div variants={fadeUp} className={center ? "text-center" : ""}>
            <span className="inline-flex items-center gap-2 text-[#B08D2A] font-semibold text-xs uppercase tracking-[0.3em]">
                <span className="w-6 h-px bg-[#C9A227]/60" /> {eyebrow} <span className="w-6 h-px bg-[#C9A227]/60" />
            </span>
            <h2 style={DISPLAY} className={`mt-3 text-3xl md:text-5xl font-bold text-[#101848] ${center ? "" : ""}`}>{title}</h2>
        </motion.div>
    );
}

/* Fixed particle field (no random → no hydration mismatch). */
const PARTICLES = [
    { top: "12%", left: "10%", s: 3, d: 0 }, { top: "24%", left: "26%", s: 2, d: 0.7 },
    { top: "68%", left: "14%", s: 4, d: 1.2 }, { top: "44%", left: "6%", s: 2, d: 0.4 },
    { top: "80%", left: "30%", s: 3, d: 1.0 }, { top: "18%", left: "50%", s: 2, d: 1.5 },
    { top: "10%", left: "74%", s: 3, d: 0.6 }, { top: "32%", left: "90%", s: 4, d: 1.1 },
    { top: "62%", left: "92%", s: 3, d: 0.3 }, { top: "82%", left: "78%", s: 2, d: 0.9 },
    { top: "52%", left: "68%", s: 2, d: 1.7 }, { top: "40%", left: "40%", s: 2, d: 0.5 },
];
function Particles() {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
            {PARTICLES.map((p, i) => (
                <motion.span key={i} className="absolute rounded-full bg-[#F5E6A8]"
                    style={{ top: p.top, left: p.left, width: p.s, height: p.s, boxShadow: "0 0 8px 2px rgba(232,199,102,0.7)" }}
                    animate={{ opacity: [0.1, 1, 0.1], scale: [0.6, 1.4, 0.6] }}
                    transition={{ duration: 2.8, repeat: Infinity, delay: p.d, ease: "easeInOut" }} />
            ))}
        </div>
    );
}

/** A slow-rotating concentric mandala behind the hero. */
function Mandala({ className = "" }: { className?: string }) {
    return (
        <motion.svg viewBox="0 0 400 400" className={className} aria-hidden
            animate={{ rotate: 360 }} transition={{ duration: 80, repeat: Infinity, ease: "linear" }}>
            <g fill="none" stroke="#C9A227" strokeOpacity="0.5">
                <circle cx="200" cy="200" r="196" />
                <circle cx="200" cy="200" r="160" strokeDasharray="2 8" />
                <circle cx="200" cy="200" r="120" />
                <circle cx="200" cy="200" r="80" strokeDasharray="1 6" />
                {Array.from({ length: 24 }).map((_, i) => {
                    const a = (i / 24) * Math.PI * 2;
                    return <line key={i} x1={200 + 160 * Math.cos(a)} y1={200 + 160 * Math.sin(a)} x2={200 + 196 * Math.cos(a)} y2={200 + 196 * Math.sin(a)} />;
                })}
            </g>
        </motion.svg>
    );
}

/** Circular gold-ringed portrait for each remembered master. */
function MasterMedallion({ name, image, fit = "cover", pos = "center" }: { name: string; image?: string | null; fit?: string; pos?: string }) {
    const src = image ? resolveMediaUrl(image) : "";
    return (
        <motion.div variants={fadeUp} className="flex flex-col items-center text-center w-28 sm:w-32">
            <motion.div whileHover={{ scale: 1.07, y: -3 }} transition={{ type: "spring", stiffness: 260, damping: 16 }} className="relative">
                <Star size={14} className="absolute -top-2 left-1/2 -translate-x-1/2 text-[#E8C766] fill-[#E8C766]" />
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-[2px] bg-gradient-to-br from-[#F5E6A8] via-[#C9A227] to-[#8B6914] shadow-[0_0_18px_-4px_rgba(201,162,39,0.6)]">
                    <div className="w-full h-full rounded-full overflow-hidden bg-[#0a0e27] flex items-center justify-center">
                        {src ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={src} alt={name} className="w-full h-full" style={{ objectFit: fit as "cover" | "contain", objectPosition: pos }} />
                        ) : (
                            <Flower2 className="text-[#E8C766]" size={24} />
                        )}
                    </div>
                </div>
            </motion.div>
            {/* Fixed height so all three name blocks align regardless of line count. */}
            <p style={SERIF} className="mt-3 text-[13px] sm:text-sm font-semibold text-[#F5E6A8] leading-snug min-h-[3.5rem]">{name}</p>
        </motion.div>
    );
}

const HIGHLIGHTS = [
    "Grand Group Meditation with our Guru",
    "Remembrance Day of Our Spiritual Masters",
    "78th Birthday of our Guru, Paranjothi Subramaniam",
    "38th Anniversary of Self Awareness Centre",
];
const JOURNEY_MRT = [
    "Alight at Serangoon MRT Station (NE12 / CC13).",
    "Take Exit E towards Serangoon Central.",
    "Take Bus 315 or 317 towards Serangoon Gardens.",
    "Alight at Serangoon Garden Circus or the Country Club bus stop (66261).",
    "Walk to the club (a short walk).",
];
const PARKING_ALT = [
    "MyVillage at Serangoon Garden (about 200 m away)",
    "Serangoon Garden Market Car Park (49A Serangoon Garden Way)",
    "Public parking along Serangoon Garden Way / Kensington Park Road",
];
const INFO_ROW = [
    { icon: Ticket, title: "Your Ticket", body: "Please have your event ticket / QR code ready upon arrival." },
    { icon: Users, title: "Admission", body: "Doors open: To be confirmed. Updates will be posted here." },
    { icon: Shirt, title: "Dress Code", body: "To be confirmed." },
    { icon: Phone, title: "Enquiries", body: "For any enquiries, please contact Self Awareness Society, Singapore." },
];

export default function GrandGroupMeditationPage() {
    const { enabled, content } = useGrandMeditationEvent();
    const router = useRouter();

    useEffect(() => { if (enabled === false) router.replace("/"); }, [enabled, router]);

    if (enabled !== true) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0e27]">
                <div className="w-14 h-14 border-4 border-[#E8C766]/20 border-t-[#E8C766] rounded-full animate-spin" />
            </div>
        );
    }

    const guruSrc = content.guru_image ? resolveMediaUrl(content.guru_image) : "/director_paranjothi.png";
    const links = buildLinks(content);
    const dLabel = dateLabel(content.starts_at);
    const tLabel = timeLabel(content.starts_at);

    return (
        <main style={{ fontFamily: "var(--font-manrope)" }} className={`${playfair.variable} ${cormorant.variable} min-h-screen bg-[#F7F5F0] text-[#25242e] overflow-x-clip`}>
            <Navbar />

            {/* ============================ HERO ============================ */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-10%,_#242a63_0%,_#141a4a_40%,_#0a0e27_100%)]" />
                <Mandala className="absolute -top-40 left-1/2 -translate-x-1/2 w-[46rem] h-[46rem] opacity-[0.12]" />
                <div className="absolute -top-20 -left-24 w-[28rem] h-[28rem] rounded-full bg-[#C9A227]/12 blur-3xl" />
                <div className="absolute -bottom-24 -right-24 w-[30rem] h-[30rem] rounded-full bg-[#5b3fa8]/15 blur-3xl" />
                <Particles />

                <div className="relative z-10 max-w-6xl mx-auto px-6 pt-14 md:pt-16 pb-16 grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                    {/* ---------- LEFT: images ---------- */}
                    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="flex flex-col items-center gap-6">
                        {/* Guru portrait with rotating conic ring */}
                        <div className="flex flex-col items-center">
                            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="relative w-60 h-60 sm:w-72 sm:h-72">
                                <motion.div className="absolute -inset-1.5 rounded-full"
                                    style={{ background: "conic-gradient(from 0deg,#8B6914,#C9A227,#F5E6A8,#FFFDF5,#F5E6A8,#C9A227,#8B6914)" }}
                                    animate={{ rotate: 360 }} transition={{ duration: 16, repeat: Infinity, ease: "linear" }} />
                                <div className="absolute inset-0 rounded-full overflow-hidden bg-[#0a0e27] ring-1 ring-[#0a0e27]">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={guruSrc} alt={content.guru_name} className="w-full h-full" style={{ objectFit: (content.guru_fit as "cover" | "contain") || "cover", objectPosition: content.guru_pos || "center" }} />
                                </div>
                            </motion.div>
                            <p style={SERIF} className="mt-4 text-[#F5E6A8] text-lg font-semibold tracking-wide text-center">{content.guru_name}</p>
                        </div>

                        {/* Masters row */}
                        <motion.div variants={stagger} initial="hidden" animate="show" className="flex items-start justify-center gap-4 sm:gap-7">
                            {content.masters.map((m, i) => (<MasterMedallion key={i} name={m.name} image={m.image} fit={m.fit} pos={m.pos} />))}
                        </motion.div>
                    </motion.div>

                    {/* ---------- RIGHT: content ---------- */}
                    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.15 }} className="text-center lg:text-left">
                        <div className="flex items-center justify-center lg:justify-start gap-4">
                            <p className="text-[#E8C766] tracking-[0.28em] text-[11px] sm:text-xs font-semibold uppercase">Self Awareness Society, Singapore</p>
                            <span className="hidden lg:block flex-1 h-px bg-gradient-to-r from-[#C9A227]/60 to-transparent" />
                        </div>
                        <p style={SERIF} className="text-white/55 italic text-lg mt-1">proudly presents</p>

                        <p style={SERIF} className="mt-5 text-2xl sm:text-3xl md:text-4xl font-medium text-[#E8C766]">Grand Group</p>
                        <h1 style={DISPLAY} className="text-6xl sm:text-7xl font-black leading-[0.95] tracking-tight">
                            <motion.span className="inline-block bg-clip-text text-transparent"
                                style={{ backgroundImage: "linear-gradient(100deg,#C9A227 0%,#F5E6A8 30%,#FFFDF5 50%,#F5E6A8 70%,#C9A227 100%)", backgroundSize: "220% 100%" }}
                                animate={{ backgroundPosition: ["0% 0%", "220% 0%"] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}>
                                Meditation
                            </motion.span>
                        </h1>

                        <div className="mt-5 flex items-center justify-center lg:justify-start gap-4">
                            <span className="text-white/90 tracking-[0.25em] text-sm font-semibold uppercase">With Our Guru</span>
                            <span className="h-px w-12 sm:w-24 bg-gradient-to-r from-[#C9A227] to-transparent" />
                        </div>

                        <p className="mt-5 text-white/55 text-[11px] uppercase tracking-[0.25em]">in conjunction with</p>
                        <p style={SERIF} className="text-[#E8C766] text-xl sm:text-2xl mt-1">Remembrance Day of Our Spiritual Masters</p>

                        <div className="mt-6 pt-6 border-t border-white/10">
                            <p className="text-[#E8C766] tracking-[0.3em] text-[11px] font-semibold uppercase">Celebrating</p>
                            <p style={SERIF} className="mt-2 text-white/90 text-lg">
                                <span className="text-[#F5E6A8] font-semibold">78th Birthday</span> of our Guru, Paranjothi Subramaniam
                                <span className="mx-2 text-[#C9A227]">·</span>
                                <span className="text-[#F5E6A8] font-semibold">38th Anniversary</span> of Self Awareness Centre
                            </p>
                        </div>

                        <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                            <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A227]/40 bg-white/5 backdrop-blur-sm px-4 py-2 text-sm text-white/90">
                                <Calendar size={15} className="text-[#E8C766]" /> {dLabel} · {tLabel}
                            </span>
                            <span className="inline-flex items-center gap-2 rounded-full border border-[#C9A227]/40 bg-white/5 backdrop-blur-sm px-4 py-2 text-sm text-white/90">
                                <MapPin size={15} className="text-[#E8C766]" /> {content.venue_name}
                            </span>
                        </div>

                        <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                            <a href={links.calendar} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2 bg-gradient-to-r from-[#C9A227] to-[#E8C766] text-[#0a0e27] px-7 py-3 rounded-full font-bold text-sm hover:shadow-[0_10px_30px_-8px_rgba(201,162,39,0.7)] transition-all">
                                <CalendarPlus size={16} /> Add to Calendar
                            </a>
                            <a href="#details" className="inline-flex items-center gap-2 border border-white/25 text-white px-7 py-3 rounded-full font-medium text-sm hover:bg-white/10 transition-all">
                                View Details <ArrowRight size={15} />
                            </a>
                        </div>
                    </motion.div>
                </div>

                {/* elegant bottom fade into the page */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-[#F7F5F0]" />
            </section>

            {/* ====================== ABOUT + HIGHLIGHTS ====================== */}
            <Reveal id="details" className="max-w-6xl mx-auto px-6 py-16 md:py-24 grid lg:grid-cols-[1.25fr_1fr] gap-10 items-stretch">
                <motion.div variants={fadeUp} className="flex flex-col justify-center">
                    <SectionHead eyebrow="About" title="About the Event" />
                    <p className="mt-6 text-[#25242e]/70 leading-relaxed text-lg" style={SERIF}>
                        Join us for a Grand Group Meditation with our Guru, in conjunction with the Remembrance Day of Our
                        Spiritual Masters. This special gathering also celebrates the 78th birthday of our Guru, Paranjothi
                        Subramaniam, and the 38th anniversary of the Self Awareness Centre — a rare occasion to meditate as one
                        community, honour our masters, and mark two treasured milestones together.
                    </p>
                </motion.div>
                <motion.div variants={fadeUp} className="relative rounded-[28px] bg-gradient-to-br from-[#141a4a] to-[#242a63] p-8 md:p-9 shadow-2xl overflow-hidden">
                    <Mandala className="absolute -right-16 -top-16 w-64 h-64 opacity-[0.14]" />
                    <h3 style={DISPLAY} className="relative text-2xl font-bold text-white">Event Highlights</h3>
                    <ul className="relative mt-6 space-y-4">
                        {HIGHLIGHTS.map((h, i) => (
                            <motion.li key={h} variants={fadeUp} className="flex items-start gap-3.5">
                                <span className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-[#C9A227] to-[#E8C766] text-[#0a0e27] text-xs font-bold flex items-center justify-center">{i + 1}</span>
                                <span className="text-white/85 leading-snug" style={SERIF}>{h}</span>
                            </motion.li>
                        ))}
                    </ul>
                </motion.div>
            </Reveal>

            {/* ============================ VENUE ============================ */}
            <Reveal className="bg-white border-y border-[#101848]/8">
                <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
                    <SectionHead eyebrow="Location" title="The Venue" />
                    <motion.div variants={fadeUp} className="mt-8 rounded-[28px] bg-[#F7F5F0] border border-[#C9A227]/20 shadow-[0_20px_60px_-25px_rgba(16,24,72,0.35)] overflow-hidden grid lg:grid-cols-[1fr_1.15fr]">
                        <div className="p-8 md:p-10 flex flex-col justify-center">
                            <span className="inline-flex items-center gap-2 text-[#B08D2A] text-xs font-bold uppercase tracking-[0.2em]"><MapPin size={14} /> Where</span>
                            <p style={DISPLAY} className="mt-3 text-3xl font-bold text-[#101848]">{content.venue_name}</p>
                            <p className="text-[#25242e]/65 mt-2 text-lg" style={SERIF}>{content.venue_subtitle}</p>
                            <p className="text-[#25242e]/65" style={SERIF}>{content.venue_address}</p>
                            <div className="mt-6 flex flex-wrap gap-3">
                                <a href={links.maps} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#101848] text-[#F5E6A8] px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-[#1b1b2b] transition-all shadow-md"><MapPin size={16} /> Open in Google Maps</a>
                                <a href={links.directions} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border border-[#101848]/25 text-[#101848] px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-[#101848]/5 transition-all"><Navigation size={16} /> Get Directions</a>
                            </div>
                        </div>
                        <div className="min-h-[18rem] lg:min-h-full border-t lg:border-t-0 lg:border-l border-[#C9A227]/20">
                            <iframe title={`${content.venue_name} map`} src={links.embed} className="w-full h-full min-h-[18rem]" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                        </div>
                    </motion.div>
                </div>
            </Reveal>

            {/* ====================== GETTING THERE ====================== */}
            <Reveal className="max-w-6xl mx-auto px-6 py-16 md:py-24">
                <SectionHead eyebrow="Getting There" title="Plan Your Journey" center />
                <div className="mt-12 grid gap-6 lg:grid-cols-3 items-stretch">
                    {/* 01 MRT */}
                    <motion.div variants={fadeUp} whileHover={{ y: -8 }} className="group relative flex flex-col rounded-[26px] bg-white p-8 shadow-[0_14px_50px_-20px_rgba(16,24,72,0.22)] border border-[#101848]/8 overflow-hidden">
                        <span style={DISPLAY} className="absolute top-5 right-7 text-6xl font-black text-[#C9A227]/10 select-none">01</span>
                        <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#141a4a] to-[#242a63] flex items-center justify-center shadow-md mb-5"><Train className="text-[#E8C766]" size={22} /></span>
                        <h3 style={DISPLAY} className="text-xl font-bold text-[#101848]">By MRT &amp; Bus</h3>
                        <p className="text-xs text-[#25242e]/50 mb-4">Via Serangoon MRT (NE12 / CC13)</p>
                        <ol className="space-y-3.5">
                            {JOURNEY_MRT.map((step, i) => (
                                <li key={i} className="flex gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-[#C9A227] to-[#E8C766] text-[#0a0e27] text-xs font-bold flex items-center justify-center">{i + 1}</span>
                                    <span className="text-sm text-[#25242e]/75 leading-relaxed pt-0.5">{step}</span>
                                </li>
                            ))}
                        </ol>
                    </motion.div>

                    {/* 02 Driving */}
                    <motion.div variants={fadeUp} whileHover={{ y: -8 }} className="group relative flex flex-col rounded-[26px] bg-white p-8 shadow-[0_14px_50px_-20px_rgba(16,24,72,0.22)] border border-[#101848]/8 overflow-hidden">
                        <span style={DISPLAY} className="absolute top-5 right-7 text-6xl font-black text-[#C9A227]/10 select-none">02</span>
                        <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#141a4a] to-[#242a63] flex items-center justify-center shadow-md mb-5"><Car className="text-[#E8C766]" size={22} /></span>
                        <h3 style={DISPLAY} className="text-xl font-bold text-[#101848]">Driving &amp; Parking</h3>
                        <p className="text-xs text-[#25242e]/50 mb-4">Parking subject to availability</p>
                        <p className="text-xs uppercase tracking-widest text-[#25242e]/40 font-bold mb-3">Nearby alternatives</p>
                        <ul className="space-y-2.5 flex-1">
                            {PARKING_ALT.map((p) => (<li key={p} className="flex gap-2.5 text-sm text-[#25242e]/75"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#C9A227] flex-shrink-0" />{p}</li>))}
                        </ul>
                        <p className="mt-5 text-sm text-[#101848] font-medium bg-[#F7F5F0] rounded-2xl px-4 py-3">Please arrive early — parking may be limited. Consider carpooling or public transport.</p>
                    </motion.div>

                    {/* 03 Taxi */}
                    <motion.div variants={fadeUp} whileHover={{ y: -8 }} className="group relative flex flex-col rounded-[26px] bg-white p-8 shadow-[0_14px_50px_-20px_rgba(16,24,72,0.22)] border border-[#101848]/8 overflow-hidden">
                        <span style={DISPLAY} className="absolute top-5 right-7 text-6xl font-black text-[#C9A227]/10 select-none">03</span>
                        <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#141a4a] to-[#242a63] flex items-center justify-center shadow-md mb-5"><CarTaxiFront className="text-[#E8C766]" size={22} /></span>
                        <h3 style={DISPLAY} className="text-xl font-bold text-[#101848]">By Taxi / Private Hire</h3>
                        <p className="text-xs text-[#25242e]/50 mb-4">Drop-off at the main entrance</p>
                        <p className="text-sm text-[#25242e]/60 mb-3">Set your destination to:</p>
                        <div className="rounded-2xl bg-[#F7F5F0] border border-[#C9A227]/20 p-5 flex-1">
                            <p style={DISPLAY} className="text-lg font-bold text-[#101848]">{content.venue_name}</p>
                            <p className="text-sm text-[#25242e]/70 mt-1">{content.venue_subtitle}</p>
                            <p className="text-sm text-[#25242e]/70">{content.venue_address}</p>
                        </div>
                        <a href={links.directions} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center justify-center gap-2 border border-[#101848]/25 text-[#101848] px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-[#101848]/5 transition-all"><Navigation size={16} /> Get Directions</a>
                    </motion.div>
                </div>
            </Reveal>

            {/* ====================== INFO ROW ====================== */}
            <Reveal className="bg-white border-y border-[#101848]/8">
                <div className="max-w-6xl mx-auto px-6 py-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {INFO_ROW.map((it) => {
                        const Icon = it.icon;
                        return (
                            <motion.div key={it.title} variants={fadeUp} whileHover={{ y: -5 }} className="rounded-3xl bg-[#F7F5F0] border border-[#C9A227]/15 p-6">
                                <span className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#141a4a] to-[#242a63] flex items-center justify-center mb-4"><Icon size={18} className="text-[#E8C766]" /></span>
                                <h4 style={DISPLAY} className="text-lg font-bold text-[#101848]">{it.title}</h4>
                                <p className="mt-1.5 text-sm text-[#25242e]/65 leading-relaxed">{it.body}</p>
                            </motion.div>
                        );
                    })}
                </div>
            </Reveal>

            {/* ====================== TAGLINE BANNER ====================== */}
            <div className="relative overflow-hidden bg-[radial-gradient(ellipse_at_center,_#242a63_0%,_#141a4a_55%,_#0a0e27_100%)]">
                <Mandala className="absolute left-1/2 -translate-x-1/2 -bottom-40 w-[36rem] h-[36rem] opacity-[0.1]" />
                <div className="relative z-10 max-w-5xl mx-auto px-6 py-16 text-center">
                    <motion.p style={DISPLAY} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
                        className="text-4xl md:text-5xl italic bg-gradient-to-r from-[#F5E6A8] via-[#E8C766] to-[#C9A227] bg-clip-text text-transparent">
                        Partners in Spiritual Upliftment
                    </motion.p>
                    <p className="mt-4 text-[#E8C766] font-semibold tracking-wide">Self Awareness Society, Singapore</p>
                    <p className="mt-2 text-white/70 text-sm md:text-base max-w-2xl mx-auto" style={SERIF}>
                        Build People Psychologically, Uplift them Spiritually and the People will build the Nation.
                    </p>
                </div>
            </div>

            <Footer />
        </main>
    );
}
