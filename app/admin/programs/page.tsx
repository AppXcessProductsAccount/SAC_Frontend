"use client";

import { useState, useEffect } from "react";
import { cmsApi } from "@/lib/cms-api";

export default function ProgramsAdminPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState<string | null>(null);
    const [message, setMessage] = useState("");

    const [data, setData] = useState({
        title: "",
        description: "",
        button_text: "",
        background_image_url: "",
        card1_title: "",
        card1_image_url: "",
        card2_title: "",
        card2_image_url: ""
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const programs = await cmsApi.getPrograms();
                setData(programs);
            } catch (error) {
                console.error("Failed to fetch programs:", error);
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
            await cmsApi.updatePrograms(data);
            setMessage("Programs section updated successfully!");
        } catch (error) {
            console.error("Failed to save:", error);
            setMessage("Failed to update programs section.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-center py-12 md:py-20 text-[#101848] font-serif">Loading Programs Settings...</div>;

    const getFullUrl = (url: string) => {
        if (!url) return "";
        if (url.startsWith("/uploads/")) {
            return `${process.env.NEXT_PUBLIC_API_URL}${url}`;
        }
        return url;
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h1 className="text-3xl font-serif font-bold text-[#101848] mb-8">Programs Section Management</h1>

            <form onSubmit={handleSave} className="space-y-8">
                {/* Main Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
                            <textarea
                                value={data.title}
                                onChange={(e) => setData({ ...data, title: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#101848] outline-none text-black transition-all"
                                placeholder="e.g. Nurturing Your Path\nto Enlightenment"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <textarea
                                value={data.description}
                                onChange={(e) => setData({ ...data, description: e.target.value })}
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#101848] outline-none text-black transition-all"
                                placeholder="Section Description"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
                                <input
                                    type="text"
                                    value={data.button_text}
                                    onChange={(e) => setData({ ...data, button_text: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#101848] outline-none text-black transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Background Image</label>
                                <label className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition-all block text-center">
                                    {uploading === "background_image_url" ? "Uploading..." : "Upload BG"}
                                    <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, "background_image_url")} accept="image/*" />
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-6 flex flex-col items-center justify-center border border-dashed border-gray-200">
                        <span className="text-xs font-semibold test-black uppercase tracking-wider mb-4">Background Preview</span>
                        {data.background_image_url ? (
                            <div className="relative w-full aspect-video bg-white rounded-xl shadow-sm overflow-hidden">
                                <img src={getFullUrl(data.background_image_url)} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                        ) : (
                            <div className="aspect-video w-full flex items-center justify-center test-black">No Image</div>
                        )}
                    </div>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gray-100">
                    {/* Card 1 */}
                    <div className="space-y-4 p-6 bg-gray-50 rounded-2xl">
                        <h3 className="font-semibold text-[#101848]">Card 1</h3>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
                            <input
                                type="text"
                                value={data.card1_title}
                                onChange={(e) => setData({ ...data, card1_title: e.target.value })}
                                className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-black"
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex-1">
                                <label className="block text-xs font-medium text-gray-500 mb-1">Image</label>
                                <label className="bg-white hover:bg-gray-50 text-gray-700 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium cursor-pointer transition-all block text-center">
                                    {uploading === "card1_image_url" ? "Uploading..." : "Upload Image"}
                                    <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, "card1_image_url")} accept="image/*" />
                                </label>
                            </div>
                            {data.card1_image_url && (
                                <img src={getFullUrl(data.card1_image_url)} className="h-12 w-12 rounded-lg object-cover shadow-sm" />
                            )}
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="space-y-4 p-6 bg-gray-50 rounded-2xl">
                        <h3 className="font-semibold text-[#101848]">Card 2</h3>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
                            <input
                                type="text"
                                value={data.card2_title}
                                onChange={(e) => setData({ ...data, card2_title: e.target.value })}
                                className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-black"
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex-1">
                                <label className="block text-xs font-medium text-gray-500 mb-1">Image</label>
                                <label className="bg-white hover:bg-gray-50 text-gray-700 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium cursor-pointer transition-all block text-center">
                                    {uploading === "card2_image_url" ? "Uploading..." : "Upload Image"}
                                    <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, "card2_image_url")} accept="image/*" />
                                </label>
                            </div>
                            {data.card2_image_url && (
                                <img src={getFullUrl(data.card2_image_url)} className="h-12 w-12 rounded-lg object-cover shadow-sm" />
                            )}
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
                        {saving ? "Saving Changes..." : "Save Programs Settings"}
                    </button>
                </div>
            </form>
        </div>
    );
}
