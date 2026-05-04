import React from 'react';

const Features = () => {
  return (
    <div id="how-it-works" className="bg-white text-slate-900 py-32 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-sm font-black text-violet-600 tracking-widest uppercase mb-4">
            The Engine
          </h2>
          <h3 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 mb-6">
            Everything you need to <br className="hidden sm:block" />
            <span className="text-slate-400">eliminate empty chairs.</span>
          </h3>
        </div>

        {/* Bento Box Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 auto-rows-[280px]">
          
          {/* Box 1: Large Feature */}
          <div className="md:col-span-2 rounded-3xl bg-slate-50 border border-slate-100 p-10 flex flex-col justify-between overflow-hidden group hover:border-violet-200 transition-all shadow-sm">
            <div className="max-w-md relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mb-8 border border-slate-100 shadow-sm">
                <svg className="w-7 h-7 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h4 className="text-2xl font-black text-slate-900 mb-3">Automated SMS Flows</h4>
              <p className="text-slate-500 font-medium leading-relaxed">Patients get reminded automatically via Twilio. Stop spending your evenings sending manual WhatsApp messages to unconfirmed patients.</p>
            </div>
          </div>

          {/* Box 2: Tall Feature */}
          <div className="md:col-span-1 md:row-span-2 rounded-3xl bg-slate-900 p-10 flex flex-col hover:scale-[1.02] transition-all shadow-2xl shadow-slate-900/20">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-8 border border-white/10">
              <svg className="w-7 h-7 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h4 className="text-2xl font-black text-white mb-4">AI No-Show Spotter</h4>
            <p className="text-slate-400 font-medium flex-grow leading-relaxed">Our AI analyzes your history and highlights which patients are most likely to cancel, allowing you to proactively fill slots.</p>
            
            <div className="mt-10 p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">Risk Pattern</span>
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-rose-500 to-rose-400 w-[85%]"></div>
              </div>
              <div className="text-[10px] font-bold text-slate-500 mt-3 uppercase tracking-widest">85% probability of no-show</div>
            </div>
          </div>

          {/* Box 3: Square Feature */}
          <div className="md:col-span-1 rounded-3xl bg-violet-600 p-10 flex flex-col justify-end relative overflow-hidden group shadow-xl shadow-violet-600/20">
            <div className="absolute top-10 right-10 w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h4 className="text-2xl font-black text-white mb-2 z-10">Live Feed</h4>
            <p className="text-violet-100 z-10 text-sm font-bold uppercase tracking-tight">Real-time confirmation tracking.</p>
          </div>

          {/* Box 4: Square Feature */}
          <div className="md:col-span-1 rounded-3xl bg-slate-50 border border-slate-100 p-10 flex flex-col justify-center hover:border-emerald-200 transition-all shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 border border-emerald-100">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h4 className="text-xl font-black text-slate-900 mb-2">Setup in 15m</h4>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">No complex IT required. Built for practitioners, not tech teams.</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Features;
