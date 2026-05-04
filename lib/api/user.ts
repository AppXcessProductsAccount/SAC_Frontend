import { AuthUser } from "./auth";

import { API_BASE_URL as API_URL } from "./config";

export interface UserUpdatePayload {
    full_name?: string;
    nickname?: string;
    email?: string;
    phone_number?: string;
    gender?: string;
    dob?: string;
    occupation?: string;
    address?: string;
    avatar?: File;
}

export const userApi = {
    getMe: async (token: string): Promise<AuthUser> => {
        const res = await fetch(`${API_URL}/api/user/me`, {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || "Failed to fetch profile");
        return data;
    },

    updateMe: async (token: string, payload: UserUpdatePayload): Promise<AuthUser> => {
        const formData = new FormData();
        if (payload.full_name) formData.append("full_name", payload.full_name);
        if (payload.nickname) formData.append("nickname", payload.nickname);
        if (payload.email) formData.append("email", payload.email);
        if (payload.phone_number) formData.append("phone_number", payload.phone_number);
        if (payload.gender) formData.append("gender", payload.gender);
        if (payload.dob) formData.append("dob", payload.dob);
        if (payload.occupation) formData.append("occupation", payload.occupation);
        if (payload.address) formData.append("address", payload.address);
        if (payload.avatar) formData.append("avatar", payload.avatar);

        const res = await fetch(`${API_URL}/api/user/me`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
            body: formData,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || "Failed to update profile");
        return data;
    },
};
