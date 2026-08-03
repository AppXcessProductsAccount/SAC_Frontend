"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { cmsApi } from "@/lib/cms-api";
import { AnimatePresence } from "framer-motion";
import { useTheme } from "./ThemeProvider";
import { Sparkles, Layout, User, LogOut, FileText, Menu, X, ChevronDown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import AuthModal from "./auth/AuthModal";
import CompleteProfileModal from "./auth/CompleteProfileModal";

interface NavigationItem {
    label: string;
    url: string;
    id: string;
    children?: NavigationItem[];
}

const DEFAULT_NAV: NavigationItem[] = [
    {
        label: "Home",
        url: "/",
        id: "home",
        children: [
            { label: "Testimonials", url: "/#testimonials", id: "testimonials" },
        ]
    },
    { label: "About", url: "/about", id: "about" },
    { label: "Paranjothi", url: "/paranjothi", id: "paranjothi" },
    { label: "Programs", url: "/programs", id: "programs" },
    { label: "Community", url: "/community", id: "community" },
    { label: "Events", url: "/#events", id: "events" },
    { label: "Membership", url: "/membership", id: "membership" },
    { label: "Contact", url: "/contact", id: "contact" },
];

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
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [openMobileGroup, setOpenMobileGroup] = useState<string | null>(null);

    const [navItems, setNavItems] = useState<NavigationItem[]>(DEFAULT_NAV);
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
                                { label: "Testimonials", url: "/#testimonials", id: "testimonials" },
                            ];
                        }

                        // Ensure Programs is present at top level if not in CMS
                        if (!data.links.find((l: any) => l.label === "Programs")) {
                            const aboutIndex = data.links.findIndex((l: any) => l.label === "About");
                            const newItem = { label: "Programs", url: "/programs", id: "programs" };
                            if (aboutIndex !== -1) {
                                data.links.splice(aboutIndex + 1, 0, newItem);
                            } else {
                                data.links.push(newItem);
                            }
                        }

                        // Logic for About (no children now)
                        const aboutItem = data.links.find((l: any) => l.label === "About");
                        if (aboutItem) {
                            aboutItem.children = [];
                        }

                        // Ensure Paranjothi is present at top level if not in CMS
                        if (!data.links.find((l: any) => l.label === "Paranjothi")) {
                            const aboutIndex = data.links.findIndex((l: any) => l.label === "About");
                            const newItem = { label: "Paranjothi", url: "/paranjothi", id: "paranjothi" };
                            if (aboutIndex !== -1) {
                                data.links.splice(aboutIndex + 1, 0, newItem);
                            } else {
                                data.links.push(newItem);
                            }
                        }

                        // Ensure Membership is present if not in CMS
                        if (!data.links.find((l: any) => l.label === "Membership")) {
                            const contactIndex = data.links.findIndex((l: any) => l.label === "Contact");
                            const newItem = { label: "Membership", url: "/membership", id: "membership" };
                            if (contactIndex !== -1) {
                                data.links.splice(contactIndex, 0, newItem);
                            } else {
                                data.links.push(newItem);
                            }
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
    }, []);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        handleScroll(); // sync on mount — a reload half-way down the page must not render "unscrolled"
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        }, { root: null, rootMargin: "-10% 0px -80% 0px", threshold: 0 });

        // Track both top-level and children sections
        const allItems = navItems.flatMap(item => item.children ? [item, ...item.children] : [item]);
        allItems.forEach((item) => {
            const element = document.getElementById(item.id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
        // Re-observe whenever the nav content itself changes (CMS load swaps the
        // array without necessarily changing its length).
    }, [navItems, pathname]);

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
    }, [isAuthenticated, user, pathname]);

    // Close the drawer/dropdown on navigation (including browser back/forward).
    // Adjusted during render rather than in an effect — this is React's
    // recommended pattern and avoids a second render pass.
    const [lastPath, setLastPath] = useState(pathname);
    if (lastPath !== pathname) {
        setLastPath(pathname);
        setIsMobileMenuOpen(false);
        setIsUserMenuOpen(false);
    }

    // Lock background scrolling + wire Escape while the drawer is open.
    useEffect(() => {
        if (!isMobileMenuOpen) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsMobileMenuOpen(false);
        };
        window.addEventListener("keydown", onKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [isMobileMenuOpen]);

    // Close the account dropdown on any outside click.
    useEffect(() => {
        if (!isUserMenuOpen) return;
        const onClick = (e: MouseEvent) => {
            if (!(e.target as HTMLElement).closest("[data-user-menu]")) setIsUserMenuOpen(false);
        };
        document.addEventListener("mousedown", onClick);
        return () => document.removeEventListener("mousedown", onClick);
    }, [isUserMenuOpen]);

    const scrollToSection = (e: React.MouseEvent<any>, id: string) => {
        const element = document.getElementById(id);
        if (!element) return; // let the router handle it — the section isn't on this page
        e.preventDefault();

        const navHeight = parseInt(
            getComputedStyle(document.documentElement).getPropertyValue("--nav-h"),
            10
        ) || 80;

        const offsetPosition = element.getBoundingClientRect().top + window.scrollY - navHeight - 12;

        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    };

    const getFullUrl = (url: string) => {
        if (!url) return "";
        if (url.startsWith("/uploads/")) {
            return `${process.env.NEXT_PUBLIC_API_URL}${url}`;
        }
        return url;
    };

    const isStandalonePage = pathname !== "/";

    return (
        <>
        <nav className={`sticky top-0 z-[100] w-full pt-4 md:pt-6 pb-2 px-4 md:px-8 transition-all duration-300 ${scrolled && theme === 'classic' ? "backdrop-blur-md bg-white/40 shadow-lg" : ""}`}>
            {/* Background Image Layer for Classic Theme */}
            {theme === 'classic' && (
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/header_bg.png"
                        alt=""
                        aria-hidden="true"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            )}

            <div className={`relative z-10 max-w-[1400px] mx-auto flex items-center justify-between gap-3 transition-all duration-300 ${
                theme === 'modern'
                ? 'bg-white rounded-[100px] shadow-[0_10px_40px_rgba(0,0,0,0.08)] px-4 py-2 md:px-6'
                : 'px-1 py-0 md:px-6'
            }`}>
                {/* Logo Section */}
                <Link href="/" className="flex items-center gap-2 md:gap-3 shrink-0 lg:w-1/4 relative z-40 group">
                    <div className="relative w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105 shrink-0">
                        <Image src={getFullUrl(logoUrl)} alt={`${brandName} Logo`} fill className="object-cover" />
                    </div>
                    <span className={`font-serif text-[13px] sm:text-[15px] md:text-[16px] tracking-wide font-medium whitespace-nowrap ${theme === 'modern' ? 'text-[#1b1b2b]' : 'text-[#101848]'}`}>
                        SELF <span className="font-light opacity-80 font-sans tracking-widest text-[10px] sm:text-[11px] md:text-[12px] ml-1">AWARENESS</span>
                    </span>
                </Link>

                {/* Navigation Links - Centered (desktop only) */}
                <div className="hidden lg:flex items-center justify-center gap-6 xl:gap-8 flex-1">
                    {navItems.map((item, index) => {
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
                                        <ChevronDown
                                            size={14}
                                            className={`transition-transform duration-300 ${hoveredItem === item.id ? 'rotate-180' : ''}`}
                                        />
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

                {/* Right Side Actions */}
                <div className="flex items-center justify-end gap-2 md:gap-3 shrink-0 lg:w-1/4">
                    {isAuthenticated ? (
                        <div className="relative" data-user-menu>
                            <button
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                aria-haspopup="menu"
                                aria-expanded={isUserMenuOpen}
                                className={`flex items-center gap-2 p-1 sm:pr-3 rounded-full border transition-all ${
                                    theme === 'modern'
                                    ? 'bg-gray-50 hover:bg-gray-100 border-gray-200'
                                    : 'bg-white/20 hover:bg-white/30 border-white/30'
                                }`}
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold overflow-hidden shrink-0">
                                    {user?.profile_image_url ? (
                                        <img src={user.profile_image_url} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        user?.full_name?.charAt(0).toUpperCase()
                                    )}
                                </div>
                                <span className={`hidden sm:block text-sm font-medium ${theme === 'modern' ? 'text-[#1b1b2b]' : 'text-[#101848]'}`}>
                                    {user?.full_name?.split(' ')[0]}
                                </span>
                            </button>

                            <AnimatePresence>
                                {isUserMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-black/5 py-2 z-50"
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
                        <button
                            onClick={() => setIsAuthModalOpen(true)}
                            className={`hidden lg:flex items-center gap-2 transition-all ${
                                theme === 'modern'
                                ? 'bg-white text-[#101848] px-5 py-1.5 rounded-full font-bold text-[11px] xl:text-[12px] shadow-sm hover:shadow-md hover:bg-[#101848] hover:text-white border border-gray-200 group'
                                : 'bg-[#101848] text-white px-6 py-2 rounded-[10px] font-medium text-[13px] hover:bg-[#1b1b2b] shadow-sm'
                            }`}
                        >
                            Sign In
                            {theme === 'modern' && <div className="w-1.5 h-1.5 rounded-full bg-[#101848] group-hover:bg-white" />}
                        </button>
                    )}

                    {/* Hamburger — the only navigation entry point below `lg` */}
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        aria-label="Open menu"
                        aria-expanded={isMobileMenuOpen}
                        aria-controls="mobile-menu"
                        className={`lg:hidden w-10 h-10 rounded-full flex items-center justify-center transition-all shrink-0 ${
                            theme === 'modern'
                            ? 'bg-white text-[#1b1b2b] shadow-sm hover:bg-gray-100 border border-gray-100'
                            : 'bg-[#101848] text-white shadow-sm hover:bg-[#1b1b2b]'
                        }`}
                    >
                        <Menu size={20} />
                    </button>
                </div>
            </div>
        </nav>

            {/* MOBILE DRAWER — rendered OUTSIDE <nav>: the navbar's scrolled-state
                `backdrop-blur` establishes a containing block, which would otherwise
                re-anchor these `fixed` layers to the header instead of the viewport. */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-[#1b1b2b]/50 backdrop-blur-sm z-[190] lg:hidden"
                        />

                        <motion.div
                            id="mobile-menu"
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", stiffness: 320, damping: 34 }}
                            className="fixed top-0 right-0 bottom-0 w-[86%] max-w-[360px] bg-white z-[200] lg:hidden flex flex-col shadow-2xl"
                        >
                            <div className="flex items-center justify-between px-5 py-4 border-b border-black/5 shrink-0">
                                <span className="font-serif text-[15px] tracking-wide font-medium text-[#101848]">
                                    SELF <span className="font-light opacity-80 font-sans tracking-widest text-[11px] ml-1">AWARENESS</span>
                                </span>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    aria-label="Close menu"
                                    className="w-9 h-9 rounded-full bg-black/5 flex items-center justify-center text-[#1b1b2b] hover:bg-black/10 transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto overscroll-contain px-2 py-3">
                                {navItems.map((item, index) => {
                                    const hasChildren = !!item.children?.length;
                                    const isOpen = openMobileGroup === item.id;
                                    const isActive = pathname === item.url;

                                    return (
                                        <div key={index} className="border-b border-black/[0.04] last:border-0">
                                            <div className="flex items-center">
                                                <Link
                                                    href={item.url}
                                                    onClick={(e) => {
                                                        if (!isStandalonePage && item.url.startsWith("/#")) {
                                                            scrollToSection(e, item.id);
                                                        }
                                                        setIsMobileMenuOpen(false);
                                                    }}
                                                    className={`flex-1 px-4 py-3.5 text-[15px] font-medium transition-colors ${
                                                        isActive ? "text-[#101848] font-bold" : "text-[#1b1b2b]/80"
                                                    }`}
                                                >
                                                    {item.label}
                                                </Link>
                                                {hasChildren && (
                                                    <button
                                                        onClick={() => setOpenMobileGroup(isOpen ? null : item.id)}
                                                        aria-label={`${isOpen ? "Collapse" : "Expand"} ${item.label}`}
                                                        aria-expanded={isOpen}
                                                        className="w-11 h-11 flex items-center justify-center text-[#1b1b2b]/50 shrink-0"
                                                    >
                                                        <ChevronDown
                                                            size={18}
                                                            className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                                                        />
                                                    </button>
                                                )}
                                            </div>

                                            <AnimatePresence initial={false}>
                                                {hasChildren && isOpen && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.25 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="pb-2 pl-4">
                                                            {item.children?.map((child, cIdx) => (
                                                                <Link
                                                                    key={cIdx}
                                                                    href={child.url}
                                                                    onClick={(e) => {
                                                                        if (!isStandalonePage && child.url.startsWith("/#")) {
                                                                            scrollToSection(e, child.id);
                                                                        }
                                                                        setIsMobileMenuOpen(false);
                                                                    }}
                                                                    className="block px-4 py-2.5 text-[14px] text-[#1b1b2b]/60 hover:text-[#101848] transition-colors"
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

                            <div className="shrink-0 border-t border-black/5 p-4 space-y-3 pb-[calc(1rem+env(safe-area-inset-bottom))]">
                                {isAuthenticated ? (
                                    <>
                                        <Link
                                            href="/profile"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="w-full flex items-center justify-center gap-2 bg-[#101848] text-white py-3 rounded-xl font-medium text-[14px]"
                                        >
                                            <User size={16} /> My Profile
                                        </Link>
                                        <button
                                            onClick={() => { setIsMobileMenuOpen(false); logout(); }}
                                            className="w-full flex items-center justify-center gap-2 text-red-600 py-2.5 rounded-xl font-medium text-[14px] hover:bg-red-50 transition-colors"
                                        >
                                            <LogOut size={16} /> Logout
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => { setIsMobileMenuOpen(false); setIsAuthModalOpen(true); }}
                                        className="w-full bg-[#101848] text-white py-3 rounded-xl font-medium text-[14px] hover:bg-[#1b1b2b] transition-colors"
                                    >
                                        Sign In
                                    </button>
                                )}

                                <button
                                    onClick={toggleTheme}
                                    className="w-full flex items-center justify-center gap-2 border border-black/10 text-[#1b1b2b]/70 py-2.5 rounded-xl font-medium text-[13px] hover:bg-black/[0.03] transition-colors"
                                >
                                    {theme === "classic" ? <Layout size={15} /> : <Sparkles size={15} />}
                                    Switch to {theme === "classic" ? "Modern" : "Classic"}
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />

            <CompleteProfileModal
                isOpen={isCompleteProfileOpen}
                onClose={() => setIsCompleteProfileOpen(false)}
            />
        </>
    );
}
