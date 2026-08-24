"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { cmsApi } from "@/lib/cms-api";
import { applyCmsPageBindings } from "@/lib/cms-pages";
import { AnimatePresence } from "framer-motion";
import { User, LogOut, FileText, Menu, X, ChevronDown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import AuthModal from "./auth/AuthModal";
import CompleteProfileModal from "./auth/CompleteProfileModal";
import { resolveMediaUrl as getFullUrl } from "@/lib/api/config";

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
    const { user, isAuthenticated, logout } = useAuth();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isCompleteProfileOpen, setIsCompleteProfileOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [openMobileGroup, setOpenMobileGroup] = useState<string | null>(null);

    const navRef = useRef<HTMLElement>(null);
    const [navItems, setNavItems] = useState<NavigationItem[]>(DEFAULT_NAV);
    const [logoUrl, setLogoUrl] = useState("/logo.png");
    const [brandName, setBrandName] = useState("SELF AWARENESS CENTRE");

    /* The wordmark beside the logo. It was two hard-coded words — "SELF AWARENESS" —
       so the centre's name was cut short, and `brandName` (already fetched from the
       CMS, already defaulting to the full name) only ever reached the logo's alt text.
       The first word keeps the serif weight and the rest stays in the light spaced
       sans, so the look is unchanged apart from the word that was missing. */
    const renderBrand = (restSizeClass: string) => {
        const [firstWord, ...rest] = brandName.trim().split(/\s+/);
        return (
            <>
                {firstWord}
                {rest.length > 0 && (
                    /* `font-serif`, matching the first word. This span used to force
                       `font-sans`, so "SELF" rendered in Lora while "AWARENESS CENTRE"
                       rendered in a different face beside it. The lighter weight and
                       wider tracking stay — that hierarchy is intended, the typeface
                       switch was not. */
                    <span className={`font-light opacity-80 font-serif tracking-widest ml-1 ${restSizeClass}`}>
                        {rest.join(" ")}
                    </span>
                )}
            </>
        );
    };

    useEffect(() => {
        const fetchNavData = async () => {
            let links: NavigationItem[] = DEFAULT_NAV;

            try {
                const data = await cmsApi.getNavigation();
                // Merge CMS links if they exist, otherwise use default structure
                if (data) {
                    if (data.links) {
                        /* Every lookup below keys on the destination URL, never on the
                           label. The label is what an editor renames in the CMS ("Paranjothi"
                           -> "Our Spiritual Master"); matching on it meant a rename read as
                           "this link is missing" and the menu grew a duplicate entry back to
                           the same page. The URL is what actually identifies the link. */
                        const sameUrl = (a: unknown, b: unknown) => {
                            const clean = (url: unknown) => {
                                const value = typeof url === "string" ? url.trim().toLowerCase() : "";
                                return value.length > 1 ? value.replace(/\/+$/, "") : value;
                            };
                            return clean(a) === clean(b);
                        };
                        const findByUrl = (url: string) => data.links.find((l: NavigationItem) => sameUrl(l.url, url));
                        const indexByUrl = (url: string) => data.links.findIndex((l: NavigationItem) => sameUrl(l.url, url));

                        /* Insert a link the CMS doesn't carry, next to an anchor link —
                           keeping whatever label the editor gave the anchor. */
                        const ensureLink = (item: NavigationItem, anchorUrl: string, offset: number) => {
                            if (findByUrl(item.url)) return;
                            const anchorIndex = indexByUrl(anchorUrl);
                            if (anchorIndex !== -1) {
                                data.links.splice(anchorIndex + offset, 0, item);
                            } else {
                                data.links.push(item);
                            }
                        };

                        // Logic to maintain the dropdown if CMS data doesn't have it
                        const homeItem = findByUrl("/");
                        if (homeItem) {
                            homeItem.children = [
                                { label: "Testimonials", url: "/#testimonials", id: "testimonials" },
                            ];
                        }

                        // Ensure Programs is present at top level if not in CMS
                        ensureLink({ label: "Programs", url: "/programs", id: "programs" }, "/about", 1);

                        // Logic for About (no children now)
                        const aboutItem = findByUrl("/about");
                        if (aboutItem) {
                            aboutItem.children = [];
                        }

                        // Ensure Paranjothi is present at top level if not in CMS
                        ensureLink({ label: "Paranjothi", url: "/paranjothi", id: "paranjothi" }, "/about", 1);

                        // Ensure Membership is present if not in CMS
                        ensureLink({ label: "Membership", url: "/membership", id: "membership" }, "/contact", 0);

                        links = data.links;
                    }
                    if (data.logo_url) setLogoUrl(data.logo_url);
                    if (data.brand_name) setBrandName(data.brand_name);
                }
            } catch (error) {
                console.error("Failed to fetch navigation data:", error);
            }

            /* Menu labels and hrefs follow the CMS page names, so renaming a page in the
               admin shows up here and points at its new URL. Kept separate from the block
               above because the menu falls back to DEFAULT_NAV whenever there is no
               navigation section to merge — a rename has to reach the menu in that case
               too. */
            try {
                const pages = await cmsApi.getPages();
                links = applyCmsPageBindings(links, pages);
            } catch (error) {
                console.warn("Could not apply CMS page names to the menu:", error);
            }

            setNavItems(links);
        };
        fetchNavData();
    }, []);

    /* Publish the navbar's real height into --nav-h.
       The variable was a hard-coded guess (76px / 92px) but the bar is not one fixed
       height: the modern theme wraps its contents in a floating pill with its own
       padding, and the desktop link row is taller than the logo. The guess fell short
       of the modern bar, so the hero — which pulls itself up by --nav-h to sit under a
       transparent navbar — stopped a few pixels below the top of the page and left a
       strip of background above the slider. Measuring covers every breakpoint, both
       themes, and a theme switch at runtime. */
    useEffect(() => {
        const nav = navRef.current;
        if (!nav) return;

        const publishHeight = () => {
            const height = nav.getBoundingClientRect().height;
            // A 0 during layout would pull the hero flush and then jump it back.
            if (height > 0) {
                document.documentElement.style.setProperty("--nav-h", `${Math.round(height)}px`);
            }
        };

        publishHeight();

        const observer =
            typeof ResizeObserver !== "undefined" ? new ResizeObserver(publishHeight) : null;
        observer?.observe(nav);
        window.addEventListener("resize", publishHeight);
        window.addEventListener("orientationchange", publishHeight);

        return () => {
            observer?.disconnect();
            window.removeEventListener("resize", publishHeight);
            window.removeEventListener("orientationchange", publishHeight);
        };
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

    const isStandalonePage = pathname !== "/";

    return (
        <>
        <nav ref={navRef} className={`sticky top-0 z-[100] w-full pt-4 md:pt-6 pb-2 px-4 md:px-8 transition-all duration-300 backdrop-blur-md ${scrolled ? "bg-background-light/85 shadow-lg" : "bg-background-light/55"}`}>
            <div className="relative z-10 max-w-[1400px] mx-auto flex items-center justify-between gap-3 transition-all duration-300 px-1 py-0 md:px-6">
                {/* Logo Section */}
                {/* `min-w-0`, not `shrink-0`: the brand name comes from the CMS and is
                    set `nowrap`, so an unshrinkable logo block pushed the row wider than
                    the viewport on phones and the header ran off screen. It may now give
                    up width, and the name ellipsises rather than forcing the overflow. */}
                <Link href="/" className="flex items-center gap-2 md:gap-3 min-w-0 shrink lg:w-1/4 relative z-40 group">
                    <div className="relative w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105 shrink-0">
                        <Image src={getFullUrl(logoUrl)} alt={`${brandName} Logo`} fill className="object-cover" />
                    </div>
                    <span className="font-serif text-[13px] sm:text-[15px] md:text-[16px] tracking-wide font-medium truncate min-w-0 text-[#101848]">
                        {renderBrand("text-[10px] sm:text-[11px] md:text-[12px]")}
                    </span>
                </Link>

                {/* Navigation Links - Centered (desktop only) */}
                {/* Tighter gap at lg: labels come from CMS page names now, so a renamed
                    page ("Our Spiritual Master") needs the room the gap was using. */}
                <div className="hidden lg:flex items-center justify-center gap-4 xl:gap-8 flex-1">
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
                                    }`}
                                >
                                    {/* `whitespace-pre`, not the default: a menu label is one line.
                                        As a flex child it could shrink below its own width and break
                                        at every space ("Our / Spiritual / Master"). This breaks only
                                        where an editor actually typed a newline. */}
                                    <span className="whitespace-pre">{item.label}</span>
                                    {hasChildren && (
                                        <ChevronDown
                                            size={14}
                                            className={`transition-transform duration-300 ${hoveredItem === item.id ? 'rotate-180' : ''}`}
                                        />
                                    )}
                                    {isActive && (
                                        <motion.span
                                            layoutId="activeNav"
                                            className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#101848] rounded-full"
                                        />
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
                                                        className="px-5 py-2 text-[13px] text-[#1b1b2b]/70 hover:text-[#101848] hover:bg-[#101848]/5 transition-all text-left font-medium whitespace-pre"
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
                                className="flex items-center gap-2 p-1 sm:pr-3 rounded-full border transition-all bg-white/20 hover:bg-white/30 border-white/30"
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold overflow-hidden shrink-0">
                                    {user?.profile_image_url ? (
                                        <img src={user.profile_image_url} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        user?.full_name?.charAt(0).toUpperCase()
                                    )}
                                </div>
                                <span className="hidden sm:block text-sm font-medium text-[#101848]">
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
                            className="hidden lg:flex items-center gap-2 transition-all bg-[#101848] text-white px-6 py-2 rounded-[10px] font-medium text-[13px] hover:bg-[#1b1b2b] shadow-sm"
                        >
                            Sign In
                        </button>
                    )}

                    {/* Hamburger — the only navigation entry point below `lg` */}
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        aria-label="Open menu"
                        aria-expanded={isMobileMenuOpen}
                        aria-controls="mobile-menu"
                        className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center transition-all shrink-0 bg-[#101848] text-white shadow-sm hover:bg-[#1b1b2b]"
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
                                    {renderBrand("text-[11px]")}
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
                                                    className={`flex-1 px-4 py-3.5 text-[15px] font-medium transition-colors whitespace-pre ${
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
                                                                    className="block px-4 py-2.5 text-[14px] text-[#1b1b2b]/60 hover:text-[#101848] transition-colors whitespace-pre"
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
