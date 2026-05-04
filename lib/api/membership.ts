import { getApiBaseUrl } from "./config";

export interface MembershipType {
    name: string;
    price: number;
    description?: string;
    allow_donation?: boolean;
}

export interface CustomQuestion {
    question: string;
    type: string;
    options?: string[];
}

export interface Membership {
    id: string;
    name: string;
    is_active: boolean;
    attended_programs_options: string[];
    membership_types: MembershipType[];
    custom_questions: CustomQuestion[];
    interest_options: string[];
    terms_and_conditions?: string;
    created_at: string;
    updated_at: string;
}

export interface MembershipRegistrationPayload {
    attended_programs: string[];
    membership_type: string;
    monthly_contribution: number;
    custom_answers: Record<string, any>;
    interests: string[];
    agreed_to_terms: boolean;
}

export interface MembershipRegistration {
    id: string;
    user_id: string;
    membership_id: string;
    attended_programs: string[];
    membership_type: string;
    monthly_contribution: number;
    custom_answers: Record<string, any>;
    interests: string[];
    agreed_to_terms: boolean;
    status: string;
    created_at: string;
    payment_url?: string;
    membership?: Membership;
}

export const membershipApi = {
    // Public
    listActive: async (): Promise<Membership[]> => {
        const res = await fetch(`${getApiBaseUrl()}/api/memberships`, { cache: 'no-store' });
        if (!res.ok) throw new Error("Failed to fetch memberships");
        return res.json();
    },

    getDetails: async (id: string): Promise<Membership> => {
        const res = await fetch(`${getApiBaseUrl()}/api/memberships/${id}`, { cache: 'no-store' });
        if (!res.ok) throw new Error("Failed to fetch membership details");
        return res.json();
    },

    apply: async (id: string, token: string, data: MembershipRegistrationPayload): Promise<MembershipRegistration> => {
        const res = await fetch(`${getApiBaseUrl()}/api/memberships/${id}/apply`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.detail || "Failed to apply for membership");
        return result;
    },

    getMyApplications: async (token: string): Promise<MembershipRegistration[]> => {
        const res = await fetch(`${getApiBaseUrl()}/api/memberships/my-applications`, {
            headers: { "Authorization": `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch your applications");
        return res.json();
    },

    // Admin
    adminListAll: async (token: string): Promise<Membership[]> => {
        const res = await fetch(`${getApiBaseUrl()}/api/admin/memberships`, {
            headers: { "Authorization": `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch memberships (admin)");
        return res.json();
    },

    adminCreate: async (token: string, data: Partial<Membership>): Promise<Membership> => {
        const res = await fetch(`${getApiBaseUrl()}/api/admin/memberships`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed to create membership");
        return res.json();
    },

    adminUpdate: async (id: string, token: string, data: Partial<Membership>): Promise<Membership> => {
        const res = await fetch(`${getApiBaseUrl()}/api/admin/memberships/${id}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed to update membership");
        return res.json();
    },

    adminListApplications: async (token: string, membershipId?: string): Promise<MembershipRegistration[]> => {
        let url = `${getApiBaseUrl()}/api/admin/memberships/applications`;
        if (membershipId) url += `?membership_id=${membershipId}`;
        const res = await fetch(url, {
            headers: { "Authorization": `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch applications");
        return res.json();
    },

    adminUpdateStatus: async (applicationId: string, token: string, status: string): Promise<MembershipRegistration> => {
        const res = await fetch(`${getApiBaseUrl()}/api/admin/memberships/applications/${applicationId}/status?status=${status}`, {
            method: "PATCH",
            headers: { "Authorization": `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to update status");
        return res.json();
    },

    adminDelete: async (id: string, token: string): Promise<void> => {
        const res = await fetch(`${getApiBaseUrl()}/api/admin/memberships/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to delete membership");
    }
};
