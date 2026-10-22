import Link from 'next/link';
import { Search, Home, Briefcase, CreditCard, Trophy, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Page Not Found',
  description: 'The page you are looking for does not exist or has been moved. Explore our latest government job alerts, admit cards, and exam results.',
};

export default function NotFound() {
  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-slate-300 text-center">
      <div className="glass-card rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-2xl space-y-6">
        
        {/* 404 Header Icon & Title */}
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-20 h-20 rounded-3xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/10">
            <Search className="w-10 h-10 animate-pulse" />
          </div>
          <span className="text-6xl sm:text-7xl font-black text-slate-700 tracking-wider">404</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Oops! Page Not Found
          </h1>
          <p className="text-sm text-slate-400 max-w-lg leading-relaxed">
            The page or job notification you are looking for might have been moved, updated, or does not exist anymore. Use the shortcuts below to browse live notifications.
          </p>
        </div>

        {/* Quick Action Navigation Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-800/80">
          <Link
            href="/latest-jobs/"
            className="flex flex-col items-center p-5 bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl transition-all group shadow-md"
          >
            <Briefcase className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform mb-2" />
            <span className="font-bold text-white text-sm group-hover:text-cyan-400 transition-colors">Latest Jobs</span>
            <span className="text-xs text-slate-500 mt-1">Explore 2026 notifications</span>
          </Link>

          <Link
            href="/admit-cards/"
            className="flex flex-col items-center p-5 bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl transition-all group shadow-md"
          >
            <CreditCard className="w-6 h-6 text-indigo-400 group-hover:scale-110 transition-transform mb-2" />
            <span className="font-bold text-white text-sm group-hover:text-indigo-400 transition-colors">Admit Cards</span>
            <span className="text-xs text-slate-500 mt-1">Download hall tickets</span>
          </Link>

          <Link
            href="/results/"
            className="flex flex-col items-center p-5 bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl transition-all group shadow-md"
          >
            <Trophy className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform mb-2" />
            <span className="font-bold text-white text-sm group-hover:text-emerald-400 transition-colors">Exam Results</span>
            <span className="text-xs text-slate-500 mt-1">Check merit lists & cutoffs</span>
          </Link>
        </div>

        {/* Back to Home Button */}
        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-lg shadow-cyan-500/20"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
        </div>

      </div>
    </article>
  );
}
