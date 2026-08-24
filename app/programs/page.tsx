"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Calendar,
    MapPin,
    Clock,
    ArrowRight,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Info,
    ChevronRight,
    Search,
    Filter,
    X,
    FileText,
    ShieldCheck,
    Languages,
    Utensils,
    Activity,
    Users,
    PhoneCall,
    Share2,
    Lock,
    Sparkles,
    User,
    HeartPulse
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { programsApi, Program, RegistrationPayload } from "@/lib/api/programs";
import { useAuth } from "@/hooks/useAuth";
import CompleteProfileModal from "@/components/auth/CompleteProfileModal";
import AuthModal from "@/components/auth/AuthModal";
import ProgramsListClassic from "@/components/programs/ProgramsListClassic";
import { isProfileComplete } from "@/lib/profile";
import PhoneField, { isValidPhone, phoneErrorMessage } from "@/components/forms/PhoneField";

const FIELD_BASE = "w-full px-4 py-2.5 bg-gray-50 border rounded-xl focus:border-[#101848] transition-all text-sm font-medium text-[#101848]";

const fieldClass = (hasError?: boolean, extra = "") =>
    `${FIELD_BASE} ${hasError ? "border-red-400 bg-red-50/50" : "border-black/10"} ${extra}`.trim();

const FieldError = ({ message }: { message?: string }) =>
    message ? <p className="text-[10px] font-bold text-red-600 ml-1 mt-1">{message}</p> : null;

