import React from 'react';

const Roadmap = () => {
  const ICON_SET = '/assets/roadmap.png';

  const steps = [
    {
      title: "PHASE 1: Day 1-2",
      headline: "ZERO-FRICTION SETUP",
      desc: "Sync your existing schedule in under 15 minutes. No complex IT integration or technical degree required.",
      color: "bg-slate-50",
      accent: "text-slate-900"
    },
    {
      title: "PHASE 2: Day 3-5",
      headline: "AI CALIBRATION",
      desc: "Our engine identifies your 'Risk Zones'—the specific times and days where you lose the most money.",
      color: "bg-violet-50",
      accent: "text-violet-600"
    },
    {
      title: "PHASE 3: Day 7+",
      headline: "REVENUE RESTORED",
      desc: "Recover your first $200+ slot automatically. View live ROI reports directly on your clinic dashboard.",
      color: "bg-emerald-50",
      accent: "text-emerald-600"
    }
  ];

  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-sm font-black uppercase tracking-widest text-violet-600 mb-4">Implementation</h2>
          <h3 className="text-4xl font-black text-slate-900 tracking-tight">The 7-Day Revenue Recovery Roadmap</h3>
        </div>

        {/* Minimalist Step Flow (Replaces Image) */}
        <div className="relative mb-24 max-w-4xl mx-auto">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 hidden md:block"></div>
          <div className="relative flex flex-col md:flex-row justify-between gap-12 md:gap-0">
            {[1, 2, 3].map((num) => (
              <div key={num} className="relative z-10 flex flex-col items-center">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-xl transition-all ${
                  num === 1 ? 'bg-slate-900 text-white' : 
                  num === 2 ? 'bg-violet-600 text-white' : 
                  'bg-emerald-500 text-white'
                }`}>
                  0{num}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div key={i} className={`${step.color} rounded-3xl p-8 border border-slate-100 transition-transform hover:-translate-y-2`}>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{step.title}</p>
              <h4 className={`text-xl font-black mb-4 ${step.accent}`}>{step.headline}</h4>
              <p className="text-slate-600 text-sm leading-relaxed font-medium">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Roadmap;
