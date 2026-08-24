"use client";

import { useState, useEffect } from "react";
import { membershipApi, Membership, MembershipRegistrationPayload } from "@/lib/api/membership";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthModal from "@/components/auth/AuthModal";

export default function MembershipPage() {
    const [memberships, setMemberships] = useState<Membership[]>([]);
    const [selectedMembership, setSelectedMembership] = useState<Membership | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [step, setStep] = useState(1); // 1: List, 2: Form, 3: Success
    const [formData, setFormData] = useState<MembershipRegistrationPayload>({
        attended_programs: [],
        membership_type: "",
        monthly_contribution: 0,
        custom_answers: {},
        interests: [],
        agreed_to_terms: false
    });
    const [message, setMessage] = useState("");
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const router = useRouter();

    const { tokens, isAuthenticated } = useAuth();
    const token = tokens?.access_token || "";

    useEffect(() => {
        const fetchMemberships = async () => {
            try {
                const data = await membershipApi.listActive();
                setMemberships(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchMemberships();
    }, []);

    const handleApply = (membership: Membership) => {
        if (!isAuthenticated) {
            setIsAuthModalOpen(true);
            return;
        }
        setSelectedMembership(membership);
        setStep(2);
        // Reset form data for this membership
        setFormData({
            attended_programs: [],
            membership_type: membership.membership_types[0]?.name || "",
            monthly_contribution: membership.membership_types[0]?.price || 0,
            custom_answers: {},
            interests: [],
            agreed_to_terms: false
        });
    };

    const toggleSelection = (field: "attended_programs" | "interests", value: string) => {
        const current = [...formData[field]];
        if (current.includes(value)) {
            setFormData({ ...formData, [field]: current.filter(v => v !== value) });
        } else {
            setFormData({ ...formData, [field]: [...current, value] });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedMembership || !token) {
            if (!token) setIsAuthModalOpen(true);
            return;
        }

        if (!formData.agreed_to_terms) {
            setMessage("Please agree to the terms and conditions.");
            return;
        }

        setSubmitting(true);
        try {
            const result = await membershipApi.apply(selectedMembership.id, token, formData);
            if (result.payment_url) {
                window.location.href = result.payment_url;
            } else {
                setStep(3);
            }
        } catch (error: any) {
            setMessage(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <main className="relative min-h-screen">
            <Navbar />
            <div className="relative z-10 text-center py-40 font-serif text-[#101848]">Discovering Membership Options...</div>
            <Footer />
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </main>
    );

    if (step === 3) {
        return (
            <main className="relative min-h-screen">
                <Navbar />
                <div className="relative z-10 max-w-2xl mx-auto py-12 md:py-20 px-4 text-center">
                    <div className="bg-green-50 rounded-3xl p-12 border border-green-100">
                        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-green-200">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="text-2xl md:text-4xl font-serif font-bold text-[#101848] mb-4">Application Submitted!</h1>
                        <p className="text-gray-600 text-lg mb-8">Thank you for your interest in joining {selectedMembership?.name}. Our team will review your application and get back to you shortly.</p>
                        <button 
                            onClick={() => router.push('/profile')}
                            className="bg-[#101848] text-white px-8 py-3 rounded-xl font-medium hover:bg-[#1b1b2b] transition-all"
                        >
                            View My Applications
                        </button>
                    </div>
                </div>
                <Footer />
                <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
            </main>
        );
    }

    if (step === 2 && selectedMembership) {
        return (
            <main className="relative min-h-screen">
                <Navbar />
                <div className="relative z-10 max-w-4xl mx-auto py-12 px-4">
                    <button onClick={() => setStep(1)} className="text-[#101848] font-medium mb-8 hover:underline flex items-center gap-2">
                        &larr; Back to Memberships
                    </button>

                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="bg-[#101848] p-8 text-white">
                            <h1 className="text-2xl sm:text-3xl font-serif font-bold mb-2 text-balance">Apply for {selectedMembership.name}</h1>
                            <p className="text-white/70">Please fill out the details below to complete your application.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-5 sm:p-8 space-y-10">
                            {/* Section 1: Membership Type */}
                            <section className="space-y-6">
                                <h3 className="text-xl font-bold text-[#101848] border-b border-gray-100 pb-2">Membership Type</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {selectedMembership.membership_types.map((type) => (
                                        <label 
                                            key={type.name}
                                            className={`relative p-6 rounded-2xl border-2 transition-all cursor-pointer ${
                                                formData.membership_type === type.name 
                                                ? 'border-[#101848] bg-[#101848]/5' 
                                                : 'border-gray-100 hover:border-gray-200 bg-gray-50'
                                            }`}
                                        >
                                            <input 
                                                type="radio" 
                                                name="membership_type"
                                                className="hidden"
                                                checked={formData.membership_type === type.name}
                                                onChange={() => setFormData({...formData, membership_type: type.name, monthly_contribution: type.price})}
                                            />
                                            <div className="font-bold text-[#101848] mb-1">{type.name}</div>
                                            <div className="text-2xl font-serif font-bold text-[#101848] mb-2">${type.price} <span className="text-xs font-normal text-gray-500">/ mo</span></div>
                                            <div className="text-[10px] text-gray-500 leading-tight">{type.description}</div>
                                        </label>
                                    ))}
                                </div>
                                
                                {/* Monthly Contribution if allow_donation */}
                                {selectedMembership.membership_types.find(t => t.name === formData.membership_type)?.allow_donation && (
                                    <div className="bg-blue-50 p-5 sm:p-6 rounded-2xl border border-blue-100">
                                        <label className="block text-sm font-medium text-blue-800 mb-2">Monthly Contribution</label>
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                            <div className="relative flex-1">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-800 font-bold">$</span>
                                                <input 
                                                    type="number" 
                                                    min={selectedMembership.membership_types.find(t => t.name === formData.membership_type)?.price || 0}
                                                    value={formData.monthly_contribution}
                                                    onChange={(e) => setFormData({...formData, monthly_contribution: parseFloat(e.target.value)})}
                                                    className="w-full pl-10 pr-4 py-3 bg-white border border-blue-200 rounded-xl focus:ring-2 focus:ring-[#101848] outline-none text-black font-bold text-xl"
                                                />
                                            </div>
                                            <div className="text-sm text-blue-600 font-medium">Would you like to donate more than ${selectedMembership.membership_types.find(t => t.name === formData.membership_type)?.price}?</div>
                                        </div>
                                    </div>
                                )}
                            </section>

                            {/* Section 2: Programs Attended */}
                            <section className="space-y-6">
                                <h3 className="text-xl font-bold text-[#101848] border-b border-gray-100 pb-2">Programs you have attended under SAC</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {selectedMembership.attended_programs_options.map((opt) => (
                                        <label key={opt} className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-100 cursor-pointer hover:bg-gray-100 transition-all">
                                            <input 
                                                type="checkbox" 
                                                checked={formData.attended_programs.includes(opt)}
                                                onChange={() => toggleSelection("attended_programs", opt)}
                                                className="w-5 h-5 rounded border-gray-300 text-[#101848] focus:ring-[#101848]"
                                            />
                                            <span className="ml-3 text-sm text-gray-700">{opt}</span>
                                        </label>
                                    ))}
                                </div>
                            </section>

                            {/* Section 3: Interests */}
                            <section className="space-y-6">
                                <h3 className="text-xl font-bold text-[#101848] border-b border-gray-100 pb-2">Your Interests Matter</h3>
                                <p className="text-sm text-gray-500">Let us know the types of events that interest you, so we can plan something special for you!</p>
                                <div className="flex flex-wrap gap-2">
                                    {selectedMembership.interest_options.map((opt) => (
                                        <button 
                                            key={opt}
                                            type="button"
                                            onClick={() => toggleSelection("interests", opt)}
                                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                                formData.interests.includes(opt) 
                                                ? 'bg-[#101848] text-white shadow-md' 
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </section>

                            {/* Section 4: Custom Questions */}
                            {selectedMembership.custom_questions.length > 0 && (
                                <section className="space-y-6">
                                    <h3 className="text-xl font-bold text-[#101848] border-b border-gray-100 pb-2">Additional Information</h3>
                                    {selectedMembership.custom_questions.map((q, i) => (
                                        <div key={i}>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">{q.question}</label>
                                            <textarea 
                                                onChange={(e) => setFormData({
                                                    ...formData, 
                                                    custom_answers: { ...formData.custom_answers, [q.question]: e.target.value }
                                                })}
                                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#101848] outline-none text-black transition-all"
                                                rows={3}
                                            />
                                        </div>
                                    ))}
                                </section>
                            )}

                            {/* Section 5: Terms & Conditions */}
                            <section className="space-y-6 p-5 sm:p-8 rounded-3xl border border-gray-100">
                                <h3 className="text-xl font-bold text-[#101848]">Terms and Conditions For Members</h3>
                                <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-200 max-h-60 overflow-y-auto text-sm text-gray-600 leading-relaxed whitespace-pre-wrap mb-6">
                                    {selectedMembership.terms_and_conditions}
                                </div>
                                <div className="flex items-center gap-6">
                                    <label className="flex items-center cursor-pointer group">
                                        <input 
                                            type="radio" 
                                            name="agreed"
                                            checked={formData.agreed_to_terms === true}
                                            onChange={() => setFormData({...formData, agreed_to_terms: true})}
                                            className="w-5 h-5 text-green-600 border-gray-300 focus:ring-green-500"
                                        />
                                        <span className="ml-3 font-bold text-green-700">YES, I Agree</span>
                                    </label>
                                    <label className="flex items-center cursor-pointer group">
                                        <input 
                                            type="radio" 
                                            name="agreed"
                                            checked={formData.agreed_to_terms === false}
                                            onChange={() => setFormData({...formData, agreed_to_terms: false})}
                                            className="w-5 h-5 text-red-600 border-gray-300 focus:ring-red-500"
                                        />
                                        <span className="ml-3 font-bold text-red-700">No</span>
                                    </label>
                                </div>
                            </section>

                            <div className="pt-10 flex flex-col items-center">
                                {message && <div className="text-red-500 text-sm mb-4 font-medium">{message}</div>}
                                <button 
                                    type="submit"
                                    disabled={submitting || !formData.agreed_to_terms}
                                    className="w-full md:w-auto px-12 py-4 rounded-2xl bg-[#101848] text-white font-bold text-lg hover:bg-[#1b1b2b] transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-95"
                                >
                                    {submitting ? 'Submitting Application...' : 'Submit Application'}
                                </button>
                                <p className="mt-4 text-xs text-gray-400">By clicking submit, you agree to our privacy policy and data processing terms.</p>
                            </div>
                        </form>
                    </div>
                </div>
                <Footer />
                <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
            </main>
        );
    }

    return (
        <main className="relative min-h-screen text-[#1b1b2b] selection:bg-[#101848]/10 font-sans">
            <Navbar />
            <div className="relative z-10 max-w-7xl mx-auto py-12 md:py-20 px-4">
                <div className="text-center mb-16">
                    <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#101848] mb-6">Become a Member</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">Join our community and embark on a transformative journey towards self-awareness and inner peace.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {memberships.map((m) => (
                        <div key={m.id} className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 hover:shadow-2xl transition-all duration-500 flex flex-col group hover:-translate-y-2">
                            <h2 className="text-2xl font-serif font-bold text-[#101848] mb-4">{m.name}</h2>
                            <div className="space-y-4 mb-8 flex-1">
                                {m.membership_types.map((t) => (
                                    <div key={t.name} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                                        <span className="text-gray-600 font-medium">{t.name}</span>
                                        <span className="text-[#101848] font-bold">${t.price} / mo</span>
                                    </div>
                                ))}
                            </div>
                            <button 
                                onClick={() => handleApply(m)}
                                className="w-full py-4 rounded-2xl bg-[#101848] text-white font-bold hover:bg-[#1b1b2b] transition-all shadow-lg group-hover:scale-[1.02]"
                            >
                                Apply Now
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </main>
    );
}
