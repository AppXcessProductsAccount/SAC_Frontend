"use client";

import { useState, useEffect } from "react";
import { cmsApi } from "@/lib/cms-api";

interface Testimonial {
    id: number;
    author_name: string;
    author_role: string;
    quote: string;
    order: number;
}

export default function TestimonialsAdminPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);

    const [formData, setFormData] = useState({
        author_name: "",
        author_role: "",
        quote: "",
        order: 0
    });

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        try {
            const data = await cmsApi.getTestimonials();
            setTestimonials(data);
        } catch (error) {
            console.error("Failed to fetch testimonials:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (testimonial: Testimonial) => {
        setEditingId(testimonial.id);
        setFormData({
            author_name: testimonial.author_name,
            author_role: testimonial.author_role,
            quote: testimonial.quote,
            order: testimonial.order
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this testimonial?")) return;
        try {
            await cmsApi.deleteTestimonial(id);
            setMessage("Testimonial deleted successfully!");
            fetchTestimonials();
        } catch (error) {
            console.error("Delete failed:", error);
            setMessage("Failed to delete testimonial.");
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage("");
        try {
            if (editingId) {
                await cmsApi.updateTestimonial(editingId, formData);
                setMessage("Testimonial updated successfully!");
            } else {
                await cmsApi.createTestimonial(formData);
                setMessage("Testimonial created successfully!");
            }
            setFormData({ author_name: "", author_role: "", quote: "", order: 0 });
            setEditingId(null);
            fetchTestimonials();
        } catch (error) {
            console.error("Save failed:", error);
            setMessage("Failed to save testimonial.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-center py-12 md:py-20 text-[#101848] font-serif">Loading Testimonials...</div>;

    return (
        <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h1 className="text-3xl font-serif font-bold text-[#101848] mb-8">
                    {editingId ? "Edit Testimonial" : "Add New Testimonial"}
                </h1>
                
                <form onSubmit={handleSave} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Author Name</label>
                            <input
                                type="text"
                                required
                                value={formData.author_name}
                                onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#101848] outline-none text-black transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Author Role</label>
                            <input
                                type="text"
                                required
                                value={formData.author_role}
                                onChange={(e) => setFormData({ ...formData, author_role: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#101848] outline-none text-black transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Quote</label>
                        <textarea
                            required
                            value={formData.quote}
                            onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#101848] outline-none text-black transition-all"
                        />
                    </div>

                    <div className="w-32">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                        <input
                            type="number"
                            value={formData.order}
                            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#101848] outline-none text-black transition-all"
                        />
                    </div>

                    <div className="flex items-center justify-between pt-4">
                        <span className={`text-sm ${message.includes("success") ? "text-green-600" : "text-red-500"}`}>
                            {message}
                        </span>
                        <div className="flex gap-4">
                            {editingId && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingId(null);
                                        setFormData({ author_name: "", author_role: "", quote: "", order: 0 });
                                    }}
                                    className="px-6 py-2 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition-all"
                                >
                                    Cancel
                                </button>
                            )}
                            <button
                                type="submit"
                                disabled={saving}
                                className="bg-[#101848] text-white px-8 py-2 rounded-xl font-medium hover:bg-[#1b1b2b] transition-all disabled:opacity-50 shadow-md"
                            >
                                {saving ? "Saving..." : editingId ? "Update Testimonial" : "Add Testimonial"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-2xl font-serif font-bold text-[#101848] mb-6">Existing Testimonials</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {testimonials.map((t) => (
                        <div key={t.id} className="p-6 rounded-2xl border border-gray-100 bg-gray-50 flex flex-col justify-between group h-full">
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="bg-[#101848]/10 px-3 py-1 rounded-full text-[#101848] text-xs font-bold uppercase tracking-wider">
                                        Order: {t.order}
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={() => handleEdit(t)}
                                            className="p-2 hover:bg-white rounded-lg text-blue-600 transition-colors shadow-sm"
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(t.id)}
                                            className="p-2 hover:bg-white rounded-lg text-red-600 transition-colors shadow-sm"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                                <p className="text-gray-600 italic mb-4">"{t.quote}"</p>
                            </div>
                            <div>
                                <h4 className="font-serif font-bold text-[#101848]">{t.author_name}</h4>
                                <p className="text-[#101848]/60 text-sm font-medium">{t.author_role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
