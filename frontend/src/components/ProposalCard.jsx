import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
  Heart,
  Share2,
  Target,
  Coins,
  User,
  CheckCircle,
  Loader2,
  Check
} from 'lucide-react';
import { clsx } from 'clsx';

export function ProposalCard({ proposal, onSupportToggle }) {
  const { user, token } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const supportCount = proposal._count?.supports || 0;
  const targetSupports = 50;
  const progress = Math.min(Math.round((supportCount / targetSupports) * 100), 100);
  const isSupportedByMe = proposal.supports?.some(s => s.userId === user?.id);

  const handleSupport = async () => {
    if (!user) return;
    setIsUpdating(true);
    try {
      await axios.post(`http://localhost:5000/api/proposals/${proposal.id}/support`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onSupportToggle();
    } catch (err) {
      console.error("Failed to toggle support", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/proposals?id=${proposal.id}`;
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'REVIEW': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'APPROVED': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'REJECTED': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'IMPLEMENTED': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="glass-card overflow-hidden hover:border-white/30 transition-all duration-500 group flex flex-col h-full">
      <div className="p-6 space-y-5 flex-grow">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            <span className={clsx(
              "text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider",
              getStatusColor(proposal.status)
            )}>
              {proposal.status}
            </span>
          </div>
          <button
            onClick={handleShare}
            className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all rounded-lg border border-white/5 relative text-[10px] font-bold uppercase tracking-widest"
            title="Share Proposal"
          >
            {isCopied ? 'Copied' : 'Share'}
            {isCopied && (
              <span className="absolute -top-8 right-0 bg-white text-black text-[10px] px-2 py-1 rounded shadow-lg whitespace-nowrap animate-in fade-in slide-in-from-bottom-2">
                Link Copied!
              </span>
            )}
          </button>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-black text-white group-hover:text-slate-300 transition-colors uppercase tracking-tight leading-tight">
            {proposal.title}
          </h3>
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center overflow-hidden border border-white/5">
              {proposal.createdBy?.avatar && (
                <img src={proposal.createdBy.avatar} alt="" className="w-full h-full object-cover" />
              )}
            </div>
            <span>by {proposal.createdBy?.name || 'Anonymous'}</span>
          </div>
        </div>

        <p className="text-slate-400 text-sm line-clamp-3 leading-relaxed font-medium">
          {proposal.description}
        </p>

        {/* Goal Section */}
        <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5 space-y-3">
          <div className="flex items-start space-x-3">
            <div>
              <p className="text-[11px] font-semibold text-slate-500 font-sans mb-1">Specific goal</p>
              <p className="text-xs text-slate-300 leading-normal">{proposal.goal}</p>
            </div>
          </div>
          {proposal.budget && (
            <div className="flex items-center space-x-3 border-t border-white/5 pt-3">
              <div>
                <p className="text-[11px] font-semibold text-slate-500 font-sans mb-0.5">Estimated budget</p>
                <p className="text-xs text-white font-black">${proposal.budget.toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="space-y-2 pt-2">
          <div className="flex justify-between items-end">
            <span className="text-[11px] font-semibold text-slate-500 font-sans">Community support</span>
            <span className="text-xs font-black text-white">{supportCount} <span className="text-slate-500 font-medium">/ {targetSupports}</span></span>
          </div>
          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
            <div
              className="h-full bg-gradient-to-r from-white via-slate-300 to-slate-500 transition-all duration-1000 shadow-[0_0_10px_rgba(255,255,255,0.3)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="p-6 pt-0 mt-auto">
        <button
          onClick={handleSupport}
          disabled={!user || isUpdating}
          className={clsx(
            "w-full flex items-center justify-center space-x-2 h-12 rounded-xl border transition-all font-bold text-sm uppercase tracking-widest",
            isSupportedByMe
              ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              : "bg-white/5 text-white border-white/10 hover:bg-white/10"
          )}
        >
          {isUpdating ? (
            <span className="animate-pulse">Processing...</span>
          ) : (
            <span>{isSupportedByMe ? 'Supported' : 'Support Proposal'}</span>
          )}
        </button>
        {!user && (
          <p className="text-[10px] text-center text-slate-600 mt-2">Sign in to support this project</p>
        )}
      </div>
    </div>
  );
}
