"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [isNavOpen, setIsNavOpen] = useState(false);

    const menuItems = [
        { label: "Navbar", href: "/admin/navbar" },
        { label: "Hero Section", href: "/admin/hero" },
        { label: "Programs", href: "/admin/programs" },
        { label: "Memberships", href: "/admin/memberships" },
        { label: "Upcoming Events", href: "/admin/events" },
        { label: "Enlightenment", href: "/admin/enlightenment" },
        { label: "Testimonials", href: "/admin/testimonials" },
        { label: "Contact Us", href: "/admin/contact" },
        { label: "Footer", href: "/admin/footer" },
    ];

    // Close the drawer on navigation.
    const [lastPath, setLastPath] = useState(pathname);
    if (lastPath !== pathname) {
        setLastPath(pathname);
        setIsNavOpen(false);
    }

    useEffect(() => {
        if (!isNavOpen) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIsNavOpen(false);
        window.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = prev;
            window.removeEventListener("keydown", onKey);
        };
    }, [isNavOpen]);

    const nav = (
        <>
            <div className="p-6">
                <h2 className="text-2xl font-serif font-bold tracking-tight">CMS Admin</h2>
                <p className="text-white/60 text-sm mt-1">Meditation Centre</p>
            </div>
            <nav className="mt-2 flex-1 overflow-y-auto">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center px-6 py-3 transition-colors ${
                                isActive
                                    ? "bg-white/10 text-white border-l-4 border-white"
                                    : "text-white/70 hover:bg-white/5 hover:text-white"
                            }`}
                        >
                            {item.label}
                        </Link>
                    );
                })}
            </nav>
            {/* Was `absolute bottom-0` inside a static <aside>, so it escaped the
                sidebar and pinned itself to the viewport. Now it's a flex footer. */}
            <div className="p-6 border-t border-white/10 shrink-0">
                <Link href="/" className="text-sm text-white/50 hover:text-white transition-colors">
                    ← Back to Site
                </Link>
            </div>
        </>
    );

    return (
        <div className="lg:flex min-h-screen bg-gray-50">
            {/* Mobile top bar — the 256px sidebar left only ~100px of usable width
                on a phone, with no way to collapse it. */}
            <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between bg-[#101848] text-white px-4 py-3 shadow-lg">
                <span className="font-serif font-bold text-lg">CMS Admin</span>
                <button
                    onClick={() => setIsNavOpen(true)}
                    aria-label="Open admin menu"
                    aria-expanded={isNavOpen}
                    className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                    <Menu size={20} />
                </button>
            </header>

            {/* Desktop sidebar */}
            <aside className="hidden lg:flex w-64 shrink-0 bg-[#101848] text-white shadow-xl flex-col sticky top-0 h-screen">
                {nav}
            </aside>

            {/* Mobile drawer */}
            {isNavOpen && (
                <>
                    <div
                        onClick={() => setIsNavOpen(false)}
                        className="lg:hidden fixed inset-0 bg-black/50 z-50"
                    />
                    <aside className="lg:hidden fixed top-0 left-0 bottom-0 w-[80%] max-w-[280px] bg-[#101848] text-white shadow-2xl z-50 flex flex-col">
                        <button
                            onClick={() => setIsNavOpen(false)}
                            aria-label="Close admin menu"
                            className="absolute right-3 top-3 w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                        >
                            <X size={18} />
                        </button>
                        {nav}
                    </aside>
                </>
            )}

            {/* Main Content */}
            <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
                <div className="max-w-5xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
