import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isLanding = location.pathname === '/';

  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.5)] border border-white/20">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-extrabold text-slate-900 text-lg tracking-tight">
              AI Nexus <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">Insight</span>
            </span>
          </Link>
 
          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            {isLanding && (
              <>
                <a href="#how-it-works" className="text-slate-500 hover:text-slate-900 transition-colors">
                  How It Works
                </a>
                <a href="#waitlist" className="text-slate-500 hover:text-slate-900 transition-colors">
                  Early Access
                </a>
              </>
            )}
            {isLoggedIn ? (
              <>
                <Link
                  to="/settings"
                  className="text-slate-500 hover:text-slate-900 transition-colors"
                >
                  Settings
                </Link>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-bold text-white shadow-xl shadow-slate-900/10 transition-all hover:bg-violet-600 active:scale-95"
                >
                  Dashboard →
                </Link>
              </>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-bold text-white shadow-xl shadow-slate-900/10 transition-all hover:bg-violet-600 active:scale-95"
              >
                Login
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-slate-900 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-md px-4 py-6 flex flex-col gap-4 text-base font-medium">
          {isLanding && (
            <>
              <a href="#how-it-works" onClick={() => setMenuOpen(false)} className="text-slate-500 hover:text-slate-900 transition-colors">How It Works</a>
              <a href="#waitlist" onClick={() => setMenuOpen(false)} className="text-slate-500 hover:text-slate-900 transition-colors">Early Access</a>
            </>
          )}
          {isLoggedIn ? (
            <>
              <Link to="/settings" onClick={() => setMenuOpen(false)} className="text-slate-500 hover:text-slate-900 transition-colors px-1">Settings</Link>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="rounded-xl bg-slate-900 text-white px-4 py-3 text-center font-bold shadow-xl shadow-slate-900/10">
                Go to Dashboard →
              </Link>
            </>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)} className="rounded-xl bg-slate-900 text-white px-4 py-3 text-center font-bold shadow-xl shadow-slate-900/10">
              Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
