"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HeaderBelow from "@/components/HeaderBelow";
import UpcomingEvents from "@/components/UpcomingPrograms";
import Enlightenment from "@/components/Enlightenment";
import Testimonials from "@/components/Testimonials";
import ContactUs from "@/components/ContactUs";
import Footer from "@/components/Footer";

// --- V2 Components (Dark & Minimalist Theme) ---


export default function LandingPageV2() {
    return (
        <main className="bg-[#eeebf0] min-h-screen text-[#1b1b2b] selection:bg-[#101848]/10 font-sans">
            <Navbar />
            <Hero />
            <HeaderBelow />
            <UpcomingEvents />
            <Enlightenment />
            <Testimonials />
            <ContactUs />
            <Footer />
        </main>
    );
}
