"use client";

import { useState, useEffect } from "react";
import { cmsApi } from "@/lib/cms-api";

export default function ContactAdminPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState<string | null>(null);
    const [message, setMessage] = useState("");

    const [data, setData] = useState({
        title: "",
        subtitle: "",
        email: "",
        support_text: "",
        location: "",
        phone: "",
        website: "",
        background_image_url: "",
        form_background_image_url: ""
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await cmsApi.getContactInfo();
                setData(res);
            } catch (error) {
                console.error("Failed to fetch contact data:", error);
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
            await cmsApi.updateContactInfo(data);
            setMessage("Contact information updated successfully!");
        } catch (error) {
            console.error("Failed to save:", error);
            setMessage("Failed to update contact information.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-center py-12 md:py-20 text-[#101848] font-serif">Loading Contact Settings...</div>;

    const getFullUrl = (url: string) => {
        if (!url) return "";
        if (url.startsWith("/uploads/")) {
            return `${process.env.NEXT_PUBLIC_API_URL}${url}`;
        }
        return url;
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h1 className="text-3xl font-serif font-bold text-[#101848] mb-8">Contact Section Management</h1>

            <form onSubmit={handleSave} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column: Main Content */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-serif font-bold text-[#101848] border-b pb-2">Main Content</h2>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) => setData({ ...data, title: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#101848] outline-none text-black transition-all"
                                placeholder="Section Title"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle / Description</label>
                            <textarea
                                value={data.subtitle}
                                onChange={(e) => setData({ ...data, subtitle: e.target.value })}
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#101848] outline-none text-black transition-all"
                                placeholder="Section Subtitle"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Location Address</label>
                            <textarea
                                value={data.location}
                                onChange={(e) => setData({ ...data, location: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#101848] outline-none text-black transition-all"
                                placeholder="Full Address"
                            />
                        </div>
                    </div>

                    {/* Right Column: Contact Details & Images */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-serif font-bold text-[#101848] border-b pb-2">Contact Details</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData({ ...data, email: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#101848] outline-none text-black transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                                <input
                                    type="text"
                                    value={data.phone}
                                    onChange={(e) => setData({ ...data, phone: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#101848] outline-none text-black transition-all"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Support Text</label>
                                <input
                                    type="text"
                                    value={data.support_text}
                                    onChange={(e) => setData({ ...data, support_text: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#101848] outline-none text-black transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                                <input
                                    type="text"
                                    value={data.website}
                                    onChange={(e) => setData({ ...data, website: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#101848] outline-none text-black transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Section Background Image</label>
                            <div className="flex items-center gap-4">
                                <label className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition-all block text-center flex-1 border border-gray-200">
                                    {uploading === "background_image_url" ? "Uploading..." : "Upload Section BG"}
                                    <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, "background_image_url")} accept="image/*" />
                                </label>
                                {data.background_image_url && (
                                    <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                                        <img src={getFullUrl(data.background_image_url)} alt="BG" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Form Card Background Image</label>
                            <div className="flex items-center gap-4">
                                <label className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition-all block text-center flex-1 border border-gray-200">
                                    {uploading === "form_background_image_url" ? "Uploading..." : "Upload Form BG"}
                                    <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, "form_background_image_url")} accept="image/*" />
                                </label>
                                {data.form_background_image_url && (
                                    <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                                        <img src={getFullUrl(data.form_background_image_url)} alt="Form BG" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section Preview */}
                <div className="bg-gray-100/50 rounded-2xl p-6 border border-dashed border-gray-200 mt-8">
                    <span className="text-xs font-semibold test-black uppercase tracking-wider mb-4 block">Live Section Preview</span>
                    <div className="relative w-full bg-[#eeebf0] rounded-xl shadow-lg overflow-hidden min-h-[400px] flex items-center p-8 border border-gray-200">
                        {/* Background Image Layer */}
                        <div className="absolute inset-0 z-0">
                            {data.background_image_url ? (
                                <img src={getFullUrl(data.background_image_url)} alt="BG" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gray-200" />
                            )}
                            <div className="absolute inset-0 bg-[#eeebf0]/25" />
                        </div>

                        <div className="relative z-10 w-full grid grid-cols-2 gap-12 items-start">
                            {/* Content Side */}
                            <div className="space-y-4">
                                <div>
                                    <span className="text-[#101848]/60 font-sans font-semibold tracking-[0.2em] uppercase text-[8px] mb-1 block">
                                        Connect With Us
                                    </span>
                                    <h2 className="text-[24px] font-serif text-[#101848] leading-[1.1] mb-3">
                                        {data.title || "Section Title"}
                                    </h2>
                                    <p className="text-[#233252]/80 text-[10px] leading-relaxed font-sans max-w-xs">
                                        {data.subtitle || "Have questions? Reach out to us."}
                                    </p>
                                </div>

                                <div className="space-y-2 pt-2">
                                    <div className="flex items-center gap-3 bg-white/40 backdrop-blur-sm border border-white/60 px-3 py-2 rounded-xl shadow-sm w-fit">
                                        <div className="w-6 h-6 rounded-full border border-[#101848]/20 bg-white/80 flex items-center justify-center text-[#101848]">
                                            <span className="text-[10px]">@</span>
                                        </div>
                                        <span className="font-sans font-bold text-[#101848] text-[10px] tracking-wide">{data.email || "hello@example.com"}</span>
                                    </div>
                                    <div className="flex items-center gap-3 bg-white/40 backdrop-blur-sm border border-white/60 px-3 py-2 rounded-xl shadow-sm w-fit">
                                        <div className="w-6 h-6 rounded-full border border-[#101848]/20 bg-white/80 flex items-center justify-center text-[#101848]">
                                            <span className="text-[10px]">spa</span>
                                        </div>
                                        <span className="font-sans font-bold text-[#101848] text-[10px] tracking-wide">{data.support_text || "Support Available"}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Form Side Visual Placeholder */}
                            <div className="relative">
                                <div className="relative overflow-hidden rounded-[16px] shadow-xl border border-white/30 h-[250px]">
                                    <div className="absolute inset-0 z-0">
                                        {data.form_background_image_url ? (
                                            <img src={getFullUrl(data.form_background_image_url)} alt="Form BG" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-gray-300" />
                                        )}
                                        <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px]"></div>
                                    </div>
                                    <div className="relative z-10 p-6 space-y-3">
                                        <div className="h-8 bg-white/40 rounded-lg"></div>
                                        <div className="h-8 bg-white/40 rounded-lg"></div>
                                        <div className="h-16 bg-white/40 rounded-lg"></div>
                                        <div className="h-10 bg-[#101848] rounded-lg"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
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
                        {saving ? "Saving Changes..." : "Save Contact Settings"}
                    </button>
                </div>
            </form>
        </div>
    );
}
