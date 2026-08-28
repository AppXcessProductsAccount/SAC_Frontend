"use client";

import { useEffect, useState } from "react";
import MiddleSectionClassic from "./MiddleSectionClassic";
import { cmsApi } from "@/lib/cms-api";

export interface MiddleSectionContent {
    /** Optional CMS override for the section backdrop; falls back to the marble plate. */
    background_image_url?: string;
    title: string;
    text: string;
    youtube_url: string;
    testimonial?: {
        text: string;
        author: string;
        role: string;
    };
    group_meditation?: {
        title: string;
        description: string;
        /** The card's backdrop. Named *_image_url so the admin draws an upload widget. */
        image_url?: string;
    };
}

export default function MiddleSection({ content }: { content?: MiddleSectionContent, template?: string }) {
    const [data, setData] = useState<MiddleSectionContent | null>(content || null);
    const [loading, setLoading] = useState(!content);

    useEffect(() => {
        if (content) return; // Skip fetching if content is provided via props

        const fetchContent = async () => {
            try {
                const response = await cmsApi.getSectionContent("section2");
                const contentData = (response.content?.content && typeof response.content.content === 'object') 
                    ? response.content.content 
                    : response.content;
                
                setData(contentData);
            } catch (error) {
                console.error("Failed to fetch section2 content:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, [content]);

    if (loading && !content) return (
        <div className="py-16 md:py-24 lg:py-32 flex justify-center items-center bg-white">
            <div className="w-8 h-8 border-4 border-[#101848]/20 border-t-[#101848] rounded-full animate-spin"></div>
        </div>
    );

    const displayData = data || content;

    return <MiddleSectionClassic content={displayData || null} />;
}

