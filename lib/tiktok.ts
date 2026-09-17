/**
 * TikTok URL normalisation.
 *
 * Editors paste whatever the Share button or address bar gives them:
 *   https://www.tiktok.com/@user/video/7412345678901234567
 *   https://www.tiktok.com/embed/v2/7412345678901234567
 *   7412345678901234567           (bare numeric id)
 *
 * TikTok frames only its official player URL, https://www.tiktok.com/embed/v2/ID,
 * so everything that embeds a CMS-supplied TikTok runs the value through
 * `toTikTokEmbedUrl`. Short links (vt.tiktok.com/…) can't be resolved client-side
 * without following a redirect, so they return "" and the caller skips them.
 */
const EMBED_BASE = "https://www.tiktok.com/embed/v2";
const VIDEO_ID = /^\d{6,25}$/;

/** Pull the numeric video id out of any TikTok link, or "" if not found. */
export function tikTokVideoId(input?: string | null): string {
    const raw = (input || "").trim();
    if (!raw) return "";
    if (VIDEO_ID.test(raw)) return raw;

    let url: URL;
    try {
        url = new URL(raw.startsWith("//") ? `https:${raw}` : raw, "https://www.tiktok.com");
    } catch {
        return "";
    }
    const host = url.hostname.replace(/^www\./, "").toLowerCase();
    if (host !== "tiktok.com" && host !== "m.tiktok.com") return "";

    const segments = url.pathname.split("/").filter(Boolean);
    // .../video/ID  or  /embed/v2/ID  or  /embed/ID
    const videoIdx = segments.indexOf("video");
    if (videoIdx !== -1 && segments[videoIdx + 1]) return segments[videoIdx + 1].split("?")[0];
    if (segments[0] === "embed") {
        const last = segments[segments.length - 1];
        if (VIDEO_ID.test(last)) return last;
    }
    return "";
}

/** Embeddable TikTok player URL, or "" when the input isn't a recognisable video. */
export function toTikTokEmbedUrl(input?: string | null): string {
    const id = tikTokVideoId(input);
    return id ? `${EMBED_BASE}/${id}` : "";
}
