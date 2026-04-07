import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Vote as VoteIcon,
  LayoutDashboard,
  PlusCircle,
  LogOut,
  Shield,
  User as UserIcon,
  Info,
  Gavel,
  ChevronRight,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Lightbulb,
  Plus,
  History,
  CheckCircle,
  FileText,
  TrendingUp
} from 'lucide-react';

export function Layout({ children, user, onLogout }) {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { label: 'Polls', path: '/dashboard', icon: <VoteIcon size={20} /> },
    { label: 'eAuction', path: '/eauction', icon: <Gavel size={20} /> },
    { label: 'Proposals', path: '/proposals', icon: <Lightbulb size={20} /> },
    { label: 'Trending', path: '/trending', icon: <TrendingUp size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-black text-slate-200">
      {/* Sidebar */}
      {user && (
        <aside className={`${isCollapsed ? 'w-28' : 'w-72'} hidden lg:flex flex-col border-r border-white/5 bg-black sticky top-0 h-screen transition-all duration-300 ease-in-out z-50`}>
          <div className="flex flex-col items-center overflow-hidden h-full w-full">

            {/* Logo Section */}
            <div className={`w-full flex flex-col relative mb-12 mt-6 ${isCollapsed ? 'space-y-6 items-center' : 'space-y-4 px-6 items-start'}`}>
              <div className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
                <Link to="/" className="flex items-center space-x-3 group min-h-[40px]">
                  <div className={`w-10 h-10 min-w-[2.5rem] rounded-lg flex items-center justify-center transition-all duration-300 overflow-hidden ${isCollapsed ? '' : 'bg-white shadow-lg shadow-white/10'}`}>
                    <img src="/logo.png" alt="VoteHub Logo" className="w-full h-full object-cover p-1" />
                  </div>
                  {!isCollapsed && (
                    <span className="text-2xl font-black tracking-tighter text-white whitespace-nowrap animate-in fade-in slide-in-from-left-4 duration-300">
                      VoteHub
                    </span>
                  )}
                </Link>

                {!isCollapsed && (
                  <button
                    onClick={() => setIsCollapsed(true)}
                    className="p-2 text-white hover:text-white/80 transition-all hover:scale-125 ml-4"
                    title="Collapse Sidebar"
                  >
                    <PanelLeftClose size={24} />
                  </button>
                )}
              </div>

              {isCollapsed && (
                <button
                  onClick={() => setIsCollapsed(false)}
                  className="w-10 h-10 text-white hover:text-white/80 flex items-center justify-center transition-all hover:scale-125"
                  title="Expand Sidebar"
                >
                  <PanelLeftOpen size={24} />
                </button>
              )}
            </div>

            {/* Navigation Section */}
            <nav className={`w-full flex-grow space-y-6 ${isCollapsed ? '' : 'px-4'}`}>
              {!isCollapsed && (
                <div className="text-base font-extrabold text-slate-400 px-4 mb-5 animate-in fade-in duration-300 tracking-wide">
                  Main Menu
                </div>
              )}
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const content = (
                  <>
                    <div className={`flex items-center justify-center transition-all duration-300 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-white'}`}>
                      {React.cloneElement(item.icon, { size: isCollapsed ? 26 : 20 })}
                    </div>
                    {!isCollapsed && (
                      <span className={`font-medium transition-colors ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-white'}`}>
                        {item.label}
                      </span>
                    )}
                    {isActive && (
                      <div className={`absolute ${isCollapsed ? 'right-0' : 'right-2'} top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.6)]`} />
                    )}
                  </>
                );

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-start space-x-3 px-4'} py-3 transition-all group relative w-full rounded-lg`}
                    title={item.label}
                  >
                    {content}
                  </Link>
                );
              })}
            </nav>

            {/* Bottom Section */}
            <div className={`w-full mt-auto space-y-8 pb-8 flex flex-col ${isCollapsed ? 'items-start' : 'items-center px-4'}`}>
              <button
                onClick={onLogout}
                className={`flex items-center transition-all text-slate-500 hover:text-red-500 ${isCollapsed ? 'justify-center w-full h-10' : 'justify-center space-x-2 w-full py-3 rounded-md border border-white/5 bg-white/5 hover:bg-red-500/10 font-bold text-xs uppercase tracking-widest'}`}
                title="Logout"
              >
                <LogOut size={isCollapsed ? 24 : 16} />
                {!isCollapsed && <span>Logout</span>}
              </button>

              <div className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3 px-4 py-3 glass-card'}`}>
                <div className={`w-10 h-10 min-w-[2.5rem] rounded-full bg-white/5 flex items-center justify-center border border-white/10 overflow-hidden ${isCollapsed ? 'ring-2 ring-white/10 ring-offset-2 ring-offset-black transition-all' : ''}`}>
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon size={20} className="text-white" />
                  )}
                </div>
                {!isCollapsed && (
                  <div className="flex-1 min-w-0 animate-in fade-in slide-in-from-left-4 duration-300">
                    <p className="text-sm font-bold text-white truncate">{user.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </aside>
      )}

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar - Mobile & Unauthenticated */}
        <header className={`h-20 border-b border-white/5 backdrop-blur-md sticky top-0 z-50 w-full`}>
          <div className={`h-full flex items-center justify-between pl-6 lg:pl-12 ${user ? 'pr-0' : 'pr-6 lg:pr-12'} ${!user ? 'container mx-auto max-w-7xl' : ''}`}>
            <Link to="/" className={`flex items-center space-x-4 ${user ? 'lg:hidden' : ''}`}>
              <div className="w-9 h-9 rounded-md bg-white flex items-center justify-center overflow-hidden">
                <img src="/logo.png" alt="VoteHub Logo" className="w-full h-full object-cover p-1" />
              </div>
              <span className="text-3xl font-black tracking-tighter text-white">VoteHub</span>
            </Link>

            <div className="flex items-center space-x-8">
              {user ? (
                <div className="flex items-center space-x-8">
                  {/* Action buttons REMOVED from here to be placed in Dashboard */}
                  <div className="flex items-center space-x-6 lg:hidden">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 overflow-hidden">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          <UserIcon size={20} className="text-white" />
                        )}
                      </div>
                      <span className="text-base font-bold text-white hidden sm:inline">{user.name}</span>
                    </div>
                    <button onClick={onLogout} className="p-2 text-slate-400 hover:text-red-400 transition-colors">
                      <LogOut size={24} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-8">
                  <Link to="/login" className="text-lg font-bold text-white hover:text-slate-300 transition-colors">Log In</Link>
                  <Link to="/register" className="glass-button text-xl px-4 py-1 font-bold">Sign Up</Link>
                </div>
              )}
            </div>
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
