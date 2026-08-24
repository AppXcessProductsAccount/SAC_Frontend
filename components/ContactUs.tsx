"use client";

import { useState, useEffect } from "react";
import { cmsApi } from "@/lib/cms-api";
import ContactUsClassic from "./ContactUsClassic";

export default function ContactUs() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await cmsApi.getContactInfo();
                setData(res);
            } catch (error) {
                console.error("Failed to fetch contact info:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return null;

    const displayData = data || {
        title: "Connect with us",
        subtitle: "Have questions about our programs or centers? Reach out and find the stillness you've been searching for. Chat with us on social platforms.",
        email: "enquiry@selfawareness.com.sg",
        support_text: "24/7 Spiritual Support",
        location: "Self Awareness Centre HQ\n10 Anson Road, Singapore.",
        phone: "+65 6222 5115",
        website: "https://selfawareness.com.sg/",
        background_image_url: "/header_below.png",
        form_background_image_url: "/card_bg.png",
        malaysia_info: "Self Awareness Society, Malaysia Branches",
        singapore_info: "Self Awareness Society, Singapore Branches"
    };

    return <ContactUsClassic data={displayData} />;
}
