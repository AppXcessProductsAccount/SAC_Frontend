"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const menuItems = [
        { label: "Navbar", href: "/admin/navbar" },
        { label: "Hero Section", href: "/admin/hero" },
        { label: "Programs", href: "/admin/programs" },
        { label: "Upcoming Events", href: "/admin/events" },
        { label: "Enlightenment", href: "/admin/enlightenment" },
        { label: "Testimonials", href: "/admin/testimonials" },
        { label: "Contact Us", href: "/admin/contact" },
        { label: "Footer", href: "/admin/footer" },
    ];

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-[#101848] text-white shadow-xl">
                <div className="p-6">
                    <h2 className="text-2xl font-serif font-bold tracking-tight">CMS Admin</h2>
                    <p className="text-white/60 text-sm mt-1">Meditation Centre</p>
                </div>
                <nav className="mt-6">
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
                <div className="absolute bottom-0 w-64 p-6 border-t border-white/10">
                    <Link href="/" className="text-sm text-white/50 hover:text-white transition-colors">
                        ← Back to Site
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-5xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
