"use client";

import { useState, useEffect } from "react";
import { cmsApi } from "@/lib/cms-api";

export default function AdminHeroPage() {
    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [buttonText, setButtonText] = useState("");
    const [bgImageUrl, setBgImageUrl] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await cmsApi.getHero();
                setTitle(data.title || "Awaken to Your True Self");
                setSubtitle(data.subtitle || "For a Life of Inner Peace, Wisdom, and Transformation");
                setButtonText(data.button_text || "Explore Programs");
                setBgImageUrl(data.background_image_url || "/hero_section.png");
            } catch (error) {
                console.error("Failed to fetch hero data:", error);
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
            setBgImageUrl(data.url);
            setMessage("Image uploaded successfully!");
        } catch (error) {
            console.error("Upload failed:", error);
            setMessage("Failed to upload image.");
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage("");
        try {
            await cmsApi.updateHero({
                title: title,
                subtitle: subtitle,
                button_text: buttonText,
                background_image_url: bgImageUrl
            });
            setMessage("Hero settings updated successfully!");
        } catch (error) {
            console.error("Failed to save:", error);
            setMessage("Failed to update hero settings.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-center py-12 md:py-20">Loading...</div>;

    const fullBgUrl = bgImageUrl.startsWith("/uploads/")
        ? `${process.env.NEXT_PUBLIC_API_URL}${bgImageUrl}`
        : bgImageUrl;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h1 className="text-3xl font-serif font-bold text-[#101848] mb-8">Hero Section Management</h1>

            <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                            <textarea
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#101848] outline-none text-black"
                                placeholder="Hero Title (use \n for new lines)"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                            <textarea
                                value={subtitle}
                                onChange={(e) => setSubtitle(e.target.value)}
                                rows={2}
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#101848] outline-none text-black"
                                placeholder="Hero Subtitle"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
                                <input
                                    type="text"
                                    value={buttonText}
                                    onChange={(e) => setButtonText(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#101848] outline-none text-black"
                                    placeholder="Explore Programs"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Background Image URL</label>
                                <input
                                    type="text"
                                    value={bgImageUrl}
                                    onChange={(e) => setBgImageUrl(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#101848] outline-none text-xs test-black"
                                    placeholder="/hero_section.png"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl text-sm font-medium cursor-pointer transition-all inline-block">
                                {uploading ? "Uploading..." : "Upload New Background Image"}
                                <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" disabled={uploading} />
                            </label>
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-6 flex flex-col items-center justify-center border border-dashed border-gray-200">
                        <span className="text-xs font-semibold test-black uppercase tracking-wider mb-4">Background Preview</span>
                        {bgImageUrl ? (
                            <div className="relative w-full aspect-video flex items-center justify-center bg-white rounded-xl shadow-sm overflow-hidden">
                                <img
                                    src={fullBgUrl}
                                    alt="Hero BG Preview"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = "/hero_section.png";
                                    }}
                                />
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                    <div className="text-center p-4">
                                        <h2 className="text-white text-xs font-serif font-bold line-clamp-1">{title}</h2>
                                        <p className="text-white/80 text-[8px] line-clamp-1 mt-1">{subtitle}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="aspect-video w-full flex items-center justify-center test-black">
                                No background image selected
                            </div>
                        )}
                        <p className="mt-4 text-[10px] test-black text-center break-all">{fullBgUrl}</p>
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
