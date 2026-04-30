"use client";

import { useEffect, useState } from "react";
import { cmsApi } from "@/lib/cms-api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CommunityHero from "@/components/community/CommunityHero";
import SACSection from "@/components/community/SACSection";
import SocietySection from "@/components/community/SocietySection";
import CoreGrowthGrid from "@/components/community/CoreGrowthGrid";
import CommunityActivities from "@/components/community/CommunityActivities";
import UpcomingEvents from "@/components/community/UpcomingEvents";

export default function CommunityPage() {
    const [sections, setSections] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSections = async () => {
            try {
                // 1. Discovery: List all available pages
                const pages = await cmsApi.getPages();
                
                // 2. Find the Community page
                const communityPage = pages.find((p: any) => 
                    p.name === "community_events" || p.name === "community"
                );

                if (communityPage) {
                    // 3. Navigation: List sections (structure only)
                    const sectionList = await cmsApi.getPageSections(communityPage.id); 
                    
                    // 4. Content: Fetch detailed content for each section
                    const detailedSections = await Promise.all(
                        sectionList.map(async (section: any) => {
                            try {
                                const fullContent = await cmsApi.getSpecificSection(
                                    communityPage.id, 
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
                } else {
                    console.warn("Community page not found in CMS discovery list.");
                }
            } catch (err) {
                console.error("Failed to execute CMS flow for community page", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSections();
    }, []);

    const renderSection = (section: any) => {
        const { section_id, content } = section;
        const sectionData = content?.content || content;

        // Use startsWith to handle IDs with suffixes like "-section1"
        const sid = section_id.toLowerCase();

        // More specific prefixes first to avoid collisions
        if (sid.startsWith("community-activities")) {
            return <CommunityActivities key={section.id} content={sectionData} />;
        }
        if (sid.startsWith("community-") || sid === "hero") {
            return <CommunityHero key={section.id} content={sectionData} />;
        }
        if (sid.startsWith("sac-")) {
            return <SACSection key={section.id} content={sectionData} />;
        }
        if (sid.startsWith("sasm-")) {
            return <SocietySection key={section.id} type="SASM" content={sectionData} />;
        }
        if (sid.startsWith("sass-")) {
            return <SocietySection key={section.id} type="SASS" content={sectionData} />;
        }
        if (sid.startsWith("core-areas")) {
            return <CoreGrowthGrid key={section.id} content={sectionData} />;
        }
        if (sid.startsWith("upcoming-events")) {
            return <UpcomingEvents key={section.id} content={sectionData} />;
        }

        return null;
    };

    return (
        <main className="bg-[#eeebf0] min-h-screen text-[#1b1b2b] selection:bg-[#101848]/10 font-sans">
            <Navbar />
            
            {loading ? (
                <div className="min-h-screen flex flex-col items-center justify-center bg-white">
                    <div className="w-16 h-16 border-4 border-[#101848]/10 border-t-[#101848] rounded-full animate-spin mb-4"></div>
                    <p className="text-[#101848]/60 font-serif italic text-lg animate-pulse">Loading Sacred Space...</p>
                </div>
            ) : sections.length > 0 ? (
                sections.map(renderSection)
            ) : (
                // Fallback to static components if no CMS data is returned
                <>
                    <CommunityHero />
                    <SACSection />
                    <SocietySection type="SASM" />
                    <SocietySection type="SASS" />
                    <CoreGrowthGrid />
                    <CommunityActivities />
                    <UpcomingEvents />
                </>
            )}
            
            <Footer />
        </main>
    );
}
