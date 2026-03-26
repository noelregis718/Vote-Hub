import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Vote as VoteIcon, 
  LayoutDashboard, 
  PlusCircle, 
  LogOut, 
  Shield, 
  User as UserIcon,
  ChevronRight,
  Info,
  Gavel
} from 'lucide-react';

export function Layout({ children, user, onLogout }) {
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { label: 'eAuction', path: '/eauction', icon: <Gavel size={20} /> },
    { label: 'Create Poll', path: '/create-poll', icon: <PlusCircle size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-black text-slate-200">
      {/* Sidebar */}
      {user && (
        <aside className="hidden lg:flex flex-col w-72 border-r border-white/5 bg-black sticky top-0 h-screen">
          <div className="p-6">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-lg shadow-white/10 group-hover:scale-110 transition-transform">
                <VoteIcon className="text-black" size={24} />
              </div>
              <span className="text-2xl font-black tracking-tighter text-white">VoteHub</span>
            </Link>
          </div>

          <nav className="flex-grow px-4 py-6 space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-4 mb-4">Main Menu</div>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all group ${
                  location.pathname === item.path
                    ? 'bg-white/10 text-white border border-white/10'
                    : 'text-slate-500 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </div>
                {location.pathname === item.path && <ChevronRight size={16} />}
              </Link>
            ))}
          </nav>

          {/* User Section at Bottom */}
          <div className="p-4 mt-auto space-y-3">
            <button 
              onClick={onLogout}
              className="w-full flex items-center justify-center space-x-2 py-3 rounded-lg border border-white/5 bg-white/5 hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-all font-bold text-xs"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>

            <div className="glass-card p-4 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 overflow-hidden">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <UserIcon size={20} className="text-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{user.name}</p>
                <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar - Mobile & Unauthenticated */}
        <header className={`h-20 flex items-center justify-between px-6 lg:px-10 border-b border-white/5 backdrop-blur-md sticky top-0 z-50 ${user ? 'lg:hidden' : 'w-full'}`}>
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-md
 bg-white flex items-center justify-center">
              <VoteIcon className="text-black" size={18} />
            </div>
            <span className="text-xl font-black tracking-tighter text-white">VoteHub</span>
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 overflow-hidden">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon size={16} className="text-white" />
                    )}
                  </div>
                  <span className="text-sm font-bold text-white hidden sm:inline">{user.name}</span>
                </div>
                <button onClick={onLogout} className="p-2 text-slate-400 hover:text-red-400 transition-colors">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Log In</Link>
                <Link to="/register" className="glass-button text-xs px-4 py-2">Sign Up</Link>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className={`flex-grow overflow-y-auto px-6 py-8 lg:px-12 lg:py-12 ${!user ? 'container mx-auto max-w-7xl' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  );
}
