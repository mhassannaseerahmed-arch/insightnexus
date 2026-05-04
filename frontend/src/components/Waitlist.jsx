import React, { useState } from 'react';

const Waitlist = () => {
  const [email, setEmail] = useState('');
  const [waitlistLoading, setWaitlistLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setWaitlistLoading(true);
    setError(null);
    try {
      const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res  = await fetch(`${BASE_URL}/api/waitlist/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setWaitlistLoading(false);
    }
  };

  return (
    <section id="faq" className="py-32 bg-slate-50 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-20">
          <h2 className="text-sm font-black text-violet-600 tracking-widest uppercase mb-4">
            The Partnership
          </h2>
          <h3 className="text-4xl font-black text-slate-900 tracking-tight mb-4">
            Frequently Asked Questions
          </h3>
          <p className="text-slate-500 font-medium">Everything you need to know about joining the Founding 5.</p>
        </div>

        <div className="space-y-6">
          {[
            {
              q: "How long does setup really take?",
              a: "Under 15 minutes. We don't touch your legacy database. You simply sync your calendar, and our AI begins analyzing patterns instantly."
            },
            {
              q: "Is it safe for my patient data?",
              a: "Absolutely. We are built with end-to-end encryption and adhere to strict healthcare data privacy standards. Your data is yours, and yours only."
            },
            {
              q: "What is a 'Founding Partner'?",
              a: "Our first 5 clinics get a 50% lifetime discount and direct input into our product roadmap. We build the features you specifically ask for."
            },
            {
              q: "Does it work with my current phone number?",
              a: "Yes. We use Twilio to mask your personal number or integrate with your business line so patients see a professional clinic ID."
            }
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-3xl p-8 border border-slate-200/60 shadow-sm">
              <h4 className="text-lg font-black text-slate-900 mb-3 flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-xs font-black">?</span>
                {item.q}
              </h4>
              <p className="text-slate-600 font-medium leading-relaxed pl-9">
                {item.a}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-20 p-10 rounded-[40px] bg-slate-900 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/20 blur-3xl rounded-full translate-x-1/3 -translate-y-1/3"></div>
          <h3 className="text-3xl font-black text-white mb-6 relative z-10">Ready to recover your lost revenue?</h3>
          <p className="text-slate-400 font-medium mb-10 max-w-lg mx-auto relative z-10">
            Join the Founding 5 today and secure your 50% lifetime discount before slots are filled.
          </p>
          <a
            href="/signup"
            className="inline-flex items-center justify-center rounded-2xl bg-white px-10 py-5 text-sm font-black text-slate-900 transition-all hover:scale-105 shadow-2xl relative z-10"
          >
            Apply for Founding Partnership
          </a>
        </div>

      </div>
    </section>
  );
};

export default Waitlist;
