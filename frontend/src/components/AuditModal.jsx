import React, { useState } from 'react';

const AuditModal = ({ isOpen, onClose }) => {
  const [form, setForm] = useState({ name: '', email: '', clinicName: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/leads/request-audit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        setTimeout(onClose, 3000);
      } else {
        alert(data.message || 'Something went wrong');
      }
    } catch (err) {
      alert('Error requesting audit');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative bg-[#0f1523] border border-white/10 rounded-[32px] w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="px-8 pt-8 pb-4">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest text-violet-400 bg-violet-400/10 border border-violet-400/20 mb-4">
                💎 Premium Service
              </div>
              <h2 className="text-3xl font-black text-white tracking-tight">Free Revenue Audit</h2>
              <p className="text-slate-400 text-sm mt-2 font-medium">We'll analyze your clinic's data and show you exactly where you're leaking money.</p>
            </div>
            <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4 pb-8">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Your Name</label>
                  <input
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm font-bold text-white focus:outline-none focus:border-violet-500 transition-all"
                    placeholder="Dr. John Doe"
                    onChange={(e) => setForm({...form, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Clinic Name</label>
                  <input
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm font-bold text-white focus:outline-none focus:border-violet-500 transition-all"
                    placeholder="Smile Dental"
                    onChange={(e) => setForm({...form, clinicName: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Work Email</label>
                <input
                  required type="email"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm font-bold text-white focus:outline-none focus:border-violet-500 transition-all"
                  placeholder="doctor@clinic.com"
                  onChange={(e) => setForm({...form, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Phone Number</label>
                <input
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm font-bold text-white focus:outline-none focus:border-violet-500 transition-all"
                  placeholder="+1 (555) 000-0000"
                  onChange={(e) => setForm({...form, phone: e.target.value})}
                />
              </div>
              <button
                type="submit" disabled={loading}
                className="w-full bg-violet-600 hover:bg-violet-500 text-white font-black py-5 rounded-2xl shadow-xl shadow-violet-600/20 transition-all active:scale-[0.98] mt-4 disabled:opacity-50"
              >
                {loading ? 'Securing Your Audit...' : 'Claim My Free Audit'}
              </button>
              <p className="text-[10px] text-center text-slate-500 font-bold uppercase tracking-widest mt-4">
                Limited to 2 Audits per week
              </p>
            </form>
          ) : (
            <div className="py-12 text-center">
              <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 animate-bounce">
                ✅
              </div>
              <h3 className="text-2xl font-black text-white mb-2">Audit Sent!</h3>
              <p className="text-slate-400 font-medium mb-8">Your custom strategy deck has been sent to your email.</p>
              
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-8 text-left">
                <h4 className="text-white font-bold text-sm mb-2">What's Next?</h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Most clinics recover their first $1,000 within 7 days of implementing our AI. Schedule a quick walkthrough of your audit.
                </p>
              </div>

              <a 
                href="/signup" 
                className="block w-full bg-white text-slate-950 font-black py-4 rounded-2xl shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Book My Strategy Session
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditModal;
