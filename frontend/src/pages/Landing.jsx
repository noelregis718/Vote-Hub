import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Shield, Zap, ArrowRight, Vote as VoteIcon } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-20 pb-12 md:pt-32 md:pb-24 overflow-hidden">
        {/* Decorative Blobs */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-white/10 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-slate-500/10 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-white/5 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>

        <div className="relative text-center space-y-8 max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400 text-sm font-medium backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/40 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <span>Version 1.0 is now live</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.1]"
          >
            Empower Your <br />
            <span className="bg-gradient-to-r from-white via-slate-300 to-slate-500 bg-clip-text text-transparent italic text-white drop-shadow-sm">
              Community
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-slate-400 text-xl md:text-2xl max-w-2xl mx-auto font-light leading-relaxed"
          >
            VoteHub provides a transparent, secure, and beautiful way to make collective decisions. 
            Join the decentralized future of governance today.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-6 pt-4"
          >
            <button
              onClick={() => navigate('/register')}
              className="glass-button text-lg px-8 py-4 flex items-center space-x-2 group"
            >
              <span>Get Started Now</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 border border-white/10 rounded-2xl hover:bg-white/5 transition-all text-lg font-medium backdrop-blur-sm">
              View Sample Polls
            </button>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Unrivaled Security",
              desc: "Every vote is cryptographically secured to prevent tampering and ensure integrity.",
              icon: <Shield className="text-white" size={24} />,
            },
            {
              title: "Instant Verification",
              desc: "Real-time auditing allows anyone to verify the results as they come in.",
              icon: <CheckCircle className="text-slate-300" size={24} />,
            },
            {
              title: "Built for Speed",
              desc: "A lightning-fast interface optimized for quick participation on any device.",
              icon: <Zap className="text-slate-500" size={24} />,
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-8 group hover:bg-white/[0.07] transition-all duration-500"
            >
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{feature.title}</h3>
              <p className="text-slate-500 leading-relaxed text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Social Proof / Stats */}
      <section className="max-w-7xl mx-auto px-4 w-full">
        <div className="glass-card p-12 md:p-20 relative overflow-hidden bg-gradient-to-br from-white/10 to-transparent">
          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {[
              { label: "Total Polls", val: "1.2k+" },
              { label: "Votes Cast", val: "50k+" },
              { label: "Communities", val: "500+" },
              { label: "Uptime", val: "99.9%" },
            ].map((stat, i) => (
              <div key={i} className="space-y-1">
                <div className="text-3xl md:text-5xl font-black text-white">{stat.val}</div>
                <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
