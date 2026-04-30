"use client";

import { useState, useEffect } from "react";
import { useTheme } from "./ThemeProvider";
import FAQClassic from "./FAQClassic";
import FAQModern from "./FAQModern";
import { cmsApi } from "@/lib/cms-api";

export interface FAQItem {
    question: string;
    answer: string;
}

export interface FAQContent {
    title: string;
    subtitle: string;
    faqs: FAQItem[];
}

export default function FAQ({ content, template: propTemplate }: { content?: FAQContent, template?: string }) {
    const { theme } = useTheme();
    const [data, setData] = useState<FAQContent | null>(content || null);
    const [template, setTemplate] = useState<string>(propTemplate || "default");
    const [loading, setLoading] = useState(!content);

    const defaultData: FAQContent = {
        title: "Frequently Asked Questions",
        subtitle: "GET ANSWERS",
        faqs: [
            {
                question: "What is the 7 Day Transformational Journey?",
                answer: "A comprehensive program designed to guide individuals through deep self-discovery and spiritual growth using meditation and wisdom teachings."
            },
            {
                question: "Can beginners join these programs?",
                answer: "Absolutely! Our programs are designed for all levels, from beginners looking to start their meditation journey to advanced practitioners seeking deeper insights."
            },
            {
                question: "Is there a free trial or preview available?",
                answer: "Yes, we offer a Free Online Preview session where you can experience our teachings and meditation techniques before committing to a full program."
            },
            {
                question: "Where are the centers located?",
                answer: "We have our HQ in Singapore and multiple branches across Malaysia. You can find detailed address information in our Contact section."
            },
            {
                question: "How do I start with Kundalini Yoga?",
                answer: "You can sign up for our introductory Kundalini Yoga workshop which focuses on the Ajna Chakra and awakening the vital energy within."
            }
        ]
    };

    useEffect(() => {
        if (content) return; // Skip fetching if content is provided via props

        const fetchContent = async () => {
            try {
                const response = await cmsApi.getSectionContent("faq");
                const contentData = (response.content?.content && typeof response.content.content === 'object') 
                    ? response.content.content 
                    : response.content;
                
                setData(contentData);
                setTemplate(response.template_id || "default");
            } catch (error) {
                console.error("Failed to fetch FAQ content:", error);
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
        ? <FAQClassic data={displayData} />
        : <FAQModern data={displayData} />;
}
