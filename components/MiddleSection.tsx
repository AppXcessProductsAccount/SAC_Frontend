"use client";

import { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";
import MiddleSectionClassic from "./MiddleSectionClassic";
import MiddleSectionModern from "./MiddleSectionModern";
import { cmsApi } from "@/lib/cms-api";

export interface MiddleSectionContent {
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
    };
}

export default function MiddleSection({ content, template: propTemplate }: { content?: MiddleSectionContent, template?: string }) {
    const { theme } = useTheme();
    const [data, setData] = useState<MiddleSectionContent | null>(content || null);
    const [template, setTemplate] = useState<string>(propTemplate || "default");
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
                setTemplate(response.template_id || "default");
            } catch (error) {
                console.error("Failed to fetch section2 content:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, [content]);

    if (loading && !content) return (
        <div className="py-32 flex justify-center items-center bg-white">
            <div className="w-8 h-8 border-4 border-[#101848]/20 border-t-[#101848] rounded-full animate-spin"></div>
        </div>
    );

    const activeTemplate = template === "default" ? theme : template;
    const displayData = data || content;

    return (
        <>
            {activeTemplate === "classic" ? (
                <MiddleSectionClassic content={displayData || null} />
            ) : (
                <MiddleSectionModern content={displayData || null} />
            )}
        </>
    );
}

