import api from '@/lib/api';
import { useAuth } from '../context/AuthContext';
import {
  Share2,
  User,
  CheckCircle,
  Loader2,
  Check,
  Pencil
} from 'lucide-react';
import { clsx } from 'clsx';

export function ProposalCard({ proposal, onSupportToggle, onEdit }) {
  const { user, token } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const supportCount = proposal._count?.supports || 0;
  const targetSupports = proposal.targetSupports || 100;
  const progress = Math.min(Math.round((supportCount / targetSupports) * 100), 100);
  const isSupportedByMe = proposal.supports?.some(s => s.userId === user?.id);
  const isAuthor = user?.id === proposal.userId;

  const handleSupport = async () => {
    if (!user) return;
    setIsUpdating(true);
    try {
      await api.post(`/api/proposals/${proposal.id}/support`, {});
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
      case 'PENDING': return 'border-yellow-500/50 text-yellow-500 bg-yellow-500/5';
      case 'REVIEW': return 'border-blue-500/50 text-blue-400 bg-blue-500/5';
      case 'APPROVED': return 'border-green-500/50 text-green-400 bg-green-500/5';
      case 'REJECTED': return 'border-red-500/50 text-red-400 bg-red-500/5';
      case 'IMPLEMENTED': return 'border-purple-500/50 text-purple-400 bg-purple-500/5';
      default: return 'border-slate-500/50 text-slate-400 bg-slate-500/5';
    }
  };

  return (
    <div className="glass-card overflow-hidden hover:border-white/20 transition-all duration-500 group flex flex-col h-full p-8 space-y-8">
      {/* Top Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <span className={clsx(
            "text-[10px] font-bold px-3 py-1 rounded-full border uppercase tracking-wider",
            getStatusColor(proposal.status)
          )}>
            {proposal.status}
          </span>
          {isAuthor && (
            <button
              onClick={() => onEdit?.(proposal)}
              className="p-1 px-3 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all rounded-lg border border-white/5 text-[10px] font-black uppercase tracking-widest flex items-center space-x-1"
            >
              <Pencil size={12} />
              <span>EDIT</span>
            </button>
          )}
        </div>
        <button
          onClick={handleShare}
          className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all rounded-md border border-white/5 text-[10px] font-black uppercase tracking-widest"
        >
          {isCopied ? 'Copied' : 'SHARE'}
        </button>
      </div>

      {/* Title & Author */}
      <div className="space-y-4">
        <h3 className="text-3xl font-black text-white uppercase tracking-tight leading-[1.1]">
          {proposal.title}
        </h3>
        <div className="flex items-center space-x-3 text-sm text-slate-500 font-bold">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center overflow-hidden border border-white/5">
            {proposal.createdBy?.avatar ? (
              <img src={proposal.createdBy.avatar} alt={proposal.createdBy.name} className="w-full h-full object-cover" />
            ) : (
              <User size={16} className="text-slate-500" />
            )}
          </div>
          <span>by {proposal.createdBy?.name || 'Anonymous'}</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-slate-400 text-base leading-relaxed font-bold">
        {proposal.description}
      </p>

      {/* Details Container */}
      <div className="bg-white/[0.03] rounded-2xl p-6 border border-white/5 space-y-6">
        <div className="space-y-1.5">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Specific goal</p>
          <p className="text-base text-white font-bold">{proposal.goal}</p>
        </div>
        {proposal.budget !== null && (
          <div className="space-y-1.5 border-t border-white/5 pt-4">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Estimated budget</p>
            <p className="text-xl font-black text-white tracking-tight">₹{proposal.budget?.toLocaleString()}</p>
          </div>
        )}
      </div>

      {/* Progress Section */}
      <div className="space-y-4 pt-2">
        <div className="flex justify-between items-end">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Community support</span>
          <span className="text-sm font-black text-white">{supportCount} <span className="text-slate-500 font-bold">/ {targetSupports}</span></span>
        </div>
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-white transition-all duration-1000 shadow-[0_0_15px_rgba(255,255,255,0.4)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-2">
        <button
          onClick={handleSupport}
          disabled={!user || isUpdating}
          className={clsx(
            "w-full flex items-center justify-center space-x-2 h-16 rounded-md transition-all font-black text-base uppercase tracking-widest",
            isSupportedByMe
              ? "bg-white text-black shadow-[0_10px_30px_rgba(255,255,255,0.15)]"
              : "bg-white/5 text-white border border-white/10 hover:bg-white/10"
          )}
        >
          {isUpdating ? (
            <Loader2 className="animate-spin" size={24} />
          ) : (
            <span>{isSupportedByMe ? 'SUPPORTED' : 'SUPPORT PROPOSAL'}</span>
          )}
        </button>
        {!user && (
          <p className="text-[10px] text-center text-slate-600 mt-3 font-bold uppercase tracking-widest">Sign in to support</p>
        )}
      </div>
    </div>
  );
}
