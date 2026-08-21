const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]", "::1"]);

const stripTrailingSlash = (url: string) => url.replace(/\/+$/, "");

/**
 * The browser blocks any http:// request made from an https:// page (mixed content),
 * so an API URL that was configured — or redirected — as http:// must be upgraded.
 * Loopback hosts are exempt: they are trustworthy origins and are never blocked.
 */
const upgradeInsecureUrl = (url: string) => {
    if (typeof window === "undefined") return url;
    if (window.location.protocol !== "https:") return url;
    if (!url.startsWith("http://")) return url;

    const rest = url.slice("http://".length);
    const host = rest.split("/")[0].split(":")[0];
    if (LOCAL_HOSTS.has(host)) return url;

    return `https://${rest}`;
};

export const getApiBaseUrl = () => {
    const envUrl = process.env.NEXT_PUBLIC_API_URL;
    if (envUrl && envUrl.trim().length > 0) {
        return upgradeInsecureUrl(stripTrailingSlash(envUrl.trim()));
    }

    if (typeof window !== "undefined") {
        return `${window.location.protocol}//${window.location.hostname}:8000`;
    }
    return "http://127.0.0.1:8000";
};

/** Absolute URL for an API path such as "/api/programs/". */
export const getFullUrl = (path: string) => {
    const base = getApiBaseUrl();
    if (!base && typeof window !== "undefined") {
        console.warn("NEXT_PUBLIC_API_URL is not defined. Falling back to relative path.");
    }
    return `${base}${path}`;
};

/**
 * Absolute URL for an image/file the backend returns as a relative path
 * (e.g. "/uploads/logo.png"). Values that are already absolute are passed
 * through, still protocol-corrected so they cannot break an https page.
 */
export const resolveMediaUrl = (url?: string | null) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return upgradeInsecureUrl(url);
    if (url.startsWith("/uploads/")) return getFullUrl(url);
    return url;
};
