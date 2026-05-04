"use client";

import { useState, useEffect } from "react";
import { membershipApi, Membership, MembershipType, CustomQuestion } from "@/lib/api/membership";
import { useAuth } from "@/hooks/useAuth";

export default function AdminMembershipsPage() {
    const [memberships, setMemberships] = useState<Membership[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingMembership, setEditingMembership] = useState<Partial<Membership> | null>(null);
    const [message, setMessage] = useState("");
    const [activeTab, setActiveTab] = useState<"list" | "applications">("list");
    const [applications, setApplications] = useState<any[]>([]);

    const { tokens, isAuthenticated } = useAuth();
    const token = tokens?.access_token || "";

    useEffect(() => {
        fetchMemberships();
        fetchApplications();
    }, []);

    const fetchMemberships = async () => {
        try {
            const data = await membershipApi.adminListAll(token);
            setMemberships(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchApplications = async () => {
        try {
            const data = await membershipApi.adminListApplications(token);
            setApplications(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingMembership) return;

        try {
            if (editingMembership.id) {
                await membershipApi.adminUpdate(editingMembership.id, token, editingMembership);
                setMessage("Membership updated successfully!");
            } else {
                await membershipApi.adminCreate(token, editingMembership);
                setMessage("Membership created successfully!");
            }
            setEditingMembership(null);
            fetchMemberships();
        } catch (error: any) {
            setMessage(error.message);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this membership?")) return;
        try {
            await membershipApi.adminDelete(id, token);
            fetchMemberships();
            setMessage("Deleted successfully");
        } catch (error: any) {
            setMessage(error.message);
        }
    };

    const updateStatus = async (appId: string, status: string) => {
        try {
            await membershipApi.adminUpdateStatus(appId, token, status);
            fetchApplications();
            setMessage("Status updated");
        } catch (error: any) {
            setMessage(error.message);
        }
    };

    const addNewMembership = () => {
        setEditingMembership({
            name: "New Membership",
            is_active: true,
            attended_programs_options: ["7DTJ", "Enhance Prosperity and Abundance", "Soul Nourishment Conference", "Being With Guru", "Dark Side Conference", "Other"],
            membership_types: [
                { name: "Principle", price: 25, allow_donation: true },
                { name: "Associate", price: 15, description: "Applicable only for immediate family members..." },
                { name: "Student", price: 15 }
            ],
            interest_options: ["Movies", "Dance & Music", "Singing", "Sports", "Hiking", "Yoga", "Other"],
            custom_questions: [
                { question: "Let us know how much you will like to contribute monthly.", type: "text" }
            ],
            terms_and_conditions: "Please Read Before Submitting Your Membership Application..."
        });
    };

    if (loading) return <div className="text-center py-20 font-serif">Loading...</div>;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 min-h-[600px]">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-serif font-bold text-[#101848]">Membership Management</h1>
                <div className="flex gap-4">
                    <button 
                        onClick={() => setActiveTab("list")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'list' ? 'bg-[#101848] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        Memberships
                    </button>
                    <button 
                        onClick={() => setActiveTab("applications")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'applications' ? 'bg-[#101848] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        Applications
                    </button>
                    {activeTab === 'list' && (
                        <button 
                            onClick={addNewMembership}
                            className="bg-green-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-green-700 transition-all shadow-md"
                        >
                            + Create New
                        </button>
                    )}
                </div>
            </div>

            {activeTab === 'list' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {memberships.map((m) => (
                        <div key={m.id} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-md transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-semibold text-[#101848]">{m.name}</h3>
                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${m.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                                    {m.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            <p className="text-gray-500 text-sm mb-4">Created: {new Date(m.created_at).toLocaleDateString()}</p>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => setEditingMembership(m)}
                                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-all"
                                >
                                    Edit
                                </button>
                                <button 
                                    onClick={() => handleDelete(m.id)}
                                    className="px-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="py-4 font-semibold text-[#101848]">User</th>
                                <th className="py-4 font-semibold text-[#101848]">Membership</th>
                                <th className="py-4 font-semibold text-[#101848]">Type</th>
                                <th className="py-4 font-semibold text-[#101848]">Status</th>
                                <th className="py-4 font-semibold text-[#101848]">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.map((app) => (
                                <tr key={app.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-all">
                                    <td className="py-4 text-sm text-gray-700">{app.user_id}</td>
                                    <td className="py-4 text-sm text-gray-700">{app.membership?.name}</td>
                                    <td className="py-4 text-sm text-gray-700 font-medium">${app.monthly_contribution} ({app.membership_type})</td>
                                    <td className="py-4">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                                            app.status === 'Approved' ? 'bg-green-100 text-green-700' : 
                                            app.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td className="py-4 flex gap-2">
                                        <button onClick={() => updateStatus(app.id, 'Approved')} className="p-1.5 bg-green-50 text-green-600 rounded hover:bg-green-100">Approve</button>
                                        <button onClick={() => updateStatus(app.id, 'Rejected')} className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100">Reject</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal for Editing */}
            {editingMembership && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
                    <div className="bg-white rounded-3xl w-full max-w-4xl p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-serif font-bold text-[#101848]">
                                {editingMembership.id ? 'Edit Membership' : 'Create Membership'}
                            </h2>
                            <button onClick={() => setEditingMembership(null)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                        </div>

                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Membership Name</label>
                                    <input 
                                        type="text" 
                                        value={editingMembership.name} 
                                        onChange={(e) => setEditingMembership({...editingMembership, name: e.target.value})}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#101848] outline-none text-black"
                                    />
                                </div>
                                <div className="flex items-center pt-6">
                                    <label className="flex items-center cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            checked={editingMembership.is_active} 
                                            onChange={(e) => setEditingMembership({...editingMembership, is_active: e.target.checked})}
                                            className="w-5 h-5 rounded border-gray-300 text-[#101848] focus:ring-[#101848]"
                                        />
                                        <span className="ml-3 text-sm font-medium text-gray-700">Active (Visible to users)</span>
                                    </label>
                                </div>
                            </div>

                            <hr className="border-gray-100" />

                            {/* Dynamic Options for Attended Programs */}
                            <div>
                                <label className="block text-sm font-bold text-[#101848] mb-2">Programs Attended Options</label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {editingMembership.attended_programs_options?.map((opt, i) => (
                                        <div key={i} className="flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
                                            {opt}
                                            <button 
                                                type="button" 
                                                onClick={() => setEditingMembership({
                                                    ...editingMembership, 
                                                    attended_programs_options: editingMembership.attended_programs_options?.filter((_, idx) => idx !== i)
                                                })}
                                                className="ml-2 text-red-500 hover:text-red-700"
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        placeholder="Add option" 
                                        id="newProgramOpt"
                                        className="flex-1 px-4 py-1.5 border border-gray-200 rounded-lg text-sm text-black"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                const val = (e.target as HTMLInputElement).value;
                                                if (val) {
                                                    setEditingMembership({
                                                        ...editingMembership, 
                                                        attended_programs_options: [...(editingMembership.attended_programs_options || []), val]
                                                    });
                                                    (e.target as HTMLInputElement).value = '';
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Membership Types & Prices */}
                            <div>
                                <label className="block text-sm font-bold text-[#101848] mb-2">Membership Types & Prices</label>
                                <div className="space-y-4">
                                    {editingMembership.membership_types?.map((type, i) => (
                                        <div key={i} className="flex gap-4 items-start bg-gray-50 p-4 rounded-xl border border-gray-100">
                                            <div className="flex-1">
                                                <input 
                                                    type="text" 
                                                    value={type.name} 
                                                    placeholder="Type Name"
                                                    onChange={(e) => {
                                                        const newTypes = [...(editingMembership.membership_types || [])];
                                                        newTypes[i].name = e.target.value;
                                                        setEditingMembership({...editingMembership, membership_types: newTypes});
                                                    }}
                                                    className="w-full mb-2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-black"
                                                />
                                                <textarea 
                                                    value={type.description || ""} 
                                                    placeholder="Description (Optional)"
                                                    onChange={(e) => {
                                                        const newTypes = [...(editingMembership.membership_types || [])];
                                                        newTypes[i].description = e.target.value;
                                                        setEditingMembership({...editingMembership, membership_types: newTypes});
                                                    }}
                                                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-black h-16"
                                                />
                                            </div>
                                            <div className="w-24">
                                                <input 
                                                    type="number" 
                                                    value={type.price} 
                                                    placeholder="Price"
                                                    onChange={(e) => {
                                                        const newTypes = [...(editingMembership.membership_types || [])];
                                                        newTypes[i].price = parseFloat(e.target.value);
                                                        setEditingMembership({...editingMembership, membership_types: newTypes});
                                                    }}
                                                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-black"
                                                />
                                                <label className="flex items-center mt-2 cursor-pointer">
                                                    <input 
                                                        type="checkbox" 
                                                        checked={type.allow_donation} 
                                                        onChange={(e) => {
                                                            const newTypes = [...(editingMembership.membership_types || [])];
                                                            newTypes[i].allow_donation = e.target.checked;
                                                            setEditingMembership({...editingMembership, membership_types: newTypes});
                                                        }}
                                                        className="w-3 h-3 text-[#101848]"
                                                    />
                                                    <span className="ml-1 text-[10px] text-gray-500">Allow Donation</span>
                                                </label>
                                            </div>
                                            <button 
                                                type="button"
                                                onClick={() => setEditingMembership({
                                                    ...editingMembership,
                                                    membership_types: editingMembership.membership_types?.filter((_, idx) => idx !== i)
                                                })}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    ))}
                                    <button 
                                        type="button"
                                        onClick={() => setEditingMembership({
                                            ...editingMembership,
                                            membership_types: [...(editingMembership.membership_types || []), { name: "", price: 0 }]
                                        })}
                                        className="text-blue-600 text-sm font-medium hover:underline"
                                    >
                                        + Add Type
                                    </button>
                                </div>
                            </div>

                            {/* Terms and Conditions */}
                            <div>
                                <label className="block text-sm font-bold text-[#101848] mb-1">Terms & Conditions</label>
                                <textarea 
                                    rows={6}
                                    value={editingMembership.terms_and_conditions || ""} 
                                    onChange={(e) => setEditingMembership({...editingMembership, terms_and_conditions: e.target.value})}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#101848] outline-none text-black transition-all text-sm"
                                    placeholder="Enter terms and conditions text..."
                                />
                            </div>

                            <div className="pt-6 border-t border-gray-100 flex justify-end gap-4">
                                <button 
                                    type="button"
                                    onClick={() => setEditingMembership(null)}
                                    className="px-6 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all font-medium"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="px-8 py-2 rounded-xl bg-[#101848] text-white hover:bg-[#1b1b2b] transition-all font-medium shadow-lg"
                                >
                                    {editingMembership.id ? 'Save Changes' : 'Create Membership'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {message && (
                <div className="fixed bottom-8 right-8 bg-[#101848] text-white px-6 py-3 rounded-xl shadow-2xl animate-bounce">
                    {message}
                </div>
            )}
        </div>
    );
}
