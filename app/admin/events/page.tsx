"use client";

import { useState, useEffect } from "react";
import { cmsApi } from "@/lib/cms-api";

export default function EventsAdminPage() {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState<number | string | null>(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const data = await cmsApi.getEvents();
            setEvents(data);
        } catch (error) {
            console.error("Failed to fetch events:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, eventId: number | string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(eventId);
        setMessage("");
        try {
            const uploadRes = await cmsApi.uploadFile(file);
            setEvents(events.map(ev => ev.id === eventId ? { ...ev, image_url: uploadRes.url } : ev));
            setMessage("Image uploaded successfully!");
        } catch (error) {
            console.error("Upload failed:", error);
            setMessage("Failed to upload image.");
        } finally {
            setUploading(null);
        }
    };

    const handleCreateEvent = async () => {
        const newEvent = {
            title: "New Event",
            date_text: "Date Here",
            image_url: "/event_retreat.png",
            button_text: "View Details",
            order: events.length
        };
        try {
            await cmsApi.createEvent(newEvent);
            fetchEvents();
            setMessage("Event created!");
        } catch (error) {
            setMessage("Failed to create event.");
        }
    };

    const handleUpdateEvent = async (id: number, data: any) => {
        setSaving(true);
        try {
            await cmsApi.updateEvent(id, data);
            setMessage("Event updated!");
        } catch (error) {
            setMessage("Failed to update event.");
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteEvent = async (id: number) => {
        if (!confirm("Are you sure?")) return;
        try {
            await cmsApi.deleteEvent(id);
            fetchEvents();
            setMessage("Event deleted!");
        } catch (error) {
            setMessage("Failed to delete event.");
        }
    };

    if (loading) return <div className="text-center py-12 md:py-20 text-[#101848] font-serif">Loading Events...</div>;

    const getFullUrl = (url: string) => {
        if (!url) return "";
        if (url.startsWith("/uploads/")) {
            return `${process.env.NEXT_PUBLIC_API_URL}${url}`;
        }
        return url;
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-serif font-bold text-[#101848]">Events Management</h1>
                <button
                    onClick={handleCreateEvent}
                    className="bg-[#101848] text-white px-6 py-2 rounded-xl font-medium hover:bg-[#1b1b2b] transition-all shadow-md hover:shadow-lg"
                >
                    + Add New Event
                </button>
            </div>

            <div className="space-y-6">
                {events.map((event) => (
                    <div key={event.id} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col md:flex-row gap-8">
                        {/* Preview */}
                        <div className="relative w-full md:w-64 aspect-video bg-white rounded-xl overflow-hidden shadow-sm">
                            <img src={getFullUrl(event.image_url)} alt={event.title} className="w-full h-full object-cover" />
                            <label className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                <span className="text-white text-xs font-medium">Change Image</span>
                                <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, event.id)} accept="image/*" />
                            </label>
                            {uploading === event.id && (
                                <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                                    <span className="text-xs font-bold text-[#101848]">Uploading...</span>
                                </div>
                            )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Event Title</label>
                                    <input
                                        type="text"
                                        value={event.title}
                                        onChange={(e) => setEvents(events.map(ev => ev.id === event.id ? { ...ev, title: e.target.value } : ev))}
                                        className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-black"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Date Text</label>
                                    <input
                                        type="text"
                                        value={event.date_text}
                                        onChange={(e) => setEvents(events.map(ev => ev.id === event.id ? { ...ev, date_text: e.target.value } : ev))}
                                        className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-black"
                                    />
                                </div>
                            </div>
                            <div className="space-y-4 text-right flex flex-col justify-between">
                                <div className="flex gap-2 justify-end">
                                    <button
                                        onClick={() => handleUpdateEvent(event.id, event)}
                                        className="bg-green-600 text-white px-4 py-1.5 rounded-lg text-xs font-medium hover:bg-green-700 transition-all shadow-sm"
                                    >
                                        Save Changes
                                    </button>
                                    <button
                                        onClick={() => handleDeleteEvent(event.id)}
                                        className="bg-red-600 text-white px-4 py-1.5 rounded-lg text-xs font-medium hover:bg-red-700 transition-all shadow-sm"
                                    >
                                        Delete
                                    </button>
                                </div>
                                <div className="text-xs test-black">ID: {event.id} | Order: {event.order}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {message && (
                <div className={`fixed bottom-8 right-8 px-6 py-3 rounded-xl shadow-lg text-white ${message.includes("failed") ? "bg-red-500" : "bg-green-600"}`}>
                    {message}
                </div>
            )}
        </div>
    );
}
