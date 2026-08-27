import type { ComponentType } from "react";
import { notFound } from "next/navigation";
import { getApiBaseUrl } from "@/lib/api/config";
import { routeKeyForSlug, type CmsRouteKey } from "@/lib/cms-pages";

import HomePage from "../page";
import AboutPage from "../about/page";
import ParanjothiPage from "../paranjothi/page";
import CommunityPage from "../community/page";
import ProgramsPage from "../programs/page";
import ContactPage from "../contact/page";
import PrivacyPolicyPage from "../privacy-policy/page";
import TermsOfServicePage from "../terms-of-service/page";

/**
 * Serves a CMS page that has been renamed.
 *
 * Renaming "Paranjothi" to "Our Spiritual Master" in the admin moves the page to
 * /our-spiritual-master, and this route renders it. The hand-built routes
 * (/paranjothi, /about, …) still exist and still work — a static route wins over a
 * dynamic segment in Next.js — so old links and bookmarks keep resolving.
 *
 * Each key renders the same component as its original route rather than a second
 * copy of the render logic, so the two URLs can never drift apart.
 */
const RENDERERS: Record<CmsRouteKey, ComponentType> = {
    home: HomePage,
    about: AboutPage,
    paranjothi: ParanjothiPage,
    community: CommunityPage,
    programs: ProgramsPage,
    contact: ContactPage,
    privacy: PrivacyPolicyPage,
    terms: TermsOfServicePage,
};

/* Resolved on the server so an unknown slug answers with a real 404 instead of a
   200 that turns into a not-found only once the browser has run. */
async function fetchPages() {
    try {
        const res = await fetch(`${getApiBaseUrl()}/api/cms/website`, { cache: "no-store" });
        if (!res.ok) return null;
        return await res.json();
    } catch {
        return null;
    }
}

export default async function CmsSlugPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const routeKey = routeKeyForSlug(await fetchPages(), slug);
    if (!routeKey) notFound();

    const Page = RENDERERS[routeKey];
    return <Page />;
}
