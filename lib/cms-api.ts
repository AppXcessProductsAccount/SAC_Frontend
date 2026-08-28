import { getApiBaseUrl } from "./api/config";
import { authHeaders } from "./api/token";

/* The public content route is /website/{page_id}/{section_id}/content, but every
   helper below knows only its section id. section_id is unique across the whole
   sections table, so the page it belongs to can be resolved once and reused: this
   builds a section -> page index on first use and caches the promise, so the
   lookup costs one round of requests per page load rather than one per section.

   Before this, getSectionContent called /website/{section_id}/content, which
   matches no route on the API. Every section 404'd, every component fell back to
   its hardcoded defaults, and nothing edited in the admin ever reached the site. */
let sectionPageIndex: Promise<Record<string, number>> | null = null;

const buildSectionPageIndex = async (): Promise<Record<string, number>> => {
    const index: Record<string, number> = {};
    const pages = await cmsApi.getPages();
    const lists = await Promise.all(
        (pages as any[]).map((page) => cmsApi.getPageSections(page.id))
    );
    for (const sections of lists) {
        for (const section of ((sections as any[]) ?? [])) {
            if (section?.section_id && typeof section.page_id === "number") {
                index[section.section_id] = section.page_id;
            }
        }
    }
    return index;
};

const getSectionPageIndex = () => {
    if (!sectionPageIndex) {
        sectionPageIndex = buildSectionPageIndex().catch((err) => {
            /* Never cache a failure: one blocked request would otherwise pin every
               section to its defaults for the rest of the page's life. */
            sectionPageIndex = null;
            throw err;
        });
    }
    return sectionPageIndex;
};

export const cmsApi = {
    // 1. Discovery: List Pages
    getPages: async () => {
        const res = await fetch(`${getApiBaseUrl()}/api/cms/website`, { cache: 'no-store' });
        if (!res.ok) throw new Error("Failed to fetch CMS pages");
        return await res.json();
    },

    // 2. Navigation: List Sections for a Page
    getPageSections: async (pageId: number) => {
        const res = await fetch(`${getApiBaseUrl()}/api/cms/website?page_id=${pageId}`, { cache: 'no-store' });
        if (!res.ok) {
            console.warn(`CMS page sections not found for page: ${pageId}`);
            return [];
        }
        return await res.json();
    },

    // 3. Content: Get Specific Section Data (Lazy Loading/Refresh)
    getSpecificSection: async (pageId: number, sectionId: string) => {
        const res = await fetch(`${getApiBaseUrl()}/api/cms/website/${pageId}/${sectionId}/content`, { cache: 'no-store' });
        if (!res.ok) {
            console.warn(`CMS section detail not found: ${sectionId}`);
            return null;
        }
        const data = await res.json();
        return data?.content || data;
    },

    // Generic Section Content Fetcher (Legacy/Backward Compatibility)
    getSectionContent: async (sectionId: string) => {
        let pageId: number | undefined;
        try {
            pageId = (await getSectionPageIndex())[sectionId];
        } catch {
            console.warn(`CMS index unavailable, section skipped: ${sectionId}`);
            return null;
        }
        if (pageId === undefined) {
            console.warn(`CMS section not found: ${sectionId}`);
            return null;
        }
        return await cmsApi.getSpecificSection(pageId, sectionId);
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
        const res = await fetch(`${getApiBaseUrl()}/api/cms/hero`, {
            method: "POST",
            headers: { "Content-Type": "application/json", ...authHeaders() },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed to update hero");
        return res.json();
    },

    updateNavigation: async (data: any) => {
        const res = await fetch(`${getApiBaseUrl()}/api/cms/navigation`, {
            method: "POST",
            headers: { "Content-Type": "application/json", ...authHeaders() },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed to update navigation");
        return res.json();
    },

    // --- Admin/Mutation Routes ---
    
    updateSection: async (sectionId: string, data: any) => {
        const res = await fetch(`${getApiBaseUrl()}/api/cms/admin/sections/${sectionId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", ...authHeaders() },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error(`Failed to update section: ${sectionId}`);
        return res.json();
    },

    // Events Management
    createEvent: async (data: any) => {
        const res = await fetch(`${getApiBaseUrl()}/api/cms/admin/events`, {
            method: "POST",
            headers: { "Content-Type": "application/json", ...authHeaders() },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed to create event");
        return res.json();
    },
    updateEvent: async (id: number | string, data: any) => {
        const res = await fetch(`${getApiBaseUrl()}/api/cms/admin/events/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", ...authHeaders() },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed to update event");
        return res.json();
    },
    deleteEvent: async (id: number | string) => {
        const res = await fetch(`${getApiBaseUrl()}/api/cms/admin/events/${id}`, {
            method: "DELETE",
            headers: authHeaders(),
        });
        if (!res.ok) throw new Error("Failed to delete event");
        return res.json();
    },

    // Testimonials Management
    createTestimonial: async (data: any) => {
        const res = await fetch(`${getApiBaseUrl()}/api/cms/admin/testimonials`, {
            method: "POST",
            headers: { "Content-Type": "application/json", ...authHeaders() },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed to create testimonial");
        return res.json();
    },
    updateTestimonial: async (id: number | string, data: any) => {
        const res = await fetch(`${getApiBaseUrl()}/api/cms/admin/testimonials/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", ...authHeaders() },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed to update testimonial");
        return res.json();
    },
    deleteTestimonial: async (id: number | string) => {
        const res = await fetch(`${getApiBaseUrl()}/api/cms/admin/testimonials/${id}`, {
            method: "DELETE",
            headers: authHeaders(),
        });
        if (!res.ok) throw new Error("Failed to delete testimonial");
        return res.json();
    },

    // Upload
    uploadFile: async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch(`${getApiBaseUrl()}/api/upload`, {
            method: "POST",
            headers: authHeaders(),
            body: formData,
        });
        if (!res.ok) throw new Error("Failed to upload file");
        return res.json();
    },

    // Generic Section List
    getSectionList: async () => {
        const res = await fetch(`${getApiBaseUrl()}/api/cms/website/section-list`, { cache: 'no-store' });
        if (!res.ok) throw new Error("Failed to fetch section list");
        return res.json();
    },

    // Contact Form Submission
    submitContactForm: async (data: any) => {
        const res = await fetch(`${getApiBaseUrl()}/api/contacts`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed to submit contact form");
        return await res.json();
    },
};
