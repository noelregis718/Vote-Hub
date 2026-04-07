import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  TrendingUp, 
  Loader2, 
  ExternalLink, 
  Newspaper, 
  Calendar, 
  User,
  AlertCircle,
  TrendingDown,
  Activity
} from 'lucide-react';

// Backend Proxy URL
const NEWS_PROXY_URL = 'http://localhost:5000/api/news';

export default function Trending() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchNews = async () => {
    setLoading(true);
    setError('');
    try {
      // Calling our own backend proxy for Alpha Vantage Sentiment News
      const res = await axios.get(NEWS_PROXY_URL);

      if (res.data.status === 'success' && res.data.articles) {
        const normalized = (res.data.articles || []).map(item => {
          // Parse Alpha Vantage date: YYYYMMDDTHHMMSS
          const dateStr = item.time_published;
          let formattedDate = 'Recent';
          if (dateStr && dateStr.length >= 8) {
            const y = dateStr.substring(0, 4);
            const m = dateStr.substring(4, 6);
            const d = dateStr.substring(6, 8);
            formattedDate = new Date(`${y}-${m}-${d}`).toLocaleDateString();
          }

          return {
            title: item.title,
            description: item.summary,
            image: item.banner_image,
            url: item.url,
            date: formattedDate,
            source: item.source || 'Alpha Vantage',
            creator: item.authors?.[0] || 'Market Analyst',
            sentiment: item.overall_sentiment_label || 'Neutral'
          };
        });
        
        setNews(normalized);
      } else {
        setError(res.data.message || 'Failed to fetch the latest trending insights.');
      }
    } catch (err) {
      console.error('Frontend Fetch Error:', err);
      const msg = err.response?.data?.message || 'Connection to market news server failed.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const getSentimentStyles = (sentiment) => {
    const s = sentiment.toLowerCase();
    if (s.includes('bullish')) return 'text-green-400 bg-green-500/10 border-green-500/20';
    if (s.includes('bearish')) return 'text-red-400 bg-red-500/10 border-red-500/20';
    return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
  };

  const getSentimentIcon = (sentiment) => {
    const s = sentiment.toLowerCase();
    if (s.includes('bullish')) return <TrendingUp size={12} />;
    if (s.includes('bearish')) return <TrendingDown size={12} />;
    return <Activity size={12} />;
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 -mt-10">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Market Intelligence</h1>
          <p className="text-slate-400 text-sm font-medium tracking-tight animate-in fade-in duration-1000">
            Real-time sentiment Analysis and Global Technology Market Insights.
          </p>
        </div>

        <button 
          onClick={fetchNews}
          disabled={loading}
          className="flex items-center space-x-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all active:scale-95 disabled:opacity-50"
        >
          {loading && <Loader2 size={18} className="animate-spin" />}
          <span>Refresh Analysis</span>
        </button>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-6">
          <div className="w-16 h-16 border-4 border-white/5 border-t-white rounded-full animate-spin" />
          <p className="text-slate-400 font-medium animate-pulse tracking-widest uppercase text-xs">Analyzing Market Sentiments...</p>
        </div>
      ) : error ? (
        <div className="glass-card p-12 text-center max-w-2xl mx-auto border-red-500/20 bg-red-500/5">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
          <p className="text-slate-400 mb-6">{error}</p>
          <button 
            onClick={fetchNews} 
            className="bg-white text-black px-8 py-3 rounded-xl font-bold hover:scale-105 transition-all shadow-xl shadow-white/5"
          >
            Reconnect
          </button>
        </div>
      ) : news.length === 0 ? (
        <div className="glass-card p-20 text-center max-w-3xl mx-auto bg-gradient-to-br from-white/5 to-transparent">
          <div className="mb-6 inline-flex p-5 rounded-full bg-white/5 border border-white/10">
            <Newspaper size={40} className="text-slate-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">No trends found</h2>
          <p className="text-slate-400">The market is currently quiet. Please check back later!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {news.map((item, index) => (
            <article 
              key={index}
              className="glass-card group flex flex-col h-full border-white/5 hover:border-white/20 transition-all duration-500 hover:-translate-y-2"
            >
              <div className="relative h-48 w-full overflow-hidden rounded-t-2xl bg-white/5">
                {item.image ? (
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                ) : (
                   <div className="absolute inset-0 flex items-center justify-center opacity-10">
                    <Newspaper size={64} />
                  </div>
                )}
                <div className="absolute top-4 right-4 z-10">
                  <div className={`px-3 py-1.5 rounded-lg border backdrop-blur-md flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest ${getSentimentStyles(item.sentiment)}`}>
                    {getSentimentIcon(item.sentiment)}
                    <span>{item.sentiment}</span>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
              </div>
              
              <div className="p-6 flex flex-col flex-1 space-y-4">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400">
                  <span className="bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20">
                    {item.source}
                  </span>
                  <div className="flex items-center space-x-1 text-slate-500">
                    <Calendar size={12} />
                    <span>{item.date}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white leading-tight group-hover:text-blue-200 transition-colors line-clamp-2">
                  {item.title}
                </h3>

                <p className="text-slate-400 text-sm line-clamp-3 flex-1">
                  {item.description || 'Global market insight details for this headline.'}
                </p>

                <div className="pt-4 flex items-center justify-between border-t border-white/5">
                  <div className="flex items-center space-x-2 text-slate-500">
                    <User size={14} />
                    <span className="text-xs truncate max-w-[120px]">{item.creator}</span>
                  </div>
                  
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1.5 text-xs font-bold text-white hover:text-blue-400 transition-colors py-2 px-3 rounded-lg hover:bg-white/5"
                  >
                    <span>Read Report</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
