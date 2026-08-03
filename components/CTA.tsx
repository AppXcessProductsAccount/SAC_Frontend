"use client";

import AmbientBackground from "./AmbientBackground";
import { motion } from "framer-motion";

export default function CTA() {
    return (
        <section className="py-14 md:py-24 px-6 relative overflow-hidden bg-[var(--site-bg-dark)]">
            {/* Background Layer */}
            <AmbientBackground starCount={40} showShootingStar={true} opacity={0.5} />

            <div className="max-w-5xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="bg-white p-12 md:p-20 rounded-[3rem] text-center shadow-2xl border-none"
                >
                    <div className="max-w-3xl mx-auto">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className="text-2xl sm:text-4xl md:text-6xl font-bold text-secondary mb-8 leading-tight"
                        >
                            Ready to Begin Your Journey to <span className="text-[var(--site-primary)]">Clarity?</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5, duration: 1 }}
                            className="text-slate-600 text-xl mb-12 leading-relaxed"
                        >
                            Join millions of users who start their day with mindful presence.
                            Download the app today and get 7 days of premium access for free.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.7, duration: 0.8 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-6"
                        >
                            <button className="bg-[var(--site-primary)] text-secondary px-10 py-5 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-[var(--site-primary)]/20 transition-all w-full sm:w-auto">
                                Start Free Trial
                            </button>
                            <button className="text-secondary border border-secondary/20 px-10 py-5 rounded-full font-bold text-lg hover:bg-secondary/5 transition-all w-full sm:w-auto">
                                View Pricing
                            </button>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
