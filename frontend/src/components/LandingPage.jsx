import React, { useState } from 'react';
import Hero from './Hero';
import RevenueLeak from './RevenueLeak';
import ScheduleAudit from './ScheduleAudit';
import Roadmap from './Roadmap';
import Features from './Features';
import Waitlist from './Waitlist';
import Footer from './Footer';
import FOMONotifications from './FOMONotifications';

const LandingPage = () => {
  const [leakData, setLeakData] = useState({ appts: 20, rate: 20 });

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 font-sans pt-16">
      <FOMONotifications />
      <main className="flex-grow">
        <Hero />
        <RevenueLeak onDataChange={setLeakData} />
        <ScheduleAudit leakData={leakData} />
        <Roadmap />
        <Features />
        <Waitlist />
      </main>
      <Footer />
      {/* Version Tag to confirm deployment */}
      <div className="fixed bottom-2 right-2 text-[8px] text-slate-300 pointer-events-none">
        v1.0.4_STABLE
      </div>
    </div>
  );
};

export default LandingPage;
