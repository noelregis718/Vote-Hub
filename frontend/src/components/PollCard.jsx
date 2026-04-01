import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, Users, Calendar, Loader2, Edit, Trash2, Share2 } from 'lucide-react';
import { clsx } from 'clsx';

export function PollCard({ poll, onVoteSuccess, onEdit, onDelete, onShare }) {
  const { user } = useAuth();
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isVoting, setIsVoting] = useState(false);
  const [message, setMessage] = useState('');

  const handleVote = async () => {
    if (!user) {
      setMessage('Please sign in to vote');
      return;
    }
    if (!selectedCandidate) return;

    setIsVoting(true);
    try {
      await axios.post(`http://localhost:5000/api/polls/${poll.id}/vote`, {
        candidateId: selectedCandidate
      });
      setMessage('Vote recorded!');
      onVoteSuccess();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to record vote');
    } finally {
      setIsVoting(false);
    }
  };

  const totalVotes = poll._count?.votes || 0;

  return (
    <div className="glass-card overflow-hidden hover:border-white/30 transition-all duration-500 group">
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start shrink-0">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white group-hover:text-slate-300 transition-colors uppercase tracking-wider leading-tight">
              {poll.title}
            </h3>
          </div>
          <div className="flex items-center space-x-2 ml-4">
            {user && user.id === poll.userId && (
              <div className="flex items-center space-x-1">
                <button 
                  onClick={(e) => { e.stopPropagation(); onEdit && onEdit(poll); }}
                  className="p-1.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all rounded-lg border border-white/5"
                  title="Edit Poll"
                >
                  <Edit size={14} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onDelete && onDelete(poll.id); }}
                  className="p-1.5 bg-white/5 hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-all rounded-lg border border-white/5"
                  title="Delete Poll"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}
            <button 
              onClick={(e) => { e.stopPropagation(); onShare && onShare(poll); }}
              className="p-1.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all rounded-lg border border-white/5"
              title="Share Poll"
            >
              <Share2 size={14} />
            </button>
            <span className="bg-white/10 text-white text-sm font-bold px-4 py-1.5 rounded-full border border-white/20 whitespace-nowrap">
              Active
            </span>
          </div>
        </div>
        
        <p className="text-slate-400 text-sm line-clamp-2">
          {poll.description}
        </p>

        <div className="flex items-center space-x-4 text-base text-slate-500">
          <div className="flex items-center space-x-1">
            <Users size={16} />
            <span>{totalVotes} Votes</span>
          </div>
          {poll.endsAt && (
            <div className="flex items-center space-x-1">
              <Calendar size={16} />
              <span>Ends on {new Date(poll.endsAt).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        <div className="space-y-2 mt-6">
          {poll.candidates.map((candidate) => {
            const percentage = totalVotes > 0 
              ? Math.round((candidate._count?.votes || 0) / totalVotes * 100) 
              : 0;
            
            return (
              <button
                key={candidate.id}
                onClick={() => setSelectedCandidate(candidate.id)}
                className={clsx(
                  "w-full text-left p-4 rounded-lg border transition-all relative overflow-hidden",
                  selectedCandidate === candidate.id 
                    ? "border-white/40 bg-white/5" 
                    : "border-white/5 hover:border-white/10 bg-white/5"
                )}
              >
                <div 
                  className="absolute left-0 top-0 bottom-0 bg-white/10 transition-all duration-1000"
                  style={{ width: `${percentage}%` }}
                />
                <div className="flex justify-between items-center relative z-10">
                  <span className="text-sm font-medium text-slate-200">{candidate.name}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-bold">{percentage}%</span>
                    {selectedCandidate === candidate.id && (
                      <CheckCircle2 size={16} className="text-white" />
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="px-6 pb-6 pt-2">
        {message && (
          <p className={clsx(
            "text-xs mb-3 text-center font-medium",
            message.includes('recorded') ? "text-green-400" : "text-red-400"
          )}>
            {message}
          </p>
        )}
        <button
          onClick={handleVote}
          disabled={!selectedCandidate || isVoting}
          className="glass-button w-full flex items-center justify-center space-x-2 h-11"
        >
          {isVoting ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <>
              <CheckCircle2 size={18} />
              <span>Cast Your Vote</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
