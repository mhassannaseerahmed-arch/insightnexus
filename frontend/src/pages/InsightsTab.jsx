import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API = `${BASE_URL}/api/insights`;

const StatCard = ({ label, value, sub, color, icon }) => (
  <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm">
    <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl text-lg mb-3 bg-gradient-to-br ${color}`}>
      {icon}
    </div>
    <p className="text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">{label}</p>
    {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 shadow-lg text-sm">
        <p className="font-semibold text-slate-700 dark:text-slate-200 mb-1">{label}</p>
        {payload.map((p) => (
          <p key={p.name} style={{ color: p.color }}>
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
  const [loading, setLoading] = useState(true);
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

  if (loading) return (
    <div className="flex items-center justify-center py-32 text-slate-400">
      <svg className="w-5 h-5 animate-spin mr-2" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
      </svg>
      Analysing your data…
    </div>
  );

  if (error) return (
    <div className="m-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 text-sm border border-rose-200 dark:border-rose-800">
      {error}
    </div>
  );

  if (!data) return (
    <div className="text-center py-32 text-slate-400">
      <p className="text-4xl mb-3">📊</p>
      <p className="font-medium text-slate-500">No data yet</p>
      <p className="text-sm mt-1">Add some appointments and come back for insights.</p>
    </div>
  );

  const { overview, byDay, byTime, weekComparison, riskiestDay } = data;

  const noShowTrend = weekComparison.thisWeek.noShows - weekComparison.lastWeek.noShows;
  const trendLabel  = noShowTrend > 0
    ? `↑ ${noShowTrend} more no-shows than last week`
    : noShowTrend < 0
    ? `↓ ${Math.abs(noShowTrend)} fewer no-shows than last week`
    : 'Same as last week';
  const trendColor = noShowTrend > 0 ? 'text-rose-500' : noShowTrend < 0 ? 'text-emerald-500' : 'text-slate-400';

  const dayColors = byDay.map(d => d.rate > 50 ? '#f43f5e' : d.rate > 25 ? '#f59e0b' : '#8b5cf6');

  return (
    <div className="space-y-6">

      {/* AI Alert Banner */}
      {riskiestDay && riskiestDay.total > 0 && (
        <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl px-5 py-4">
          <span className="text-xl">🤖</span>
          <div>
            <p className="font-semibold text-amber-800 dark:text-amber-300 text-sm">AI Pattern Detected</p>
            <p className="text-amber-700 dark:text-amber-400 text-sm mt-0.5">
              <span className="font-bold">{riskiestDay.day}</span> has your highest no-show rate at{' '}
              <span className="font-bold">{riskiestDay.rate}%</span> ({riskiestDay.noShows} out of {riskiestDay.total} appointments).
              Consider sending reminders earlier on this day.
            </p>
          </div>
        </div>
      )}

      {/* Overview stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="No-Show Rate"       value={`${overview.noShowRate}%`}  icon="🚫" color="from-rose-500 to-pink-500"      sub={`${overview.noShows} of ${overview.total} appointments`} />
        <StatCard label="Confirmed"           value={overview.confirmed}          icon="✅" color="from-emerald-500 to-teal-500"   sub="patients confirmed" />
        <StatCard label="Reminders Sent"      value={overview.reminded}           icon="📱" color="from-violet-500 to-indigo-500"  sub={`${overview.total > 0 ? Math.round((overview.reminded/overview.total)*100) : 0}% of appointments`} />
        <StatCard label="This Week No-Shows"  value={weekComparison.thisWeek.noShows} icon="📅" color="from-amber-500 to-orange-500" sub={<span className={trendColor}>{trendLabel}</span>} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* No-shows by day */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-5">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-1">No-Shows by Day of Week</h3>
          <p className="text-xs text-slate-400 mb-4">Which days have the most missed appointments</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={byDay} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="noShows" name="No-Shows" radius={[6, 6, 0, 0]}>
                {byDay.map((_, i) => <Cell key={i} fill={dayColors[i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* No-show rate by time */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-5">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-1">No-Show Rate by Time of Day</h3>
          <p className="text-xs text-slate-400 mb-4">Morning, afternoon, and evening patterns</p>
          <div className="space-y-4 mt-2">
            {byTime.map((slot) => (
              <div key={slot.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{slot.label}</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{slot.rate}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      slot.rate > 50 ? 'bg-rose-500' : slot.rate > 25 ? 'bg-amber-500' : 'bg-violet-500'
                    }`}
                    style={{ width: `${slot.rate || 0}%` }}
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1">{slot.noShows} no-shows from {slot.total} appointments</p>
              </div>
            ))}
            {byTime.every(s => s.total === 0) && (
              <p className="text-sm text-slate-400 text-center py-4">Not enough data yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Week comparison */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-5">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Week Over Week</h3>
        <p className="text-xs text-slate-400 mb-5">Comparing this week vs last week</p>
        <div className="grid grid-cols-2 gap-6">
          {[
            { label: 'This Week',  data: weekComparison.thisWeek,  highlight: true  },
            { label: 'Last Week',  data: weekComparison.lastWeek,  highlight: false },
          ].map(({ label, data: w, highlight }) => (
            <div key={label} className={`rounded-xl p-4 ${highlight ? 'bg-violet-50 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-800' : 'bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700'}`}>
              <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${highlight ? 'text-violet-600 dark:text-violet-400' : 'text-slate-400'}`}>{label}</p>
              <div className="flex items-end gap-6">
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{w.appointments}</p>
                  <p className="text-xs text-slate-500">appointments</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-rose-500">{w.noShows}</p>
                  <p className="text-xs text-slate-500">no-shows</p>
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
