import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { 
  X, Trash2, History, Loader2, ArrowRight, 
  PlusCircle, AlertCircle, Calendar 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export function DraftsModal({ isOpen, onClose, onSelectDraft }) {
  const [drafts, setDrafts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { token } = useAuth();

  const fetchDrafts = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/api/drafts');
      setDrafts(res.data);
    } catch (err) {
      setError("Failed to load drafts.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && token) {
      fetchDrafts();
    }
  }, [isOpen, token]);

  const deleteDraft = async (e, id) => {
    e.stopPropagation();
    try {
      await api.delete(`/api/drafts/${id}`);
      setDrafts(drafts.filter(d => d.id !== id));
    } catch (err) {
      setError("Failed to delete draft.");
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
            className="relative w-full max-w-2xl bg-zinc-950 border border-white/10 shadow-2xl p-10 flex flex-col max-h-[80vh] overflow-hidden"
          >
            {/* Body */}
            <div className="flex-grow overflow-y-auto no-scrollbar space-y-10">
              <div className="space-y-4">
                <h2 className="text-4xl font-bold text-white tracking-tight font-sans">Saved drafts</h2>
                <p className="text-white text-base font-sans leading-relaxed">Resume your progress on existing poll configurations.</p>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg flex items-center space-x-2 text-sm font-bold">
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}

              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4 font-sans text-white">
                  <Loader2 className="text-white/20 animate-spin" size={40} />
                  <p className="font-bold text-sm">Loading drafts...</p>
                </div>
              ) : drafts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                  <div className="space-y-2 font-sans text-white">
                    <h3 className="font-bold text-lg">No drafts found</h3>
                    <p className="opacity-60 text-sm max-w-xs mx-auto">You haven't saved any poll drafts yet. Start a new poll and save your progress.</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {drafts.map((draft) => (
                    <motion.div 
                      key={draft.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      onClick={() => onSelectDraft(draft)}
                      className="group p-5 rounded-xl border border-white/5 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/20 transition-all cursor-pointer flex items-center justify-between"
                    >
                      <div className="space-y-2 font-sans">
                        <h3 className="text-base font-bold text-white group-hover:text-primary-400 transition-colors tracking-tight line-clamp-1">
                          {draft.title || 'Untitled draft'}
                        </h3>
                        <div className="flex items-center space-x-4 text-slate-500">
                          <span className="text-[10px] font-bold tracking-wider">
                            {new Date(draft.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={(e) => deleteDraft(e, draft.id)}
                          className="p-2.5 rounded-xl text-slate-500 hover:text-red-500 hover:bg-red-500/10 transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                        <ArrowRight size={20} className="text-slate-600 group-hover:text-white transition-all transform group-hover:translate-x-1" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="pt-10 flex items-center justify-between">
              <button
                onClick={onClose}
                className="text-white hover:text-slate-200 px-4 transition-colors text-lg font-bold"
              >
                Dismiss
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
