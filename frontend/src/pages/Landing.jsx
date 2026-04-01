import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock,
  BadgeCheck,
  Rocket,
  ArrowRight,
  Vote as VoteIcon,
  Layers,
  BarChart3,
  Paintbrush
} from 'lucide-react';
import {
  GitHubLogoIcon,
  TwitterLogoIcon,
  InstagramLogoIcon,
  EnvelopeClosedIcon
} from '@radix-ui/react-icons';
import { Footer } from '@/components/ui/footer';

export default function Landing() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const words = ["Community", "Organization", "DAO", "Ecosystem"];

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col space-y-24">
      {/* Hero Section */}
      <section className="relative pt-20 pb-12 md:pt-32 md:pb-24 overflow-hidden">
        {/* Decorative Blobs */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-white/10 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-slate-500/10 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-white/5 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>

        <div className="relative text-center space-y-8 max-w-4xl mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.1]"
          >
            Empower Your <br />
            <div className="h-[1.2em] relative overflow-hidden flex justify-center">
              <AnimatePresence mode="wait">
                <motion.span
                  key={words[index]}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="bg-gradient-to-r from-white via-slate-300 to-slate-500 bg-clip-text text-transparent italic text-white drop-shadow-sm absolute left-0 right-0"
                >
                  {words[index]}
                </motion.span>
              </AnimatePresence>
            </div>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-white text-xl md:text-2xl max-w-2xl mx-auto font-light leading-relaxed"
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
            <a 
              href="https://cal.com/noel-regis/30min" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-8 py-4 border border-white/10 rounded-md hover:bg-white/5 transition-all text-lg font-medium backdrop-blur-sm flex items-center justify-center"
            >
              Get a Demo
            </a>
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
              icon: <Lock className="text-white" size={24} />,
            },
            {
              title: "Instant Verification",
              desc: "Real-time auditing allows anyone to verify the results as they come in.",
              icon: <BadgeCheck className="text-slate-300" size={24} />,
            },
            {
              title: "Built for Speed",
              desc: "A lightning-fast interface optimized for quick participation on any device.",
              icon: <Rocket className="text-slate-500" size={24} />,
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
              <div className="flex items-center space-x-4 mb-6">
                <div className="group-hover:scale-110 transition-transform duration-500">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">{feature.title}</h3>
              </div>
              <p className="text-white leading-relaxed text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Modern Governance Section (Dark Theme) */}
      <section className="bg-black py-24 md:py-32 text-white overflow-hidden border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 w-full text-left">
          <div className="space-y-4 mb-20 text-center md:text-left">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1]">
              The modern way to run <br />
              <span className="text-white italic">Collective Decision Making.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Seamless Integration",
                desc: "Connect VoteHub with your existing tools effortlessly through our robust API and plugins.",
                visual: (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      className="w-56 h-44 bg-black border border-white/20 rounded-xl relative p-4 shadow-2xl"
                    >
                      <div className="w-32 h-3 bg-white/10 rounded-full mb-6 mx-auto" />
                      <div className="grid grid-cols-4 gap-3">
                        {[...Array(8)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className={`aspect-square rounded-md ${(i === 5 || i === 6 || i === 2) ? 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.3)]' : 'bg-white/5'}`}
                            animate={(i === 5 || i === 6 || i === 2) ? { opacity: [0.7, 1, 0.7] } : {}}
                            transition={{
                              opacity: (i === 5 || i === 6 || i === 2)
                                ? { repeat: Infinity, duration: 2, delay: i * 0.2 }
                                : { delay: 0.2 + (i * 0.05) }
                            }}
                          />
                        ))}
                      </div>
                      <div className="absolute top-2 left-2 w-1 h-1 bg-white/20 rounded-full" />
                      <div className="absolute top-2 right-2 w-1 h-1 bg-white/20 rounded-full" />
                      <div className="absolute bottom-2 left-2 w-1 h-1 bg-white/20 rounded-full" />
                      <div className="absolute bottom-2 right-2 w-1 h-1 bg-white/20 rounded-full" />
                    </motion.div>
                  </div>
                ),
                accent: "bg-white/5"
              },
              {
                title: "Custom Identity",
                desc: "Every community is unique. Tailor your voting interface to match your brand and values.",
                visual: (
                  <div className="relative w-full h-full flex items-center justify-center perspective-[1000px]">
                    <motion.div
                      initial={{ opacity: 0, rotateX: -20, rotateY: -20 }}
                      whileInView={{ opacity: 1, rotateX: -12, rotateY: -12 }}
                      viewport={{ once: true }}
                      animate={{ y: [0, -5, 0] }}
                      transition={{
                        opacity: { duration: 0.8 },
                        rotateX: { duration: 0.8 },
                        rotateY: { duration: 0.8 },
                        y: { repeat: Infinity, duration: 4, ease: "easeInOut" }
                      }}
                      className="w-56 h-40 bg-black border border-white/20 rounded-xl p-6 shadow-2xl skew-x-3"
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "100%" }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="h-4 bg-white/10 rounded-lg mb-4"
                      />
                      <div className="space-y-2">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: "100%" }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.7, duration: 0.6 }}
                          className="h-1 bg-white/40 rounded-full"
                        />
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: "80%" }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.8, duration: 0.6 }}
                          className="h-1 bg-white/10 rounded-full"
                        />
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: "75%" }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.9, duration: 0.6 }}
                          className="h-1 bg-white/10 rounded-full"
                        />
                      </div>
                      <div className="mt-6 flex space-x-2">
                        <motion.div
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 1.1, type: "spring" }}
                          className="w-12 h-4 bg-white rounded-full"
                        />
                        <motion.div
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 1.2, type: "spring" }}
                          className="w-12 h-4 bg-white/10 rounded-full"
                        />
                      </div>
                    </motion.div>
                  </div>
                ),
                accent: "bg-white/5"
              },
              {
                title: "Live Action Data",
                desc: "Real-time auditing allows for instant verification and deep participation insights.",
                visual: (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="w-64 h-32 bg-black border border-white/20 rounded-2xl p-6 shadow-2xl relative overflow-hidden"
                    >
                      <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                          <span className="text-[10px] font-bold tracking-widest text-white uppercase">Analytics</span>
                        </div>
                        <motion.div
                          animate={{ opacity: [1, 0.5, 1] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                          className="px-2 py-1 bg-white/5 rounded text-[8px] font-bold text-white uppercase border border-white/10"
                        >
                          Live
                        </motion.div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] items-end">
                          <span className="text-white font-medium">Votes Cast</span>
                          <motion.span
                            animate={{ opacity: [1, 0.7, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="text-white font-bold"
                          >
                            45,283 / 50k
                          </motion.span>
                        </div>
                        <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: "85%" }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                            className="h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                          />
                        </div>
                      </div>
                    </motion.div>
                  </div>
                ),
                accent: "bg-white/5"
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="space-y-8"
              >
                <div className={`${feature.accent} rounded-xl aspect-[4/3] flex items-center justify-center p-8 overflow-hidden group border border-white/10 shadow-inner`}>
                  {feature.visual}
                </div>
                <div className="space-y-3 px-2">
                  <h3 className="text-2xl font-bold tracking-tight">{feature.title}</h3>
                  <p className="text-white leading-relaxed text-sm font-medium">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 w-full py-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="glass-card p-12 md:p-28 relative overflow-hidden group border-white/20"
        >
          {/* Background effects */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent pointer-events-none group-hover:opacity-60 transition-opacity duration-700" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 group-hover:bg-white/[0.07] transition-all duration-700" />

          <div className="relative z-10 flex flex-col items-center text-center space-y-10">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.2] max-w-4xl mx-auto">
                Join the future of <br />
                <span className="italic bg-gradient-to-r from-white via-slate-300 to-slate-500 bg-clip-text text-transparent opacity-90 drop-shadow-sm py-2 block md:inline-block leading-normal">
                  Decentralized Decision Making
                </span>
              </h2>
              <p className="text-white text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
                Experience unparalleled security and transparency. Start your first poll or auction in less than a minute.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-6 pt-6">
              <button
                onClick={() => navigate('/register')}
                className="glass-button text-xl px-12 py-5 flex items-center space-x-3 group/btn"
              >
                <span>Launch Your Project</span>
                <ArrowRight size={22} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
              <Link
                to="/contact"
                className="px-8 py-5 border border-white/10 rounded-md hover:bg-white/5 transition-all text-lg font-medium backdrop-blur-sm flex items-center justify-center min-w-[200px]"
              >
                Contact Us
              </Link>
            </div>

          </div>
        </motion.div>
      </section>

      <Footer
        logo={<img src="/logo.png" alt="Logo" className="w-6 h-6 object-contain" />}
        brandName="VoteHub"
        socialLinks={[
          {
            icon: <GitHubLogoIcon className="h-5 w-5" />,
            href: "https://github.com/noelregis718/Vote-Hub.git",
            label: "GitHub",
          },
          {
            icon: <EnvelopeClosedIcon className="h-5 w-5" />,
            href: "mailto:noel.regis04@gmail.com",
            label: "Email",
          },
        ]}
        mainLinks={[
          { href: "/contact", label: "Contact Page" },
          { href: "/privacy", label: "Privacy Policy" },
          { href: "/terms", label: "Terms of Service" },
        ]}
        legalLinks={[]}
        copyright={{
          text: `© ${new Date().getFullYear()} VoteHub`,
          license: "All rights reserved.",
        }}
      />
    </div>
  );
}
