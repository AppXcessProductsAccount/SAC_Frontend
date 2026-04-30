"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MiddleSection from "@/components/MiddleSection";
import UpcomingEvents from "@/components/UpcomingPrograms"; // Verified path
import Enlightenment from "@/components/Enlightenment";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import ContactUs from "@/components/ContactUs";
import Footer from "@/components/Footer";

export default function LandingPageV1() {
    return (
        <main className="bg-[#eeebf0] min-h-screen text-[#1b1b2b] selection:bg-[#101848]/10 font-sans">
            <Navbar />
            <Hero />
            <MiddleSection />
            <UpcomingEvents />
            <Enlightenment />
            <Testimonials />
            <FAQ />
            <ContactUs />
            <Footer />
        </main>
    );
}
