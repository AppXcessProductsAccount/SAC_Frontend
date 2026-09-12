"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { cmsApi } from "@/lib/cms-api";
import { applyCmsPageBindings, routeKeyForUrl } from "@/lib/cms-pages";
import { useEventGrandMeditationEnabled } from "@/hooks/useSiteSettings";
import { GRAND_MEDITATION_PATH, GRAND_MEDITATION_NAV_LABEL } from "@/lib/site-settings";
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

interface NavData {
    links: NavigationItem[];
    logoUrl?: string;
    brandName?: string;
}

/**
 * Hangs the Grand Group Meditation page off the Events menu as a dropdown child,
 * but only while the admin has the feature switched on. When it's off the Events
 * item is returned untouched, so the dropdown disappears with it. Matching on the
 * route key (not the label) means an admin rename of "Events" keeps working.
 */
const withEventDropdown = (items: NavigationItem[], enabled: boolean): NavigationItem[] => {
    if (!enabled) return items;
    return items.map((item) => {
        const isEvents =
            item.id === "events" ||
            routeKeyForUrl(item.url) === "events" ||
            item.url.toLowerCase().includes("/#events");
        if (!isEvents) return item;

        const children = item.children ? [...item.children] : [];
        if (!children.some((c) => c.url === GRAND_MEDITATION_PATH)) {
            children.push({
                label: GRAND_MEDITATION_NAV_LABEL,
                url: GRAND_MEDITATION_PATH,
                id: "grand-group-meditation",
            });
        }
        return { ...item, children };
    });
};

/**
 * The menu, resolved once per page load and shared by every mount of the bar.
 *
 * Each page renders its own <Navbar />, so a client-side navigation unmounts one
 * and mounts another. Without this cache that new bar started from DEFAULT_NAV
 * and refetched, so for as long as the two requests took it showed the
 * hard-coded labels — a page the admin had renamed flashed its old name
 * ("Paranjothi" where it should read "Our Spiritual Master") on the way into
 * every page, then corrected itself.
 *
 * The PROMISE is cached, not only its result, so a navigation that happens while
 * the first request is still in flight joins it rather than starting a second.
 *
 * Nothing is persisted to storage: a full reload refetches, which is what keeps
 * an admin's rename from being stuck behind a stale menu.
 */
let navDataPromise: Promise<NavData> | null = null;
let navDataResolved: NavData | null = null;

const fetchNavData = async (): Promise<NavData> => {
    let links: NavigationItem[] = DEFAULT_NAV;
    let logoUrl: string | undefined;
    let brandName: string | undefined;

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

                /* The Testimonials submenu hangs off the Home link, and that link's
                   URL is editable in the admin like any other. Matching it exactly
                   against "/" therefore lost the submenu the moment anyone saved the
                   link as "/#home" or with a trailing slash: the dropdown stopped
                   existing altogether, on desktop and in the mobile menu both.
                   `routeKeyForUrl` normalises case, hash and trailing slashes, so it
                   recognises every spelling of the front page. */
                let homeItem =
                    data.links.find((l: NavigationItem) => routeKeyForUrl(l.url) === "home") ??
                    findByUrl("/");

                /* No home link at all in the CMS: add one rather than silently drop
                   the submenu, since the site always has a front page. */
                if (!homeItem) {
                    homeItem = { label: "Home", url: "/", id: "home" };
                    data.links.unshift(homeItem);
                }

                homeItem.children = [
                    { label: "Testimonials", url: "/#testimonials", id: "testimonials" },
                ];

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
            if (data.logo_url) logoUrl = data.logo_url;
            if (data.brand_name) brandName = data.brand_name;
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

    navDataResolved = { links, logoUrl, brandName };
    return navDataResolved;
};

