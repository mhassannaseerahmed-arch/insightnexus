import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuditModal from './AuditModal';

const Hero = () => {
  const [isAuditOpen, setIsAuditOpen] = useState(false);

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

        {/* Scarcity Badge */}
        <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-black text-amber-200 bg-amber-950/40 border border-amber-500/30 backdrop-blur-md mb-8 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          FOUNDING PARTNER PROGRAM: <span className="text-white">3/5 SLOTS FILLED</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-white mb-6 leading-[1.1]">
          Stop the <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">$150B Revenue Leak</span> in your clinic.
        </h1>

        {/* Subheadline */}
        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
          AI Nexus Insight identifies no-show patterns and automates recovery, helping you <span className="text-white font-bold">restore $2,000+ in weekly revenue</span> with zero effort.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-20">
          <Link
            to="/signup"
            className="group relative inline-flex items-center justify-center rounded-2xl bg-white px-10 py-5 text-sm font-black text-slate-900 transition-all hover:scale-105 hover:bg-slate-50 shadow-2xl"
          >
            Apply for Founding Partnership
          </Link>
          <button
            onClick={() => setIsAuditOpen(true)}
            className="inline-flex items-center justify-center rounded-2xl bg-white/5 px-10 py-5 text-sm font-black text-white border border-white/10 backdrop-blur-md transition-all hover:bg-white/10"
          >
            Request Free Revenue Audit
          </button>
        </div>


        {/* Trust Row */}
        <div className="pt-10 border-t border-white/5 mb-20">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-8">Ready for Modern Practice Management</p>
          <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-16 opacity-30 grayscale hover:opacity-50 transition-opacity">
             <span className="text-white font-black text-xl italic tracking-tighter">CLINIC<span className="text-violet-500">ASSOC</span></span>
             <span className="text-white font-black text-xl italic tracking-tighter">MED<span className="text-indigo-500">FLOW</span></span>
             <span className="text-white font-black text-xl italic tracking-tighter">HEALTH<span className="text-fuchsia-500">CORE</span></span>
             <span className="text-white font-black text-xl italic tracking-tighter">CARE<span className="text-rose-500">SYNC</span></span>
          </div>
        </div>

        {/* Dashboard Mockup (Glassmorphism) */}
        <div className="relative mx-auto max-w-4xl group">
          {/* ... existing mockup content ... */}
        </div>

        <AuditModal isOpen={isAuditOpen} onClose={() => setIsAuditOpen(false)} />
      </div>
    </section>
  );
};

export default Hero;

