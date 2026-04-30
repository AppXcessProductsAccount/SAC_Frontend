"use client";

import { useEffect, useState } from "react";
import { cmsApi } from "@/lib/cms-api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AboutHero from "@/components/about/AboutHero";
import HistorySection from "@/components/about/HistorySection";
import FounderProfile from "@/components/about/FounderProfile";
import CoreGrowthGrid from "@/components/about/CoreGrowthGrid";
import MissionSection from "@/components/about/MissionIntentSection";
import OrganizationSection from "@/components/about/OrganizationSection";
import Enlightenment from "@/components/Enlightenment";
import Testimonials from "@/components/Testimonials";

export default function AboutPage() {
    const [sections, setSections] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSections = async () => {
            try {
                // 1. Discovery: List all available pages
                const pages = await cmsApi.getPages();
                
                // 2. Find the About page
                const aboutPage = pages.find((p: any) => p.name === "about" || p.id === 2);

                if (aboutPage) {
                    // 3. Navigation: List sections (structure only)
                    const sectionList = await cmsApi.getPageSections(aboutPage.id); 
                    
                    // 4. Content: Fetch detailed content for each section
                    const detailedSections = await Promise.all(
                        sectionList.map(async (section: any) => {
                            try {
                                const fullContent = await cmsApi.getSpecificSection(
                                    aboutPage.id, 
                                    section.section_id
                                );
                                return { ...section, content: fullContent };
                            } catch (e) {
                                console.warn(`Failed to fetch content for ${section.section_id}`, e);
                                return section;
                            }
                        })
                    );

                    setSections(detailedSections);
                }
            } catch (err) {
                console.error("Failed to execute CMS flow for about page", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSections();
    }, []);

    const renderSection = (section: any) => {
        const { section_id, content } = section;
        const sectionData = content;
        const sid = section_id.toLowerCase();

        if (sid.startsWith("about-section1") || sid === "about-hero") {
            return <AboutHero key={section.id} content={sectionData} />;
        }
        if (sid.startsWith("history")) {
            return <HistorySection key={section.id} content={sectionData} />;
        }
        if (sid.includes("growth") || sid.includes("core")) {
            return <CoreGrowthGrid key={section.id} content={sectionData} />;
        }
        if (sid.includes("founder") || sid.includes("leadership")) {
            return <FounderProfile key={section.id} content={sectionData} />;
        }
        if (sid.startsWith("mission")) {
            return <MissionSection key={section.id} content={sectionData} />;
        }
        if (sid.startsWith("partnerships") || sid.startsWith("organization")) {
            return <OrganizationSection key={section.id} content={sectionData} />;
        }
        if (sid === "testimonials") {
            return <Testimonials key={section.id} content={sectionData} />;
        }
        if (sid === "enlightenment") {
            return <Enlightenment key={section.id} content={sectionData} />;
        }
        return null;
    };

    return (
        <main className="bg-[#eeebf0] min-h-screen text-[#1b1b2b] selection:bg-[#101848]/10 font-sans">
            <Navbar />
            
            {loading ? (
                <div className="min-h-screen flex flex-col items-center justify-center bg-white">
                    <div className="w-16 h-16 border-4 border-[#101848]/10 border-t-[#101848] rounded-full animate-spin mb-4"></div>
                    <p className="text-[#101848]/60 font-serif italic text-lg animate-pulse">Loading About Us...</p>
                </div>
            ) : sections.length > 0 ? (
                <div className="flex flex-col">
                    {sections.map(renderSection)}
                </div>
            ) : (
                // Static Fallback
                <>
                    <AboutHero />
                    <HistorySection />
                    <CoreGrowthGrid />
                    <FounderProfile />
                    <MissionSection />
                    <OrganizationSection />
                    <Testimonials />
                </>
            )}
            
            <Footer />
        </main>
    );
}