const loadNavData = (): Promise<NavData> => {
    if (!navDataPromise) {
        navDataPromise = fetchNavData().catch((error) => {
            // A failed load must not stay cached, or the menu would keep its
            // defaults for the rest of the session with no way to recover.
            navDataPromise = null;
            throw error;
        });
    }
    return navDataPromise;
};

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
    /* Seeded from the cache so a remount paints the real labels immediately;
       DEFAULT_NAV is only ever shown before the first load has finished. */
    const [navItems, setNavItems] = useState<NavigationItem[]>(() => navDataResolved?.links ?? DEFAULT_NAV);
    const [logoUrl, setLogoUrl] = useState(() => navDataResolved?.logoUrl ?? "/logo.png");
    const [brandName, setBrandName] = useState(() => navDataResolved?.brandName ?? "SELF AWARENESS CENTRE");

    /* The wordmark beside the logo, from `brandName` (CMS-fetched, defaulting to the
       full centre name).

       It renders as ONE lockup — every word in the same face, weight,
       size, tracking and opacity — and is styled entirely by its wrapper span.

       It used to split after the first word and render the remainder differently on
       five axes at once: font-light vs the inherited font-medium, 10/11/12px vs
       13/15/16px, opacity-80 vs full, tracking-widest vs tracking-wide, and
       (until recently) font-sans vs font-serif. So "SELF" read as a bolder, larger,
       darker word sitting next to a different-looking one.

       The weight was the worst of it: Lora is loaded in the root layout at
       400/500/600/700 only, so `font-light` (300) had no real face to resolve to and
       the browser substituted the nearest weight or synthesised one — the trailing
       words were never rendering the weight they asked for. */
    const renderBrand = () => brandName.trim();

    /* The Events menu gains a dropdown to the event page only while the feature
       is enabled. `null` (still loading) is treated as off so nothing flickers in
       before the flag is known. */
    const eventEnabled = useEventGrandMeditationEnabled();
    const displayNavItems = useMemo(
        () => withEventDropdown(navItems, eventEnabled === true),
        [navItems, eventEnabled]
    );

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        handleScroll(); // sync on mount — a reload half-way down the page must not render "unscrolled"
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        let cancelled = false;

        loadNavData()
            .then((data) => {
                if (cancelled) return;
                setNavItems(data.links);
                if (data.logoUrl) setLogoUrl(data.logoUrl);
                if (data.brandName) setBrandName(data.brandName);
            })
            .catch((error) => console.error("Failed to fetch navigation data:", error));

        return () => {
            cancelled = true;
        };
    }, []);

    /* Publish the navbar's real height into --nav-h.
       The variable has hard-coded fallbacks in globals.css (76px / 92px) so CSS depending
       on it is sane before this runs, but the bar is not one fixed height — the desktop
       link row is taller than the logo, and padding differs per breakpoint. The hero
       subtracts --nav-h from its own height so header + slide fill the viewport exactly,
       so a stale guess there shows up as a slide that overflows the fold or falls short
       of it. Measuring covers every breakpoint and any runtime reflow. */
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

        /* Subtract the header: it is pinned, so an anchor scrolled flush to the top of
           the viewport would land underneath it. --nav-h is the measured height. */
        const navHeight = parseInt(
            getComputedStyle(document.documentElement).getPropertyValue("--nav-h"),
            10
        ) || 80;

        const offsetPosition = element.getBoundingClientRect().top + window.scrollY - navHeight - 12;

        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    };

    /**
     * The logo, clicked while already on the home page.
     *
     * `href="/"` is a no-op when the URL is already "/", so from the landing page
     * the logo did nothing at all — and the landing page is exactly where people
     * click it, usually scrolled down into a section with "/#contact" in the
     * address bar. Nothing navigated because there was nowhere to navigate to.
     *
     * On that page the logo means "back to the top", so that is what it does. The
     * section hash goes with it, or a later reload would jump straight back down
     * to where they just left.
     *
     * Every other page still navigates normally, and a modified click (new tab,
     * middle button) is left entirely to the browser.
     */
    const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        if (pathname !== "/") return;

        e.preventDefault();
        setIsMobileMenuOpen(false);

        if (window.location.hash) {
            window.history.replaceState(null, "", "/");
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const isStandalonePage = pathname !== "/";

    return (
        <>
        {/* Sticky, and shared by every page via this one component.

            Transparent at rest so it sits directly on the fixed marble plate with no
            band of its own; near-solid once scrolled, so content passing underneath —
            the hero slide first — is covered cleanly instead of showing through. That
            opaque scrolled state is what keeps a pinned header from looking like it is
            hiding part of the image. */}
        <nav ref={navRef} className={`sticky top-0 z-[100] w-full pt-4 md:pt-6 pb-2 px-4 md:px-8 transition-all duration-300 ${scrolled ? "bg-background-light/95 backdrop-blur-md shadow-lg" : "bg-transparent"}`}>
            <div className="relative z-10 max-w-[1400px] mx-auto flex items-center justify-between gap-3 transition-all duration-300 px-1 py-0 md:px-0">
                {/* Logo Section */}
                {/* `min-w-0`, not `shrink-0`: the brand name comes from the CMS and is
                    set `nowrap`, so an unshrinkable logo block pushed the row wider than
                    the viewport on phones and the header ran off screen. It may now give
                    up width, and the name wraps rather than forcing the overflow.

                    No `lg:w-1/4` cap: at the 1024px breakpoint a quarter is ~240px while
                    the logo plus the full wordmark needs ~228px, so the name was being
                    ellipsised on desktop for the sake of a column width nothing needs.
                    The centre links are `flex-1`, so they still centre without it. */}
                <Link href="/" onClick={handleLogoClick} className="flex items-center gap-2 md:gap-3 min-w-0 shrink lg:w-auto relative z-40 group">
                    <div className="relative w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105 shrink-0">
                        {/* Fall back to the bundled logo: a missing CMS nav section
                            leaves logoUrl undefined, and Next's <Image> throws on an
                            empty src ("An empty string was passed to the src attribute"). */}
                        <Image src={getFullUrl(logoUrl) || "/logo.png"} alt={`${brandName} Logo`} fill className="object-cover" />
                    </div>
                    {/* No `truncate`: it turned a slightly-too-wide wordmark into "SELF
                        AWAR…". Without it the name wraps if it ever runs out of room,
                        which shows every word and still cannot overflow the viewport. */}
                    <span className="font-serif text-[13px] sm:text-[15px] md:text-[16px] tracking-wide font-medium leading-tight min-w-0 text-[#101848]">
                        {renderBrand()}
                    </span>
                </Link>

                {/* Navigation Links - Centered (desktop only) */}
                {/* Tighter gap at lg: labels come from CMS page names now, so a renamed
                    page ("Our Spiritual Master") needs the room the gap was using. */}
                <div className="hidden lg:flex items-center justify-center gap-4 xl:gap-8 flex-1">
                    {displayNavItems.map((item, index) => {
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
                                            className="absolute top-full left-0 mt-1 min-w-[12rem] max-w-[16rem] w-max bg-white/95 backdrop-blur-md rounded-[16px] shadow-xl border border-[#101848]/5 py-2 z-50 overflow-hidden"
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
                                                        className="px-5 py-2.5 text-[13px] text-[#1b1b2b]/70 hover:text-[#101848] hover:bg-[#101848]/5 transition-all text-left font-medium whitespace-pre-line leading-snug"
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
                <div className="flex items-center justify-end gap-2 md:gap-3 shrink-0 lg:w-auto">
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
                                {/* A link, not the plain text it used to be: the header
                                    logo is the way home everywhere else on the site, so
                                    tapping the name here did nothing and read as a dead
                                    control. Closes the drawer on the way. */}
                                <Link
                                    href="/"
                                    onClick={handleLogoClick}
                                    className="font-serif text-[15px] tracking-wide font-medium text-[#101848]"
                                >
                                    {renderBrand()}
                                </Link>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    aria-label="Close menu"
                                    className="w-9 h-9 rounded-full bg-black/5 flex items-center justify-center text-[#1b1b2b] hover:bg-black/10 transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto overscroll-contain px-2 py-3">
                                {displayNavItems.map((item, index) => {
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
                                                                    className="block px-4 py-2.5 text-[14px] text-[#1b1b2b]/60 hover:text-[#101848] transition-colors whitespace-pre-line leading-snug"
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
