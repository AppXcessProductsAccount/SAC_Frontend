"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { cmsApi } from "@/lib/cms-api";
import { AnimatePresence } from "framer-motion";
import { useTheme } from "./ThemeProvider";
import { Palette, Sparkles, Layout, User, LogOut, FileText } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import AuthModal from "./auth/AuthModal";
import CompleteProfileModal from "./auth/CompleteProfileModal";

interface NavigationItem {
    label: string;
    url: string;
    id: string;
    children?: NavigationItem[];
}

export default function Navbar() {
    const pathname = usePathname();
    const [activeSection, setActiveSection] = useState("home");
    const [scrolled, setScrolled] = useState(false);
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const { theme, toggleTheme } = useTheme();
    const { user, isAuthenticated, logout } = useAuth();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isCompleteProfileOpen, setIsCompleteProfileOpen] = useState(false);

    const [navItems, setNavItems] = useState<NavigationItem[]>([
        { 
            label: "Home", 
            url: "/", 
            id: "home",
            children: [
                { label: "Programs", url: "/programs", id: "programs" },
                { label: "Testimonials", url: "/#testimonials", id: "testimonials" },
            ]
        },
        { label: "About", url: "/about", id: "about" },
        { label: "Community", url: "/community", id: "community" },
        { label: "Events", url: "/#events", id: "events" },
        { label: "Contact", url: "/contact", id: "contact" },
    ]);
    const [logoUrl, setLogoUrl] = useState("/logo.png");
    const [brandName, setBrandName] = useState("SELF AWARENESS CENTRE");

    useEffect(() => {
        const fetchNavData = async () => {
            try {
                const data = await cmsApi.getNavigation();
                // Merge CMS links if they exist, otherwise use default structure
                if (data) {
                    if (data.links) {
                        // Logic to maintain the dropdown if CMS data doesn't have it
                        const homeItem = data.links.find((l: any) => l.label === "Home");
                        if (homeItem) {
                            homeItem.children = [
                                { label: "Programs", url: "/programs", id: "programs" },
                                { label: "Testimonials", url: "/#testimonials", id: "testimonials" },
                            ];
                        }
                        setNavItems(data.links);
                    }
                    if (data.logo_url) setLogoUrl(data.logo_url);
                    if (data.brand_name) setBrandName(data.brand_name);
                }
            } catch (error) {
                console.error("Failed to fetch navigation data:", error);
            }
        };
        fetchNavData();

        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);

        const observerOptions = {
            root: null,
            rootMargin: "-10% 0px -80% 0px",
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        }, observerOptions);

        // Track both top-level and children sections
        const allItems = navItems.flatMap(item => item.children ? [item, ...item.children] : [item]);
        allItems.forEach((item) => {
            const element = document.getElementById(item.id);
            if (element) observer.observe(element);
        });

        return () => {
            window.removeEventListener("scroll", handleScroll);
            observer.disconnect();
        };
    }, [navItems.length]); // Re-run if navItems change structure

    useEffect(() => {
        // Show complete profile modal if authenticated but missing information
        // No need to show it on the profile page itself
        if (isAuthenticated && user && pathname !== "/profile") {
            const criticalFields = ['full_name', 'nickname', 'gender', 'dob', 'occupation', 'address'];
            const isIncomplete = criticalFields.some(field => !user[field as keyof typeof user]);
            
            if (isIncomplete) {
                // Delay to allow page to load smoothly or AuthModal to close
                const timer = setTimeout(() => {
                    setIsCompleteProfileOpen(true);
                }, 2000);
                return () => clearTimeout(timer);
            }
        }
    }, [isAuthenticated, user]);

    const scrollToSection = (e: React.MouseEvent<any>, id: string) => {
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

    const getFullUrl = (url: string) => {
        if (!url) return "";
        if (url.startsWith("/uploads/")) {
            return `${process.env.NEXT_PUBLIC_API_URL}${url}`;
        }
        return url;
    };

    return (
        <nav className={`sticky top-0 z-[100] w-full pt-6 pb-2 px-4 md:px-8 transition-all duration-300 ${scrolled && theme === 'classic' ? "backdrop-blur-md bg-white/10 shadow-lg" : ""}`}>
            {/* Background Image Layer for Classic Theme */}
            {theme === 'classic' && (
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/header_bg.png"
                        alt="Header Background"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            )}

            {/* FLOATING THEME TOGGLE (Dot on right) - placed outside main container so it anchors to screen */}
            <div className="fixed bottom-8 right-6 md:right-10 z-[1000]">
                <button 
                    onClick={toggleTheme}
                    className={`relative w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center backdrop-blur-xl shadow-2xl transition-all hover:scale-110 active:scale-95 group border ${
                        theme === 'classic'
                        ? 'bg-[#101848] text-white border-white/20'
                        : 'bg-white text-[#1b1b2b] border-[#1b1b2b]/10 hover:shadow-[0_10px_30px_rgba(0,0,0,0.15)]'
                    }`}
                    title={`Switch to ${theme === 'classic' ? 'Modern' : 'Classic'}`}
                >
                    {theme === 'classic' ? <Layout size={18} /> : <Sparkles size={18} />}
                    
                    <span className={`absolute right-full mr-4 px-3 py-1.5 rounded-lg text-xs md:text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg ${
                        theme === 'classic'
                        ? 'bg-[#101848] text-white'
                        : 'bg-white text-[#1b1b2b]'
                    }`}>
                        Switch to {theme === 'classic' ? 'Modern' : 'Classic'}
                    </span>
                </button>
            </div>

            <div className={`relative z-10 max-w-[1400px] mx-auto flex items-center justify-between transition-all duration-300 ${
                theme === 'modern' 
                ? 'bg-white rounded-[100px] shadow-[0_10px_40px_rgba(0,0,0,0.08)] px-5 py-2 md:px-6' 
                : 'px-5 py-0 md:px-6'
            }`}>
                {/* Logo Section - SCALED DOWN */}
                <Link href="/" className="flex items-center gap-2 md:gap-3 w-1/4 relative z-40 group">
                    <div className="relative w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
                        <Image src={getFullUrl(logoUrl)} alt={`${brandName} Logo`} fill className="object-cover" />
                    </div>
                    <span className={`font-serif text-[15px] md:text-[16px] tracking-wide font-medium ${theme === 'modern' ? 'text-[#1b1b2b]' : 'text-[#101848]'}`}>
                        SELF <span className="font-light opacity-80 font-sans tracking-widest text-[11px] md:text-[12px] ml-1">AWARENESS</span>
                    </span>
                </Link>

                {/* Navigation Links - Centered SCALED DOWN */}
                <div className="hidden lg:flex items-center justify-center gap-6 xl:gap-8 flex-1">
                    {navItems.map((item, index) => {
                        const isStandalonePage = pathname !== "/";
                        const isHashLink = item.url.startsWith("/#");
                        const isActive = (pathname === item.url) || (item.id === activeSection && !isStandalonePage);
                        const hasChildren = item.children && item.children.length > 0;

                        return (
                            <div 
                                key={index} 
                                className="relative py-4"
                                onMouseEnter={() => setHoveredItem(item.id)}
                                onMouseLeave={() => setHoveredItem(null)}
                            >
                                <Link
                                    href={item.url}
                                    onClick={(e) => {
                                        if (!isStandalonePage && isHashLink) {
                                            scrollToSection(e, item.id);
                                        }
                                    }}
                                    className={`text-[13px] xl:text-[14px] font-medium transition-all relative group flex items-center gap-1.5 ${
                                        isActive ? "text-[#101848]" : "text-[#1b1b2b]/70 hover:text-[#101848]"
                                    } ${theme === 'modern' ? 'font-sans text-[11px] xl:text-[12px] font-bold uppercase tracking-[0.1em]' : ''}`}
                                >
                                    {item.label}
                                    {hasChildren && (
                                        <span className={`material-symbols-outlined text-[14px] transition-transform duration-300 ${hoveredItem === item.id ? 'rotate-180' : ''}`}>
                                            expand_more
                                        </span>
                                    )}
                                    {isActive && theme === 'classic' && (
                                        <motion.span 
                                            layoutId="activeNav"
                                            className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#101848] rounded-full" 
                                        />
                                    )}
                                    {theme === 'modern' && (
                                        <span className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all group-hover:w-full bg-[#1b1b2b]`} />
                                    )}
                                </Link>

                                {/* Dropdown Menu */}
                                <AnimatePresence>
                                    {hasChildren && hoveredItem === item.id && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-full left-1/2 -translate-x-1/2 w-48 bg-white/95 backdrop-blur-md rounded-[16px] shadow-xl border border-[#101848]/5 py-3 z-50 overflow-hidden"
                                        >
                                            <div className="absolute inset-0 opacity-5 pointer-events-none">
                                                <img src="/upcoming_event.png" alt="texture" className="w-full h-full object-cover" />
                                            </div>
                                            <div className="relative z-10 flex flex-col">
                                                {item.children?.map((child, cIdx) => (
                                                    <Link
                                                        key={cIdx}
                                                        href={child.url}
                                                        onClick={(e) => {
                                                            if (!isStandalonePage && child.url.startsWith("/#")) {
                                                                scrollToSection(e, child.id);
                                                                setHoveredItem(null);
                                                            }
                                                        }}
                                                        className="px-5 py-2 text-[13px] text-[#1b1b2b]/70 hover:text-[#101848] hover:bg-[#101848]/5 transition-all text-left font-medium"
                                                    >
                                                        {child.label}
                                                    </Link>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>

                {/* Right Side Actions - SCALED DOWN */}
                <div className="flex items-center justify-end gap-3 md:gap-4 w-1/4">
                    {isAuthenticated ? (
                        <div className="relative">
                            <button 
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 p-1.5 pr-3 rounded-full border border-white/10 transition-all group"
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                                    {user?.profile_image_url ? (
                                        <img src={user.profile_image_url} alt={user.full_name} className="w-full h-full object-cover" />
                                    ) : (
                                        user?.full_name?.charAt(0).toUpperCase()
                                    )}
                                </div>
                                <span className={`text-sm font-medium ${theme === 'modern' ? 'text-[#1b1b2b]' : 'text-white'}`}>
                                    {user?.full_name?.split(' ')[0]}
                                </span>
                            </button>

                            <AnimatePresence>
                                {isUserMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-black/5 py-2 z-50"
                                    >
                                        <div className="px-4 py-2 border-b border-black/5 mb-1">
                                            <p className="text-xs text-black/40 font-medium uppercase tracking-wider">Account</p>
                                            <p className="text-sm font-semibold text-black/80 truncate">{user?.email}</p>
                                        </div>
                                        <Link 
                                            href="/profile"
                                            onClick={() => setIsUserMenuOpen(false)}
                                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-black/70 hover:bg-black/5 transition-all"
                                        >
                                            <User size={16} />
                                            Profile
                                        </Link>
                                        <Link 
                                            href="/my-registrations"
                                            onClick={() => setIsUserMenuOpen(false)}
                                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-black/70 hover:bg-black/5 transition-all"
                                        >
                                            <FileText size={16} />
                                            My Registrations
                                        </Link>
                                        <button 
                                            onClick={logout}
                                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-all"
                                        >
                                            <LogOut size={16} />
                                            Logout
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <>
                            {theme === 'modern' ? (
                                <div className="flex items-center gap-3">
                                    <button 
                                        onClick={() => setIsAuthModalOpen(true)}
                                        className="hidden lg:flex items-center gap-2 bg-white text-[#101848] px-5 py-1.5 rounded-full font-bold text-[11px] xl:text-[12px] shadow-sm hover:shadow-md hover:bg-[#101848] hover:text-white border border-gray-200 transition-all group"
                                    >
                                        Sign In
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#101848] group-hover:bg-white" />
                                    </button>
                                    <button className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white flex items-center justify-center text-[#1b1b2b] shadow-sm hover:bg-gray-100 border border-gray-100 transition-all">
                                        <span className="material-symbols-outlined text-[18px]">menu</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-4">
                                     <button 
                                        onClick={() => setIsAuthModalOpen(true)}
                                        className="hidden lg:block bg-[#101848] text-white px-6 py-2 rounded-[10px] font-medium text-[13px] hover:bg-[#1b1b2b] transition-all shadow-sm"
                                     >
                                         Sign In
                                     </button>
                                     <button className="lg:hidden text-white">
                                         <span className="material-symbols-outlined text-[24px]">menu</span>
                                     </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            <AuthModal 
                isOpen={isAuthModalOpen} 
                onClose={() => setIsAuthModalOpen(false)} 
            />

            <CompleteProfileModal 
                isOpen={isCompleteProfileOpen}
                onClose={() => setIsCompleteProfileOpen(false)}
            />
        </nav>
    );
}
