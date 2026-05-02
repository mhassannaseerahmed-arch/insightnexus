import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-[#0b0f19] pt-32 pb-20 sm:pt-40 sm:pb-24">
      {/* Animated Mesh Gradient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-violet-600/20 blur-[120px] mix-blend-screen animate-blob"></div>
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[60%] rounded-full bg-indigo-500/20 blur-[120px] mix-blend-screen animate-blob" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[50%] rounded-full bg-fuchsia-500/20 blur-[120px] mix-blend-screen animate-blob" style={{ animationDelay: '4s' }}></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center z-10">

        {/* Premium Badge */}
        <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium text-violet-300 bg-violet-900/40 border border-violet-500/30 backdrop-blur-md mb-8 shadow-[0_0_15px_rgba(139,92,246,0.3)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
          </span>
          Currently onboarding 5 Beta Clinics
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
          Stop losing money to <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-400 to-fuchsia-400">
            silent no-shows.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
          An AI-powered clinic management platform that automatically reminds patients, tracks confirmations, and flags high-risk appointments before they happen.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-20">
          <a
            href="#waitlist"
            className="group relative inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-sm font-bold text-slate-900 transition-all hover:scale-105 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-slate-900 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
          >
            <span className="absolute inset-0 rounded-full bg-white/20 blur-md transition-opacity group-hover:opacity-100 opacity-0"></span>
            Join the Waitlist
            <svg className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center rounded-full bg-slate-800/50 px-8 py-4 text-sm font-semibold text-white border border-slate-700/50 backdrop-blur-md transition-all hover:bg-slate-800 hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500"
          >
            View Live Demo
          </Link>
        </div>

        {/* Dashboard Mockup (Glassmorphism) */}
        <div className="relative mx-auto max-w-4xl group">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-transparent to-transparent z-20 h-full w-full rounded-t-2xl pointer-events-none"></div>
          
          <div className="relative rounded-2xl sm:rounded-t-[2rem] border border-white/10 bg-[#0f1523]/80 backdrop-blur-2xl shadow-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-10px_rgba(139,92,246,0.2)] hover:border-white/20">
            {/* Mockup Header */}
            <div className="flex items-center px-4 py-3 border-b border-white/5 bg-white/5">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
              </div>
              <div className="mx-auto text-xs text-slate-400 font-medium font-mono">insightnexus.app/dashboard</div>
            </div>
            
            {/* Mockup Body */}
            <div className="p-6 text-left grid grid-cols-1 sm:grid-cols-3 gap-6 bg-[#0b0f19]/40">
              {/* Left Column */}
              <div className="col-span-1 space-y-4">
                <div className="rounded-2xl bg-white/5 border border-white/5 p-5 shadow-sm transition-colors hover:bg-white/10">
                  <div className="text-xs text-slate-400 mb-2 font-medium">Revenue at Risk Today</div>
                  <div className="text-3xl font-bold text-white tracking-tight">$450</div>
                  <div className="text-xs text-rose-400 mt-2 flex items-center gap-1 font-medium bg-rose-500/10 w-fit px-2 py-1 rounded-md">
                    ↑ 2 high-risk patients
                  </div>
                </div>
                
                <div className="rounded-2xl bg-white/5 border border-white/5 p-5 shadow-sm">
                  <div className="h-3 w-1/2 bg-white/10 rounded-full mb-5"></div>
                  <div className="space-y-3">
                    <div className="h-2 w-full bg-white/5 rounded-full"></div>
                    <div className="h-2 w-3/4 bg-white/5 rounded-full"></div>
                    <div className="h-2 w-4/5 bg-white/5 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Right Column: Upcoming Appointments */}
              <div className="col-span-1 sm:col-span-2 rounded-2xl bg-white/5 border border-white/5 p-6 shadow-sm flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <div className="text-base font-semibold text-white tracking-wide">Upcoming Appointments</div>
                  <div className="text-xs px-2.5 py-1.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Live Sync
                  </div>
                </div>
                
                <div className="space-y-3 flex-grow">
                  {[
                    { name: 'Sarah J.', time: '09:00 AM', status: 'Confirmed', color: 'emerald' },
                    { name: 'Michael T.', time: '10:30 AM', status: 'Pending', color: 'amber' },
                    { name: 'Emma W.', time: '11:15 AM', status: 'High Risk', color: 'rose' }
                  ].map((appt, i) => (
                    <div key={i} className="group/item flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-transparent hover:bg-white/10 hover:border-white/10 transition-all cursor-default">
                      <div className="flex items-center gap-3.5">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-sm font-semibold text-white shadow-inner">
                          {appt.name[0]}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-200">{appt.name}</div>
                          <div className="text-xs text-slate-500">{appt.time}</div>
                        </div>
                      </div>
                      <div className={`text-xs px-2.5 py-1 rounded-md font-medium border border-${appt.color}-500/20 bg-${appt.color}-500/10 text-${appt.color}-400 group-hover/item:border-${appt.color}-500/40 transition-colors`}>
                        {appt.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;