export default function ProgramsPage() {
    const { user, tokens, isAuthenticated } = useAuth();
    const [programs, setPrograms] = useState<Program[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
    const [showRegForm, setShowRegForm] = useState(false);
    const [isCompleteProfileOpen, setIsCompleteProfileOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    /* Held while the completion modal is open so the visitor lands back on the
       programme they picked instead of an empty page once the profile is saved. */
    const [pendingProgram, setPendingProgram] = useState<Program | null>(null);

    // Registration Form State
    const [regLoading, setRegLoading] = useState(false);
    const [regSuccess, setRegSuccess] = useState(false);
    const [regError, setRegError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [regStep, setRegStep] = useState(1);
    const [formData, setFormData] = useState<RegistrationPayload>({
        nric_last_4: "",
        preferred_language: "English",
        meal_preference: "Vegetarian",
        health_issues: "None",
        referred_by: "",
        emergency_contact_name: "",
        emergency_contact_phone: "",
        emergency_contact_relation: "",
        discovery_source: "",
        introducer_name: "",
        introducer_phone: "",
        pay_full: true
    });

    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const data = await programsApi.listPrograms();
                setPrograms(data);
            } catch (err: any) {
                setError(err.message || "Failed to load programs");
            } finally {
                setLoading(false);
            }
        };
        fetchPrograms();
    }, []);

    const handleRegisterClick = (program: Program) => {
        if (!isAuthenticated) {
            setIsAuthModalOpen(true);
            return;
        }
        /* Gate on the profile HERE, not at payment. The API rejects an incomplete
           profile with a 400, but only on submit — so the visitor filled in the whole
           two-step form and pressed pay before being told to go and complete it. The
           submit handler still catches that 400 as a backstop. */
        if (!isProfileComplete(user)) {
            setPendingProgram(program);
            setIsCompleteProfileOpen(true);
            return;
        }
        setSelectedProgram(program);
        setRegStep(1);
        setFieldErrors({});
        setRegError(null);
        setFormData(prev => ({
            ...prev,
            preferred_language: program.languages?.[0] || "English",
            discovery_source: program.discovery_sources?.[0] || ""
        }));
        setShowRegForm(true);
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear this field's error as soon as it is edited, so the message goes away
        // when it is addressed rather than lingering until the next Continue.
        setFieldErrors(prev => {
            if (!prev[name]) return prev;
            const next = { ...prev };
            delete next[name];
            return next;
        });
    };

    /**
     * Step 1's Continue is a `type="button"`, which means the browser never runs its
     * own `required` checks on that step — every field could be left blank and the
     * form would still advance to payment. This gates it explicitly.
     */
    const validateStep1 = () => {
        const errors: Record<string, string> = {};

        if (!/^\d{4}$/.test(formData.nric_last_4.trim())) {
            errors.nric_last_4 = "Enter the last 4 digits.";
        }
        if (!formData.emergency_contact_name.trim()) {
            errors.emergency_contact_name = "Required.";
        }
        if (!formData.emergency_contact_relation) {
            errors.emergency_contact_relation = "Required.";
        }
        if (!formData.emergency_contact_phone.trim()) {
            errors.emergency_contact_phone = "Required.";
        } else if (!isValidPhone(formData.emergency_contact_phone)) {
            // Country-aware: judged against the selected country's own rules, and the
            // message names that country so a number typed under the wrong flag says so.
            errors.emergency_contact_phone = phoneErrorMessage(formData.emergency_contact_phone);
        }

        if (formData.discovery_source === "Introducer") {
            // Both introducer fields are optional in the payload type — they only exist
            // when this source is picked — so default before checking.
            const introducerName = formData.introducer_name ?? "";
            const introducerPhone = formData.introducer_phone ?? "";

            if (!introducerName.trim()) {
                errors.introducer_name = "Required.";
            }
            if (!introducerPhone.trim()) {
                errors.introducer_phone = "Required.";
            } else if (!isValidPhone(introducerPhone)) {
                errors.introducer_phone = phoneErrorMessage(introducerPhone);
            }
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmitRegistration = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProgram || !tokens?.access_token) return;

        // Re-check step 1 here too: the user can walk back from payment and edit it.
        if (!validateStep1()) {
            setRegStep(1);
            return;
        }

        setRegLoading(true);
        setRegError(null);
        try {
            const response = await programsApi.register(selectedProgram.id, tokens.access_token, formData);

            if (response.payment_url) {
                // Redirect to HitPay
                window.location.href = response.payment_url;
                return;
            }

            setRegSuccess(true);
            setTimeout(() => {
                setShowRegForm(false);
                setRegSuccess(false);
                setSelectedProgram(null);
            }, 3000);
        } catch (err: any) {
            if (err.profileIncomplete) {
                setRegError(err.message);
                setIsCompleteProfileOpen(true);
            } else {
                setRegError(err.message || "Registration failed. Please try again.");
            }
        } finally {
            setRegLoading(false);
        }
    };

    return (
        <main className="min-h-screen text-[#1b1b2b] font-sans">
            <Navbar />

            {/* No background of its own — the page marble shows through. The navy
                panel and its `upcoming_event.png` overlay are gone, so the copy is
                recoloured to the classic dark-on-light palette; left white it would
                have been invisible against the pale plate.

                Padding is small because the navbar is STICKY, not fixed: this section
                already begins below it in normal flow. The old `pt-40` was clearing a
                navbar that never overlapped it, leaving 160px of blank plate above the
                heading on desktop. */}
            <section className="relative pt-10 md:pt-16 pb-8 md:pb-10 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <span className="px-6 py-2 bg-[#101848]/5 text-[#101848]/70 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-[#101848]/15 inline-block">
                            Transformative Journeys
                        </span>
                        <h1 className="text-3xl sm:text-5xl md:text-7xl font-serif font-bold text-[#101848] tracking-tight">
                            Upcoming Programs
                        </h1>
                        <div className="w-24 h-1 bg-[#101848]/20 mx-auto rounded-full" />
                        <p className="text-[#233252]/70 max-w-2xl mx-auto text-base sm:text-lg italic font-serif">
                            "The purpose of life is to be useful, to be honorable, to be compassionate, to have it make some difference that you have lived and lived well."
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Programs List Section. Only a small top padding — the heading block
                above supplies the separation, and doubling both sides pushed the first
                card most of a screen down. */}
            <section className="pt-2 md:pt-4 pb-10 md:pb-14 max-w-7xl mx-auto px-6">
                <ProgramsListClassic
                    programs={programs}
                    loading={loading}
                    error={error}
                    onRegister={handleRegisterClick}
                />
            </section>

            {/* Registration Modal Overlay */}
            <AnimatePresence>
                {showRegForm && selectedProgram && (
                    /* The dialog scrolls the OUTER container, not the panel: the form is
                       three columns wide on desktop but stacks to one very tall column on
                       mobile. Previously the panel was centred inside a non-scrolling
                       `fixed inset-0`, so everything below the fold — including the
                       submit button — was simply unreachable on a phone. */
                    <div className="fixed inset-0 z-[1200] overflow-y-auto overscroll-contain">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => !regLoading && setShowRegForm(false)}
                            className="fixed inset-0 bg-[#101848]/20 backdrop-blur-md"
                        />

                        <div className="relative min-h-full flex items-center justify-center p-3 sm:p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-5xl bg-white rounded-[24px] sm:rounded-[40px] shadow-2xl flex flex-col border border-black/5"
                        >
                            <button
                                onClick={() => setShowRegForm(false)}
                                aria-label="Close registration form"
                                className="absolute right-3 top-3 sm:right-8 sm:top-8 p-2 text-black/30 hover:text-black/80 transition-colors rounded-full hover:bg-black/5 z-50 bg-white/80 backdrop-blur-sm sm:bg-transparent"
                            >
                                <X size={22} />
                            </button>

                            <div className="p-5 sm:p-8 md:p-10">
                                {/* Modal Header - Minimalist */}
                                <div className="text-center space-y-2 mb-6 px-8 sm:px-0">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-full border border-black/5 text-black/40 text-[9px] font-black uppercase tracking-[0.2em]">
                                        <Sparkles size={10} />
                                        Program Registration
                                    </div>
                                    <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-[#101848] tracking-tight text-balance">
                                        Join {selectedProgram.program_name}
                                    </h2>
                                    <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[10px] font-black uppercase tracking-widest text-black/40">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar size={14} className="text-[#101848]/20" />
                                            {selectedProgram.date_range}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <MapPin size={14} className="text-[#101848]/20" />
                                            {selectedProgram.city}
                                        </div>
                                    </div>
                                </div>

                                {regSuccess ? (
                                    <div className="py-10 flex flex-col items-center text-center space-y-6">
                                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center border border-green-100 animate-bounce">
                                            <CheckCircle2 className="text-green-600 w-10 h-10" />
                                        </div>
                                        <h3 className="text-2xl font-serif font-bold text-[#101848]">Registration Confirmed</h3>
                                        <button
                                            onClick={() => setShowRegForm(false)}
                                            className="px-8 py-3 bg-[#101848] text-white rounded-full font-bold"
                                        >
                                            Done
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmitRegistration} className="space-y-6">
                                        {regStep === 1 ? (
                                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                                                {/* Step 1: Info Grid */}
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6">
                                                    {/* Column 1: Personal Preferences */}
                                                    <div className="space-y-4 min-w-0">
                                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#101848]/40 mb-3 border-b border-black/5 pb-2">Preferences</h4>
                                                        <div className="space-y-3">
                                                            <div className="space-y-1.5">
                                                                <label className="text-[10px] font-black uppercase tracking-widest text-[#101848] ml-1 flex items-center gap-2">
                                                                    <ShieldCheck size={12} className="text-[#101848]/40" />
                                                                    NRIC (Last 4)
                                                                </label>
                                                                <input
                                                                    type="text" inputMode="numeric" name="nric_last_4" required maxLength={4} value={formData.nric_last_4} onChange={handleFormChange}
                                                                    aria-invalid={!!fieldErrors.nric_last_4}
                                                                    className={fieldClass(!!fieldErrors.nric_last_4)}
                                                                    placeholder="1234"
                                                                />
                                                                <FieldError message={fieldErrors.nric_last_4} />
                                                            </div>
                                                            <div className="space-y-1.5">
                                                                <label className="text-[10px] font-black uppercase tracking-widest text-[#101848] ml-1 flex items-center gap-2">
                                                                    <Languages size={12} className="text-[#101848]/40" />
                                                                    Language
                                                                </label>
                                                                <select
                                                                    name="preferred_language" value={formData.preferred_language} onChange={handleFormChange}
                                                                    className={fieldClass(false, "appearance-none")}
                                                                >
                                                                    {selectedProgram.languages && selectedProgram.languages.length > 0 ? (
                                                                        selectedProgram.languages.map(lang => (
                                                                            <option key={lang} value={lang}>{lang}</option>
                                                                        ))
                                                                    ) : (
                                                                        <>
                                                                            <option value="English">English</option>
                                                                            <option value="Mandarin">Mandarin</option>
                                                                            <option value="Malay">Malay</option>
                                                                            <option value="Tamil">Tamil</option>
                                                                        </>
                                                                    )}
                                                                </select>
                                                            </div>
                                                            <div className="space-y-1.5">
                                                                <label className="text-[10px] font-black uppercase tracking-widest text-[#101848] ml-1 flex items-center gap-2">
                                                                    <Utensils size={12} className="text-[#101848]/40" />
                                                                    Meal
                                                                </label>
                                                                <select
                                                                    name="meal_preference" value={formData.meal_preference} onChange={handleFormChange}
                                                                    className={fieldClass(false, "appearance-none")}
                                                                >
                                                                    <option value="Vegetarian">Vegetarian</option>
                                                                    <option value="Non-Vegetarian">Non-Vegetarian</option>
                                                                    <option value="Vegan">Vegan</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Column 2: Emergency Contact */}
                                                    <div className="space-y-4 min-w-0">
                                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#101848]/40 mb-3 border-b border-black/5 pb-2">Emergency Contact</h4>
                                                        <div className="space-y-3">
                                                            <div className="space-y-1.5">
                                                                <label className="text-[10px] font-black uppercase tracking-widest text-[#101848] ml-1 flex items-center gap-2">
                                                                    <User size={12} className="text-[#101848]/40" />
                                                                    Contact Name
                                                                </label>
                                                                <input
                                                                    type="text" name="emergency_contact_name" required value={formData.emergency_contact_name} onChange={handleFormChange}
                                                                    aria-invalid={!!fieldErrors.emergency_contact_name}
                                                                    className={fieldClass(!!fieldErrors.emergency_contact_name)}
                                                                    placeholder="Full Name"
                                                                />
                                                            </div>
                                                            <div className="space-y-1.5">
                                                                <label className="text-[10px] font-black uppercase tracking-widest text-[#101848] ml-1 flex items-center gap-2">
                                                                    <Users size={12} className="text-[#101848]/40" />
                                                                    Relationship
                                                                </label>
                                                                <select
                                                                    name="emergency_contact_relation" required value={formData.emergency_contact_relation} onChange={handleFormChange}
                                                                    aria-invalid={!!fieldErrors.emergency_contact_relation}
                                                                    className={fieldClass(!!fieldErrors.emergency_contact_relation, "appearance-none")}
                                                                >
                                                                    <option value="">Select Relation</option>
                                                                    <option value="Spouse">Spouse</option>
                                                                    <option value="Parent">Parent</option>
                                                                    <option value="Sibling">Sibling</option>
                                                                    <option value="Child">Child</option>
                                                                    <option value="Friend">Friend</option>
                                                                    <option value="Other">Other</option>
                                                                </select>
                                                                <FieldError message={fieldErrors.emergency_contact_relation} />
                                                            </div>
                                                            <div className="space-y-1.5">
                                                                <label className="text-[10px] font-black uppercase tracking-widest text-[#101848] ml-1 flex items-center gap-2">
                                                                    <PhoneCall size={12} className="text-[#101848]/40" />
                                                                    Contact Phone
                                                                </label>
                                                                <PhoneField
                                                                    value={formData.emergency_contact_phone}
                                                                    onChange={(v) => {
                                                                        setFormData(prev => ({ ...prev, emergency_contact_phone: v || "" }));
                                                                        setFieldErrors(prev => {
                                                                            if (!prev.emergency_contact_phone) return prev;
                                                                            const next = { ...prev };
                                                                            delete next.emergency_contact_phone;
                                                                            return next;
                                                                        });
                                                                    }}
                                                                    error={fieldErrors.emergency_contact_phone}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Column 3: Misc & Health */}
                                                    <div className="space-y-4 min-w-0">
                                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#101848]/40 mb-3 border-b border-black/5 pb-2">Additional Info</h4>
                                                        <div className="space-y-3">
                                                            <div className="space-y-1.5">
                                                                <label className="text-[10px] font-black uppercase tracking-widest text-[#101848] ml-1 flex items-center gap-2">
                                                                    <Activity size={12} className="text-[#101848]/40" />
                                                                    Referred By
                                                                </label>
                                                                <input
                                                                    type="text" name="referred_by" value={formData.referred_by} onChange={handleFormChange}
                                                                    className={fieldClass()}
                                                                    placeholder="Name"
                                                                />
                                                            </div>
                                                            <div className="space-y-1.5">
                                                                <label className="text-[10px] font-black uppercase tracking-widest text-[#101848] ml-1 flex items-center gap-2">
                                                                    <Share2 size={12} className="text-[#101848]/40" />
                                                                    Discovery Source
                                                                </label>
                                                                <select
                                                                    name="discovery_source" value={formData.discovery_source} onChange={handleFormChange}
                                                                    className={fieldClass(false, "appearance-none")}
                                                                >
                                                                    <option value="">Select Source</option>
                                                                    {selectedProgram.discovery_sources?.map(source => (
                                                                        <option key={source} value={source}>{source}</option>
                                                                    ))}
                                                                </select>
                                                            </div>

                                                            {formData.discovery_source === "Introducer" && (
                                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-1 duration-300">
                                                                    <div className="space-y-1.5">
                                                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#101848] ml-1 flex items-center gap-2">
                                                                            <User size={12} className="text-[#101848]/40" />
                                                                            Name
                                                                        </label>
                                                                        <input
                                                                            type="text" name="introducer_name" required value={formData.introducer_name} onChange={handleFormChange}
                                                                            aria-invalid={!!fieldErrors.introducer_name}
                                                                            className={fieldClass(!!fieldErrors.introducer_name)}
                                                                            placeholder="Name"
                                                                        />
                                                                    </div>
                                                                    <div className="space-y-1.5">
                                                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#101848] ml-1 flex items-center gap-2">
                                                                            <PhoneCall size={12} className="text-[#101848]/40" />
                                                                            Phone
                                                                        </label>
                                                                        <PhoneField
                                                                            value={formData.introducer_phone}
                                                                            onChange={(v) => {
                                                                                setFormData(prev => ({ ...prev, introducer_phone: v || "" }));
                                                                                setFieldErrors(prev => {
                                                                                    if (!prev.introducer_phone) return prev;
                                                                                    const next = { ...prev };
                                                                                    delete next.introducer_phone;
                                                                                    return next;
                                                                                });
                                                                            }}
                                                                            error={fieldErrors.introducer_phone}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            )}
                                                            <div className="space-y-1.5">
                                                                <label className="text-[10px] font-black uppercase tracking-widest text-[#101848] ml-1 flex items-center gap-2">
                                                                    <HeartPulse size={12} className="text-[#101848]/40" />
                                                                    Health Issues
                                                                </label>
                                                                <input
                                                                    type="text" name="health_issues" value={formData.health_issues} onChange={handleFormChange}
                                                                    className={fieldClass()}
                                                                    placeholder="Optional"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex justify-stretch sm:justify-end pt-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => { if (validateStep1()) setRegStep(2); }}
                                                        className="w-full sm:w-auto px-10 py-4 bg-[#101848] text-white font-black uppercase tracking-widest text-[10px] rounded-full shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3"
                                                    >
                                                        Continue to Payment <ArrowRight size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500 max-w-2xl mx-auto">
                                                {/* Step 2: Payment Selection */}
                                                <div className="bg-[#101848]/5 rounded-[24px] sm:rounded-[40px] p-6 sm:p-10 border border-[#101848]/10">
                                                    <div className="flex flex-col items-center text-center gap-6 sm:gap-8">
                                                        <div className="space-y-3">
                                                            <h4 className="text-2xl md:text-3xl font-serif font-bold text-[#101848]">Secure Your Spot</h4>
                                                            <p className="text-black/40 text-sm font-medium">Almost there! Select your payment preference to complete registration.</p>
                                                        </div>

                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                                                            <button
                                                                type="button"
                                                                onClick={() => setFormData(prev => ({ ...prev, pay_full: true }))}
                                                                className={`p-5 sm:p-6 rounded-[20px] sm:rounded-[24px] border transition-all flex flex-col items-center gap-2 ${formData.pay_full
                                                                        ? "bg-white border-[#101848] shadow-2xl scale-105"
                                                                        : "bg-transparent border-black/5 hover:border-black/20"
                                                                    }`}
                                                            >
                                                                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-black/30">Full Payment</span>
                                                                <span className="text-2xl sm:text-3xl font-bold text-[#101848]">RM {selectedProgram.price}</span>
                                                                <div className="mt-2 w-2 h-2 rounded-full bg-[#101848] opacity-0 transition-opacity" style={{ opacity: formData.pay_full ? 1 : 0 }} />
                                                            </button>

                                                            {selectedProgram.allow_partial_payment && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setFormData(prev => ({ ...prev, pay_full: false }))}
                                                                    className={`p-5 sm:p-6 rounded-[20px] sm:rounded-[24px] border transition-all flex flex-col items-center gap-2 ${!formData.pay_full
                                                                            ? "bg-white border-[#101848] shadow-2xl scale-105"
                                                                            : "bg-transparent border-black/5 hover:border-black/20"
                                                                        }`}
                                                                >
                                                                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-black/30">Minimum Deposit</span>
                                                                    <span className="text-2xl sm:text-3xl font-bold text-[#101848]">RM {selectedProgram.minimum_deposit}</span>
                                                                    <div className="mt-2 w-2 h-2 rounded-full bg-[#101848] opacity-0 transition-opacity" style={{ opacity: !formData.pay_full ? 1 : 0 }} />
                                                                </button>
                                                            )}
                                                        </div>

                                                        <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-black/30">
                                                            <Lock size={14} />
                                                            SSL Secure Payment via HitPay
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4">
                                                    <button
                                                        type="button"
                                                        onClick={() => setRegStep(1)}
                                                        className="text-[10px] font-black uppercase tracking-widest text-black/40 hover:text-black transition-colors"
                                                    >
                                                        Go Back to Info
                                                    </button>

                                                    <button
                                                        type="submit"
                                                        disabled={regLoading}
                                                        className="w-full sm:w-auto px-12 py-4 bg-[#101848] text-white font-black uppercase tracking-widest text-[10px] rounded-full shadow-2xl shadow-blue-900/20 hover:bg-black transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-3"
                                                    >
                                                        {regLoading ? <Loader2 className="animate-spin" size={16} /> : <>Pay & Confirm <ArrowRight size={16} /></>}
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {regError && (
                                            <div className="flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-[10px] font-bold uppercase tracking-wider">
                                                <AlertCircle size={14} />
                                                {regError}
                                            </div>
                                        )}
                                    </form>
                                )}
                            </div>
                        </motion.div>
                        </div>
                    </div>
                )}
            </AnimatePresence>

            <CompleteProfileModal
                isOpen={isCompleteProfileOpen}
                onClose={() => {
                    setIsCompleteProfileOpen(false);
                    /* Resume where they left off: if the profile is now complete, open
                       the registration form for the programme they originally picked
                       rather than dropping them back on the list. */
                    const resume = pendingProgram;
                    setPendingProgram(null);
                    if (resume && isProfileComplete(user)) {
                        handleRegisterClick(resume);
                    }
                }}
            />

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />

            <Footer />
        </main>
    );
}
