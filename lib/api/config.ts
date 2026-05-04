export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export const getFullUrl = (path: string) => {
    // If API_BASE_URL is empty, it will be a relative path
    // which the browser resolves to the current window.location.origin
    if (!API_BASE_URL && typeof window !== "undefined") {
        console.warn("NEXT_PUBLIC_API_URL is not defined. Falling back to relative path.");
    }
    return `${API_BASE_URL}${path}`;
};
