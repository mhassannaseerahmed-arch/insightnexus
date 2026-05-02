import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-slate-950 py-10 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-500">
              AI Nexus Insight
            </span>
            <p className="text-xs text-slate-400 mt-0.5">Patient feedback intelligence for solo clinics</p>
          </div>

          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate-400 dark:text-slate-500">
            <a href="#how-it-works" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">How It Works</a>
            <a href="#waitlist" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Join Waitlist</a>
          </nav>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-400">
          <p>&copy; {new Date().getFullYear()} AI Nexus Insight. Built with ❤️ for clinic owners.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

