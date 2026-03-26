import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Plus, Minus, Send, AlertCircle, Loader2 } from 'lucide-react';

export default function CreatePoll() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [candidates, setCandidates] = useState(['', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

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
        candidates: candidates.filter(c => c.trim())
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create poll. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="glass-card p-8 md:p-12 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white">Create New Poll</h1>
          <p className="text-slate-400">Set up a new voting event for your community.</p>
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
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 ml-1">Poll Title</label>
              <input
                type="text"
                required
                className="glass-input"
                placeholder="What are we voting on?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 ml-1">Description (Optional)</label>
              <textarea
                className="glass-input min-h-[100px] py-3"
                placeholder="Provide some context for the voters..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
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

          <div className="pt-4 border-t border-white/10 flex justify-end items-center space-x-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="text-slate-400 hover:text-white px-6 py-2.5 transition-colors"
            >
              Cancel
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
                  <span className="font-bold">Launch Poll</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
