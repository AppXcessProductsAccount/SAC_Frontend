"use client";

import { useState, useEffect } from "react";
import { cmsApi } from "@/lib/cms-api";
import AmbientBackground from "./AmbientBackground";
import { motion } from "framer-motion";

interface Product {
    name: string;
    description: string;
    price: number;
    image_url: string;
}

export default function Shop() {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await cmsApi.getProducts();
                setProducts(data);
            } catch (error) {
                console.error("Failed to fetch products:", error);
                setProducts([
                    {
                        name: "7-Chakra Meditation Audio Tamil",
                        description: "7-Chakra Meditation in Tamil (Audio). A guided journey through your energy centers.",
                        price: 10.00,
                        image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBjPMI13waoIjGZcF7s-NwhxQdBhxigpIBN41zC1k0JHeTdV_0dl04KnyfEp73nluhqKRfikeD6S5ZUpQ_HYxeEQEj1TE19HfnF03bYiNrTTy3LiHUVAOou6h_5l0TDYCGG1g2ZDKQayYvqA8Nc31tv7kTxq3KWhkoUJVfJe56U7-a-DL-NczKEvVHcwuCCUILsrtyCUnpDQQrEgMkxBuOSMYOfLF4LiwEdNKyUDgbKlhLaIdVNTPFBLZ6n7XA7SwXxSqWprhTU6HeX",
                    },
                    {
                        name: "7 Day Transformational Journey Class Fees",
                        description: "Atome Singapore Installment Plan – 7 Day Transformational Journey Class Fees. Start your evolution today.",
                        price: 796.00,
                        image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBYTOAPReK7Cp2xr948QwtQ2-AE_TPAjtNtXX7n_c8WcxjMcqhK1rNybq1D8_Och2iNpaP4HdPDPQNClyMbA5p6x-id0sf4B_GongXtoZFMDktgFhJFU8jvEqsy9dvafRrq1AobBATSxskxlm_Km1ngUPR_YXv4KpYac5LyH2Bu5lPYyIgf_jxps7neirHaZxjLs3cOi-QNFQfWI_cYt8s3TLTrntGscaqV2v92iEMyVMcN6h6fh6_rngp7RvnzOv64c8MNTbW5sEg7",
                    },
                    {
                        name: "Quality Mind Therapy – Meditation (Tamil)",
                        description: "Premium meditation session by Self Awareness. Quality Mind Therapy for inner peace.",
                        price: 7.00,
                        image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCvR-i1g1afmiuNFwajDJHfiGw32S63CKQQfEie4SqMzz5HXzHFtQoulSe4mSJx3mxXwhtjQYmJtQ87Yk2Br-A76pOH_5Y4yy_8-os13egreOSKc7imo1cpykA_ztKwO7qckWTL91mSpXqehc3DTZUSxv-sF33vrIeDrjAcLHJSaUC9l9vhDmGFQb0apyCF1ZzwDWd3stVkwn0I9xekbrzQ0d83-6rH_Hm8chBG0HfsQNoe9XKoz_5e6cNKplrtB77o5c2MQ5Q2BL1q",
                    },
                ]);
            }
        };
        fetchData();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.9, y: 20 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" as const },
        },
    };

    return (
        <section className="py-10 md:py-14 px-6 relative overflow-hidden bg-secondary/80 backdrop-blur-3xl" id="shop">
            <AmbientBackground starCount={30} opacity={0.3} />

            <div className="max-w-7xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6"
                >
                    <div className="max-w-xl text-left">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                            Mindful Essentials
                        </h2>
                        <p className="text-slate-300 text-lg leading-relaxed">
                            Curated tools to deepen your practice and transform your physical space into a sanctuary.
                        </p>
                    </div>
                    <button className="text-[var(--site-primary)] font-bold flex items-center gap-2 hover:translate-x-1 transition-transform group">
                        View Shop <span className="material-symbols-outlined text-sm">shopping_bag</span>
                    </button>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid md:grid-cols-3 gap-8"
                >
                    {products.map((product, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="bg-white border border-slate-100 p-4 rounded-xl group transition-all hover:shadow-lg shadow-md"
                        >
                            <div className="aspect-square rounded-lg overflow-hidden mb-6 relative">
                                <img
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    src={product.image_url}
                                />
                                <div className="absolute top-3 right-3">
                                    <button className="w-10 h-10 rounded-full bg-white/90 backdrop-blur shadow-sm flex items-center justify-center text-secondary hover:text-[var(--site-primary)] transition-colors">
                                        <span className="material-symbols-outlined">favorite</span>
                                    </button>
                                </div>
                            </div>
                            <div className="px-2 text-left">
                                <h3 className="text-xl font-bold text-secondary mb-2">{product.name}</h3>
                                <p className="text-slate-600 text-sm mb-4 leading-relaxed line-clamp-2">
                                    {product.description}
                                </p>
                                <div className="flex items-center justify-between mt-auto">
                                    <span className="text-2xl font-bold text-[var(--site-primary)]">
                                        ${product.price.toFixed(2)}
                                    </span>
                                    <button className="bg-[var(--site-primary)]/10 text-[var(--site-primary)] hover:bg-[var(--site-primary)] hover:text-white px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2">
                                        <span className="material-symbols-outlined text-base">add_shopping_cart</span>
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
