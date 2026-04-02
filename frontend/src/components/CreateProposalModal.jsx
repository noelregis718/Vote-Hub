import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, AlertCircle, Loader2, CheckCircle, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function CreateProposalModal({ isOpen, onClose, onSuccess, initialData }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [goal, setGoal] = useState('');
  const [budget, setBudget] = useState('');
  const [targetSupports, setTargetSupports] = useState('100');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const { token } = useAuth();

  React.useEffect(() => {
    if (isOpen) {
      setTitle(initialData?.title || '');
      setDescription(initialData?.description || '');
      setGoal(initialData?.goal || '');
      setBudget(initialData?.budget || '');
      setTargetSupports(initialData?.targetSupports?.toString() || '100');
    }
  }, [isOpen, initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const payload = {
        title, 
        description, 
        goal, 
        budget: budget ? parseFloat(budget) : null,
        targetSupports: targetSupports ? parseInt(targetSupports) : 100
      };

      if (initialData?.id) {
        await axios.put(`http://localhost:5000/api/proposals/${initialData.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('http://localhost:5000/api/proposals', payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onSuccess?.();
        onClose();
        if (!initialData) {
          setTitle('');
          setDescription('');
          setGoal('');
          setBudget('');
          setTargetSupports('100');
        }
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save proposal. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-5xl bg-zinc-950 border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl flex flex-col md:flex-row h-[90vh]">
        {/* Left Side - Visual/Info */}
        <div className="w-full md:w-2/5 bg-white/[0.02] p-8 md:p-12 flex flex-col justify-start border-b md:border-b-0 md:border-r border-white/5">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-white tracking-tight font-sans">
              {initialData ? 'Edit idea' : 'Submit idea'}
            </h2>
            <p className="text-white text-base leading-relaxed font-sans">
              Gather community support to bring your project to life. Define your goals, set a budget, and rally your peers.
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-3/5 p-8 md:p-12 flex flex-col h-full">
          <button 
            onClick={onClose}
            className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>

          <form id="proposal-modal-form" onSubmit={handleSubmit} className="flex flex-col h-full">
            <div className="flex-grow overflow-y-auto no-scrollbar pr-2 space-y-8 pb-8">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center space-x-3 text-red-400">
                  <AlertCircle size={20} />
                  <p className="text-sm font-bold">{error}</p>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <label className="text-sm font-bold text-white ml-1 mb-2 block font-sans">
                    Title of your proposal
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Solar Powered Street Lights"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-white/20 transition-all font-bold text-base font-sans"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-white ml-1 mb-2 block font-sans">
                    Detailed description
                  </label>
                  <textarea
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Explain the problem and your solution..."
                    rows={4}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-white/20 transition-all font-bold text-base no-scrollbar font-sans"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-white ml-1 mb-2 block font-sans">
                    Specific goal
                  </label>
                  <input
                    type="text"
                    required
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder="What single outcome will this achieve?"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-white/20 transition-all font-bold text-base font-sans"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-bold text-white ml-1 mb-2 block font-sans">
                      Estimated budget (₹)
                    </label>
                    <div className="relative">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 text-white font-bold text-lg pointer-events-none font-sans">₹</span>
                      <input
                        type="number"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-white/20 transition-all font-bold text-base font-sans"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-bold text-white ml-1 mb-2 block font-sans">
                      Support goal (Votes)
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={targetSupports}
                      onChange={(e) => setTargetSupports(e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-white/20 transition-all font-bold text-base font-sans"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-white/5 mt-auto flex justify-end">
              {isSuccess ? (
                <div className="bg-white text-black flex items-center space-x-2 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest animate-in zoom-in-95 duration-300">
                  <CheckCircle size={20} />
                  <span>Proposal Saved!</span>
                </div>
              ) : (
                <button
                  form="proposal-modal-form"
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-white text-black flex items-center space-x-2 px-10 py-4 rounded-md hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/5"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      <Send size={18} />
                      <span className="font-bold text-sm font-sans">
                        {initialData ? 'Update proposal' : 'Publish proposal'}
                      </span>
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
