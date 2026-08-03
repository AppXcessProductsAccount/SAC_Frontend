"use client";

import { usePathname } from "next/navigation";
import { Layout, Sparkles } from "lucide-react";
import { useTheme } from "./ThemeProvider";

/**
 * Floating classic/modern switcher.
 *
 * Rendered at the root (from ThemeProvider) rather than inside <Navbar>: the
 * navbar applies `backdrop-blur` when scrolled, which creates a containing
 * block and would make this `fixed` button scroll away with the header.
 *
 * Anchored bottom-LEFT so it never sits on top of the Zoho SalesIQ chat
 * launcher, which docks itself bottom-right.
 */
export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    const pathname = usePathname();

    // The CMS admin has its own chrome — no public theme switcher there.
    if (pathname?.startsWith("/admin")) return null;

    const nextTheme = theme === "classic" ? "Modern" : "Classic";

    return (
        <div className="fixed bottom-5 left-4 md:bottom-8 md:left-6 z-[1000]">
            <button
                onClick={toggleTheme}
                aria-label={`Switch to ${nextTheme} theme`}
                title={`Switch to ${nextTheme}`}
                className={`relative w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center backdrop-blur-xl shadow-2xl transition-all hover:scale-110 active:scale-95 group border ${
                    theme === "classic"
                        ? "bg-[#101848] text-white border-white/20"
                        : "bg-white text-[#1b1b2b] border-[#1b1b2b]/10 hover:shadow-[0_10px_30px_rgba(0,0,0,0.15)]"
                }`}
            >
                {theme === "classic" ? <Layout size={18} /> : <Sparkles size={18} />}

                <span
                    className={`absolute left-full ml-3 px-3 py-1.5 rounded-lg text-xs md:text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg hidden sm:block ${
                        theme === "classic" ? "bg-[#101848] text-white" : "bg-white text-[#1b1b2b]"
                    }`}
                >
                    Switch to {nextTheme}
                </span>
            </button>
        </div>
    );
}
