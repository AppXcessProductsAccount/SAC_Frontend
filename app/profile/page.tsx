"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
    User, 
    Mail, 
    Phone, 
    Save, 
    ArrowLeft, 
    Loader2, 
    CheckCircle2, 
    AlertCircle,
    Camera,
    Heart,
    Users,
    Calendar,
    Briefcase,
    MapPin
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { userApi } from "@/lib/api/user";

export default function ProfilePage() {
    const router = useRouter();
    const { user, tokens, isAuthenticated, loading: authLoading, updateUser } = useAuth();
    
    const [fullName, setFullName] = useState("");
    const [nickname, setNickname] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [gender, setGender] = useState("");
    const [dob, setDob] = useState("");
    const [occupation, setOccupation] = useState("");
    const [address, setAddress] = useState("");
    
    const [avatar, setAvatar] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push("/");
        }
    }, [authLoading, isAuthenticated, router]);

    useEffect(() => {
        if (user) {
            setFullName(user.full_name || "");
            setNickname(user.nickname || "");
            setEmail(user.email || "");
            setPhone(user.phone_number || "");
            setGender(user.gender || "");
            setDob(user.dob || "");
            setOccupation(user.occupation || "");
            setAddress(user.address || "");
            setAvatarPreview(user.profile_image_url || null);
        }
    }, [user]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatar(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!tokens?.access_token) return;

        setLoading(true);
        setMessage(null);
        try {
            const updatedUser = await userApi.updateMe(tokens.access_token, {
                full_name: fullName,
                nickname,
                email,
                phone_number: phone,
                gender,
                dob,
                occupation,
                address,
                avatar: avatar || undefined
            });
            updateUser(updatedUser);
            setAvatar(null);
            setMessage({ type: 'success', text: "Profile updated successfully!" });
            setTimeout(() => setMessage(null), 3000);
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || "Failed to update profile" });
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#eeebf0]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <main className="bg-[#eeebf0] min-h-screen text-[#1b1b2b] selection:bg-[#101848]/10 font-sans">
            <Navbar />
            
            <div className="max-w-5xl mx-auto px-6 py-12 md:py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                >
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <button 
                                onClick={() => router.back()}
                                className="flex items-center gap-2 text-sm text-[#101848]/60 hover:text-[#101848] transition-colors mb-4 group"
                            >
                                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                                Back
                            </button>
                            <h1 className="text-2xl md:text-4xl font-serif font-bold text-[#101848]">Profile Settings</h1>
                            <p className="text-[#101848]/60 italic font-serif">"The journey inward begins with self-awareness."</p>
                        </div>
                        
                        <div className="relative group self-start md:self-center">
                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 border-4 border-white shadow-xl flex items-center justify-center overflow-hidden">
                                {avatarPreview ? (
                                    <img src={avatarPreview} alt={user.full_name} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold text-[#101848]">
                                        {user.full_name?.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <label className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-gray-100 text-[#101848] hover:bg-[#101848] hover:text-white transition-all cursor-pointer">
                                <Camera size={18} />
                                <input 
                                    type="file" 
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </label>
                        </div>
                    </div>

                    {/* Settings Form */}
                    <div className="bg-white rounded-[32px] p-8 md:p-10 border border-white shadow-sm">
                        <form onSubmit={handleUpdate} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Basic Info Section */}
                                <div className="space-y-6">
                                    <h3 className="text-lg font-serif font-bold text-[#101848] border-b pb-2">Basic Information</h3>
                                    
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-[#101848]/80 ml-1">Full Name</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#101848]/30">
                                                <User size={20} />
                                            </div>
                                            <input 
                                                type="text"
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#101848]/10 transition-all"
                                                placeholder="Deepak"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-[#101848]/80 ml-1">Nickname</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#101848]/30">
                                                <Heart size={20} />
                                            </div>
                                            <input 
                                                type="text"
                                                value={nickname}
                                                onChange={(e) => setNickname(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#101848]/10 transition-all"
                                                placeholder="Nick name"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-[#101848]/80 ml-1">Gender</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#101848]/30">
                                                <Users size={20} />
                                            </div>
                                            <select
                                                value={gender}
                                                onChange={(e) => setGender(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#101848]/10 transition-all appearance-none"
                                            >
                                                <option value="" disabled>Select Gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-[#101848]/80 ml-1">Date of Birth</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#101848]/30">
                                                <Calendar size={20} />
                                            </div>
                                            <input 
                                                type="date"
                                                value={dob}
                                                onChange={(e) => setDob(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#101848]/10 transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Info Section */}
                                <div className="space-y-6">
                                    <h3 className="text-lg font-serif font-bold text-[#101848] border-b pb-2">Contact & Professional</h3>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-[#101848]/80 ml-1">Email Address</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#101848]/30">
                                                <Mail size={20} />
                                            </div>
                                            <input 
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#101848]/10 transition-all"
                                                placeholder="email@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-[#101848]/80 ml-1">Phone Number</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#101848]/30">
                                                <Phone size={20} />
                                            </div>
                                            <input 
                                                type="tel"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#101848]/10 transition-all"
                                                placeholder="+91 phone number"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-[#101848]/80 ml-1">Occupation</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#101848]/30">
                                                <Briefcase size={20} />
                                            </div>
                                            <input 
                                                type="text"
                                                value={occupation}
                                                onChange={(e) => setOccupation(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#101848]/10 transition-all"
                                                placeholder="Software Engineer"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-[#101848]/80 ml-1">Address</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#101848]/30">
                                                <MapPin size={20} />
                                            </div>
                                            <input 
                                                type="text"
                                                value={address}
                                                onChange={(e) => setAddress(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#101848]/10 transition-all"
                                                placeholder="Your residential address"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 flex flex-col gap-4">
                                {message && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className={`flex items-center gap-3 p-4 rounded-2xl border ${
                                            message.type === 'success' 
                                            ? 'bg-green-50 border-green-100 text-green-700' 
                                            : 'bg-red-50 border-red-100 text-red-700'
                                        }`}
                                    >
                                        {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                                        <span className="text-sm font-medium">{message.text}</span>
                                    </motion.div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full md:w-max flex items-center justify-center gap-2 px-12 py-4 bg-[#101848] text-white font-bold rounded-2xl shadow-xl shadow-[#101848]/20 hover:bg-[#1b1b2b] transition-all active:scale-[0.98] disabled:opacity-70 ml-auto"
                                >
                                    {loading ? (
                                        <Loader2 className="animate-spin" size={22} />
                                    ) : (
                                        <>
                                            <Save size={20} />
                                            Save All Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Account Security Info */}
                    <div className="bg-[#101848]/5 rounded-[32px] p-8 border border-[#101848]/5">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-white rounded-2xl text-[#101848]">
                                <AlertCircle size={24} />
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-bold text-[#101848]">Account Security</h3>
                                <p className="text-sm text-[#101848]/60">
                                    Your account is secured with OTP-based authentication. We'll send a code to your registered email whenever you sign in to keep your practice private and secure.
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            <Footer />
        </main>
    );
}
