"use client";

import { useState, useEffect } from "react";
import { cmsApi } from "@/lib/cms-api";
import { resolveMediaUrl as getFullUrl } from "@/lib/api/config";
import { resolveCopyrightText } from "@/lib/copyright";

export default function FooterAdminPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState<string | null>(null);
    const [message, setMessage] = useState("");

    const [data, setData] = useState({
        newsletter_title: "",
        newsletter_description: "",
        facebook_url: "",
        instagram_url: "",
        twitter_url: "",
        mail_url: "",
        logo_url: "",
        copyright_text: "",
        background_image_url: ""
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await cmsApi.getFooterInfo();
                // A section that has not been authored yet answers null; keep the
                // form's own defaults rather than rendering from null.
                if (res && typeof res === "object") {
                    setData((prev) => ({ ...prev, ...res }));
                }
            } catch (error) {
                console.error("Failed to fetch footer data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(field);
        setMessage("");
        try {
            const uploadRes = await cmsApi.uploadFile(file);
            setData(prev => ({ ...prev, [field]: uploadRes.url }));
            setMessage("Image uploaded successfully!");
        } catch (error) {
            console.error("Upload failed:", error);
            setMessage("Failed to upload image.");
        } finally {
            setUploading(null);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage("");
        try {
            await cmsApi.updateFooterInfo(data);
            setMessage("Footer information updated successfully!");
        } catch (error) {
            console.error("Failed to save:", error);
            setMessage("Failed to update footer information.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-center py-12 md:py-20 text-[#101848] font-serif">Loading Footer Settings...</div>;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h1 className="text-3xl font-serif font-bold text-[#101848] mb-8">Footer Management</h1>

            <form onSubmit={handleSave} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column: Newsletter & Branding */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-serif font-bold text-[#101848] border-b pb-2">Newsletter & Branding</h2>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Newsletter Title</label>
                            <input
                                type="text"
                                value={data.newsletter_title}
                                onChange={(e) => setData({ ...data, newsletter_title: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#101848] outline-none text-black transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Newsletter Description</label>
                            <textarea
                                value={data.newsletter_description}
                                onChange={(e) => setData({ ...data, newsletter_description: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#101848] outline-none text-black transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Copyright Text</label>
                            <input
                                type="text"
                                value={data.copyright_text}
                                onChange={(e) => setData({ ...data, copyright_text: e.target.value })}
                                placeholder="© {year} SelfAwareness Inc. All rights reserved."
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#101848] outline-none text-black transition-all"
                            />
                            {/* Without this note the year gets typed as a literal and
                                quietly goes stale on 1 January. */}
                            <p className="mt-2 text-xs text-gray-500">
                                Write <code className="px-1 py-0.5 bg-gray-100 rounded font-mono">{"{year}"}</code> where the
                                year belongs and the site fills in the current one. A year typed
                                by hand is moved forward automatically once it falls behind.
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
                            <div className="flex items-center gap-4">
                                <label className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition-all block text-center flex-1 border border-gray-200">
                                    {uploading === "logo_url" ? "Uploading..." : "Upload Logo"}
                                    <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, "logo_url")} accept="image/*" />
                                </label>
                                {data.logo_url && (
                                    <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-gray-50 flex items-center justify-center p-2">
                                        <img src={getFullUrl(data.logo_url)} alt="Logo" className="max-w-full max-h-full object-contain" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Social Links & Background */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-serif font-bold text-[#101848] border-b pb-2">Social Media & Visuals</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Facebook URL</label>
                                <input
                                    type="text"
                                    value={data.facebook_url}
                                    onChange={(e) => setData({ ...data, facebook_url: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#101848] outline-none text-black transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Instagram URL</label>
                                <input
                                    type="text"
                                    value={data.instagram_url}
                                    onChange={(e) => setData({ ...data, instagram_url: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#101848] outline-none text-black transition-all"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Twitter URL</label>
                                <input
                                    type="text"
                                    value={data.twitter_url}
                                    onChange={(e) => setData({ ...data, twitter_url: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#101848] outline-none text-black transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Mail URL / Link</label>
                                <input
                                    type="text"
                                    value={data.mail_url}
                                    onChange={(e) => setData({ ...data, mail_url: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#101848] outline-none text-black transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Footer Background Image</label>
                            <div className="flex items-center gap-4">
                                <label className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition-all block text-center flex-1 border border-gray-200">
                                    {uploading === "background_image_url" ? "Uploading..." : "Upload Footer BG"}
                                    <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, "background_image_url")} accept="image/*" />
                                </label>
                                {data.background_image_url && (
                                    <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                                        <img src={getFullUrl(data.background_image_url)} alt="Footer BG" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Preview */}
                <div className="bg-gray-100/50 rounded-2xl p-6 border border-dashed border-gray-200 mt-8">
                    <span className="text-xs font-semibold text-black uppercase tracking-wider mb-4 block">Live Footer Preview</span>
                    <footer className="relative w-full bg-[#101848] rounded-xl shadow-lg overflow-hidden py-8 px-6 border border-gray-200">
                        {/* Background Overlay */}
                        <div className="absolute inset-0 z-0">
                            {data.background_image_url ? (
                                <img src={getFullUrl(data.background_image_url)} alt="BG" className="w-full h-full object-cover opacity-30" />
                            ) : (
                                <div className="w-full h-full bg-[#101848]" />
                            )}
                            <div className="absolute inset-0 bg-[#101848]/40 backdrop-blur-[1px]" />
                        </div>

                        <div className="relative z-10 w-full grid grid-cols-2 lg:grid-cols-4 gap-4 items-start text-white">
                            {/* Newsletter */}
                            <div className="space-y-2 col-span-1">
                                <h3 className="text-[12px] font-serif font-bold">{data.newsletter_title || "Newsletter"}</h3>
                                <p className="text-[8px] text-white/60 leading-tight">{data.newsletter_description || "Stay updated..."}</p>
                                <div className="flex h-6">
                                    <div className="flex-grow bg-white/10 rounded-l-md"></div>
                                    <div className="w-10 bg-[#101848] rounded-r-md border border-white/20"></div>
                                </div>
                            </div>

                            {/* Logo */}
                            <div className="flex justify-center items-center col-span-1">
                                <div className="w-12 h-12 bg-white rounded-full p-1 border-2 border-[#101848]/20 overflow-hidden">
                                    <img src={getFullUrl(data.logo_url)} alt="Logo" className="w-full h-full object-contain" />
                                </div>
                            </div>

                            {/* Quick Links Placeholder */}
                            <div className="space-y-2 col-span-1">
                                <h3 className="text-[12px] font-serif font-bold border-b border-white/10">Links</h3>
                                <div className="space-y-1">
                                    {[1, 2, 3].map(i => <div key={i} className="h-2 w-12 bg-white/10 rounded"></div>)}
                                </div>
                            </div>

                            {/* Contact Info Placeholder */}
                            <div className="space-y-2 col-span-1">
                                <h3 className="text-[12px] font-serif font-bold border-b border-white/10">Contact</h3>
                                <div className="space-y-1">
                                    {[1, 2, 3].map(i => <div key={i} className="h-2 w-full bg-white/10 rounded"></div>)}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-4 border-t border-white/10 flex justify-between items-center text-[7px] text-white/30 uppercase tracking-widest">
                            <p>{resolveCopyrightText(data.copyright_text)}</p>
                            <div className="flex gap-4">
                                <span>Privacy</span>
                                <span>Terms</span>
                            </div>
                        </div>
                    </footer>
                </div>

                <div className="pt-8 border-t border-gray-100 flex items-center justify-between">
                    <span className={`text-sm ${message.includes("success") ? "text-green-600" : "text-red-500"}`}>
                        {message}
                    </span>
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-[#101848] text-white px-8 py-3 rounded-xl font-medium hover:bg-[#1b1b2b] transition-all disabled:opacity-50 shadow-md hover:shadow-lg"
                    >
                        {saving ? "Saving Changes..." : "Save Footer Settings"}
                    </button>
                </div>
            </form>
        </div>
    );
}
