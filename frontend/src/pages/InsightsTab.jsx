import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API = `${BASE_URL}/api/insights`;

const StatCard = ({ label, value, sub, color, icon }) => (
  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
    <div className={`text-xl mb-4`}>
      {icon}
    </div>
    <p className="text-3xl font-bold text-slate-900">{value}</p>
    <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mt-1">{label}</p>
    {sub && <p className="text-xs text-slate-400 mt-1 font-medium">{sub}</p>}
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-xl text-sm">
        <p className="font-bold text-slate-900 mb-1">{label}</p>
        {payload.map((p) => (
          <p key={p.name} className="font-medium" style={{ color: p.color }}>
            {p.name}: <span className="font-bold">{p.value}{p.name === 'No-Show Rate' ? '%' : ''}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const InsightsTab = () => {
  const [data, setData]     = useState(null);
  const [insightsLoading, setInsightsLoading] = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const token = localStorage.getItem('token');
        const res  = await fetch(API, {
          headers: { 'x-auth-token': token }
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.message);
        setData(json.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, []);

  if (insightsLoading) return (
    <div className="flex flex-col items-center justify-center py-32 text-slate-400">
      <svg className="w-8 h-8 animate-spin mb-4 text-violet-600" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
      </svg>
      <span className="text-lg font-medium">Analyzing your data…</span>
    </div>
  );

  if (error) return (
    <div className="p-5 rounded-2xl bg-rose-50 text-rose-700 text-sm font-bold border border-rose-100">
      {error}
    </div>
  );

  if (!data) return (
    <div className="text-center py-32">
      <p className="text-5xl mb-4">📊</p>
      <p className="text-xl font-bold text-slate-900 mb-2">No data yet</p>
      <p className="text-slate-500">Add some appointments and come back for insights.</p>
    </div>
  );

  const { overview, byDay, byTime, weekComparison, riskiestDay } = data;

  const noShowTrend = weekComparison.thisWeek.noShows - weekComparison.lastWeek.noShows;
  const trendLabel  = noShowTrend > 0
    ? `+${noShowTrend} vs last week`
    : noShowTrend < 0
    ? `-${Math.abs(noShowTrend)} vs last week`
    : 'Same as last week';
  const trendColor = noShowTrend > 0 ? 'text-rose-500' : noShowTrend < 0 ? 'text-emerald-500' : 'text-slate-400';

  const dayColors = byDay.map(d => d.rate > 50 ? '#f43f5e' : d.rate > 25 ? '#f59e0b' : '#6366f1');

  return (
    <div className="space-y-6">

      {/* AI Alert Banner */}
      {riskiestDay && riskiestDay.total > 0 && (
        <div className="flex items-start gap-4 bg-violet-50 border border-violet-100 rounded-2xl px-6 py-5">
          <span className="text-2xl">🤖</span>
          <div>
            <p className="font-bold text-violet-900 text-sm tracking-tight uppercase">AI Pattern Detected</p>
            <p className="text-violet-700 text-sm mt-1 font-medium leading-relaxed">
              <span className="font-black underline decoration-violet-300">{riskiestDay.day}</span> has your highest no-show rate at{' '}
              <span className="font-black">{riskiestDay.rate}%</span>.
              Our engine recommends sending reminders **2 hours earlier** on this day.
            </p>
          </div>
        </div>
      )}

      {/* Overview stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="No-Show Rate"       value={`${overview.noShowRate}%`}  icon="🚫" sub={`${overview.noShows} missed`} />
        <StatCard label="Revenue Lost"       value={`$${overview.noShows * 200}`} icon="💸" sub="Est. @$200/appt" />
        <StatCard label="Confirmed"           value={overview.confirmed}          icon="✅" sub="Patients confirmed" />
        <StatCard label="Automation"          value={`${overview.total > 0 ? Math.round((overview.reminded/overview.total)*100) : 0}%`} icon="📱" sub="Reminder Coverage" />
        <StatCard label="This Week"           value={weekComparison.thisWeek.noShows} icon="📅" sub={<span className={`font-bold ${trendColor}`}>{trendLabel}</span>} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* No-shows by day */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-slate-900">Weekly Patterns</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Total Missed Appointments</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={byDay} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f8fafc" vertical={false} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} />
              <Tooltip cursor={{fill: '#f1f5f9'}} content={<CustomTooltip />} />
              <Bar dataKey="noShows" name="No-Shows" radius={[4, 4, 0, 0]}>
                {byDay.map((_, i) => <Cell key={i} fill={dayColors[i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* No-show rate by time */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-slate-900">Time-of-Day Risk</h3>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1 mb-6">Morning vs Evening Patterns</p>
          <div className="space-y-6">
            {byTime.map((slot) => (
              <div key={slot.label}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-slate-600">{slot.label}</span>
                  <span className="text-sm font-black text-slate-900">{slot.rate}%</span>
                </div>
                <div className="w-full bg-slate-50 rounded-full h-2 border border-slate-100">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      slot.rate > 50 ? 'bg-rose-500' : slot.rate > 25 ? 'bg-amber-500' : 'bg-violet-500'
                    }`}
                    style={{ width: `${slot.rate || 0}%` }}
                  />
                </div>
              </div>
            ))}
            {byTime.every(s => s.total === 0) && (
              <p className="text-sm text-slate-400 text-center py-4">Not enough data yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Week comparison (Simplified) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-bold text-slate-900 mb-6">Efficiency Benchmarking</h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Current Week', data: weekComparison.thisWeek, highlight: true  },
            { label: 'Previous Week', data: weekComparison.lastWeek, highlight: false },
          ].map(({ label, data: w, highlight }) => (
            <div key={label} className={`rounded-xl p-5 border ${highlight ? 'bg-violet-50/50 border-violet-100' : 'bg-slate-50/50 border-slate-100'}`}>
              <p className={`text-[10px] font-black uppercase tracking-widest mb-4 ${highlight ? 'text-violet-600' : 'text-slate-400'}`}>{label}</p>
              <div className="flex items-center gap-8">
                <div>
                  <p className="text-2xl font-black text-slate-900">{w.appointments}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bookings</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-rose-500">{w.noShows}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Missed</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default InsightsTab;
