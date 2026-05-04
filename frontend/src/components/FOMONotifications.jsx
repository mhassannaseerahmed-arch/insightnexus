import React, { useState, useEffect } from 'react';

const FOMONotifications = () => {
  const [currentNotification, setCurrentNotification] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  const locations = ['London', 'New York', 'Dubai', 'Sydney', 'Toronto', 'Singapore', 'Mumbai'];
  const doctors = ['Dr. Smith', 'Dr. Ahmed', 'Dr. Garcia', 'Dr. Chen', 'Dr. Muller', 'Dr. Patel'];

  const showRandomNotification = () => {
    const doc = doctors[Math.floor(Math.random() * doctors.length)];
    const loc = locations[Math.floor(Math.random() * locations.length)];
    
    setCurrentNotification({
      text: `${doc} from ${loc} just applied for a Founding Partner slot.`,
      slotsRemaining: Math.floor(Math.random() * 2) + 1
    });
    
    setIsVisible(true);
    
    // Hide after 5 seconds
    setTimeout(() => {
      setIsVisible(false);
    }, 5000);
  };

  useEffect(() => {
    // Show first notification after 10 seconds
    const firstTimer = setTimeout(showRandomNotification, 10000);
    
    // Show new notification every 30-45 seconds
    const interval = setInterval(() => {
      showRandomNotification();
    }, 45000);

    return () => {
      clearTimeout(firstTimer);
      clearInterval(interval);
    };
  }, []);

  if (!currentNotification) return null;

  return (
    <div 
      className={`fixed bottom-8 left-8 z-[100] transition-all duration-700 transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}
    >
      <div className="bg-white/90 backdrop-blur-xl border border-slate-200 p-5 rounded-[28px] shadow-2xl flex items-center gap-4 max-w-sm">
        <div className="w-12 h-12 bg-violet-600 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg shadow-violet-600/20">
          💎
        </div>
        <div>
          <p className="text-xs font-black text-slate-900 tracking-tight leading-snug">
            {currentNotification.text}
          </p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
            <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">
              Only {currentNotification.slotsRemaining} slots left
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FOMONotifications;
