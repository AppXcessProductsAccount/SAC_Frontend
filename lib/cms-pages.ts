/**
 * Binding between a Next.js route and the CMS page whose sections it renders.
 *
 * A CMS page's *name* is an editable label — an admin can rename "community" to
 * "Community & Events" at any time. Each route used to hard-code the name it
 * expected, so a rename silently detached the page and the site fell back to its
 * static placeholder copy (/community had no fallback at all and went blank).
 *
 * What never changes across a rename is the page's row id, because sections are
 * attached to their page by `page_id` foreign key — the content follows the page,
 * not its name. So resolution tries the name first (ids can differ between the
 * local and production databases) and falls back to the id (survives renames).
 */

export type CmsPage = { id: number; name: string };

export type CmsRouteKey = "home" | "about" | "paranjothi" | "community" | "programs" | "contact";

type CmsRoute = { id: number; route: string; aliases: string[] };

/**
 * `id` is the row id in the reference database. `aliases` are the names this page
 * has been known by — add to them rather than replacing, so older databases and
 * renamed-back pages keep resolving.
 */
export const CMS_ROUTES: Record<CmsRouteKey, CmsRoute> = {
    home: { id: 1, route: "/", aliases: ["home", "homepage", "landing", "main"] },
    about: { id: 2, route: "/about", aliases: ["about", "about us", "about_us"] },
    paranjothi: {
        id: 3,
        route: "/paranjothi",
        aliases: ["paranjothi", "gnanaguru paranjothi", "paranjothi subramaniam", "guru"],
    },
    community: { id: 4, route: "/community", aliases: ["community", "community events", "community_events"] },
    programs: { id: 5, route: "/programs", aliases: ["program", "programs", "our programs"] },
    contact: { id: 6, route: "/contact", aliases: ["contact", "contact us", "contact_us"] },
};

/** Case, spacing, underscore, hyphen and trailing-"page" insensitive. */
const normalize = (value: string) =>
    value
        .toLowerCase()
        .trim()
        .replace(/[\s_-]+/g, "")
        .replace(/page$/, "");

/** Names claimed by a route other than `key` — an id fallback must never steal one. */
const claimedByOtherRoute = (key: CmsRouteKey) => {
    const claimed = new Set<string>();
    for (const [otherKey, route] of Object.entries(CMS_ROUTES) as [CmsRouteKey, CmsRoute][]) {
        if (otherKey === key) continue;
        for (const alias of route.aliases) claimed.add(normalize(alias));
    }
    return claimed;
};

/**
 * Find the CMS page that backs a route. Returns null when nothing plausibly
 * matches, which leaves the caller on its static fallback content rather than
 * rendering some other page's sections.
 */
export function resolveCmsPage(pages: unknown, key: CmsRouteKey): CmsPage | null {
    if (!Array.isArray(pages)) return null;

    const target = CMS_ROUTES[key];
    const wanted = new Set(target.aliases.map(normalize));

    const isPage = (p: unknown): p is CmsPage =>
        !!p && typeof (p as CmsPage).id === "number" && typeof (p as CmsPage).name === "string";

    const candidates = pages.filter(isPage);

    const byName = candidates.find((p) => wanted.has(normalize(p.name)));
    if (byName) return byName;

    /* Renamed: fall back to the stable row id — but only if that row hasn't since
       become a different route's page, or /paranjothi would happily render whatever
       page 3 now holds. */
    const claimed = claimedByOtherRoute(key);
    const byId = candidates.find((p) => p.id === target.id);
    if (byId && !claimed.has(normalize(byId.name))) return byId;

    return null;
}

/** Which route a nav link points at, so its label can follow that page's name. */
export function routeKeyForUrl(url: unknown): CmsRouteKey | null {
    if (typeof url !== "string") return null;
    const clean = url.trim().toLowerCase().split("#")[0].replace(/\/+$/, "") || "/";

    for (const [key, route] of Object.entries(CMS_ROUTES) as [CmsRouteKey, CmsRoute][]) {
        if (route.route === clean) return key;
    }
    return null;
}

/**
 * The label a page should show to visitors.
 *
 * Renaming a page in the admin is meant to be visible on the site, so a renamed
 * page hands its name straight to the menu. A page still carrying one of its
 * stock names keeps the hand-written default instead — otherwise the menu would
 * regress to raw identifiers like "program" or "home".
 */
export function cmsPageLabel(pages: unknown, key: CmsRouteKey, fallback: string): string {
    const page = resolveCmsPage(pages, key);
    if (!page) return fallback;

    /* Collapse runs of spaces and tabs but keep newlines: the menu renders labels with
       `white-space: pre`, so a break belongs where someone typed one and nowhere else. */
    const pretty = page.name
        .trim()
        .replace(/[_-]+/g, " ")
        .replace(/[^\S\n]+/g, " ")
        .replace(/ ?\n ?/g, "\n")
        .replace(/\n{2,}/g, "\n");
    if (!pretty) return fallback;

    const stockName = CMS_ROUTES[key].aliases.some((alias) => normalize(alias) === normalize(pretty));
    return stockName ? fallback : pretty;
}

/** "Our Spiritual Master" -> "our-spiritual-master" */
export function slugify(name: string): string {
    return name
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "") // strip accents, so an accented name still slugifies
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

/**
 * The URL a page lives at.
 *
 * A renamed page moves to a URL built from its new name, served by the catch-all
 * `app/[slug]` route. An unrenamed page keeps its hand-built route, and home is
 * always "/" — no rename should push the site's front door to another address.
 */
export function cmsPageHref(pages: unknown, key: CmsRouteKey, fallback: string): string {
    if (key === "home") return fallback;

    const page = resolveCmsPage(pages, key);
    if (!page) return fallback;

    const stockName = CMS_ROUTES[key].aliases.some((alias) => normalize(alias) === normalize(page.name));
    if (stockName) return fallback;

    const slug = slugify(page.name);
    return slug ? `/${slug}` : fallback;
}

/** Which route a renamed-page URL belongs to, for `app/[slug]` to render. */
export function routeKeyForSlug(pages: unknown, slug: string): CmsRouteKey | null {
    const wanted = slugify(slug || "");
    if (!wanted) return null;

    for (const key of Object.keys(CMS_ROUTES) as CmsRouteKey[]) {
        const page = resolveCmsPage(pages, key);
        if (page && slugify(page.name) === wanted) return key;
    }
    return null;
}

/**
 * Point nav items at the CMS pages they represent — label and URL both, so a
 * rename shows up in the menu and moves the link with it. Anchors and links to
 * pages outside the CMS (membership, profile) pass through untouched.
 */
export function applyCmsPageBindings<T extends { label: string; url: string }>(items: T[], pages: unknown): T[] {
    if (!Array.isArray(items)) return items;

    return items.map((item) => {
        const key = routeKeyForUrl(item.url);
        if (!key) return item;

        const label = cmsPageLabel(pages, key, item.label);
        const url = cmsPageHref(pages, key, item.url);
        return label === item.label && url === item.url ? item : { ...item, label, url };
    });
}
