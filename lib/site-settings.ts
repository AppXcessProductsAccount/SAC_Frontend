import { getApiBaseUrl } from "./api/config";

/** Shared so the navbar link and the page route can never drift apart. */
export const GRAND_MEDITATION_PATH = "/events/grand-group-meditation";
export const GRAND_MEDITATION_TITLE = "Grand Group Meditation with our Guru";
/** Shorter label for the compact nav dropdown. */
export const GRAND_MEDITATION_NAV_LABEL = "Grand Group Meditation";

/**
 * The public, unauthenticated slice of the site settings the website needs
 * before anyone signs in. Only the fields the front end actually reads are typed
 * here; the API may return more.
 */
export interface EventMaster {
    name: string;
    image?: string | null;
}

export interface GrandMeditationContent {
    guru_name: string;
    guru_image?: string | null;
    masters: EventMaster[];
    /** Local wall-time "YYYY-MM-DDTHH:MM" in the venue's timezone (SGT). */
    starts_at: string;
    duration_hours: number;
    venue_name: string;
    venue_subtitle: string;
    venue_address: string;
    /** Short line shown in the scrolling announcement bar on the landing page. */
    announcement_text: string;
}

/** Used when the admin hasn't customised the event yet (content is null). */
export const DEFAULT_GRAND_MEDITATION_CONTENT: GrandMeditationContent = {
    guru_name: "Gnanaguru Paranjothi Subramaniam",
    guru_image: null, // falls back to the bundled portrait
    masters: [
        { name: "Dr William Brugh Joy", image: null },
        { name: "Gnanavallal Paranjothi Mahan", image: null },
        { name: "Gnanaguru Paranjothi Sivasankaran", image: null },
    ],
    starts_at: "2027-01-09T15:00",
    duration_hours: 3,
    venue_name: "Kensington Ballroom",
    venue_subtitle: "Serangoon Gardens Country Club",
    venue_address: "22 Kensington Park Road, Singapore 557271",
    announcement_text: "Grand Group Meditation with our Guru · 9 January 2027 · Kensington Ballroom, Serangoon Gardens Country Club",
};

/** Merges stored content over the defaults so callers always get every field. */
export const mergeGrandMeditationContent = (
    raw?: Partial<GrandMeditationContent> | null
): GrandMeditationContent => {
    const base = DEFAULT_GRAND_MEDITATION_CONTENT;
    const masters = base.masters.map((def, i) => ({
        name: raw?.masters?.[i]?.name?.trim() || def.name,
        image: raw?.masters?.[i]?.image ?? def.image,
    }));
    return {
        guru_name: raw?.guru_name?.trim() || base.guru_name,
        guru_image: raw?.guru_image ?? base.guru_image,
        masters,
        starts_at: raw?.starts_at?.trim() || base.starts_at,
        duration_hours: Number(raw?.duration_hours) > 0 ? Number(raw?.duration_hours) : base.duration_hours,
        venue_name: raw?.venue_name?.trim() || base.venue_name,
        venue_subtitle: raw?.venue_subtitle?.trim() || base.venue_subtitle,
        venue_address: raw?.venue_address?.trim() || base.venue_address,
        announcement_text: raw?.announcement_text?.trim() || base.announcement_text,
    };
};

export interface PublicSiteSettings {
    event_grand_meditation_enabled: boolean;
    event_announcement_enabled?: boolean;
    event_grand_meditation_content?: GrandMeditationContent | null;
    organisation_name?: string | null;
    default_currency?: string;
    timezone?: string;
}

const DEFAULTS: PublicSiteSettings = {
    // A settings outage must not hide a page that is meant to be live, so the
    // feature defaults to on — the same default the database column carries.
    event_grand_meditation_enabled: true,
};

let cache: Promise<PublicSiteSettings> | null = null;

/**
 * Fetches the public settings once per page load and caches the promise, so the
 * navbar and any gated page share a single request rather than firing one each.
 * A failure is never cached: the next caller retries instead of being pinned to
 * the fallback for the life of the page.
 */
export const getPublicSettings = (): Promise<PublicSiteSettings> => {
    if (!cache) {
        cache = fetch(`${getApiBaseUrl()}/api/settings/public`, { cache: "no-store" })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to load public settings");
                return res.json();
            })
            .then((data) => ({ ...DEFAULTS, ...data }))
            .catch((err) => {
                cache = null;
                throw err;
            });
    }
    return cache;
};
