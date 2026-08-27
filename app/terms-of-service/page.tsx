"use client";

import LegalPage from "@/components/legal/LegalPage";
import { TERMS_OF_SERVICE_DEFAULT } from "@/lib/legal-defaults";

export default function TermsOfServicePage() {
    return (
        <LegalPage
            routeKey="terms"
            sectionId="terms_of_service"
            fallback={TERMS_OF_SERVICE_DEFAULT}
        />
    );
}
