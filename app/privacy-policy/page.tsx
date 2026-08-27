"use client";

import LegalPage from "@/components/legal/LegalPage";
import { PRIVACY_POLICY_DEFAULT } from "@/lib/legal-defaults";

export default function PrivacyPolicyPage() {
    return (
        <LegalPage
            routeKey="privacy"
            sectionId="privacy_policy"
            fallback={PRIVACY_POLICY_DEFAULT}
        />
    );
}
