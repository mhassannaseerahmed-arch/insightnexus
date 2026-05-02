import React from 'react';

const Features = () => {
  return (
    <div id="how-it-works" className="bg-[#0b0f19] text-white py-24 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-900/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-sm font-semibold text-violet-400 tracking-wide uppercase mb-3">
            Why AI Nexus Insight
          </h2>
          <h3 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-6">
            Everything you need to <br className="hidden sm:block" />
            <span className="text-slate-400">eliminate empty chairs.</span>
          </h3>
        </div>

        {/* Bento Box Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
          
          {/* Box 1: Large Feature */}
          <div className="md:col-span-2 rounded-3xl bg-white/5 border border-white/10 p-8 flex flex-col justify-between overflow-hidden group hover:border-violet-500/50 transition-colors">
            <div className="max-w-md relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-violet-500/20 flex items-center justify-center mb-6 border border-violet-500/30">
                <svg className="w-6 h-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h4 className="text-2xl font-bold text-white mb-2">Automated SMS Reminders</h4>
              <p className="text-slate-400">Patients get reminded automatically via Twilio. Stop spending your evenings sending manual WhatsApp messages to unconfirmed patients.</p>
            </div>
            {/* Decorative background element */}
            <div className="absolute right-0 bottom-0 opacity-20 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none translate-x-1/4 translate-y-1/4">
               <svg width="300" height="300" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#8b5cf6" strokeWidth="1" strokeDasharray="4 4"/>
                  <path d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z" stroke="#8b5cf6" strokeWidth="1" strokeDasharray="4 4"/>
               </svg>
            </div>
          </div>

          {/* Box 2: Tall Feature */}
          <div className="md:col-span-1 md:row-span-2 rounded-3xl bg-white/5 border border-white/10 p-8 flex flex-col hover:border-indigo-500/50 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center mb-6 border border-indigo-500/30">
              <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h4 className="text-xl font-bold text-white mb-2">AI No-Show Spotter</h4>
            <p className="text-slate-400 flex-grow">Our AI engine analyzes your history and highlights which patients are most likely to cancel, allowing you to doublebook or follow up proactively.</p>
            
            <div className="mt-8 p-4 rounded-xl bg-indigo-950/50 border border-indigo-500/20">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-indigo-300">High Risk Detected</span>
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-rose-500 to-rose-400 w-[85%]"></div>
              </div>
              <div className="text-[10px] text-slate-500 mt-2">85% probability of no-show</div>
            </div>
          </div>

          {/* Box 3: Square Feature */}
          <div className="md:col-span-1 rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-600 p-8 flex flex-col justify-end relative overflow-hidden group">
            <div className="absolute top-8 right-8 w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h4 className="text-xl font-bold text-white mb-2 z-10">Live Dashboard</h4>
            <p className="text-indigo-100 z-10 text-sm">See exactly who confirmed and who is pending in real-time.</p>
          </div>

          {/* Box 4: Square Feature */}
          <div className="md:col-span-1 rounded-3xl bg-white/5 border border-white/10 p-8 flex flex-col justify-center hover:border-emerald-500/50 transition-colors">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h4 className="text-lg font-bold text-white mb-1">Seamless Setup</h4>
            <p className="text-slate-400 text-sm">No tech skills required. Built specifically for solo practitioners.</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Features;

