import { API_BASE_URL as API_URL } from "./config";

export interface Program {
    id: string;
    program_name: string;
    city: string;
    address: string;
    class_id: string;
    date_range: string;
    is_active: boolean;
    order_id: number;
    languages?: string[];
    discovery_sources?: string[];
    price: number;
    minimum_deposit: number;
    allow_partial_payment: boolean;
    is_refundable: boolean;
    refund_percentage: number;
    balance_due_days: number;
    created_at: string;
}

export interface RegistrationPayload {
    nric_last_4: string;
    preferred_language: string;
    meal_preference: string;
    health_issues: string;
    referred_by: string;
    emergency_contact_name: string;
    emergency_contact_phone: string;
    emergency_contact_relation: string;
    discovery_source: string;
    introducer_name?: string;
    introducer_phone?: string;
    pay_full: boolean;
}

export interface RegistrationResponse {
    id: string;
    user_id: string;
    program_id: string;
    status: string;
    nric_last_4: string;
    preferred_language: string;
    meal_preference: string;
    health_issues: string;
    referred_by: string;
    emergency_contact_name: string;
    emergency_contact_phone: string;
    emergency_contact_relation: string;
    discovery_source: string;
    introducer_name?: string;
    introducer_phone?: string;
    payment_url?: string;
    payment_request_id?: string;
    payment_signature?: string;
    hitpay_payment_id?: string;
    amount_paid: number;
    balance_amount: number;
    payment_status: string;
    due_date?: string;
    created_at: string;
    program?: Program;
}

export const programsApi = {
    listPrograms: async (): Promise<Program[]> => {
        const res = await fetch(`${API_URL}/api/programs`, { cache: 'no-store' });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || "Failed to fetch programs");
        // Sort by order_id
        return data.sort((a: Program, b: Program) => a.order_id - b.order_id);
    },

    register: async (programId: string, token: string, payload: RegistrationPayload): Promise<RegistrationResponse> => {
        const res = await fetch(`${API_URL}/api/programs/${programId}/register`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) {
            // Check for profile incomplete error
            if (res.status === 400 && data.detail?.profile_setup === false) {
                const error: any = new Error(data.detail.message);
                error.profileIncomplete = true;
                throw error;
            }
            throw new Error(data.detail?.message || data.detail || "Registration failed");
        }
        return data;
    },

    myRegistrations: async (token: string): Promise<RegistrationResponse[]> => {
        const res = await fetch(`${API_URL}/api/programs/my-registrations`, {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || "Failed to fetch registrations");
        return data;
    },

    payBalance: async (registrationId: string, token: string): Promise<{ payment_url: string }> => {
        const res = await fetch(`${API_URL}/api/payments/pay-balance/${registrationId}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || "Failed to initiate balance payment");
        return data;
    },
};
