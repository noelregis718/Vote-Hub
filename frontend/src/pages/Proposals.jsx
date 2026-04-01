import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Lightbulb, 
  Plus, 
  Search, 
  Filter, 
  Loader2, 
  AlertCircle,
  TrendingUp,
  Award,
  Zap
} from 'lucide-react';
import { ProposalCard } from '../components/ProposalCard';
import CreateProposalModal from '../components/CreateProposalModal';
import { useAuth } from '../context/AuthContext';
import { clsx } from 'clsx';

export default function Proposals() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { token } = useAuth();
  const navigate = useNavigate();

  const fetchProposals = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/proposals');
      setProposals(res.data);
    } catch (err) {
      setError('Failed to load proposals. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  const filteredProposals = proposals.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-black text-white tracking-tight uppercase">Community Proposals</h1>
          </div>
          <p className="text-slate-400 max-w-lg font-medium">
            Discover and support community-driven projects.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="glass-button flex items-center justify-center space-x-2 px-8 py-4 self-start md:self-center"
        >
          <span className="font-bold">Submit Idea</span>
        </button>
      </div>

      {/* Stats / Impact Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Live proposals', value: proposals.length, color: 'text-blue-400' },
          { label: 'Goal reached', value: proposals.filter(p => (p._count?.supports || 0) >= 50).length, color: 'text-green-400' },
          { label: 'Community support', value: proposals.reduce((acc, p) => acc + (p._count?.supports || 0), 0), color: 'text-yellow-400' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-5 border-white/5 hover:border-white/10 transition-all group h-28 flex flex-col justify-between">
            <p className="text-sm font-semibold text-slate-400 font-sans">{stat.label}</p>
            <h3 className="text-3xl font-black text-white leading-none">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search proposals by title or keywords..."
            className="glass-input h-14 bg-white/[0.03] px-6"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="px-6 h-14 border border-white/10 rounded-xl bg-white/5 text-slate-300 hover:text-white transition-all flex items-center justify-center font-bold text-sm uppercase tracking-widest">
          <span>Filters</span>
        </button>
      </div>

      {/* Proposals Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <p className="text-slate-500 font-medium animate-pulse text-center">Scanning community projects...</p>
        </div>
      ) : error ? (
        <div className="glass-card p-12 text-center border-red-500/20">
          <h2 className="text-xl font-bold text-white mb-2 uppercase tracking-tight">Something went wrong</h2>
          <p className="text-slate-400 mb-6">{error}</p>
          <button onClick={fetchProposals} className="glass-button px-8 py-3">Try Again</button>
        </div>
      ) : filteredProposals.length === 0 ? (
        <div className="glass-card p-20 text-center border-white/10">
          <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">No Proposals Found</h2>
          <p className="text-slate-500 max-w-sm mx-auto mb-8 font-medium">
            Be the first to propose a project for the community to rally behind!
          </p>
          <button onClick={() => setIsModalOpen(true)} className="glass-button px-10 py-4">Create First Proposal</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
          {filteredProposals.map((proposal) => (
            <ProposalCard 
              key={proposal.id} 
              proposal={proposal} 
              onSupportToggle={fetchProposals}
            />
          ))}
        </div>
      )}

      {/* Create Proposal Modal */}
      <CreateProposalModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchProposals}
      />
    </div>
  );
}
