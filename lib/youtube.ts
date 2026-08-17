/**
 * YouTube URL normalisation.
 *
 * The CMS fields ask for an "embed URL", but editors naturally paste whatever the
 * browser address bar / the Share button gives them:
 *   https://www.youtube.com/watch?v=ID   or   https://youtu.be/ID?si=...
 * Those pages send `X-Frame-Options: sameorigin`, so the browser refuses to render
 * them in an <iframe> ("Refused to display 'https://www.youtube.com/' in a frame")
 * and the video block comes up blank in production.
 *
 * Everything that frames a CMS-supplied video runs the value through
 * `toYouTubeEmbedUrl` so any of those shapes turns into
 * https://www.youtube.com/embed/ID — which is the only one YouTube allows framing.
 */

// Deliberately youtube.com and not youtube-nocookie.com: it is what the site has
// always framed, so any CSP `frame-src` in front of production already allows it.
const EMBED_BASE = "https://www.youtube.com/embed";

/** A YouTube video id: 11 chars of the URL-safe base64 alphabet. */
const VIDEO_ID = /^[\w-]{11}$/;

function isVideoId(value: string): boolean {
    return VIDEO_ID.test(value);
}

/** `1h2m3s`, `90s` or plain `90` -> seconds. Returns null when unparseable. */
function toSeconds(raw: string | null): number | null {
    if (!raw) return null;
    if (/^\d+$/.test(raw)) return parseInt(raw, 10);
    const m = raw.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/i);
    if (!m || (!m[1] && !m[2] && !m[3])) return null;
    return (+(m[1] || 0)) * 3600 + (+(m[2] || 0)) * 60 + (+(m[3] || 0));
}

/**
 * Turn any YouTube link (watch, youtu.be, shorts, live, playlist, bare id, or an
 * already-correct embed URL) into an embeddable one.
 *
 * Returns "" when the value is empty or isn't recognisably YouTube, so callers can
 * render a placeholder instead of an iframe that is guaranteed to be refused.
 */
export function toYouTubeEmbedUrl(input?: string | null): string {
    const raw = (input || "").trim();
    if (!raw) return "";

    // Bare video id straight from the CMS field.
    if (isVideoId(raw)) return `${EMBED_BASE}/${raw}`;

    let url: URL;
    try {
        url = new URL(raw.startsWith("//") ? `https:${raw}` : raw, "https://www.youtube.com");
    } catch {
        return "";
    }

    const host = url.hostname.replace(/^www\./, "").toLowerCase();
    const isYouTube =
        host === "youtube.com" ||
        host === "m.youtube.com" ||
        host === "music.youtube.com" ||
        host === "youtube-nocookie.com" ||
        host === "youtu.be";
    if (!isYouTube) return "";

    const segments = url.pathname.split("/").filter(Boolean);
    const params = url.searchParams;

    let id = "";
    let playlist = params.get("list") || "";

    if (host === "youtu.be") {
        id = segments[0] || "";
    } else if (segments[0] === "embed" || segments[0] === "shorts" || segments[0] === "live" || segments[0] === "v") {
        id = segments[1] || "";
        // /embed/videoseries?list=... is a playlist embed with no single video id.
        if (id === "videoseries") id = "";
    } else if (segments[0] === "watch" || segments.length === 0) {
        id = params.get("v") || "";
    } else if (segments[0] === "playlist") {
        id = "";
    }

    if (!id && !playlist) return "";
    if (id && !isVideoId(id)) return "";

    const out = new URL(id ? `${EMBED_BASE}/${id}` : `${EMBED_BASE}/videoseries`);
    if (playlist) out.searchParams.set("list", playlist);

    // Carry over the handful of params that are meaningful on an embed.
    const start = toSeconds(params.get("t") || params.get("start"));
    if (start) out.searchParams.set("start", String(start));
    for (const key of ["rel", "loop", "mute", "controls", "modestbranding", "autoplay"]) {
        const value = params.get(key);
        if (value !== null) out.searchParams.set(key, value);
    }

    return out.toString();
}

/**
 * Append query params to an embed URL without the `?a=1?b=2` breakage you get from
 * naive string concatenation (share links often already carry a query string).
 */
export function withEmbedParams(embedUrl: string, params: Record<string, string | number | boolean>): string {
    if (!embedUrl) return "";
    try {
        const url = new URL(embedUrl);
        for (const [key, value] of Object.entries(params)) {
            url.searchParams.set(key, String(value));
        }
        return url.toString();
    } catch {
        return embedUrl;
    }
}
