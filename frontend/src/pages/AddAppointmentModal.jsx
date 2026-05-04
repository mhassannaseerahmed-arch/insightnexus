import React, { useState } from 'react';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API = `${BASE_URL}/api/appointments`;

const AddAppointmentModal = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({
    patientName: '',
    patientPhone: '',
    patientEmail: '',
    appointmentDate: '',
    appointmentTime: '',
    reason: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res  = await fetch(`${API}/book`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      onSuccess();
    } catch (err) {
      setError(err.message || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md border border-slate-100 overflow-hidden">
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-50">
          <div>
            <h2 className="text-xl font-black tracking-tight text-slate-900">New Appointment</h2>
            <button 
              type="button"
              onClick={() => setForm({
                patientName: 'Premium Demo User',
                patientPhone: '+923000000000',
                patientEmail: 'demo@insightnexus.ai',
                appointmentDate: new Date().toISOString().split('T')[0],
                appointmentTime: '14:00',
                reason: 'Awaiting AI Confirmation'
              })}
              className="text-[9px] font-black uppercase tracking-widest text-violet-600 hover:text-violet-700 mt-1"
            >
              ✨ Fill Demo Data
            </button>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-all">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-8 space-y-5">
          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 text-rose-700 text-sm font-bold border border-rose-100">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-5">
            <div className="col-span-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Patient Name *</label>
              <input
                name="patientName" value={form.patientName} onChange={handleChange} required
                placeholder="e.g. Ahmed Khan"
                className="w-full rounded-2xl px-5 py-3.5 text-sm font-bold border border-slate-100 bg-white text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-violet-500/5 focus:border-violet-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Phone *</label>
              <input
                name="patientPhone" value={form.patientPhone} onChange={handleChange} required
                placeholder="03XX-XXXXXXX"
                className="w-full rounded-2xl px-5 py-3.5 text-sm font-bold border border-slate-100 bg-white text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-violet-500/5 focus:border-violet-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Email</label>
              <input
                name="patientEmail" value={form.patientEmail} onChange={handleChange}
                type="email" placeholder="email@example.com"
                className="w-full rounded-2xl px-5 py-3.5 text-sm font-bold border border-slate-100 bg-white text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-violet-500/5 focus:border-violet-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Date *</label>
              <input
                name="appointmentDate" value={form.appointmentDate} onChange={handleChange} required
                type="date"
                className="w-full rounded-2xl px-5 py-3.5 text-sm font-bold border border-slate-100 bg-white text-slate-900 focus:outline-none focus:ring-4 focus:ring-violet-500/5 focus:border-violet-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Time *</label>
              <input
                name="appointmentTime" value={form.appointmentTime} onChange={handleChange} required
                type="time"
                className="w-full rounded-2xl px-5 py-3.5 text-sm font-bold border border-slate-100 bg-white text-slate-900 focus:outline-none focus:ring-4 focus:ring-violet-500/5 focus:border-violet-500 transition-all"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Reason</label>
              <input
                name="reason" value={form.reason} onChange={handleChange}
                placeholder="e.g. Checkup, Cleaning..."
                className="w-full rounded-2xl px-5 py-3.5 text-sm font-bold border border-slate-100 bg-white text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-violet-500/5 focus:border-violet-500 transition-all"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="flex-1 rounded-2xl px-6 py-4 text-sm font-black text-slate-400 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 transition-all active:scale-95">
              Cancel
            </button>
            <button
              type="submit" disabled={loading}
              className="flex-grow-[2] rounded-2xl px-6 py-4 text-sm font-black text-white bg-slate-900 hover:bg-violet-600 disabled:opacity-60 transition-all shadow-xl shadow-slate-900/20 active:scale-95"
            >
              {loading ? 'Booking…' : 'Book Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAppointmentModal;
