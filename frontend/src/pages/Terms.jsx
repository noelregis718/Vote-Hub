import React from 'react';
import { motion } from 'framer-motion';

export default function Terms() {
  return (
    <div className="min-h-screen pt-20 pb-24 px-4 max-w-4xl mx-auto space-y-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6 text-center md:text-left"
      >
        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight bg-gradient-to-r from-white via-slate-300 to-slate-500 bg-clip-text text-transparent">
          Terms of Service
        </h1>
        <p className="text-white text-xl font-light opacity-80">
          Last updated: April 1, 2026
        </p>
      </motion.div>

      <div className="space-y-12 text-white/90 leading-relaxed text-lg">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight underline decoration-white/10 underline-offset-8">1. Acceptance of Terms</h2>
          <p>
            By accessing or using VoteHub, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight underline decoration-white/10 underline-offset-8">2. Use License</h2>
          <p>
            Permission is granted to temporarily use the services on VoteHub for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight underline decoration-white/10 underline-offset-8">3. User Conduct</h2>
          <p>
            Users are expected to interact with the platform in a respectful and lawful manner. Any attempt to manipulate voting results, harass others, or compromise the security of the platform will result in immediate termination of access.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight underline decoration-white/10 underline-offset-8">4. Intellectual Property</h2>
          <p>
            All content on VoteHub, including branding, designs, and source code, is the intellectual property of VoteHub and protected by applicable copyright and trademark law.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight underline decoration-white/10 underline-offset-8">5. Disclaimers</h2>
          <p>
            The services on VoteHub are provided on an 'as is' basis. VoteHub makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability.
          </p>
        </section>
      </div>
    </div>
  );
}
