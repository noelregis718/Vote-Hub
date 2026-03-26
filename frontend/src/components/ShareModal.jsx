import React, { useState } from 'react';
import { X, Copy, Check, MessageCircle, Mail, Share2 } from 'lucide-react';

export default function ShareModal({ isOpen, onClose, title, url, type = "item" }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOptions = [
    {
      name: 'WhatsApp',
      icon: <MessageCircle className="text-[#25D366]" size={20} />,
      href: `https://wa.me/?text=${encodeURIComponent(`Check out this ${type} on VoteHub: ${title} ${url}`)}`,
      bg: 'hover:bg-[#25D366]/10'
    },
    {
      name: 'Email',
      icon: <Mail className="text-[#EA4335]" size={20} />,
      href: `mailto:?subject=${encodeURIComponent(`VoteHub: ${title}`)}&body=${encodeURIComponent(`Hey, check out this ${type} on VoteHub: ${title}\n\nLink: ${url}`)}`,
      bg: 'hover:bg-[#EA4335]/10'
    }
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      <div className="glass-card w-full max-w-sm relative z-[210] p-8 border-white/10 animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">Share {type}</h2>
            <p className="text-[10px] text-slate-500 font-bold tracking-wide uppercase">{title}</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Platform Buttons */}
          <div className="grid grid-cols-2 gap-3">
            {shareOptions.map((option) => (
              <a
                key={option.name}
                href={option.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex flex-col items-center justify-center p-4 rounded-xl border border-white/5 bg-white/5 ${option.bg} transition-all group`}
              >
                <div className="mb-2 group-hover:scale-110 transition-transform">
                  {option.icon}
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{option.name}</span>
              </a>
            ))}
          </div>

          {/* Copy Link Section */}
          <div className="pt-4">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 block">Direct Link</label>
            <div className="flex items-center space-x-2">
              <div className="glass-input h-12 flex-grow flex items-center px-4 overflow-hidden">
                <span className="text-xs text-slate-400 truncate">{url}</span>
              </div>
              <button 
                onClick={handleCopy}
                className={`w-12 h-12 flex items-center justify-center rounded-lg border transition-all ${
                  copied 
                    ? 'bg-green-500/20 border-green-500 text-green-500' 
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                }`}
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5">
          <p className="text-[9px] text-slate-600 text-center uppercase tracking-tight">Premium sharing enabled via VoteHub Secure Links</p>
        </div>
      </div>
    </div>
  );
}
