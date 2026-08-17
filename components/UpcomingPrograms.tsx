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

/**
 * Some sections are stored with an extra `{ template_id, content: { … } }` wrapper
 * around the real payload. The fetch path already unwrapped it; the props path (how
 * the home page supplies this section) did not, so every CMS value — title, subtitle
 * and the programme pictures — silently read as undefined.
 */
function unwrapContent(raw: unknown): UpcomingProgramsContent | null {
    if (!raw || typeof raw !== "object") return null;

    const inner = (raw as { content?: unknown }).content;
    if (inner && typeof inner === "object") return inner as UpcomingProgramsContent;

    return raw as UpcomingProgramsContent;
}

export default function UpcomingEvents({ content, template: propTemplate }: { content?: UpcomingProgramsContent, template?: string }) {
    const { theme } = useTheme();
    const [data, setData] = useState<UpcomingProgramsContent | null>(unwrapContent(content));
    const [template, setTemplate] = useState<string>(propTemplate || "default");
    const [loading, setLoading] = useState(!content);
    const [realPrograms, setRealPrograms] = useState<Program[]>([]);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                if (!content) {
                    // Fetch static content from CMS
                    const response = await cmsApi.getSectionContent("upcoming-programs");
                    // Null-safe: this endpoint answers 404 for a missing section, and
                    // reaching into `response.content` then threw before the programme
                    // list below could load at all.
                    setData(unwrapContent(response?.content ?? response));
                    setTemplate(response?.template_id || "default");
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
    const displayData = data || unwrapContent(content);

    /* This section is authored content, not a view of the Programs module: its cards
       carry their own title, date_text, tags, location and picture, all editable under
       Website -> upcoming-programs. The live programme list used to replace it whenever
       a single programme existed, which is why the authored dates and pictures never
       showed. The live list is now only a fallback for an empty section. */
    const cmsPrograms = displayData?.programs || [];

    const mergedData = displayData ? {
        ...displayData,
        programs: cmsPrograms.length > 0 ? cmsPrograms : realPrograms
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

