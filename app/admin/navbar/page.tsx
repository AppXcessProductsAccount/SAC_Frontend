"use client";

import { useState, useEffect } from "react";
import { cmsApi } from "@/lib/cms-api";
import { resolveMediaUrl } from "@/lib/api/config";

interface NavigationLink {
    label: string;
    url: string;
    id: string;
}

export default function AdminNavbarPage() {
    const [logoUrl, setLogoUrl] = useState("");
    const [brandName, setBrandName] = useState("");
    const [links, setLinks] = useState<NavigationLink[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await cmsApi.getNavigation();
                setLogoUrl(data.logo_url || "/logo.png");
                setBrandName(data.brand_name || "SELF AWARENESS CENTRE");
                setLinks(data.links || []);
            } catch (error) {
                console.error("Failed to fetch nav data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setMessage("");
        try {
            const data = await cmsApi.uploadFile(file);
            setLogoUrl(data.url);
            setMessage("Logo uploaded successfully!");
        } catch (error) {
            console.error("Upload failed:", error);
            setMessage("Failed to upload logo.");
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage("");
        try {
            await cmsApi.updateNavigation({
                logo_url: logoUrl,
                brand_name: brandName,
                links: links
            });
            setMessage("Navbar settings updated successfully!");
        } catch (error) {
            console.error("Failed to save:", error);
            setMessage("Failed to update navbar settings.");
        } finally {
            setSaving(false);
        }
    };

    const addLink = () => {
        setLinks([...links, { label: "New Link", url: "#", id: "new-id" }]);
    };

    const removeLink = (index: number) => {
        setLinks(links.filter((_, i) => i !== index));
    };

    const updateLink = (index: number, field: keyof NavigationLink, value: string) => {
        const newLinks = [...links];
        newLinks[index][field] = value;
        setLinks(newLinks);
    };

    if (loading) return <div className="text-center py-12 md:py-20">Loading...</div>;

    const fullLogoUrl = resolveMediaUrl(logoUrl);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h1 className="text-3xl font-serif font-bold text-[#101848] mb-8">Navbar Management</h1>

            <form onSubmit={handleSave} className="space-y-8">
                {/* Brand & Logo */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Brand Name (Logo Text)</label>
                            <input
                                type="text"
                                value={brandName}
                                onChange={(e) => setBrandName(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#101848] outline-none transition-all text-black"
                                placeholder="e.g. SELF AWARENESS CENTRE"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
                            <div className="flex flex-col gap-3">
                                <input
                                    type="text"
                                    value={logoUrl}
                                    onChange={(e) => setLogoUrl(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#101848] outline-none text-xs text-gray-500"
                                    placeholder="/logo.png"
                                />
                                <div className="flex items-center gap-4">
                                    <label className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition-all">
                                        {uploading ? "Uploading..." : "Upload New Logo"}
                                        <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" disabled={uploading} />
                                    </label>
                                    <span className="text-xs test-black">Supported: JPG, PNG, SVG</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-6 flex flex-col items-center justify-center border border-dashed border-gray-200">
                        <span className="text-xs font-semibold test-black uppercase tracking-wider mb-4">Logo Preview</span>
                        {logoUrl ? (
                            <div className="relative h-32 w-full flex items-center justify-center bg-white rounded-xl shadow-sm p-4 overflow-hidden">
                                <img
                                    src={fullLogoUrl}
                                    alt="Logo Preview"
                                    className="max-h-full max-w-full object-contain"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = "/logo.png";
                                    }}
                                />
                            </div>
                        ) : (
                            <div className="h-32 w-full flex items-center justify-center test-black">
                                No logo selected
                            </div>
                        )}
                        <p className="mt-4 text-[10px] test-black text-center break-all">{fullLogoUrl}</p>
                    </div>
                </div>

                {/* Navigation Links */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <label className="text-lg font-medium text-[#101848]">Navigation Links</label>
                        <button
                            type="button"
                            onClick={addLink}
                            className="text-sm bg-gray-100 hover:bg-gray-200 px-4 py-1.5 rounded-full transition-colors"
                        >
                            + Add Link
                        </button>
                    </div>
                    <div className="space-y-3">
                        {links.map((link, index) => (
                            <div key={index} className="flex gap-4 items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <input
                                        type="text"
                                        value={link.label}
                                        onChange={(e) => updateLink(index, "label", e.target.value)}
                                        placeholder="Label"
                                        className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-black"
                                    />
                                    <input
                                        type="text"
                                        value={link.url}
                                        onChange={(e) => updateLink(index, "url", e.target.value)}
                                        placeholder="URL (e.g. #home)"
                                        className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-black"
                                    />
                                    <input
                                        type="text"
                                        value={link.id}
                                        onChange={(e) => updateLink(index, "id", e.target.value)}
                                        placeholder="Section ID (e.g. home)"
                                        className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-black"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeLink(index)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                    {message && (
                        <p className={`text-sm ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>
                            {message}
                        </p>
                    )}
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-[#101848] text-white px-8 py-3 rounded-xl font-medium hover:bg-[#1b1b2b] transition-all disabled:opacity-50 ml-auto"
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    );
}
