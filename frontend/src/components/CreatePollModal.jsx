import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { 
  X, Plus, Minus, Send, AlertCircle, Loader2, Save, 
  Calendar as CalendarIcon 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { DropdownMultiCalendar } from './ui/dropdown-multi-calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

export function CreatePollModal({ isOpen, onClose, initialData = null, onPollCreated, onDraftSaved }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [candidates, setCandidates] = useState(['', '']);
  const [endsAt, setEndsAt] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [activeDraftId, setActiveDraftId] = useState(null);

  const { token } = useAuth();

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setCandidates(initialData.candidates?.length > 0 ? initialData.candidates : ['', '']);
      setEndsAt(initialData.endsAt || '');
      setActiveDraftId(initialData.id || null);
    } else {
      resetForm();
    }
  }, [initialData, isOpen]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCandidates(['', '']);
    setEndsAt('');
    setActiveDraftId(null);
    setError('');
  };

  const saveDraft = async () => {
    if (!title && !description) return;

    try {
      const res = await api.post('/api/drafts', {
        id: activeDraftId,
        title,
        description,
        candidates,
        endsAt
      });

      if (onDraftSaved) onDraftSaved(res.data);
      resetForm();
      onClose();
    } catch (err) {
      setError("Failed to save draft.");
    }
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
      await api.post('/api/polls', {
        title,
        description,
        candidates: candidates.filter(c => c.trim()),
        endsAt: endsAt || null
      });

      if (onPollCreated) onPollCreated();
      resetForm();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create poll. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-zinc-950 border border-white/10 shadow-2xl p-10 flex flex-col max-h-[90vh] overflow-hidden"
          >
            {/* Body */}
            <div className="flex-grow overflow-y-auto no-scrollbar space-y-10">
              <div className="space-y-4">
                <h2 className="text-4xl font-bold text-white tracking-tight font-sans">Create new poll</h2>
                <p className="text-white text-base font-sans">Set up a new voting event for your community.</p>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg flex items-center space-x-2 text-sm font-bold">
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}

              <form id="poll-modal-form" onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-6">
                  <div className="flex flex-col gap-3">
                    <label className="text-sm font-bold text-white ml-1 font-sans">Poll title</label>
                    <input
                      type="text"
                      required
                      className="glass-input h-14 bg-white/[0.03] border-white/10"
                      placeholder="What are we voting on?"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-3">
                    <label className="text-sm font-bold text-white ml-1 font-sans">Description (Optional)</label>
                    <textarea
                      className="glass-input min-h-[140px] py-4 bg-white/[0.03] border-white/10"
                      placeholder="Provide some context for the voters..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-3">
                    <label className="text-sm font-bold text-white ml-1 font-sans">Expiry date (Optional)</label>
                    <Popover open={showCalendar} onOpenChange={setShowCalendar}>
                      <PopoverTrigger asChild>
                        <div className="glass-input h-14 flex items-center px-4 cursor-pointer hover:border-white/20 transition-all bg-white/[0.03] border-white/10">
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

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-bold text-white ml-1 font-sans">Candidates / options</label>
                      <button
                        type="button"
                        onClick={handleAddCandidate}
                        className="text-xs font-bold text-white hover:text-slate-300 flex items-center space-x-1.5 font-sans"
                      >
                        <Plus size={14} />
                        <span>Add option</span>
                      </button>
                    </div>

                    <div className="space-y-4 no-scrollbar">
                      {candidates.map((candidate, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="flex-grow">
                            <input
                              type="text"
                              required
                              className="glass-input h-14 bg-white/[0.03] border-white/10"
                              placeholder={`Option ${index + 1}`}
                              value={candidate}
                              onChange={(e) => handleCandidateChange(index, e.target.value)}
                            />
                          </div>
                          {candidates.length > 2 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveCandidate(index)}
                              className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                            >
                              <Minus size={20} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="pt-10 flex flex-wrap gap-4 items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="text-white hover:text-slate-200 px-4 transition-colors text-lg font-bold"
              >
                Cancel
              </button>

              <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={saveDraft}
                    className="flex items-center space-x-2 px-6 py-3 border border-white/10 rounded-lg hover:bg-white/5 transition-all text-white text-sm font-bold font-sans"
                  >
                    <Save size={18} />
                    <span className="text-sm font-bold">Save draft</span>
                  </button>

                <button
                  form="poll-modal-form"
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-white text-black flex items-center space-x-2 px-8 py-3 rounded-lg hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/5"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      <Send size={18} />
                      <span className="font-bold text-sm font-sans">Launch poll</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
