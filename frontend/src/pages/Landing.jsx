import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Shield, 
  Zap, 
  ArrowRight, 
  Vote as VoteIcon
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
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] max-w-4xl mx-auto">
                Join the future of <br />
                <span className="italic bg-gradient-to-r from-white via-slate-300 to-slate-500 bg-clip-text text-transparent opacity-90 drop-shadow-sm">
                  Decentralized Decision Making
                </span>
              </h2>
              <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
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
                to="/login"
                className="px-8 py-5 border border-white/10 rounded-xl hover:bg-white/5 transition-all text-lg font-medium backdrop-blur-sm flex items-center justify-center min-w-[200px]"
              >
                Sign In
              </Link>
            </div>
            
          </div>
        </motion.div>
      </section>

      <Footer
        logo={<VoteIcon className="h-6 w-6 text-white" />}
        brandName="VoteHub"
        socialLinks={[
          {
            icon: <TwitterLogoIcon className="h-5 w-5" />,
            href: "https://twitter.com/votehub",
            label: "Twitter",
          },
          {
            icon: <GitHubLogoIcon className="h-5 w-5" />,
            href: "https://github.com/votehub/core",
            label: "GitHub",
          },
          {
            icon: <InstagramLogoIcon className="h-5 w-5" />,
            href: "https://instagram.com/votehub",
            label: "Instagram",
          },
          {
            icon: <EnvelopeClosedIcon className="h-5 w-5" />,
            href: "mailto:support@votehub.io",
            label: "Email",
          },
        ]}
        mainLinks={[
          { href: "/polls", label: "Browse Polls" },
          { href: "/auctions", label: "eAuctions" },
          { href: "/contact", label: "Contact Page" },
          { href: "/community", label: "Communities" },
        ]}
        legalLinks={[
          { href: "/privacy", label: "Privacy Policy" },
          { href: "/terms", label: "Terms of Service" },
          { href: "/cookies", label: "Cookie Policy" },
        ]}
        copyright={{
          text: `© ${new Date().getFullYear()} VoteHub Ecosystem`,
          license: "Licensed under ISC Premium",
        }}
      />
    </div>
  );
}
