"use client";

import Link from "next/link";

/** Kept in step with the sidebar in `layout.tsx`. */
const SECTIONS = [
    { href: "/admin/navbar", title: "Navbar", blurb: "Brand name, logo and navigation links." },
    { href: "/admin/hero", title: "Hero Section", blurb: "Main title, subtitle and background image." },
    { href: "/admin/programs", title: "Programs", blurb: "Programme section heading, description and cards." },
    { href: "/admin/memberships", title: "Memberships", blurb: "Membership tiers, pricing and applications." },
    { href: "/admin/events", title: "Upcoming Events", blurb: "Add, edit and remove event cards." },
    { href: "/admin/enlightenment", title: "Enlightenment", blurb: "Founder copy, portrait and video." },
    { href: "/admin/testimonials", title: "Testimonials", blurb: "Quotes, authors and display order." },
    { href: "/admin/contact", title: "Contact Us", blurb: "Address, phone, email and section imagery." },
    { href: "/admin/footer", title: "Footer", blurb: "Newsletter copy, social links and copyright." },
];

export default function AdminDashboard() {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h1 className="text-3xl font-serif font-bold text-[#101848] mb-4">Admin Dashboard</h1>
            <p className="text-gray-600 mb-8">
                Welcome to the Meditation Centre CMS. Choose a section below, or use the sidebar, to
                manage your website content.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {SECTIONS.map((section) => (
                    <Link
                        key={section.href}
                        href={section.href}
                        className="p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-md transition-all group"
                    >
                        <h3 className="text-xl font-semibold text-[#101848] mb-2 group-hover:text-blue-600">
                            {section.title}
                        </h3>
                        <p className="text-gray-500 text-sm">{section.blurb}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
