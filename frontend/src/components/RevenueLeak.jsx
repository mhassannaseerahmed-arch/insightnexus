import React, { useState, useEffect } from 'react';

const RevenueLeak = ({ onDataChange }) => {
  const [appts, setAppts] = useState(20);
  const [rate, setRate] = useState(20);
  const [avgRevenue, setAvgRevenue] = useState(200);
  const [fillRate, setFillRate] = useState(30);
  const [recoveries, setRecoveries] = useState([]);
  const LEAK_IMG = '/assets/revenue_leak.png';
  const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const updateAppts = (val) => {
    setAppts(val);
    onDataChange({ appts: val, rate, avgRevenue, fillRate });
  };

  const updateRate = (val) => {
    setRate(val);
    onDataChange({ appts, rate: val, avgRevenue, fillRate });
  };

  const updateAvgRevenue = (val) => {
    setAvgRevenue(val);
    onDataChange({ appts, rate, avgRevenue: val, fillRate });
  };

  const updateFillRate = (val) => {
    setFillRate(val);
    onDataChange({ appts, rate, avgRevenue, fillRate: val });
  };

  useEffect(() => {
    const fetchProof = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/public/recovery-proof`);
        const json = await res.json();
        if (json.success) {
          setRecoveries(json.data);
        }
      } catch (err) {
        console.error('Failed to fetch proof:', err);
      }
    };
    fetchProof();
  }, []);

  const workingDaysPerMonth = 22;
  const avgWastedMinutesPerNoShow = 15;
  const monthlyNoShows = appts * workingDaysPerMonth * (rate / 100);
  const monthlyUnfilledNoShows = monthlyNoShows * (1 - fillRate / 100);

  const monthlyLoss = Math.round(monthlyUnfilledNoShows * avgRevenue);
  const annualLoss  = monthlyLoss * 12;
  const hoursWasted = Math.round(monthlyUnfilledNoShows * (avgWastedMinutesPerNoShow / 60));

  return (
    <section id="revenue-leak" className="bg-slate-900 py-24 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div>
            <h2 className="text-sm font-black uppercase tracking-widest text-violet-400 mb-4">Revenue Impact</h2>
            <h3 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-8 leading-tight">
              Calculate your <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400">Revenue Leak.</span>
            </h3>
            
            <div className="space-y-8 bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="flex justify-between mb-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg. Daily Appts</label>
                    <span className="text-white font-black">{appts}</span>
                  </div>
                  <input 
                    type="range" min="5" max="100" value={appts} 
                    onChange={(e) => updateAppts(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-violet-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No-Show Rate</label>
                    <span className="text-rose-400 font-black">{rate}%</span>
                  </div>
                  <input 
                    type="range" min="5" max="50" value={rate} 
                    onChange={(e) => updateRate(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="flex justify-between mb-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg. Revenue / Appt</label>
                    <span className="text-white font-black">${avgRevenue}</span>
                  </div>
                  <input
                    type="range" min="50" max="1000" step="10" value={avgRevenue}
                    onChange={(e) => updateAvgRevenue(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fill Rate</label>
                    <span className="text-emerald-400 font-black">{fillRate}%</span>
                  </div>
                  <input
                    type="range" min="0" max="90" value={fillRate}
                    onChange={(e) => updateFillRate(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-8 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Monthly Loss</p>
                  <p className="text-4xl font-black text-white tracking-tighter">
                    ${monthlyLoss.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-rose-400 text-[10px] font-black uppercase tracking-widest mb-2">Annual Impact</p>
                  <p className="text-4xl font-black text-rose-500 tracking-tighter">
                    ${annualLoss.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="bg-violet-600/10 border border-violet-500/20 p-4 rounded-2xl flex items-center gap-4">
                <div className="w-10 h-10 bg-violet-600 text-white rounded-xl flex items-center justify-center text-lg shadow-lg">⌛</div>
                <div>
                  <p className="text-white text-sm font-black tracking-tight">{hoursWasted} Hours Wasted</p>
                  <p className="text-violet-300 text-[10px] font-bold uppercase tracking-widest">Administrative drain per month</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-10 bg-violet-600/10 blur-3xl rounded-full"></div>
            
            {/* Premium Analysis Hub */}
            <div className="relative z-10 bg-[#0f1523]/80 backdrop-blur-2xl border border-white/10 rounded-[40px] p-8 shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Recovery Engine</span>
                </div>
                <div className="text-[10px] font-mono text-violet-400 bg-violet-400/10 px-2 py-1 rounded">V2.4_STABLE</div>
              </div>

              {/* Sophisticated Data Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
                  <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Efficiency Score</p>
                  <p className="text-2xl font-black text-white">{100 - rate}%</p>
                  <div className="w-full h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${100 - rate}%` }}></div>
                  </div>
                </div>
                <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
                  <p className="text-[9px] font-black text-slate-500 uppercase mb-1">At-Risk Patients</p>
                  <p className="text-2xl font-black text-rose-500">{Math.round(appts * (rate/100))}</p>
                  <p className="text-[8px] text-rose-400/60 font-bold mt-1 uppercase tracking-tighter">Requires AI Intervention</p>
                </div>
              </div>

              {/* Recovery Stream - The "Expensive" Looking Part */}
              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Live Recovery Stream</p>
                
                {recoveries.length > 0 ? recoveries.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 group hover:bg-white/5 transition-all">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full bg-violet-500/10 flex items-center justify-center text-[10px] font-black text-violet-400 border border-violet-500/20`}>
                        {item.name[0]}
                      </div>
                      <div>
                        <p className="text-xs font-black text-white">{item.name}</p>
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">{item.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs font-black text-emerald-400`}>{item.value}</p>
                      <p className="text-[8px] font-black text-slate-600 uppercase">{item.status}</p>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8">
                    <p className="text-slate-500 text-[10px] font-black uppercase">Scanning for recoveries...</p>
                  </div>
                )}
              </div>

              {/* Scanning Decoration */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-violet-500/50 to-transparent animate-scan"></div>
            </div>

            {/* Floaties for Depth */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-indigo-500/10 blur-2xl rounded-full animate-pulse"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-rose-500/10 blur-2xl rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>


        </div>
      </div>
    </section>
  );
};

export default RevenueLeak;

