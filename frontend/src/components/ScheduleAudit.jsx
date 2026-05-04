import React, { useState } from 'react';

const ScheduleAudit = ({ leakData }) => {
  const [formData, setFormData] = useState({ name: '', email: '', clinicName: '', phone: '' });
  const [auditInfo, setAuditInfo] = useState(null);
  const [auditLoading, setAuditLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuditLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/leads/request-audit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, ...leakData })
      });
      const json = await res.json();
      if (json.success) {
        setAuditInfo({ data: json.auditData, name: json.fileName });
      }
    } catch (err) {
      console.error('Audit Request Failed:', err);
    } finally {
      setAuditLoading(false);
    }
  };

  const downloadAudit = () => {
    const link = document.createElement('a');
    link.href = `data:application/vnd.openxmlformats-officedocument.presentationml.presentation;base64,${auditInfo.data}`;
    link.download = auditInfo.name;
    link.click();
  };

  return (
    <section id="book-audit" className="py-32 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 rounded-[40px] p-8 md:p-16 border border-slate-100 shadow-2xl shadow-slate-200/50 flex flex-col md:flex-row gap-16 items-center">
          
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-100 mb-6">
              ✅ Free AI Revenue Audit
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-6">
              Stop the leak. <br />
              <span className="text-violet-600">Start the recovery.</span>
            </h2>
            <p className="text-slate-500 font-medium leading-relaxed mb-10">
              We'll analyze your {leakData.appts} daily appointments and show you how to recover your estimated ${ (leakData.appts * 22 * (leakData.rate/100) * 200 * 12).toLocaleString() } annual loss.
            </p>
            
            <ul className="space-y-4">
              {[
                'Personalized Revenue Leak PPT Report',
                'Custom AI Prediction Preview',
                'Founding Partner Pricing Lock-in'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                  <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">✓</div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="w-full md:w-[380px] bg-white rounded-3xl p-8 shadow-xl border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-violet-600"></div>
            
            {auditInfo ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">🏆</div>
                <h3 className="text-xl font-black text-slate-900 mb-2">Audit Ready!</h3>
                <p className="text-xs text-slate-500 mb-8">Your personalized strategy deck has been generated.</p>
                <button 
                  onClick={downloadAudit}
                  className="block w-full py-5 rounded-2xl bg-emerald-600 text-white font-black text-sm hover:bg-emerald-700 transition-all text-center shadow-lg"
                >
                  Download My Audit
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-lg font-black text-slate-900 mb-6 text-center">Get Your Free Audit</h3>
                <input 
                  type="text" placeholder="Your Name" required
                  className="w-full p-4 rounded-xl border border-slate-100 bg-slate-50 text-sm focus:border-violet-600 outline-none"
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
                <input 
                  type="text" placeholder="Clinic Name" required
                  className="w-full p-4 rounded-xl border border-slate-100 bg-slate-50 text-sm focus:border-violet-600 outline-none"
                  onChange={(e) => setFormData({...formData, clinicName: e.target.value})}
                />
                <input 
                  type="email" placeholder="Email Address" required
                  className="w-full p-4 rounded-xl border border-slate-100 bg-slate-50 text-sm focus:border-violet-600 outline-none"
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
                <button 
                  type="submit" disabled={auditLoading}
                  className="w-full py-5 rounded-2xl bg-slate-900 text-white font-black text-sm hover:bg-violet-600 transition-all shadow-xl shadow-slate-900/20 active:scale-95 disabled:opacity-50"
                >
                  {auditLoading ? 'Generating Audit...' : 'Generate My Audit'}
                </button>
              </form>
            )}
            
            <p className="text-[10px] text-slate-400 font-bold text-center mt-6 uppercase tracking-widest">
              ⚡ Instant PPT Generation
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ScheduleAudit;
