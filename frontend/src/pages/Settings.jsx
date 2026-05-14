import React, { useState, useEffect } from 'react';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('Profile');
  const [clinic, setClinic] = useState({
    clinicName: '',
    phone: '',
    address: '',
    description: '',
    businessHours: { start: '09:00', end: '17:00' },
    smsTemplate: '',
  });
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${BASE_URL}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setClinic(data.clinic);
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${BASE_URL}/api/auth/update-profile`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(clinic),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Settings updated successfully!' });
      } else {
        setMessage({ type: 'error', text: data.message || 'Update failed' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Something went wrong' });
    } finally {
      setSaving(false);
    }
  };

  if (settingsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
            Clinic <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">Settings</span>
          </h1>
          <p className="text-slate-500 font-medium">Customize your clinic profile and preferences.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Sidebar Nav */}
          <div className="space-y-2">
            {['Profile', 'Business Hours', 'SMS Templates'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left px-6 py-4 rounded-2xl font-bold transition-all ${
                  activeTab === tab 
                    ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/10' 
                    : 'text-slate-500 hover:bg-white hover:text-slate-900'
                }`}
              >
                {tab === 'Profile' ? '👤 ' : tab === 'Business Hours' ? '⏰ ' : '📱 '}{tab}
              </button>
            ))}
          </div>

          {/* Main Form Area */}
          <div className="lg:col-span-2">
            <div className="glass-card rounded-[32px] p-8 md:p-10">
              {message.text && (
                <div className={`mb-8 p-4 rounded-2xl font-bold text-sm ${
                  message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
                }`}>
                  {message.type === 'success' ? '✅' : '❌'} {message.text}
                </div>
              )}

              {activeTab === 'Profile' && (
                <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Clinic Name</label>
                      <input 
                        type="text" 
                        className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-white/50 text-slate-900 font-bold focus:ring-4 focus:ring-violet-500/10 outline-none transition-all"
                        value={clinic.clinicName}
                        onChange={(e) => setClinic({...clinic, clinicName: e.target.value})}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Contact Phone</label>
                        <input 
                          type="tel" 
                          className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-white/50 text-slate-900 font-bold focus:ring-4 focus:ring-violet-500/10 outline-none transition-all"
                          value={clinic.phone || ''}
                          onChange={(e) => setClinic({...clinic, phone: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Clinic Slug</label>
                        <div className="px-6 py-4 rounded-2xl bg-slate-50 text-slate-400 font-bold border border-slate-100">
                          {clinic.slug}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Physical Address</label>
                      <input 
                        type="text" 
                        className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-white/50 text-slate-900 font-bold focus:ring-4 focus:ring-violet-500/10 outline-none transition-all"
                        value={clinic.address || ''}
                        onChange={(e) => setClinic({...clinic, address: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Short Description</label>
                      <textarea 
                        rows="3"
                        className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-white/50 text-slate-900 font-bold focus:ring-4 focus:ring-violet-500/10 outline-none transition-all"
                        value={clinic.description || ''}
                        onChange={(e) => setClinic({...clinic, description: e.target.value})}
                      ></textarea>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={saving}
                    className="w-full md:w-auto px-12 py-4 rounded-2xl bg-slate-900 hover:bg-violet-600 text-white font-black shadow-2xl shadow-slate-900/20 transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Profile'}
                  </button>
                </form>
              )}

              {activeTab === 'Business Hours' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-violet-600/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">⏰</div>
                    <h3 className="text-2xl font-black text-slate-900">Define Your Hours</h3>
                    <p className="text-slate-500 font-medium">Patients will only see time slots within these hours.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Opening Time</label>
                      <input 
                        type="time" 
                        className="w-full px-8 py-5 rounded-3xl border border-slate-100 bg-white/50 text-slate-900 text-xl font-bold focus:ring-4 focus:ring-violet-500/10 outline-none"
                        value={clinic.businessHours?.start || '09:00'}
                        onChange={(e) => setClinic({...clinic, businessHours: {...clinic.businessHours, start: e.target.value}})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Closing Time</label>
                      <input 
                        type="time" 
                        className="w-full px-8 py-5 rounded-3xl border border-slate-100 bg-white/50 text-slate-900 text-xl font-bold focus:ring-4 focus:ring-violet-500/10 outline-none"
                        value={clinic.businessHours?.end || '17:00'}
                        onChange={(e) => setClinic({...clinic, businessHours: {...clinic.businessHours, end: e.target.value}})}
                      />
                    </div>
                  </div>

                  <button 
                    onClick={handleSubmit}
                    disabled={saving}
                    className="w-full md:w-auto px-12 py-4 rounded-2xl bg-slate-900 hover:bg-violet-600 text-white font-black shadow-2xl shadow-slate-900/20 transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50"
                  >
                    {saving ? 'Updating Hours...' : 'Update Hours'}
                  </button>
                </div>
              )}

              {activeTab === 'SMS Templates' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-indigo-600/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">📱</div>
                    <h3 className="text-2xl font-black text-slate-900">SMS Confirmation</h3>
                    <p className="text-slate-500 font-medium">The message patients receive when you confirm their slot.</p>
                  </div>

                  <div className="space-y-4">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Custom Message</label>
                    <textarea 
                      rows="5"
                      className="w-full px-8 py-6 rounded-3xl border border-slate-100 bg-white/50 text-slate-900 font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none leading-relaxed"
                      placeholder="Hi {patientName}, your appointment..."
                      value={clinic.smsTemplate || ''}
                      onChange={(e) => setClinic({...clinic, smsTemplate: e.target.value})}
                    ></textarea>
                    
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Available Placeholders:</p>
                      <div className="flex flex-wrap gap-2">
                        {['{patientName}', '{clinicName}', '{date}', '{time}'].map(p => (
                          <code key={p} className="px-2 py-1 bg-white border border-slate-200 rounded text-xs text-indigo-600 font-bold">{p}</code>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={handleSubmit}
                    disabled={saving}
                    className="w-full md:w-auto px-12 py-4 rounded-2xl bg-slate-900 hover:bg-violet-600 text-white font-black shadow-2xl shadow-slate-900/20 transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50"
                  >
                    {saving ? 'Saving Template...' : 'Save SMS Template'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;
