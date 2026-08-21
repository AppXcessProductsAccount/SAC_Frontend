"use client";

import { useState, useEffect } from "react";
import { cmsApi } from "@/lib/cms-api";
import { toYouTubeEmbedUrl } from "@/lib/youtube";
import { resolveMediaUrl as getFullUrl } from "@/lib/api/config";

export default function EnlightenmentAdminPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState<string | null>(null);
    const [message, setMessage] = useState("");

    const [data, setData] = useState({
        title: "",
        content: "",
        video_url: "",
        background_image_url: "",
        founder_name: "",
        founder_role: ""
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await cmsApi.getEnlightenment();
                setData(res);
            } catch (error) {
                console.error("Failed to fetch enlightenment data:", error);
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
            // Store the embeddable form so the public site never frames a watch/share
            // link (YouTube blocks those with X-Frame-Options).
            await cmsApi.updateEnlightenment({ ...data, video_url: toYouTubeEmbedUrl(data.video_url) || data.video_url });
            setMessage("Enlightenment section updated successfully!");
        } catch (error) {
            console.error("Failed to save:", error);
            setMessage("Failed to update enlightenment section.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-center py-12 md:py-20 text-[#101848] font-serif">Loading Enlightenment Settings...</div>;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h1 className="text-3xl font-serif font-bold text-[#101848] mb-8">Enlightenment Section Management</h1>

            <form onSubmit={handleSave} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
                            <textarea
                                value={data.title}
                                onChange={(e) => setData({ ...data, title: e.target.value })}
                                rows={2}
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#101848] outline-none text-black transition-all"
                                placeholder="Main Title (supports \n for newline)"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description Content</label>
                            <textarea
                                value={data.content}
                                onChange={(e) => setData({ ...data, content: e.target.value })}
                                rows={6}
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#101848] outline-none text-black transition-all"
                                placeholder="Section Description"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">YouTube Video URL</label>
                            <input
                                type="text"
                                value={data.video_url}
                                onChange={(e) => setData({ ...data, video_url: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#101848] outline-none text-black transition-all"
                                placeholder="https://www.youtube.com/watch?v=..."
                            />
                            {data.video_url && !toYouTubeEmbedUrl(data.video_url) ? (
                                <p className="text-xs text-red-600 mt-2">
                                    This doesn't look like a YouTube link — the video won't display on the site.
                                </p>
                            ) : (
                                <p className="text-xs text-gray-500 mt-2">
                                    Paste any YouTube link (watch, youtu.be or embed) — it is converted to an embeddable URL on save.
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Founder Name</label>
                                <input
                                    type="text"
                                    value={data.founder_name}
                                    onChange={(e) => setData({ ...data, founder_name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#101848] outline-none text-black transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Founder Role</label>
                                <input
                                    type="text"
                                    value={data.founder_role}
                                    onChange={(e) => setData({ ...data, founder_role: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#101848] outline-none text-black transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Background Image</label>
                            <div className="flex items-center gap-4">
                                <label className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition-all block text-center flex-1 border border-gray-200">
                                    {uploading === "background_image_url" ? "Uploading..." : "Upload BG Image"}
                                    <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, "background_image_url")} accept="image/*" />
                                </label>
                                {data.background_image_url && (
                                    <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                                        <img src={getFullUrl(data.background_image_url)} alt="BG" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

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
                            <div className="absolute inset-0 bg-[#eeebf0]/20" />
                        </div>

                        <div className="relative z-10 w-full grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
                            {/* Content Side */}
                            <div className="space-y-4">
                                <div>
                                    <span className="text-[#101848]/60 font-sans font-semibold tracking-[0.2em] uppercase text-[8px] mb-1 block">
                                        Wisdom & Knowledge
                                    </span>
                                    <h2 className="text-[20px] font-serif text-[#101848] leading-[1.1] mb-2 whitespace-pre-line">
                                        {data.title || "Section Title"}
                                    </h2>
                                </div>

                                <div className="relative pt-1">
                                    <span className="absolute -left-2 -top-2 text-[26px] md:text-[40px] text-[#101848]/5 font-serif leading-none select-none">"</span>
                                    <p className="text-[#233252]/80 text-[10px] leading-relaxed font-sans italic relative z-10">
                                        {data.content || "Experience profound transformation..."}
                                    </p>
                                </div>

                                <div className="flex items-center gap-3 pt-4 border-t border-[#101848]/10 bg-white/40 backdrop-blur-md p-3 rounded-xl shadow-sm border border-white/20">
                                    <div className="w-8 h-8 rounded-full border border-[#101848]/30 bg-[#101848]/10 flex items-center justify-center p-1 flex-shrink-0">
                                        <div className="w-full h-full rounded-full border border-[#101848]/50 flex items-center justify-center">
                                            <span className="text-[#101848] text-[10px]">spa</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-serif text-[12px] text-[#101848] leading-tight font-bold">{data.founder_name || "Name"}</h4>
                                        <p className="text-[#101848]/80 text-[8px] font-sans font-semibold tracking-wide mt-0.5 uppercase">{data.founder_role || "Role"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Video Side */}
                            <div className="relative">
                                <div className="absolute -inset-1 border border-[#101848]/10 rounded-xl -rotate-1"></div>
                                <div className="absolute -inset-1 border border-[#101848]/5 rounded-xl rotate-2"></div>

                                <div className="relative aspect-video rounded-xl overflow-hidden shadow-xl bg-black border-2 border-white/50">
                                    {toYouTubeEmbedUrl(data.video_url) ? (
                                        <iframe
                                            src={toYouTubeEmbedUrl(data.video_url)}
                                            className="w-full h-full pointer-events-none opacity-90"
                                            title="Preview"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-white/20 text-[10px]">No Video</div>
                                    )}
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
                        {saving ? "Saving Changes..." : "Save Enlightenment Settings"}
                    </button>
                </div>
            </form>
        </div>
    );
}
