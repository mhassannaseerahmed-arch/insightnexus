import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const PublicBooking = () => {
  const { slug } = useParams();
  const [clinic, setClinic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1: Date/Time, 2: Details, 3: Success

  // Form State
  const [formData, setFormData] = useState({
    patientName: '',
    patientPhone: '',
    patientEmail: '',
    appointmentDate: '',
    appointmentTime: '',
    reason: '',
  });

  useEffect(() => {
    fetchClinic();
  }, [slug]);

  const fetchClinic = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/public/clinic/${slug}`);
      const data = await res.json();
      if (data.success) {
        setClinic(data.clinic);
      } else {
        setError('Clinic not found');
      }
    } catch (err) {
      setError('Error loading clinic details');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/public/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, clinicId: clinic._id }),
      });
      const data = await res.json();
      if (data.success) {
        setStep(3);
      } else {
        alert(data.message || 'Booking failed');
      }
    } catch (err) {
      alert('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (loading && step !== 3) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans pt-24">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 font-sans p-4 pt-24">
        <h1 className="text-2xl font-black text-slate-900 mb-4">{error}</h1>
        <Link to="/" className="text-violet-600 font-bold hover:underline">Go back home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pt-24 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-3xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-top-8 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-600/10 border border-violet-600/20 text-violet-600 text-[10px] font-black uppercase tracking-widest mb-6">
            ✨ Secure Patient Portal
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-4 leading-tight">
            {clinic?.clinicName}
          </h1>
          <p className="text-lg text-slate-500 font-medium max-w-xl mx-auto">
            {clinic?.address || 'Premium healthcare services, tailored to your needs.'}
          </p>
        </div>

        {/* Step Indicator */}
        <div className="mb-12 flex justify-center gap-3">
          {[1, 2, 3].map((s) => (
            <div 
              key={s} 
              className={`h-1.5 rounded-full transition-all duration-500 ${
                step >= s ? 'w-12 bg-slate-900' : 'w-4 bg-slate-200'
              }`}
            ></div>
          ))}
        </div>

        <div className="bg-white rounded-[40px] p-10 md:p-14 border border-slate-200/60 shadow-2xl shadow-slate-200/50 relative overflow-hidden">
          
          {step === 1 && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="text-center">
                <h2 className="text-3xl font-black text-slate-900 mb-2">Pick a Time</h2>
                <p className="text-slate-500 font-medium">Select your preferred date and time slot.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Appointment Date</label>
                  <input 
                    type="date" 
                    className="w-full px-8 py-5 rounded-3xl border border-slate-100 bg-slate-50 text-slate-900 text-lg font-bold focus:ring-4 focus:ring-violet-500/5 focus:border-violet-500 outline-none transition-all cursor-pointer"
                    min={new Date().toISOString().split('T')[0]}
                    value={formData.appointmentDate}
                    onChange={(e) => setFormData({...formData, appointmentDate: e.target.value})}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Time Slot</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00']
                      .filter(t => {
                        if (!clinic?.businessHours) return true;
                        return t >= clinic.businessHours.start && t <= clinic.businessHours.end;
                      })
                      .map(t => (
                        <button
                          key={t}
                          onClick={() => setFormData({...formData, appointmentTime: t})}
                          className={`py-3 rounded-2xl font-bold text-sm transition-all ${
                            formData.appointmentTime === t 
                              ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20 scale-105' 
                              : 'bg-slate-50 text-slate-600 border border-slate-100 hover:border-violet-500'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                  </div>
                </div>
              </div>

              <button 
                disabled={!formData.appointmentDate || !formData.appointmentTime}
                onClick={() => setStep(2)}
                className="w-full py-6 rounded-3xl bg-slate-900 hover:bg-violet-600 text-white font-black text-xl shadow-2xl shadow-slate-900/20 transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-30 disabled:translate-y-0"
              >
                Continue to Details →
              </button>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleBooking} className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
              <div className="flex items-center justify-between mb-8">
                <button 
                  type="button"
                  onClick={() => setStep(1)}
                  className="group flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold transition-colors uppercase text-[10px] tracking-widest"
                >
                  <span className="group-hover:-translate-x-1 transition-transform">←</span> Back
                </button>
                <h2 className="text-3xl font-black text-slate-900">Your Info</h2>
              </div>

              <div className="space-y-5">
                <div className="relative group">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-4">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Ahmed Khan"
                    required
                    className="w-full px-8 py-5 rounded-3xl border border-slate-100 bg-slate-50 text-slate-900 text-lg font-bold focus:ring-4 focus:ring-violet-500/5 focus:border-violet-500 outline-none transition-all"
                    value={formData.patientName}
                    onChange={(e) => setFormData({...formData, patientName: e.target.value})}
                  />
                </div>
                <div className="relative group">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-4">Phone Number</label>
                  <input 
                    type="tel" 
                    placeholder="03XX-XXXXXXX"
                    required
                    className="w-full px-8 py-5 rounded-3xl border border-slate-100 bg-slate-50 text-slate-900 text-lg font-bold focus:ring-4 focus:ring-violet-500/5 focus:border-violet-500 outline-none transition-all"
                    value={formData.patientPhone}
                    onChange={(e) => setFormData({...formData, patientPhone: e.target.value})}
                  />
                </div>
                <div className="relative group">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-4">Reason for Visit</label>
                  <textarea 
                    placeholder="Briefly describe your concern..."
                    rows="3"
                    className="w-full px-8 py-5 rounded-3xl border border-slate-100 bg-slate-50 text-slate-900 text-lg font-bold focus:ring-4 focus:ring-violet-500/5 focus:border-violet-500 outline-none transition-all"
                    value={formData.reason}
                    onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  ></textarea>
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-6 rounded-3xl bg-slate-900 hover:bg-violet-600 text-white font-black text-xl shadow-2xl shadow-slate-900/20 transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Confirm Appointment'}
              </button>
            </form>
          )}

          {step === 3 && (
            <div className="text-center py-10 animate-in zoom-in duration-700">
              <div className="w-24 h-24 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-emerald-500/30 animate-bounce">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="text-4xl font-black text-slate-900 mb-4">Confirmed!</h2>
              <p className="text-xl text-slate-500 font-medium mb-12">
                We've secured your slot. A confirmation text is on its way to your phone.
              </p>
              <button 
                onClick={() => window.location.reload()}
                className="px-10 py-5 rounded-3xl bg-slate-100 text-slate-900 font-black hover:bg-slate-200 transition-all"
              >
                Done
              </button>
            </div>
          )}

        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} AI Insight Nexus • Powered by Advanced Patient Analytics</p>
        </div>
      </div>
    </div>
  );
};

export default PublicBooking;
