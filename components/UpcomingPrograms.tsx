"use client";

import { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";
import UpcomingProgramsClassic from "./UpcomingProgramsClassic";
import UpcomingProgramsModern from "./UpcomingProgramsModern";
import { cmsApi } from "@/lib/cms-api";
import { programsApi, Program as RealProgram } from "@/lib/api/programs";

export interface Program {
    id: number | string;
    title: string;
    date_text: string;
    image_url: string;
    tags: string[];
    location: string;
    isPreview?: boolean;
}

export interface UpcomingProgramsContent {
    title: string;
    subtitle: string;
    programs: Program[];
}

export default function UpcomingEvents({ content, template: propTemplate }: { content?: UpcomingProgramsContent, template?: string }) {
    const { theme } = useTheme();
    const [data, setData] = useState<UpcomingProgramsContent | null>(content || null);
    const [template, setTemplate] = useState<string>(propTemplate || "default");
    const [loading, setLoading] = useState(!content);
    const [realPrograms, setRealPrograms] = useState<Program[]>([]);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                if (!content) {
                    // Fetch static content from CMS
                    const response = await cmsApi.getSectionContent("upcoming-programs");
                    const contentData = (response.content?.content && typeof response.content.content === 'object') 
                        ? response.content.content 
                        : response.content;
                    
                    setData(contentData);
                    setTemplate(response.template_id || "default");
                }

                // Fetch dynamic program data from API always to keep it fresh
                const programs = await programsApi.listPrograms();
                const mappedPrograms: Program[] = programs.map((p: RealProgram) => ({
                    id: p.id,
                    title: p.program_name,
                    date_text: p.date_range,
                    location: p.city,
                    image_url: "/event_workshop.png", // Fallback image
                    tags: [p.class_id],
                }));
                setRealPrograms(mappedPrograms);
            } catch (error) {
                console.error("Failed to fetch upcoming-programs content:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, [content]);

    if (loading && !content) return null;

    const activeTemplate = template === "default" ? theme : template;
    const displayData = data || content;

    const mergedData = displayData ? {
        ...displayData,
        programs: realPrograms.length > 0 ? realPrograms : (displayData.programs || [])
    } : null;

    return (
        <>
            {activeTemplate === "classic" ? (
                <UpcomingProgramsClassic content={mergedData} />
            ) : (
                <UpcomingProgramsModern content={mergedData} />
            )}
        </>
    );
}

