import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  MessageSquare, 
  Send, 
  Clock, 
  ArrowRight,
  CheckCircle2,
  Vote as VoteIcon
} from 'lucide-react';
import { 
  GitHubLogoIcon, 
  EnvelopeClosedIcon
} from '@radix-ui/react-icons';
import { Footer } from '@/components/ui/footer';

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch("https://formspree.io/f/xdapzded", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          message: formData.message
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({ firstName: '', lastName: '', email: '', message: '' });
      } else {
        const data = await response.json();
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("Failed to send message. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col space-y-24">
      <div className="min-h-[80vh] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Left Side: Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-16 lg:h-full flex flex-col justify-between"
          >
            <div className="space-y-8">
              <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white leading-tight">
                Let's build <br />
                <span className="italic bg-gradient-to-r from-white via-slate-400 to-slate-600 bg-clip-text text-transparent">
                  the Future.
                </span>
              </h1>
              <p className="text-slate-400 text-lg md:text-xl font-light leading-relaxed max-w-lg">
                Have questions about VoteHub? Our team is here to help you revolutionize community governance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 gap-y-10 ring-1 ring-white/5 p-10 md:p-11 rounded-[2rem] bg-white/[0.02] backdrop-blur-3xl mt-auto">
              {[
                { icon: <Mail className="text-white" size={20} />, label: "Email Us", val: "noel.regis04@gmail.com", href: "mailto:noel.regis04@gmail.com" },
                { icon: <Phone className="text-white" size={20} />, label: "Call Us", val: "7319546900", href: "tel:7319546900" },
                { icon: <MapPin className="text-white" size={20} />, label: "Visit Us", val: "Asansol, West Bengal", href: "https://www.google.com/maps/search/?api=1&query=Asansol,West+Bengal" },
                { icon: <Clock className="text-white" size={20} />, label: "Support Hours", val: "24/7 Priority", href: null },
              ].map((item, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-colors">
                      {item.icon}
                    </div>
                    <span className="text-sm font-bold text-slate-300">{item.label}</span>
                  </div>
                  {item.href ? (
                    <a 
                      href={item.href} 
                      target={item.href.startsWith('http') ? "_blank" : undefined}
                      rel={item.href.startsWith('http') ? "noopener noreferrer" : undefined}
                      className="text-white font-medium hover:text-slate-300 transition-colors block pl-1"
                    >
                      {item.val}
                    </a>
                  ) : (
                    <p className="text-white font-medium pl-1">{item.val}</p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Side: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            <div className="glass-card p-8 md:p-12 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />
              
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg text-sm text-center">
                      {error}
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-4">
                      <label className="text-sm font-bold text-slate-300 ml-1">First Name</label>
                      <input 
                        type="text" 
                        name="firstName"
                        required 
                        value={formData.firstName}
                        onChange={handleChange}
                        className="glass-input h-14" 
                        placeholder="Jane"
                      />
                    </div>
                    <div className="flex flex-col gap-4">
                      <label className="text-sm font-bold text-slate-300 ml-1">Last Name</label>
                      <input 
                        type="text" 
                        name="lastName"
                        required 
                        value={formData.lastName}
                        onChange={handleChange}
                        className="glass-input h-14" 
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <label className="text-sm font-bold text-slate-300 ml-1">Work Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                      <input 
                        type="email" 
                        name="email"
                        required 
                        value={formData.email}
                        onChange={handleChange}
                        className="glass-input h-14 pl-12" 
                        placeholder="jane@company.com"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <label className="text-sm font-bold text-slate-300 ml-1">Message</label>
                    <div className="relative">
                      <MessageSquare className="absolute left-4 top-5 text-slate-600" size={18} />
                      <textarea 
                        name="message"
                        required 
                        value={formData.message}
                        onChange={handleChange}
                        className="glass-input min-h-[160px] pl-12 pt-4 resize-none" 
                        placeholder="Tell us about your organization and how we can help..."
                      ></textarea>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="glass-button w-full h-16 text-lg flex items-center justify-center space-x-3 group/btn hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    {isSubmitting ? (
                      <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send size={20} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20 space-y-6"
                >
                  <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto border border-white/20">
                    <CheckCircle2 className="text-white" size={40} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-3xl font-bold text-white">Message Sent!</h3>
                    <p className="text-slate-400">Thank you for reaching out. Our team will get back to you within 24 hours.</p>
                  </div>
                  <button 
                    onClick={() => setIsSubmitted(false)}
                    className="text-sm font-bold uppercase tracking-widest text-white hover:underline pt-4"
                  >
                    Send another message
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <Footer
        logo={<VoteIcon className="h-6 w-6 text-white" />}
        brandName="VoteHub"
        socialLinks={[
          {
            icon: <GitHubLogoIcon className="h-5 w-5" />,
            href: "https://github.com/votehub/core",
            label: "GitHub",
          },
          {
            icon: <EnvelopeClosedIcon className="h-5 w-5" />,
            href: "mailto:support@votehub.io",
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
          text: `© ${new Date().getFullYear()} VoteHub Ecosystem`,
          license: "Licensed under ISC Premium",
        }}
      />
    </div>
  );
}
