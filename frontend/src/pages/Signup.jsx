import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Signup = () => {
  const [formData, setFormData] = useState({
    clinicName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [signupLoading, setSignupLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setSignupLoading(true);
    setError('');

    try {
      const res = await fetch(`${BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('clinic', JSON.stringify(data.clinic));
        navigate('/dashboard');
      } else {
        setError(data.message || 'Signup failed');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest text-violet-600 bg-violet-50 border border-violet-100 mb-6">
          💎 Early Access Program
        </div>
        <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">
          Join the <span className="text-violet-600">Founding 5.</span>
        </h2>
        <p className="text-sm font-bold text-slate-500 max-w-xs mx-auto leading-relaxed">
          The first 5 clinics get priority support and <span className="text-slate-900 font-black">50% Lifetime Discount.</span>
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-6 shadow-2xl shadow-slate-200/60 sm:rounded-3xl sm:px-12 border border-slate-100">
          <form className="space-y-6" onSubmit={handleSignup}>
            {error && (
              <div className="bg-rose-50 text-rose-700 p-4 rounded-2xl text-sm border border-rose-100 font-bold">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                Clinic Name
              </label>
              <input
                type="text"
                required
                className="block w-full px-5 py-4 rounded-2xl border border-slate-100 bg-white text-slate-900 font-bold placeholder-slate-300 focus:ring-4 focus:ring-violet-500/5 focus:border-violet-500 transition-all outline-none"
                placeholder="e.g. Smile Design Dental"
                value={formData.clinicName}
                onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                Work Email
              </label>
              <input
                type="email"
                required
                className="block w-full px-5 py-4 rounded-2xl border border-slate-100 bg-white text-slate-900 font-bold placeholder-slate-300 focus:ring-4 focus:ring-violet-500/5 focus:border-violet-500 transition-all outline-none"
                placeholder="doctor@clinic.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                Create Password
              </label>
              <input
                type="password"
                required
                className="block w-full px-5 py-4 rounded-2xl border border-slate-100 bg-white text-slate-900 font-bold placeholder-slate-300 focus:ring-4 focus:ring-violet-500/5 focus:border-violet-500 transition-all outline-none"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={signupLoading}
                className="w-full flex justify-center py-5 px-4 rounded-2xl shadow-xl shadow-slate-900/10 text-sm font-black text-white bg-slate-900 hover:bg-violet-600 transition-all active:scale-95 disabled:opacity-50"
              >
                {signupLoading ? 'Processing...' : 'Secure My Founding Slot'}
              </button>
              <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest mt-6">
                🔒 Encrypted & Secure Clinic Portal
              </p>
            </div>
          </form>

          <div className="mt-10 text-center text-xs">
            <span className="text-slate-400 font-bold">HAVE AN ACCOUNT?</span>{' '}
            <Link to="/login" className="font-black text-violet-600 hover:text-slate-900 transition-colors">
              SIGN IN HERE
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
