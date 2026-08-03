"use client";

import { useEffect, useState } from "react";
import { cmsApi } from "@/lib/cms-api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import MiddleSection from "@/components/MiddleSection";
import UpcomingPrograms from "@/components/UpcomingPrograms";
import Enlightenment from "@/components/Enlightenment";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";

export default function Home() {
    const [sections, setSections] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSections = async () => {
            try {
                // 1. Discovery: List all available pages
                const pages = await cmsApi.getPages();
                
                // 2. Find the Home page
                const homePage = pages.find((p: any) => p.name === "home" || p.id === 1);

                if (homePage) {
                    // 3. Navigation: List sections (structure only)
                    const sectionList = await cmsApi.getPageSections(homePage.id); 
                    
                    // 4. Content: Fetch detailed content for each section
                    const detailedSections = await Promise.all(
                        sectionList.map(async (section: any) => {
                            try {
                                const fullContent = await cmsApi.getSpecificSection(
                                    homePage.id, 
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
                console.error("Failed to execute CMS flow for home page", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSections();
    }, []);

    const renderSection = (section: any) => {
        const { section_id, content, template_id } = section;
        const sectionData = content;

        switch (section_id) {
            case "hero":
                return <Hero key={section.id} content={sectionData} template={template_id} />;
            case "section2":
                return <MiddleSection key={section.id} content={sectionData} />;
            case "upcoming-programs":
                return <UpcomingPrograms key={section.id} content={sectionData} />;
            case "enlightenment":
                return <Enlightenment key={section.id} content={sectionData} />;
            case "testimonials":
                return <Testimonials key={section.id} content={sectionData} />;
            case "faq":
                return <FAQ key={section.id} content={sectionData} template={template_id} />;
            default:
                return null;
        }
    };

    return (
        <main className="bg-[#eeebf0] min-h-screen text-[#1b1b2b] selection:bg-[#101848]/10 font-sans overflow-x-clip">
            <Navbar />

            {loading ? (
                // 70svh, not 100vh: the navbar already occupies space above this, so a
                // full-viewport spinner forced a scrollbar on every initial load.
                <div className="min-h-[70svh] flex flex-col items-center justify-center bg-white px-6 text-center">
                    <div className="w-14 h-14 md:w-16 md:h-16 border-4 border-[#101848]/10 border-t-[#101848] rounded-full animate-spin mb-4"></div>
                    <p className="text-[#101848]/60 font-serif italic text-base md:text-lg animate-pulse">Welcome to Self Awareness...</p>
                </div>
            ) : sections.length > 0 ? (
                sections.map(renderSection)
            ) : (
                // Static Fallback
                <>
                    <Hero />
                    <MiddleSection />
                    <UpcomingPrograms />
                    <Enlightenment />
                    <Testimonials />
                    <FAQ />
                </>
            )}
            
            <Footer />
        </main>
    );
}
