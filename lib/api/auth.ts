import { getApiBaseUrl } from "./config";

export interface AuthUser {
    id: string;
    full_name: string;
    nickname?: string | null;
    email: string;
    phone_number: string;
    role: string;
    gender?: string | null;
    dob?: string | null;
    age?: number | null;
    occupation?: string | null;
    address?: string | null;
    is_active: boolean;
    is_verified: boolean;
    profile_image_url?: string | null;
    created_at: string;
}

export interface AuthTokens {
    access_token: string;
    refresh_token: string;
    token_type: string;
}

export interface LoginResponse {
    message: string;
    user: AuthUser;
    tokens: AuthTokens;
}

export const authApi = {
    sendOtp: async (email: string) => {
        const res = await fetch(`${getApiBaseUrl()}/api/auth/send-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to send OTP");
        return data;
    },

    verifyOtp: async (email: string, otp: string): Promise<LoginResponse> => {
        const res = await fetch(`${getApiBaseUrl()}/api/auth/verify-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, otp }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to verify OTP");
        return data;
    },
};

export { useAuth } from "@/hooks/useAuth";
