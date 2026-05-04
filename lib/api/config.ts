export const getApiBaseUrl = () => {
    const envUrl = process.env.NEXT_PUBLIC_API_URL;
    if (envUrl && envUrl.trim().length > 0) return envUrl;

    if (typeof window !== "undefined") {
        return `${window.location.protocol}//${window.location.hostname}:8000`;
    }
    return "http://127.0.0.1:8000"; 
};

export const API_BASE_URL = getApiBaseUrl();

export const getFullUrl = (path: string) => {
    // If API_BASE_URL is empty, it will be a relative path
    // which the browser resolves to the current window.location.origin
    if (!API_BASE_URL && typeof window !== "undefined") {
        console.warn("NEXT_PUBLIC_API_URL is not defined. Falling back to relative path.");
    }
    return `${API_BASE_URL}${path}`;
};
