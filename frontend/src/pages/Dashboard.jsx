import React, { useState, useEffect } from 'react';
import AddAppointmentModal from './AddAppointmentModal';
import InsightsTab from './InsightsTab';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API = `${BASE_URL}/api/appointments`;

const statusConfig = {
  pending:   { label: 'Pending',   classes: 'bg-amber-50  text-amber-700  ring-amber-200  dark:bg-amber-900/20 dark:text-amber-400  dark:ring-amber-800'  },
  confirmed: { label: 'Confirmed', classes: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:ring-emerald-800' },
  cancelled: { label: 'Cancelled', classes: 'bg-slate-100  text-slate-500  ring-slate-200  dark:bg-slate-800     dark:text-slate-400   dark:ring-slate-700'  },
  completed: { label: 'Completed', classes: 'bg-blue-50    text-blue-700   ring-blue-200   dark:bg-blue-900/20   dark:text-blue-400    dark:ring-blue-800'   },
  'no-show': { label: 'No-Show',   classes: 'bg-rose-50    text-rose-700   ring-rose-200   dark:bg-rose-900/20   dark:text-rose-400    dark:ring-rose-800'   },
};

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]  = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [reminding, setReminding] = useState({});
  const [activeTab, setActiveTab] = useState('appointments'); // 'appointments' | 'insights'

  const fetchAppointments = async (isInitial = false) => {
    try {
      if (isInitial) setLoading(true);
      const token = localStorage.getItem('token');
      const res  = await fetch(`${API}/all`, {
        headers: { 'x-auth-token': token }
      });
      const data = await res.json();
      setAppointments(data.data || []);
    } catch {
      setError('Could not connect to the server. Is the backend running?');
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  useEffect(() => { 
    fetchAppointments(true); 
    // Polling for live updates during demos (silent)
    const interval = setInterval(() => fetchAppointments(false), 5000);
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (id, status) => {
    const token = localStorage.getItem('token');
    await fetch(`${API}/${id}/status`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'x-auth-token': token
      },
      body: JSON.stringify({ status }),
    });
    fetchAppointments();
  };

  const deleteAppointment = async (id) => {
    if (!confirm('Delete this appointment?')) return;
    const token = localStorage.getItem('token');
    await fetch(`${API}/${id}`, { 
      method: 'DELETE',
      headers: { 'x-auth-token': token }
    });
    fetchAppointments();
  };

  const sendReminder = async (id) => {
    setReminding((prev) => ({ ...prev, [id]: true }));
    try {
      const token = localStorage.getItem('token');
      const res  = await fetch(`${API}/${id}/remind`, { 
        method: 'POST',
        headers: { 'x-auth-token': token }
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      fetchAppointments();
    } catch (err) {
      alert(`Failed to send reminder: ${err.message}`);
    } finally {
      setReminding((prev) => ({ ...prev, [id]: false }));
    }
  };

  // Stats
  const today       = new Date().toDateString();
  const todayAppts  = appointments.filter(a => new Date(a.appointmentDate).toDateString() === today);
  const confirmed   = appointments.filter(a => a.status === 'confirmed').length;
  const pending     = appointments.filter(a => a.status === 'pending').length;
  const noShows     = appointments.filter(a => a.status === 'no-show').length;

  const revenueRecovered = confirmed * 200;
  const revenueLeak      = noShows * 200;

  const stats = [
    { label: "Today's Appointments", value: todayAppts.length, icon: '📅' },
    { label: 'Revenue Recovered',    value: `$${revenueRecovered.toLocaleString()}`, icon: '💰', highlight: true },
    { label: 'Monthly Leak',         value: `$${revenueLeak.toLocaleString()}`, icon: '📉' },
    { label: 'Awaiting Response',    value: pending,            icon: '⏳' },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 pt-16">
      {/* Clean Professional Header */}
      <div className="bg-white border-b border-slate-200 py-10 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Clinic <span className="text-violet-600">Dashboard</span>
            </h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-white font-bold text-sm shadow-sm hover:bg-slate-800 transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            New Appointment
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">

        {/* Public Booking Link Card (Simplified) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-violet-50 text-violet-600 rounded-xl flex items-center justify-center text-xl border border-violet-100">
              🔗
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Public Booking Link</h3>
              <p className="text-slate-500 text-xs font-medium">Share this link to accept online appointments.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-100 w-full md:w-auto">
            <code className="px-3 py-1 font-medium text-xs text-slate-600 select-all">
              {window.location.origin}/book/{JSON.parse(localStorage.getItem('clinic') || '{}').slug || 'clinic'}
            </code>
            <button 
              onClick={() => {
                const url = `${window.location.origin}/book/${JSON.parse(localStorage.getItem('clinic') || '{}').slug || 'clinic'}`;
                navigator.clipboard.writeText(url);
                alert('Copied!');
              }}
              className="px-4 py-2 bg-white text-slate-900 border border-slate-200 rounded-lg text-xs font-bold hover:bg-slate-50 transition-all shadow-sm"
            >
              Copy
            </button>
          </div>
        </div>

        {/* Stats (Minimalist) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => (
            <div 
              key={s.label} 
              className={`bg-white rounded-2xl p-6 border transition-all ${
                s.highlight 
                  ? 'border-emerald-200 shadow-lg shadow-emerald-500/5 ring-4 ring-emerald-500/5' 
                  : 'border-slate-200 shadow-sm'
              }`}
            >
              <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${s.highlight ? 'text-emerald-600' : 'text-slate-400'}`}>
                {s.label}
              </p>
              <div className="flex items-baseline gap-2">
                <span className={`text-3xl font-black tracking-tight ${s.highlight ? 'text-emerald-600' : 'text-slate-900'}`}>
                  {s.value}
                </span>
                <span className="text-xl">{s.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Tab switcher (Refined) */}
        <div className="flex gap-1 bg-slate-200/50 p-1 rounded-xl mb-8 w-fit border border-slate-200/50">
          {[
            { id: 'appointments', label: 'Appointments' },
            { id: 'insights',     label: 'AI Insights'  },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'insights' ? (
          <InsightsTab />
        ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Upcoming Appointments</h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live</span>
            </div>
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center py-32 text-slate-500">
              <svg className="w-8 h-8 animate-spin mb-4 text-violet-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span className="text-lg font-medium">Loading appointments…</span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-3 m-8 p-5 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 text-base font-medium border border-rose-200 dark:border-rose-800">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          {!loading && !error && appointments.length === 0 && (
            <div className="text-center py-32">
              <p className="text-5xl mb-4">📋</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white mb-2">No appointments yet</p>
              <p className="text-base text-slate-500 dark:text-slate-400">Click "New Appointment" to add your first one.</p>
            </div>
          )}

          {!loading && !error && appointments.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Patient</th>
                    <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Phone</th>
                    <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Date & Time</th>
                    <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Reminder</th>
                    <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {appointments.map((appt) => {
                    const cfg = statusConfig[appt.status] || statusConfig.pending;
                    return (
                      <tr key={appt._id} className="hover:bg-violet-50/30 transition-all duration-300 group">
                        <td className="px-8 py-6">
                          <div className="text-base font-black text-slate-900 group-hover:text-violet-600 transition-colors">{appt.patientName}</div>
                          <div className="text-xs text-slate-400 mt-1 font-medium">{appt.reason || 'Routine Checkup'}</div>
                        </td>
                        <td className="px-8 py-6 text-sm font-bold text-slate-600 tracking-tight">{appt.patientPhone}</td>
                        <td className="px-8 py-6">
                          <div className="text-sm font-black text-slate-900">
                            {new Date(appt.appointmentDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </div>
                          <div className="text-xs font-bold text-violet-500 mt-1 uppercase tracking-wider">{appt.appointmentTime}</div>
                        </td>
                        <td className="px-8 py-6">
                          <span className={`inline-flex items-center rounded-xl px-3 py-1.5 text-[10px] font-black uppercase tracking-widest border ${cfg.classes}`}>
                            {cfg.label}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          {appt.reminderSent ? (
                            <span className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                              SENT
                            </span>
                          ) : (
                            <button
                              onClick={() => sendReminder(appt._id)}
                              disabled={reminding[appt._id]}
                              className="text-[10px] font-black uppercase tracking-widest rounded-xl px-4 py-2 bg-violet-600 text-white shadow-lg shadow-violet-600/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                            >
                              {reminding[appt._id] ? '...' : 'Send SMS'}
                            </button>
                          )}
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {appt.status === 'pending' && (
                              <button onClick={() => updateStatus(appt._id, 'confirmed')} className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                              </button>
                            )}
                            <button onClick={() => deleteAppointment(appt._id)} className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:bg-rose-600 hover:text-white transition-all shadow-sm">
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
        )}
      </div>

      {showModal && (
        <AddAppointmentModal
          onClose={() => setShowModal(false)}
          onSuccess={() => { setShowModal(false); fetchAppointments(); }}
        />
      )}
    </div>
  );
};

export default Dashboard;
