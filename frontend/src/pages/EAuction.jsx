import React, { useState, useEffect } from 'react';
import { Gavel, Clock, TrendingUp, Search, Filter, Plus, X, Upload, Calendar as CalendarIcon, Edit, Trash2, Share2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DropdownMultiCalendar } from '../components/ui/dropdown-multi-calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import ShareModal from '../components/ShareModal';

export default function EAuction() {
  const { token, user } = useAuth();
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Share State
  const [shareItem, setShareItem] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newAuction, setNewAuction] = useState({
    title: '',
    description: '',
    startingBid: '',
    endsAt: '',
    image: ''
  });

  // Bidding State
  const [showBidModal, setShowBidModal] = useState(false);
  const [biddingItem, setBiddingItem] = useState(null);
  const [bidAmount, setBidAmount] = useState('');

  // Sorting State
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'price-low', 'price-high', 'popular'

  const fetchAuctions = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/auctions');
      const data = await res.json();
      setAuctions(data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch auctions');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuctions();
  }, []);

  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setNewAuction({ ...newAuction, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateAuction = async (e) => {
    e.preventDefault();
    if (!token) return alert("Please log in again.");
    if (!newAuction.endsAt) return alert("Please select an auction end date.");

    try {
      const endpoint = editingId
        ? `http://localhost:5000/api/auctions/${editingId}`
        : 'http://localhost:5000/api/auctions';

      const res = await fetch(endpoint, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newAuction)
      });

      if (res.ok) {
        setShowCreateModal(false);
        setEditingId(null);
        fetchAuctions();
        setNewAuction({ title: '', description: '', startingBid: '', endsAt: '', image: '' });
        setImagePreview(null);
      } else {
        const error = await res.json();
        alert(error.message);
      }
    } catch (err) {
      alert("Network error.");
    }
  };

  const handleDeleteAuction = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/auctions/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchAuctions();
    } catch (err) {
      alert("Network error.");
    }
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setNewAuction({
      title: item.title,
      description: item.description,
      startingBid: item.startingBid,
      endsAt: item.endsAt.slice(0, 16),
      image: item.image
    });
    setImagePreview(item.image);
    setShowCreateModal(true);
  };

  const openBidModal = (item) => {
    setBiddingItem(item);
    setBidAmount(item.currentBid + 1);
    setShowBidModal(true);
  };

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    if (!token) return alert("Please log in first.");
    if (Number(bidAmount) <= biddingItem.currentBid) return alert(`Min. bid is ₹${biddingItem.currentBid + 1}`);

    try {
      const res = await fetch(`http://localhost:5000/api/auctions/${biddingItem.id}/bid`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ amount: bidAmount })
      });
      if (res.ok) {
        setShowBidModal(false);
        fetchAuctions();
      } else {
        const error = await res.json();
        alert(error.message);
      }
    } catch (err) {
      console.error('Bid failed');
    }
  };

  const filteredAndSortedAuctions = auctions
    .filter(a => {
      const urlParams = new URLSearchParams(window.location.search);
      const auctionId = urlParams.get('auctionId');
      if (auctionId && a.id === auctionId) return true;
      if (auctionId) return false; // If deep-linking, only show that one

      return a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.description.toLowerCase().includes(search.toLowerCase());
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.currentBid - b.currentBid;
      if (sortBy === 'price-high') return b.currentBid - a.currentBid;
      if (sortBy === 'popular') return (b._count?.bids || 0) - (a._count?.bids || 0);
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white uppercase">eAuction</h1>
          <p className="text-slate-500 mt-1 font-medium">Premium assets, competitive bidding.</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="glass-button flex items-center space-x-2 px-6 py-3 group"
        >
          <Plus size={18} className="group-hover:rotate-90 transition-transform" />
          <span className="font-extrabold tracking-wide text-base">Start Auction</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-white transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search premium assets..."
            className="glass-input pl-12 h-14"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <button className="glass-card flex items-center justify-center space-x-2 hover:bg-white/5 transition-colors h-14 border-white/10 w-full">
              <Filter size={18} className="text-slate-400" />
              <span className="text-base font-bold tracking-wide text-slate-300">
                {sortBy === 'newest' ? 'Newest' : sortBy === 'price-low' ? 'Price: Low' : sortBy === 'price-high' ? 'Price: High' : 'Popular'}
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-2 glass-card border-white/10 bg-black/90 backdrop-blur-xl z-[150]" align="end">
            <div className="space-y-1">
              {[
                { id: 'newest', label: 'Newest Arrivals' },
                { id: 'popular', label: 'Most Popular' },
                { id: 'price-low', label: 'Price: Low to High' },
                { id: 'price-high', label: 'Price: High to Low' }
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSortBy(option.id)}
                  className={`w-full text-left px-3 py-2 rounded-md text-base font-bold tracking-tight transition-colors ${sortBy === option.id ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredAndSortedAuctions.length === 0 ? (
        <div className="glass-card py-20 text-center space-y-4">
          <Gavel size={48} className="mx-auto text-white opacity-20" />
          <p className="text-slate-500 font-medium">No auctions match your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {filteredAndSortedAuctions.map((item) => (
            <div key={item.id} className="glass-card overflow-hidden group hover:border-white/20 transition-all flex flex-col">
              <div className="aspect-[4/3] bg-white/5 relative overflow-hidden">
                <img
                  src={item.image || "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop"}
                  alt={item.title}
                  className="w-full h-full object-cover grayscale opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white">Live</span>
                </div>
              </div>

              <div className="p-6 flex-grow flex flex-col space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-slate-300 transition-colors uppercase">{item.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">{item.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/5">
                  <div className="space-y-1">
                    <p className="text-sm tracking-wide text-slate-500 font-bold">Current Bid</p>
                    <p className="text-lg font-black text-white">₹{item.currentBid.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm tracking-wide text-slate-500 font-bold">Total Bids</p>
                    <div className="flex items-center space-x-1.5">
                      <TrendingUp size={14} className="text-green-500" />
                      <p className="text-lg font-black text-white">{item._count?.bids || 0}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between mt-auto">
                  <div className="flex items-center space-x-2 text-slate-400">
                    <Clock size={16} />
                    <span className="text-sm font-bold tracking-tight">
                      {new Date(item.endsAt) > new Date() ? 'Ends Soon' : 'Ended'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {user && user.id === item.userId && (
                      <div className="flex items-center space-x-1 mr-2">
                        <button onClick={() => openEditModal(item)} className="p-2 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all rounded-md">
                          <Edit size={14} />
                        </button>
                        <button onClick={() => handleDeleteAuction(item.id)} className="p-2 bg-white/5 hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-all rounded-md">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                    <button onClick={() => openBidModal(item)} className="text-xs font-bold px-4 py-2 border border-white bg-white text-black hover:bg-transparent hover:text-white transition-all rounded-md">
                      Place Bid
                    </button>
                    <button
                      onClick={() => setShareItem(item)}
                      className="p-2 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all rounded-md ml-2"
                      title="Share Auction"
                    >
                      <Share2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Share Modal */}
      <ShareModal
        isOpen={!!shareItem}
        onClose={() => setShareItem(null)}
        title={shareItem?.title}
        type="Auction"
        url={`${window.location.origin}/eauction?auctionId=${shareItem?.id}`}
      />

      {/* Bid Modal */}
      {showBidModal && biddingItem && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowBidModal(false)} />
          <div className="glass-card w-full max-w-sm relative z-[130] p-8 border-white/10 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Place Bid</h2>
                <p className="text-[10px] text-slate-500 font-bold tracking-wide">{biddingItem.title}</p>
              </div>
              <button onClick={() => setShowBidModal(false)} className="text-slate-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleBidSubmit} className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <label className="text-[10px] font-bold tracking-wide text-slate-500">Your Bid (₹)</label>
                  <span className="text-[10px] text-slate-400">Min. ₹{biddingItem.currentBid + 1}</span>
                </div>
                <input
                  type="number"
                  autoFocus
                  required
                  min={biddingItem.currentBid + 1}
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="glass-input h-14 text-2xl font-black text-center text-white"
                  placeholder={biddingItem.currentBid + 1}
                />
              </div>
              <button type="submit" className="w-full glass-button h-12 text-sm font-bold">Confirm Bid</button>
            </form>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setShowCreateModal(false)}></div>
          <div className="glass-card w-full max-w-2xl relative z-[101] overflow-hidden flex flex-col md:flex-row border-white/10">
            <div className="w-full md:w-1/2 aspect-square md:aspect-auto bg-white/5 relative flex items-center justify-center group cursor-pointer border-r border-white/5">
              {imagePreview ? (
                <>
                  <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center" onClick={() => { setImagePreview(null); setNewAuction({ ...newAuction, image: '' }); }}>
                    <X size={32} className="text-white" />
                  </div>
                </>
              ) : (
                <label className="text-center p-8 cursor-pointer w-full h-full flex flex-col items-center justify-center space-y-4 hover:bg-white/5 transition-all">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-dashed border-white/20">
                    <Upload size={24} className="text-slate-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white uppercase tracking-widest">Upload Asset Image</p>
                    <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-tight">PNG, JPG up to 5MB</p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
              )}
            </div>
            <div className="w-full md:w-1/2 p-8 max-h-[85vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tighter">New Auction</h2>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Asset Details</p>
                </div>
                <button onClick={() => { setShowCreateModal(false); setEditingId(null); setNewAuction({ title: '', description: '', startingBid: '', endsAt: '', image: '' }); setImagePreview(null); }} className="text-slate-500 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleCreateAuction} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Asset Title</label>
                  <input type="text" required placeholder="e.g. Vintage Leica M6" className="glass-input h-10 text-sm" value={newAuction.title} onChange={(e) => setNewAuction({ ...newAuction, title: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Description</label>
                  <textarea required placeholder="Details about the asset..." className="glass-input py-2.5 h-20 text-sm resize-none" value={newAuction.description} onChange={(e) => setNewAuction({ ...newAuction, description: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Starting Bid (₹)</label>
                    <input type="number" required placeholder="25000" className="glass-input h-10 text-sm" value={newAuction.startingBid} onChange={(e) => setNewAuction({ ...newAuction, startingBid: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Auction End Date</label>
                    <Popover open={showCalendar} onOpenChange={setShowCalendar}>
                      <PopoverTrigger asChild>
                        <div className="glass-input h-12 flex items-center px-4 cursor-pointer hover:border-white/40 transition-all bg-white/5">
                          <span className="text-xs uppercase font-bold text-white tracking-widest">
                            {newAuction.endsAt ? new Date(newAuction.endsAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : 'Select Premium End Date'}
                          </span>
                          <CalendarIcon size={16} className="ml-auto text-slate-500 hover:text-white transition-colors" />
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 border-none bg-transparent shadow-none" side="bottom" align="start">
                        <div className="animate-in fade-in zoom-in-95 duration-200">
                          <DropdownMultiCalendar initialDate={newAuction.endsAt} onConfirm={(dates) => {
                            if (dates.length > 0) {
                              const d = new Date(dates[0]);
                              d.setHours(23, 59, 0, 0);
                              setNewAuction({ ...newAuction, endsAt: d.toISOString().slice(0, 16) });
                            }
                            setShowCalendar(false);
                          }} />
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <button type="submit" className="w-full glass-button-primary h-12 mt-4 text-[11px] font-black tracking-[0.2em] uppercase">{editingId ? 'Update Asset' : 'Launch Asset'}</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
