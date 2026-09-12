"use client";

import { useState, useEffect } from "react";
import { cmsApi } from "@/lib/cms-api";
import TestimonialsClassic from "./TestimonialsClassic";

export interface Testimonial {
    author_name: string;
    author_role: string;
    quote: string;
}

export interface TestimonialsContent {
    /** Optional CMS override for the section backdrop; falls back to the marble plate. */
    background_image_url?: string;
    title: string;
    subtitle: string;
    testimonials: Testimonial[];
}

export default function Testimonials({ content }: { content?: TestimonialsContent, template?: string }) {
    const [data, setData] = useState<TestimonialsContent | null>(content || null);
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
                // response is null when the section isn't published in the CMS; the
                // optional chaining keeps that from throwing so the defaults show.
                const contentData = (response?.content?.content && typeof response.content.content === 'object')
                    ? response.content.content
                    : response?.content ?? null;

                setData(contentData ?? defaultData);
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

    return <TestimonialsClassic content={displayData} />;
}
