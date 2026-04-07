import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
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
  Zap,
  ChevronDown,
  Check
} from 'lucide-react';
import { ProposalCard } from '../components/ProposalCard';
import CreateProposalModal from '../components/CreateProposalModal';
import { useAuth } from '../context/AuthContext';
import { clsx } from 'clsx';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';

export default function Proposals() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortOption, setSortOption] = useState('newest');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProposal, setEditingProposal] = useState(null);
  
  const { token } = useAuth();
  const navigate = useNavigate();

  const fetchProposals = async () => {
    try {
      const res = await api.get('/api/proposals');
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

  const handleEdit = (proposal) => {
    setEditingProposal(proposal);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProposal(null);
  };

  const filteredAndSortedProposals = proposals
    .filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortOption === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortOption === 'popular') {
        const aSupports = a._count?.supports || 0;
        const bSupports = b._count?.supports || 0;
        return bSupports - aSupports;
      }
      return 0;
    });

  const filterOptions = [
    { id: 'ALL', label: 'All proposals' },
    { id: 'PENDING', label: 'Pending review' },
    { id: 'APPROVED', label: 'Approved ideas' },
    { id: 'IMPLEMENTED', label: 'Completed' },
    { id: 'REJECTED', label: 'Declined' }
  ];

  const sortOptions = [
    { id: 'newest', label: 'Newest first' },
    { id: 'popular', label: 'Most supported' }
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 -mt-10">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-black text-white tracking-tight uppercase">Community Proposals</h1>
          </div>
          <p className="text-slate-400 max-w-lg font-medium">
            Discover and support community-driven projects.
          </p>
        </div>
        <button
          onClick={() => { setEditingProposal(null); setIsModalOpen(true); }}
          className="glass-button flex items-center justify-center space-x-2 px-8 py-4 self-start md:self-center"
        >
          <span className="font-bold">Submit Idea</span>
        </button>
      </div>

      {/* Stats / Impact Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Live proposals', value: proposals.length, color: 'text-blue-400' },
          { label: 'Goal reached', value: proposals.filter(p => (p._count?.supports || 0) >= (p.targetSupports || 100)).length, color: 'text-green-400' },
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
        <div className="relative flex-grow text-slate-500 focus-within:text-white transition-colors">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2" size={18} />
          <input
            type="text"
            placeholder="Search proposals by title or keywords..."
            className="glass-input h-14 bg-white/[0.03] pl-12 pr-6"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Popover>
          <PopoverTrigger asChild>
            <button className="px-6 h-14 border border-white/10 rounded-md bg-white/5 text-slate-300 hover:text-white transition-all flex items-center justify-center space-x-3 font-bold text-sm min-w-[200px]">
              <Filter size={18} />
              <span className="font-sans">
                {statusFilter === 'ALL' ? 'All filters' : filterOptions.find(f => f.id === statusFilter)?.label}
              </span>
              <ChevronDown size={14} className="text-slate-500" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-4 glass-card border-white/10 bg-black/90 backdrop-blur-xl z-[150] space-y-6" align="end">
            <div className="space-y-4">
              <p className="text-sm font-black text-white ml-1 font-sans">Filter status</p>
              <div className="space-y-1">
                {filterOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setStatusFilter(option.id)}
                    className={clsx(
                      "w-full text-left px-3 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-between font-sans",
                      statusFilter === option.id ? "bg-white text-black" : "text-slate-400 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <span>{option.label}</span>
                    {statusFilter === option.id && <Check size={14} />}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/5">
              <p className="text-sm font-black text-white ml-1 font-sans">Sort by</p>
              <div className="space-y-1">
                {sortOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSortOption(option.id)}
                    className={clsx(
                      "w-full text-left px-3 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-between font-sans",
                      sortOption === option.id ? "bg-white text-black" : "text-slate-400 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <span>{option.label}</span>
                    {sortOption === option.id && <Check size={14} />}
                  </button>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Proposals Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4 text-center">
          <Loader2 className="animate-spin text-white opacity-20" size={48} />
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs animate-pulse">Scanning Proposals...</p>
        </div>
      ) : error ? (
        <div className="glass-card p-12 text-center border-red-500/20">
          <h2 className="text-xl font-bold text-white mb-2 uppercase tracking-tight">Something went wrong</h2>
          <p className="text-slate-400 mb-6">{error}</p>
          <button onClick={fetchProposals} className="glass-button px-8 py-3">Try Again</button>
        </div>
      ) : filteredAndSortedProposals.length === 0 ? (
        <div className="glass-card p-20 text-center border-white/10 bg-white/[0.02]">
          <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">No Proposals Match</h2>
          <p className="text-slate-500 max-w-sm mx-auto mb-8 font-medium">
            Try adjusting your status filters or search query to find community project ideas.
          </p>
          <button onClick={() => { setSearchQuery(''); setStatusFilter('ALL'); }} className="text-white font-bold underline hover:text-slate-300 transition-colors uppercase tracking-widest text-xs">Clear All Filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
          {filteredAndSortedProposals.map((proposal) => (
            <ProposalCard 
              key={proposal.id} 
              proposal={proposal} 
              onSupportToggle={fetchProposals}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}

      {/* Create/Edit Proposal Modal */}
      <CreateProposalModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onSuccess={fetchProposals}
        initialData={editingProposal}
      />
    </div>
  );
}
