"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * Keeps a failure inside one admin screen instead of blanking the whole route.
 * Without this, a render-time throw in any section editor took the panel down
 * with no way back except editing the URL.
 */
export default function AdminError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Admin screen failed:", error);
    }, [error]);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h1 className="text-2xl font-serif font-bold text-[#101848] mb-3">
                This screen could not load
            </h1>
            <p className="text-gray-600 mb-6 max-w-xl">
                Something went wrong while loading this section. Your other content is unaffected.
                Try again, and if it keeps failing, check that the API is reachable and that this
                section exists in the CMS.
            </p>

            <p className="text-xs font-mono text-gray-500 bg-gray-50 border border-gray-100 rounded-xl p-4 mb-6 break-words">
                {error.message || "Unknown error"}
                {error.digest ? ` (${error.digest})` : ""}
            </p>

            <div className="flex flex-wrap gap-3">
                <button
                    onClick={reset}
                    className="bg-[#101848] text-white px-6 py-2.5 rounded-xl font-medium hover:bg-[#1b1b2b] transition-colors"
                >
                    Try again
                </button>
                <Link
                    href="/admin"
                    className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                    Back to Dashboard
                </Link>
            </div>
        </div>
    );
}
