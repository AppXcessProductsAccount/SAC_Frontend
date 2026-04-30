"use client";

import Link from "next/link";

export default function AdminDashboard() {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h1 className="text-3xl font-serif font-bold text-[#101848] mb-4">Admin Dashboard</h1>
            <p className="text-gray-600 mb-8">Welcome to the Meditation Centre CMS. Select a section from the sidebar to manage your website content.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Link href="/admin/navbar" className="p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-md transition-all group">
                    <h3 className="text-xl font-semibold text-[#101848] mb-2 group-hover:text-blue-600">Navbar</h3>
                    <p className="text-gray-500 text-sm">Update brand name, logo and navigation links.</p>
                </Link>

                <Link href="/admin/hero" className="p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-md transition-all group">
                    <h3 className="text-xl font-semibold text-[#101848] mb-2 group-hover:text-blue-600">Hero Section</h3>
                    <p className="text-gray-500 text-sm">Manage main title, subtitle and background images.</p>
                </Link>

                <div className="p-6 bg-gray-50/50 rounded-2xl border border-gray-100 opacity-60">
                    <h3 className="text-xl font-semibold test-black mb-2">Other Sections</h3>
                    <p className="test-black text-sm">Coming soon: Manage programs, events, testimonials, and more.</p>
                </div>
            </div>
        </div>
    );
}
