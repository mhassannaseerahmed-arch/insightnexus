import React, { useState } from 'react';

const Waitlist = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError(null);
    try {
      const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res  = await fetch(`${BASE_URL}/api/waitlist/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="waitlist" className="py-24 bg-[#0b0f19] relative overflow-hidden border-t border-white/5">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-indigo-600/10 rounded-[100%] blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 mb-6">
          Limited Early Access
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
          Want to stop losing patients to no-shows?
        </h2>

        <p className="text-slate-400 text-base mb-10 leading-relaxed">
          I'm looking for solo clinic owners — dentists, physios, and psychologists — who want to try AI Nexus Insight for free in exchange for honest feedback.
        </p>

        {submitted ? (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-8 py-6 backdrop-blur-md max-w-md mx-auto">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
              <span className="text-2xl">🎉</span>
            </div>
            <p className="text-white font-semibold text-lg">You're on the list!</p>
            <p className="text-emerald-300 text-sm mt-1">I'll reach out to you personally within 48 hours.</p>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto relative group">
              {/* Outer glow on focus/hover */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
              
              <div className="relative flex flex-col sm:flex-row gap-2 w-full bg-[#0f1523] p-1.5 rounded-full border border-white/10">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@clinic.com"
                  disabled={loading}
                  className="flex-grow rounded-full px-5 py-3 text-sm text-white bg-transparent placeholder-slate-500 outline-none focus:ring-0 border-none disabled:opacity-70"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-full px-6 py-3 text-sm font-semibold bg-white text-slate-900 hover:bg-slate-100 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)] whitespace-nowrap disabled:opacity-70"
                >
                  {loading ? 'Joining…' : 'Join Waitlist'}
                </button>
              </div>
            </form>
            {error && (
              <p className="mt-4 text-rose-400 text-sm bg-rose-500/10 py-2 px-4 rounded-full inline-block border border-rose-500/20">{error}</p>
            )}
          </>
        )}

        <div className="mt-8 flex items-center justify-center gap-2 text-slate-500 text-xs">
          <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          No spam. No credit card. Just a conversation.
        </div>
      </div>
    </section>
  );
};

export default Waitlist;
