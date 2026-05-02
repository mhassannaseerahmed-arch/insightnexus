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

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res  = await fetch(`${API}/all`, {
        headers: { 'x-auth-token': token }
      });
      const data = await res.json();
      setAppointments(data.data || []);
    } catch {
      setError('Could not connect to the server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAppointments(); }, []);

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

  const stats = [
    { label: "Today's Appointments", value: todayAppts.length, icon: '📅', color: 'from-violet-500 to-indigo-500' },
    { label: 'Confirmed',            value: confirmed,          icon: '✅', color: 'from-emerald-500 to-teal-500'  },
    { label: 'Awaiting Response',    value: pending,            icon: '⏳', color: 'from-amber-500 to-orange-500'  },
    { label: 'No-Shows (Total)',     value: noShows,            icon: '🚫', color: 'from-rose-500 to-pink-500'     },
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Premium White Header */}
      <div className="relative overflow-hidden bg-white/50 backdrop-blur-md border-b border-slate-100 py-12 mb-10">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 to-indigo-500/5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2">
              Clinic <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">Dashboard</span>
            </h1>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-violet-600 text-white text-[10px] font-black uppercase tracking-widest">
                Analytics Live
              </span>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-tight">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="group relative flex items-center gap-2 rounded-2xl bg-slate-900 px-8 py-4 text-white font-black shadow-2xl shadow-slate-900/20 hover:bg-violet-600 hover:-translate-y-1 transition-all duration-300"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
            </svg>
            New Appointment
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">

        {/* Public Booking Link Card (Redesigned) */}
        <div className="glass-card rounded-3xl p-8 mb-10 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-violet-600/20 transition-all duration-700"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center text-3xl shadow-xl shadow-violet-600/20 animate-float">
                🔗
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 mb-1">Public Booking URL</h3>
                <p className="text-slate-500 font-medium max-w-md">Your clinic is ready for business. Share this link to start accepting appointments instantly.</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/50 p-2 rounded-2xl border border-white w-full md:w-auto shadow-sm">
              <code className="px-4 py-2 font-bold text-sm text-violet-600 select-all">
                {window.location.origin}/book/{JSON.parse(localStorage.getItem('clinic') || '{}').slug || 'your-clinic'}
              </code>
              <button 
                onClick={() => {
                  const url = `${window.location.origin}/book/${JSON.parse(localStorage.getItem('clinic') || '{}').slug || 'your-clinic'}`;
                  navigator.clipboard.writeText(url);
                  alert('URL copied to clipboard!');
                }}
                className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-violet-600 transition-all shadow-lg shadow-slate-900/10 active:scale-95"
              >
                Copy
              </button>
            </div>
          </div>
        </div>

        {/* Stats (Redesigned) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((s) => (
            <div key={s.label} className="glass-card rounded-3xl p-7 hover:-translate-y-2 transition-all duration-300 group">
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${s.color} text-2xl mb-6 shadow-lg shadow-indigo-500/10 group-hover:scale-110 transition-transform`}>
                {s.icon}
              </div>
              <p className="text-5xl font-black tracking-tight text-slate-900">{s.value}</p>
              <p className="text-sm font-bold text-slate-500 mt-2 uppercase tracking-widest">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tab switcher (Redesigned) */}
        <div className="flex gap-2 bg-slate-900/5 p-1.5 rounded-2xl mb-10 w-fit backdrop-blur-md border border-slate-200">
          {[
            { id: 'appointments', label: '📋 Appointments' },
            { id: 'insights',     label: '📊 AI Insights'  },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-8 py-3 rounded-xl text-sm font-black transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-white text-violet-600 shadow-xl shadow-violet-600/10 scale-105'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
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
        <div className="glass-card rounded-3xl overflow-hidden">
          <div className="px-8 py-8 border-b border-slate-100 flex items-center justify-between bg-white/30">
            <div>
              <h2 className="text-2xl font-black text-slate-900">All Appointments</h2>
              <p className="text-sm text-slate-500 mt-1 font-medium">Manage and monitor your patient queue in real-time.</p>
            </div>
            <span className="bg-violet-600 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest">{appointments.length} TOTAL</span>
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
