import { API_BASE_URL as API_URL } from "./api/config";

export const cmsApi = {
    // 1. Discovery: List Pages
    getPages: async () => {
        const res = await fetch(`${API_URL}/api/cms/website`, { cache: 'no-store' });
        if (!res.ok) throw new Error("Failed to fetch CMS pages");
        return await res.json();
    },

    // 2. Navigation: List Sections for a Page
    getPageSections: async (pageId: number) => {
        const res = await fetch(`${API_URL}/api/cms/website?page_id=${pageId}`, { cache: 'no-store' });
        if (!res.ok) {
            console.warn(`CMS page sections not found for page: ${pageId}`);
            return [];
        }
        return await res.json();
    },

    // 3. Content: Get Specific Section Data (Lazy Loading/Refresh)
    getSpecificSection: async (pageId: number, sectionId: string) => {
        const res = await fetch(`${API_URL}/api/cms/website/${pageId}/${sectionId}/content`, { cache: 'no-store' });
        if (!res.ok) {
            console.warn(`CMS section detail not found: ${sectionId}`);
            return null;
        }
        const data = await res.json();
        return data?.content || data;
    },

    // Generic Section Content Fetcher (Legacy/Backward Compatibility)
    getSectionContent: async (sectionId: string) => {
        const res = await fetch(`${API_URL}/api/cms/website/${sectionId}/content`, { cache: 'no-store' });
        if (!res.ok) {
            console.warn(`CMS section not found: ${sectionId}`);
            return null;
        }
        const data = await res.json();
        // The actual content is usually nested in data.content
        return (data && data.content) ? data.content : data;
    },

    // Site Settings
    getSettings: async () => {
        return await cmsApi.getSectionContent("settings");
    },

    // Navigation
    getNavigation: async () => {
        return await cmsApi.getSectionContent("navigation");
    },

    // Hero Section
    getHero: async () => {
        return await cmsApi.getSectionContent("hero");
    },

    // About Section
    getAbout: async () => {
        return await cmsApi.getSectionContent("about");
    },

    // Programs Section (CMS static content)
    getPrograms: async () => {
        return await cmsApi.getSectionContent("programs");
    },

    // Events Section
    getEvents: async () => {
        return await cmsApi.getSectionContent("events");
    },

    // Testimonials Section
    getTestimonials: async () => {
        return await cmsApi.getSectionContent("testimonials");
    },

    // Features Section
    getFeatures: async () => {
        return await cmsApi.getSectionContent("features");
    },

    // Products Section
    getProducts: async () => {
        return await cmsApi.getSectionContent("products");
    },

    // Blog Section
    getBlogPosts: async () => {
        return await cmsApi.getSectionContent("blog");
    },

    // Statistics Section
    getStatistics: async () => {
        return await cmsApi.getSectionContent("statistics");
    },

    // CTA Section
    getCTA: async () => {
        return await cmsApi.getSectionContent("cta");
    },

    // Contact Section
    getContactInfo: async () => {
        return await cmsApi.getSectionContent("contact");
    },

    // Footer Section
    getFooterInfo: async () => {
        return await cmsApi.getSectionContent("footer");
    },

    // Enlightenment Section
    getEnlightenment: async () => {
        return await cmsApi.getSectionContent("enlightenment");
    },

    updateEnlightenment: async (data: any) => {
        return await cmsApi.updateSection("enlightenment", { content: data });
    },

    // Mutation helpers for specific sections
    updatePrograms: async (data: any) => {
        return await cmsApi.updateSection("programs", { content: data });
    },

    updateContactInfo: async (data: any) => {
        return await cmsApi.updateSection("contact", { content: data });
    },

    updateFooterInfo: async (data: any) => {
        return await cmsApi.updateSection("footer", { content: data });
    },

    // Hero & Navigation (using their dedicated endpoints)
    updateHero: async (data: any) => {
        const res = await fetch(`${API_URL}/api/cms/hero`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed to update hero");
        return res.json();
    },

    updateNavigation: async (data: any) => {
        const res = await fetch(`${API_URL}/api/cms/navigation`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed to update navigation");
        return res.json();
    },

    // --- Admin/Mutation Routes ---
    
    updateSection: async (sectionId: string, data: any) => {
        const res = await fetch(`${API_URL}/api/cms/admin/sections/${sectionId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error(`Failed to update section: ${sectionId}`);
        return res.json();
    },

    // Events Management
    createEvent: async (data: any) => {
        const res = await fetch(`${API_URL}/api/cms/admin/events`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed to create event");
        return res.json();
    },
    updateEvent: async (id: number | string, data: any) => {
        const res = await fetch(`${API_URL}/api/cms/admin/events/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed to update event");
        return res.json();
    },
    deleteEvent: async (id: number | string) => {
        const res = await fetch(`${API_URL}/api/cms/admin/events/${id}`, {
            method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to delete event");
        return res.json();
    },

    // Testimonials Management
    createTestimonial: async (data: any) => {
        const res = await fetch(`${API_URL}/api/cms/admin/testimonials`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed to create testimonial");
        return res.json();
    },
    updateTestimonial: async (id: number | string, data: any) => {
        const res = await fetch(`${API_URL}/api/cms/admin/testimonials/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed to update testimonial");
        return res.json();
    },
    deleteTestimonial: async (id: number | string) => {
        const res = await fetch(`${API_URL}/api/cms/admin/testimonials/${id}`, {
            method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to delete testimonial");
        return res.json();
    },

    // Upload
    uploadFile: async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch(`${API_URL}/api/upload`, {
            method: "POST",
            body: formData,
        });
        if (!res.ok) throw new Error("Failed to upload file");
        return res.json();
    },

    // Generic Section List
    getSectionList: async () => {
        const res = await fetch(`${API_URL}/api/cms/website/section-list`, { cache: 'no-store' });
        if (!res.ok) throw new Error("Failed to fetch section list");
        return res.json();
    },

    // Contact Form Submission
    submitContactForm: async (data: any) => {
        const res = await fetch(`${API_URL}/api/contacts`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed to submit contact form");
        return await res.json();
    },
};
