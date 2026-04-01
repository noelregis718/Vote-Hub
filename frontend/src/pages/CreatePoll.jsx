import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Plus, Minus, Send, AlertCircle, Loader2, Save, History, Trash2, Calendar as CalendarIcon, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DropdownMultiCalendar } from '../components/ui/dropdown-multi-calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';

export default function CreatePoll() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [candidates, setCandidates] = useState(['', '']);
  const [endsAt, setEndsAt] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [drafts, setDrafts] = useState([]);
  const [activeDraftId, setActiveDraftId] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successType, setSuccessType] = useState('draft'); // 'draft' or 'poll'

  const navigate = useNavigate();
  const { token } = useAuth();

  const fetchDrafts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/drafts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDrafts(res.data);
    } catch (err) {
      console.error("Failed to fetch drafts", err);
    }
  };

  useEffect(() => {
    if (token) fetchDrafts();
  }, [token]);

  const saveDraft = async () => {
    if (!title && !description) return;

    try {
      const res = await axios.post('http://localhost:5000/api/drafts', {
        id: activeDraftId,
        title,
        description,
        candidates,
        endsAt
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setActiveDraftId(res.data.id);
      fetchDrafts();
      setSuccessType('draft');
      setIsSuccessModalOpen(true);
      resetForm();
    } catch (err) {
      setError("Failed to save draft.");
    }
  };

  const loadDraft = (draft) => {
    setActiveDraftId(draft.id);
    setTitle(draft.title || '');
    setDescription(draft.description || '');
    setCandidates(draft.candidates.length > 0 ? draft.candidates : ['', '']);
    setEndsAt(draft.endsAt || '');
  };

  const deleteDraft = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/drafts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (activeDraftId === id) setActiveDraftId(null);
      fetchDrafts();
    } catch (err) {
      setError("Failed to delete draft.");
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCandidates(['', '']);
    setEndsAt('');
    setActiveDraftId(null);
    setError('');
  };

  const handleAddCandidate = () => {
    setCandidates([...candidates, '']);
  };

  const handleRemoveCandidate = (index) => {
    if (candidates.length <= 2) return;
    const newCandidates = [...candidates];
    newCandidates.splice(index, 1);
    setCandidates(newCandidates);
  };

  const handleCandidateChange = (index, value) => {
    const newCandidates = [...candidates];
    newCandidates[index] = value;
    setCandidates(newCandidates);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (candidates.some(c => !c.trim())) {
      setError('All candidate options must be filled.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      await axios.post('http://localhost:5000/api/polls', {
        title,
        description,
        candidates: candidates.filter(c => c.trim()),
        endsAt: endsAt || null
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Clear associated draft if it exists
      if (activeDraftId) {
        await axios.delete(`http://localhost:5000/api/drafts/${activeDraftId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      setSuccessType('poll');
      setIsSuccessModalOpen(true);
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create poll. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-5 duration-700 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Form Section */}
        <div className="lg:col-span-2 glass-card p-8 md:p-12 space-y-8 h-fit">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white">Create New Poll</h1>
            <p className="text-slate-400 text-sm">Set up a new voting event for your community.</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg
 flex items-center space-x-2 text-sm">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <div className="flex flex-col gap-4">
                <label className="text-sm font-bold text-slate-300 ml-1">Poll Title</label>
                <input
                  type="text"
                  required
                  className="glass-input"
                  placeholder="What are we voting on?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-4">
                <label className="text-sm font-bold text-slate-300 ml-1">Description (Optional)</label>
                <textarea
                  className="glass-input min-h-[100px] py-3"
                  placeholder="Provide some context for the voters..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-4">
                <label className="text-sm font-bold text-slate-300 ml-1">Expiry Date (Optional)</label>
                <Popover open={showCalendar} onOpenChange={setShowCalendar}>
                  <PopoverTrigger asChild>
                    <div className="glass-input h-14 flex items-center px-4 cursor-pointer hover:border-white/20 transition-all bg-white/[0.03]">
                      <span className="text-sm font-medium text-white">
                        {endsAt ? new Date(endsAt).toLocaleString() : 'Set poll ending time'}
                      </span>
                      <CalendarIcon size={18} className="ml-auto text-slate-500" />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 border-none bg-transparent shadow-none" side="bottom" align="start">
                    <DropdownMultiCalendar
                      initialDate={endsAt}
                      onConfirm={(dates) => {
                        if (dates.length > 0) {
                          setEndsAt(new Date(dates[0]).toISOString());
                        }
                        setShowCalendar(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-300 ml-1">Candidates / Options</label>
                <button
                  type="button"
                  onClick={handleAddCandidate}
                  className="text-xs font-bold text-primary-400 hover:text-primary-300 flex items-center space-x-1 px-2 py-1 rounded-lg hover:bg-white/5 transition-all"
                >
                  <Plus size={14} />
                  <span>Add Option</span>
                </button>
              </div>

              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                {candidates.map((candidate, index) => (
                  <div key={index} className="flex items-center space-x-2 animate-in slide-in-from-left-2 duration-300" style={{ animationDelay: `${index * 50}ms` }}>
                    <div className="flex-grow relative">
                      <input
                        type="text"
                        required
                        className="glass-input"
                        placeholder={`Option ${index + 1}`}
                        value={candidate}
                        onChange={(e) => handleCandidateChange(index, e.target.value)}
                      />
                    </div>
                    {candidates.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveCandidate(index)}
                        className="p-3 text-slate-500 hover:text-red-400 transition-colors"
                      >
                        <Minus size={20} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 flex flex-wrap gap-4 items-center justify-between">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="text-slate-400 hover:text-white px-4 py-2.5 transition-colors text-sm font-bold uppercase tracking-wider"
              >
                Cancel
              </button>

              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={saveDraft}
                  className="flex items-center space-x-2 px-6 py-3 border border-white/10 rounded-lg hover:bg-white/5 transition-all text-slate-300 hover:text-white text-sm font-bold uppercase tracking-wider"
                >
                  <Save size={18} />
                  <span>Save Draft</span>
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="glass-button flex items-center space-x-2 px-8 py-3"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      <Send size={18} />
                      <span className="font-bold text-sm">Launch Poll</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Drafts Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-6 border-white/10 h-fit bg-white/[0.02]">
            <div className="flex items-center mb-6">
              <h2 className="text-lg font-bold text-white tracking-tight">Drafts Saved</h2>
            </div>

            <div className="space-y-4">
              {drafts.length === 0 ? (
                <div className="py-8 text-center border border-dashed border-white/10 rounded-xl">
                  <p className="text-slate-500 text-xs font-medium">No drafts saved yet</p>
                </div>
              ) : (
                drafts.map((draft) => (
                  <div key={draft.id} className="group p-4 rounded-xl border border-white/5 bg-white/[0.03] hover:border-white/20 transition-all space-y-3">
                    <div className="flex justify-between items-start">
                      <h3 className="text-sm font-bold text-white line-clamp-1">{draft.title || 'Untitled Draft'}</h3>
                      <button onClick={() => deleteDraft(draft.id)} className="text-slate-500 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-all">
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-500 line-clamp-2">
                      Last updated: {new Date(draft.updatedAt).toLocaleDateString()}
                    </p>
                    <button
                      onClick={() => loadDraft(draft)}
                      className="w-full py-2.5 text-xs font-bold bg-white/5 hover:bg-white/10 text-white rounded-lg transition-all"
                    >
                      Continue Editing
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => {
            setIsSuccessModalOpen(false);
            if (successType === 'poll') navigate('/dashboard');
          }} />
          <div className="glass-card w-full max-w-sm relative z-[160] p-10 text-center animate-in zoom-in-95 duration-300 border-white/20">
            <h2 className="text-2xl font-bold text-white mb-3 tracking-tight">
              {successType === 'draft' ? 'Draft Saved' : 'Poll Launched'}
            </h2>
            <p className="text-slate-400 text-sm mb-10 leading-relaxed px-4">
              {successType === 'draft'
                ? 'Your progress has been saved to the database. You can resume editing anytime.'
                : 'Your poll is now live! Community members can start casting their votes.'}
            </p>

            <button
              onClick={() => {
                setIsSuccessModalOpen(false);
                if (successType === 'poll') navigate('/dashboard');
              }}
              className="w-full py-4 bg-white text-black font-bold text-sm rounded-xl hover:bg-slate-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              {successType === 'draft' ? 'Return to Workspace' : 'Go to Dashboard'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
