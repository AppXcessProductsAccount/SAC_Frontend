"use client";

import { useState, useEffect } from "react";
import { cmsApi } from "@/lib/cms-api";
import { useTheme } from "./ThemeProvider";
import TestimonialsClassic from "./TestimonialsClassic";
import TestimonialsModern from "./TestimonialsModern";

export interface Testimonial {
    author_name: string;
    author_role: string;
    quote: string;
}

export interface TestimonialsContent {
    title: string;
    subtitle: string;
    testimonials: Testimonial[];
}

export default function Testimonials({ content, template: propTemplate }: { content?: TestimonialsContent, template?: string }) {
    const { theme } = useTheme();
    const [data, setData] = useState<TestimonialsContent | null>(content || null);
    const [template, setTemplate] = useState<string>(propTemplate || "default");
    const [loading, setLoading] = useState(!content);

    const defaultData: TestimonialsContent = {
        title: "Voices of Serenity",
        subtitle: "Practitioner Stories",
        testimonials: [
            {
                author_name: "John Doe",
                author_role: "London, UK",
                quote: "The 7 Day Transformational Journey completely shifted my perspective. I finally understood what it means to be truly at peace with myself.",
            },
            {
                author_name: "Amara Singh",
                author_role: "Singapore",
                quote: "Heart Centre Meditation helped me release emotional burdens I had been carrying for years. The Anahatha Chakra activation was a profound experience.",
            },
            {
                author_name: "Lee Wei",
                author_role: "Malaysia",
                quote: "Kundalini Yoga here is taught with such clarity and depth. My focus and mental clarity have improved tremendously since I started.",
            },
        ]
    };

    useEffect(() => {
        if (content) return; // Skip fetching if content is provided via props

        const fetchContent = async () => {
            try {
                const response = await cmsApi.getSectionContent("testimonials");
                const contentData = (response.content?.content && typeof response.content.content === 'object') 
                    ? response.content.content 
                    : response.content;
                
                setData(contentData);
                setTemplate(response.template_id || "default");
            } catch (error) {
                console.error("Failed to fetch testimonials content:", error);
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
        ? <TestimonialsClassic content={displayData} />
        : <TestimonialsModern content={displayData} />;
}
