"use client";

import { useState, useEffect } from "react";
import { cmsApi } from "@/lib/cms-api";
import { useTheme } from "./ThemeProvider";
import EnlightenmentClassic from "./EnlightenmentClassic";
import EnlightenmentModern from "./EnlightenmentModern";
import { getFullUrl } from "@/lib/api/config";

export interface EnlightenmentContent {
    title: string;
    content: string;
    video_url: string;
    founder_name: string;
    founder_role: string;
    background_image_url?: string;
}

export default function Enlightenment({ content, template: propTemplate }: { content?: EnlightenmentContent, template?: string }) {
    const { theme } = useTheme();
    const [data, setData] = useState<EnlightenmentContent | null>(content || null);
    const [template, setTemplate] = useState<string>(propTemplate || "default");
    const [loading, setLoading] = useState(!content);

    const defaultData: EnlightenmentContent = {
        title: "Your Life's Destiny is\nin your Hands!",
        content: "Experience the profound wisdom of Guru Paranjothi Subramaniam as he reveals how you can shape your own destiny through the power of self-awareness and meditation. Enlightenment is the ultimate freedom from emotional attachments.",
        video_url: "https://www.youtube.com/embed/sGtx4XfL76I",
        founder_name: "Yogi Dr. Pradeep Ullal",
        founder_role: "Spiritual Scientist"
    };

    useEffect(() => {
        if (content) return; // Skip fetching if content is provided via props

        const fetchContent = async () => {
            try {
                const res = await fetch(getFullUrl("/api/cms/website/enlightenment/content"), { cache: 'no-store' });
                if (!res.ok) throw new Error("Failed to fetch");
                const sectionData = await res.json();
                
                setData(sectionData.content);
                setTemplate(sectionData.template_id || "default");
            } catch (error) {
                console.error("Failed to fetch enlightenment content:", error);
                setData(defaultData);
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, [content]);

    if (loading && !content) return null;

    const displayData = data || content || defaultData;
    const activeTemplate = template === "default" ? theme : template;

    return activeTemplate === 'classic' 
        ? <EnlightenmentClassic data={displayData} />
        : <EnlightenmentModern data={displayData} />;
}
