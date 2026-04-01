import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PollCard } from '../components/PollCard';
import { Loader2, RefreshCcw, X, Plus, Trash2, Calendar as CalendarIcon, Activity, Users, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DropdownMultiCalendar } from '../components/ui/dropdown-multi-calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import ShareModal from '../components/ShareModal';

export default function Dashboard() {
  const { token, user } = useAuth();
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Editing State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPoll, setEditingPoll] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [editData, setEditData] = useState({
    title: '',
    description: '',
    candidates: [],
    endsAt: ''
  });

  const [sharePoll, setSharePoll] = useState(null);

  const fetchPolls = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/polls');
      setPolls(res.data);
    } catch (err) {
      setError('Failed to fetch polls. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  const handleDeletePoll = async (id) => {
    if (!window.confirm("Are you sure you want to delete this poll? This will delete all associated votes.")) return;
    try {
      await axios.delete(`http://localhost:5000/api/polls/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPolls();
    } catch (err) {
      alert("Delete failed.");
    }
  };

  const openEditModal = (poll) => {
    setEditingPoll(poll);
    setEditData({
      title: poll.title,
      description: poll.description || '',
      candidates: poll.candidates.map(c => c.name),
      endsAt: poll.endsAt ? poll.endsAt.slice(0, 16) : ''
    });
    setIsEditModalOpen(true);
  };

  const handleUpdatePoll = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/polls/${editingPoll.id}`, editData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsEditModalOpen(false);
      fetchPolls();
    } catch (err) {
      alert("Update failed.");
    }
  };

  const handleAddCandidate = () => {
    setEditData({ ...editData, candidates: [...editData.candidates, ''] });
  };

  const handleCandidateChange = (index, value) => {
    const newCandidates = [...editData.candidates];
    newCandidates[index] = value;
    setEditData({ ...editData, candidates: newCandidates });
  };

  const handleRemoveCandidate = (index) => {
    if (editData.candidates.length <= 2) return;
    setEditData({ ...editData, candidates: editData.candidates.filter((_, i) => i !== index) });
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  const stats = [
    { label: 'Total polls', value: polls.length, icon: <Plus size={20} />, color: 'text-blue-400' },
    { label: 'Votes cast', value: polls.reduce((acc, p) => acc + (p._count?.votes || 0), 0), icon: <Users size={20} />, color: 'text-green-400' },
    { label: 'Active now', value: polls.filter(p => !p.endsAt || new Date(p.endsAt) > new Date()).length, icon: <Activity size={20} />, color: 'text-orange-400' },
    { label: 'Completed', value: polls.filter(p => p.endsAt && new Date(p.endsAt) <= new Date()).length, icon: <CheckCircle size={20} />, color: 'text-slate-400' }
  ];

  const displayedPolls = polls.filter(p => {
    const urlParams = new URLSearchParams(window.location.search);
    const pollId = urlParams.get('pollId');
    if (pollId && p.id === pollId) return true;
    if (pollId) return false;
    return true;
  });

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            {new URLSearchParams(window.location.search).get('pollId') ? 'Shared Poll' : 'Active Polls'}
          </h1>
          <p className="text-slate-400">Discover and participate in ongoing community decisions.</p>
        </div>
        <div className="flex items-center space-x-2">
          {new URLSearchParams(window.location.search).get('pollId') && (
            <button
              onClick={() => window.history.replaceState({}, '', '/dashboard')}
              className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-white mr-4"
            >
              Show All Polls
            </button>
          )}
        </div>
      </header>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="glass-card p-5 border-white/5 hover:border-white/10 transition-all group h-28 flex flex-col justify-between">
            <p className="text-sm font-semibold text-slate-400 font-sans">{stat.label}</p>
            <h3 className="text-3xl font-black text-white leading-none">{stat.value}</h3>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <Loader2 className="animate-spin text-primary-500" size={48} />
          <p className="text-slate-500 font-medium animate-pulse">Fetching latest polls...</p>
        </div>
      ) : error ? (
        <div className="glass-card p-12 text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button onClick={fetchPolls} className="glass-button">Try Again</button>
        </div>
      ) : displayedPolls.length === 0 ? (
        <div className="glass-card p-12 text-center bg-gradient-to-br from-white/5 to-transparent">
          <p className="text-slate-400 text-lg">No active polls available at the moment.</p>
          <p className="text-slate-500 text-sm mt-2">Check back later or create one yourself!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedPolls.map((poll) => (
            <PollCard
              key={poll.id}
              poll={poll}
              onVoteSuccess={fetchPolls}
              onEdit={openEditModal}
              onDelete={handleDeletePoll}
              onShare={(p) => setSharePoll(p)}
            />
          ))}
        </div>
      )}

      {/* Share Modal */}
      <ShareModal
        isOpen={!!sharePoll}
        onClose={() => setSharePoll(null)}
        title={sharePoll?.title}
        type="Poll"
        url={`${window.location.origin}/dashboard?pollId=${sharePoll?.id}`}
      />

      {/* Edit Poll Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)} />
          <div className="glass-card w-full max-w-xl relative z-[130] p-8 border-white/10 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Edit Poll</h2>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Update Vote Details</p>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdatePoll} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Poll Title</label>
                <input
                  type="text"
                  required
                  value={editData.title}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  className="glass-input h-12 px-4 w-full text-sm text-white"
                  placeholder="e.g., Best UI Framework 2026"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Description</label>
                <textarea
                  value={editData.description}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  className="glass-input p-4 w-full text-sm text-white min-h-[100px] resize-none"
                  placeholder="Provide context for the voters..."
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Candidates</label>
                  <button
                    type="button"
                    onClick={handleAddCandidate}
                    className="text-[10px] font-bold uppercase tracking-widest text-slate-300 hover:text-white flex items-center space-x-1"
                  >
                    <Plus size={12} />
                    <span>Add Candidate</span>
                  </button>
                </div>
                <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                  {editData.candidates.map((candidate, idx) => (
                    <div key={idx} className="flex space-x-2">
                      <input
                        type="text"
                        required
                        value={candidate}
                        onChange={(e) => handleCandidateChange(idx, e.target.value)}
                        className="glass-input h-12 px-4 flex-1 text-sm text-white"
                        placeholder={`Candidate ${idx + 1}`}
                      />
                      {editData.candidates.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveCandidate(idx)}
                          className="p-3 text-slate-500 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Poll Expiration</label>
                <Popover open={showCalendar} onOpenChange={setShowCalendar}>
                  <PopoverTrigger asChild>
                    <div className="glass-input h-12 flex items-center px-4 cursor-pointer hover:border-white/40 transition-all bg-white/5">
                      <span className="text-xs uppercase font-bold text-white tracking-widest">
                        {editData.endsAt ? new Date(editData.endsAt).toLocaleString() : 'No Expiry Set'}
                      </span>
                      <CalendarIcon size={16} className="ml-auto text-slate-500" />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 border-none bg-transparent shadow-none" side="bottom" align="start">
                    <DropdownMultiCalendar
                      initialDate={editData.endsAt}
                      onConfirm={(dates) => {
                        if (dates.length > 0) {
                          setEditData({ ...editData, endsAt: new Date(dates[0]).toISOString() });
                        }
                        setShowCalendar(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <button type="submit" className="w-full glass-button-primary h-12 mt-6 text-[11px] font-black tracking-[0.2em] uppercase">
                Update Poll Details
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
