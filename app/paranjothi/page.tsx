"use client";

import { useEffect, useState } from "react";
import { cmsApi } from "@/lib/cms-api";
import { resolveCmsPage } from "@/lib/cms-pages";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ParanjothiHero from "@/components/paranjothi/ParanjothiHero";
import ParanjothiBio from "@/components/paranjothi/ParanjothiBio";
import ParanjothiVideos from "@/components/paranjothi/ParanjothiVideos";

export default function ParanjothiPage() {
    const [sections, setSections] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSections = async () => {
            try {
                // 1. Discovery: List all available pages
                const pages = await cmsApi.getPages();
                
                // 2. Find the Paranjothi page (survives an admin rename)
                const pPage = resolveCmsPage(pages, "paranjothi");

                if (pPage) {
                    // 3. Navigation: List sections (structure only)
                    const sectionList = await cmsApi.getPageSections(pPage.id); 
                    
                    // 4. Content: Fetch detailed content for each section
                    const detailedSections = await Promise.all(
                        sectionList.map(async (section: any) => {
                            try {
                                const fullContent = await cmsApi.getSpecificSection(
                                    pPage.id, 
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
                console.error("Failed to execute CMS flow for Paranjothi page", err);
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

        if (sid.includes("hero")) {
            return <ParanjothiHero key={section.id} content={sectionData} />;
        }
        if (sid.includes("bio")) {
            return <ParanjothiBio key={section.id} content={sectionData} />;
        }
        if (sid.includes("video")) {
            return <ParanjothiVideos key={section.id} content={sectionData} />;
        }
        return null;
    };

    return (
        <main className="bg-[#eeebf0] min-h-screen text-[#1b1b2b] selection:bg-[#101848]/10 font-sans">
            <Navbar />
            
            {loading ? (
                <div className="min-h-screen flex flex-col items-center justify-center bg-white">
                    <div className="w-16 h-16 border-4 border-[#101848]/10 border-t-[#101848] rounded-full animate-spin mb-4"></div>
                    <p className="text-[#101848]/60 font-serif italic text-lg animate-pulse">Loading Gnanaguru Paranjothi...</p>
                </div>
            ) : sections.length > 0 ? (
                <div className="flex flex-col">
                    {sections.map(renderSection)}
                </div>
            ) : (
                // Static Fallback
                <>
                    <ParanjothiHero />
                    <ParanjothiBio content={{ paragraphs: [
                        "Gnanaguru Paranjothi Subramaniam is the Spiritual Master, Co-Founder & Program Director of Self Awareness Centre (SAC). Gnanaguru Paranjothi Subramaniam is a True Intellect. He holds an Honours Degree in Electrical and Electronics Engineering from University of Portsmouth, England. He had served with Tenaga Nasional Berhad (Malaysian Power Board) for 14 years (1978 – 1992) as a Senior Engineer.",
                        "In 1979, he was initiated into Tantric Kundalini Yoga Meditation practice by his Spiritual Master Gnanaguru Paranjothi Sivasankaran, the prime disciple of his Holiness Gnanavallal Paranjothi Mahan. In 1988, he was officially bestowed “Guru Status” by Gnanaguru Paranjothi Sivasankaran to become a Spiritual Master. As he embarked on the spiritual journey, he left his successful career as a Senior Engineer in 1992. He then embraced the latest Western concepts in Psychoanalysis and Psychotherapy which took him to the United States of America. There, he met his mentor Dr. W. Brugh Joy, M.D. who made him realise the wonderment of the Heart Centre (Anahatha) Meditation. Blending ancient teachings with the latest Western concepts, he created the “Best of the East and the West”."
                    ] }} />
                    <ParanjothiVideos content={{ videos: Array(6).fill("https://www.youtube.com/embed/Qa8YGXFtaRU") }} />
                </>
            )}
            
            <Footer />
        </main>
    );
}
