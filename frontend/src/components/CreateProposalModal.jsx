import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function CreateProposalModal({ isOpen, onClose, onSuccess }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [goal, setGoal] = useState('');
  const [budget, setBudget] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const { token } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await axios.post('http://localhost:5000/api/proposals', {
        title,
        description,
        goal,
        budget: budget ? parseFloat(budget) : null
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onSuccess?.();
        onClose();
        // Reset form
        setTitle('');
        setDescription('');
        setGoal('');
        setBudget('');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit proposal. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="glass-card w-full max-w-2xl relative z-[160] overflow-hidden border-white/20 shadow-[0_0_80px_rgba(0,0,0,0.8)]"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-6 top-6 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all rounded-lg border border-white/5 text-xs font-bold font-sans"
            >
              Close
            </button>

            {isSuccess ? (
              <div className="p-12 text-center space-y-6">
                <h2 className="text-3xl font-black text-white tracking-tight uppercase">Proposal Live!</h2>
                <p className="text-slate-400 font-medium">Your idea has been shared with the community.</p>
              </div>
            ) : (
              <div className="p-8 md:p-12 space-y-8">
                <div className="space-y-4 text-center md:text-left">
                  <h2 className="text-4xl font-black text-white tracking-tight font-sans">Submit idea</h2>
                  <p className="text-slate-400 text-base font-medium font-sans">Gather community support to bring your project to life.</p>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl text-[11px] font-semibold animate-in shake-in duration-300 text-center font-sans">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-10">
                  <div className="space-y-6 font-sans">
                    <div className="space-y-4">
                      <label className="text-sm font-bold text-slate-400 ml-1 tracking-wide">Title</label>
                      <input
                        type="text"
                        required
                        className="glass-input h-16 text-lg px-6"
                        placeholder="Project name..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>

                    <div className="space-y-4">
                      <label className="text-sm font-bold text-slate-400 ml-1 tracking-wide">Description</label>
                      <textarea
                        required
                        className="glass-input min-h-[160px] py-6 px-6 text-lg"
                        placeholder="Detailed project description..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <label className="text-sm font-bold text-slate-400 ml-1 tracking-wide">Specific goal</label>
                        <input
                          type="text"
                          required
                          className="glass-input h-16 text-lg px-6"
                          placeholder="Specific target..."
                          value={goal}
                          onChange={(e) => setGoal(e.target.value)}
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="text-sm font-bold text-slate-400 ml-1 tracking-wide">Estimated budget (₹)</label>
                        <input
                          type="number"
                          className="glass-input h-16 text-lg px-6"
                          placeholder="Optional"
                          value={budget}
                          onChange={(e) => setBudget(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 flex flex-col md:flex-row gap-8 items-center justify-between">
                    <p className="text-sm font-semibold text-slate-500 font-sans text-center md:text-left">Visible to everyone</p>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full md:w-auto px-16 h-16 bg-white text-black font-bold text-lg font-sans rounded-xl hover:bg-slate-200 transition-all shadow-[0_10px_20px_rgba(255,255,255,0.1)]"
                    >
                      {isSubmitting ? (
                        <span className="animate-pulse">Submitting...</span>
                      ) : (
                        <span>Publish proposal</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
