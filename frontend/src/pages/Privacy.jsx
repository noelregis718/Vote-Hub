import React from 'react';
import { motion } from 'framer-motion';

export default function Privacy() {
  return (
    <div className="min-h-screen pt-20 pb-24 px-4 max-w-4xl mx-auto space-y-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6 text-center md:text-left"
      >
        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight bg-gradient-to-r from-white via-slate-300 to-slate-500 bg-clip-text text-transparent">
          Privacy Policy
        </h1>
        <p className="text-white text-xl font-light opacity-80">
          Last updated: April 1, 2026
        </p>
      </motion.div>

      <div className="space-y-12 text-white/90 leading-relaxed text-lg">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight underline decoration-white/10 underline-offset-8">1. Introduction</h2>
          <p>
            Your privacy is important to us at VoteHub. This Privacy Policy outlines how we handle information collected through our services, including our website, product pages, mobile or web applications, or other digital products.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight underline decoration-white/10 underline-offset-8">2. Information We Collect</h2>
          <p>
            We collect information that you provide directly to us, such as when you create an account, participate in a poll, or communicate with us. This may include your name, email address, and voting preferences.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight underline decoration-white/10 underline-offset-8">3. Data Usage</h2>
          <p>
            We use the information we collect to provide, maintain, and improve our services, to process your transactions, and to communicate with you about your account and our services.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight underline decoration-white/10 underline-offset-8">4. Security</h2>
          <p>
            We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight underline decoration-white/10 underline-offset-8">5. Changes to the Policy</h2>
          <p>
            We reserve the right to change this Policy at any time. If we make changes, we will notify you by revising the date at the top of the policy and, in some cases, providing you with additional notice.
          </p>
        </section>
      </div>
    </div>
  );
}
