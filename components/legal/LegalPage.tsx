"use client";

import { useEffect, useState } from "react";
import { cmsApi } from "@/lib/cms-api";
import { resolveCmsPage, type CmsRouteKey } from "@/lib/cms-pages";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/**
 * The shell both legal pages are rendered in.
 *
 * Privacy Policy and Terms of Service differ only in their words, so they share
 * one renderer: a change to the layout, the typography or the print styling
 * cannot land on one page and miss the other.
 *
 * Content comes from the CMS — each page is a `cms_pages` row with a single
 * section — so an admin edits these in the same Sections editor as every other
 * page, including adding and removing clauses. The `fallback` passed in is the
 * same text the database is seeded with, so a site whose backend is unreachable,
 * or one deployed before the seed ran, still serves a complete document instead
 * of an empty page. A legal page that renders blank is worse than a slightly
 * out-of-date one.
 */

export interface LegalClause {
    heading: string;
    body: string;
}

export interface LegalContent {
    title: string;
    last_updated: string;
    intro: string;
    clauses: LegalClause[];
}

interface Props {
    routeKey: CmsRouteKey;
    /** `sections.section_id` for this page's single content section. */
    sectionId: string;
    fallback: LegalContent;
}

/** Reads the CMS payload defensively — every field is admin-editable and may be
 *  missing, renamed or left empty, and none of that should blank the page. */
function normalise(raw: unknown, fallback: LegalContent): LegalContent {
    if (!raw || typeof raw !== "object") return fallback;
    const data = raw as Record<string, unknown>;

    const text = (value: unknown, or: string) =>
        typeof value === "string" && value.trim() ? value : or;

    const clauses = Array.isArray(data.clauses)
        ? (data.clauses as unknown[])
              .map((item) => {
                  const clause = (item ?? {}) as Record<string, unknown>;
                  return {
                      heading: text(clause.heading, ""),
                      body: text(clause.body, ""),
                  };
              })
              // An admin who clicks "+ Add Item" and saves before typing leaves a
              // blank pair behind; it should not print as an empty numbered clause.
              .filter((clause) => clause.heading || clause.body)
        : [];

    return {
        title: text(data.title, fallback.title),
        last_updated: text(data.last_updated, fallback.last_updated),
        intro: text(data.intro, fallback.intro),
        clauses: clauses.length ? clauses : fallback.clauses,
    };
}

export default function LegalPage({ routeKey, sectionId, fallback }: Props) {
    const [content, setContent] = useState<LegalContent>(fallback);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            try {
                const pages = await cmsApi.getPages();
                const page = resolveCmsPage(pages, routeKey);
                if (!page) return;

                const sections = await cmsApi.getPageSections(page.id);
                if (!Array.isArray(sections) || sections.length === 0) return;

                /* Prefer the section this page was seeded with; fall back to the
                   page's only section, so renaming the section id in the admin
                   does not silently drop the page back to its static copy. */
                const target =
                    sections.find((s: { section_id?: string }) => s.section_id === sectionId) ??
                    (sections.length === 1 ? sections[0] : null);
                if (!target?.section_id) return;

                const detail = await cmsApi.getSpecificSection(page.id, target.section_id);
                if (!cancelled && detail) setContent(normalise(detail, fallback));
            } catch (error) {
                // Keep the fallback on screen — this page must always say something.
                console.error(`Failed to load ${routeKey} content:`, error);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        load();
        return () => {
            cancelled = true;
        };
    }, [routeKey, sectionId, fallback]);

    return (
        <main className="min-h-screen text-[#1b1b2b] selection:bg-[#101848]/10 font-sans">
            <Navbar />

            {/* Clears the pinned header, whose height the layout publishes as --nav-h. */}
            <section className="pt-[calc(var(--nav-h,80px)+3rem)] pb-16 px-5 sm:px-8">
                <div className="max-w-3xl mx-auto">
                    <header className="border-b border-[#101848]/10 pb-8 mb-10">
                        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#101848] leading-tight">
                            {content.title}
                        </h1>
                        <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.2em] text-[#101848]/40">
                            Last updated: {content.last_updated}
                        </p>
                    </header>

                    {content.intro && (
                        <p className="text-base sm:text-lg leading-relaxed text-[#1b1b2b]/80 whitespace-pre-line mb-12">
                            {content.intro}
                        </p>
                    )}

                    <div className="space-y-10">
                        {content.clauses.map((clause, index) => (
                            <article key={`${clause.heading}-${index}`}>
                                {clause.heading && (
                                    <h2 className="font-serif text-xl sm:text-2xl text-[#101848] mb-3">
                                        <span className="text-[#101848]/30 mr-2 tabular-nums">{index + 1}.</span>
                                        {clause.heading}
                                    </h2>
                                )}
                                {/* `whitespace-pre-line` because the admin editor tells
                                    the author their line breaks are kept. */}
                                {clause.body && (
                                    <p className="text-sm sm:text-base leading-relaxed text-[#1b1b2b]/75 whitespace-pre-line">
                                        {clause.body}
                                    </p>
                                )}
                            </article>
                        ))}
                    </div>

                    {loading && (
                        <p className="mt-12 text-xs text-[#101848]/30 italic">Checking for updates…</p>
                    )}
                </div>
            </section>

            <Footer />
        </main>
    );
}
