import Link from 'next/link';
import { FacebookIcon, FacebookGroupIcon, TelegramIcon } from './SocialLinks';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 glass-header border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group flex-shrink-0">
            <img
              src="/favicon.ico"
              alt="SarkariJobAlerts Logo"
              className="w-10 h-10 rounded-xl shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform object-cover"
            />
            <div>
              <span className="text-xl sarkari-gradient-text font-black">SarkariJobAlerts</span>
              <span className="text-[10px] block text-cyan-400 font-bold tracking-widest uppercase">AUTOMATED GOVT ALERTS</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors">
              Home
            </Link>
            <Link href="/latest-jobs/" className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors">
              Latest Jobs
            </Link>
            <Link href="/admit-cards/" className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors">
              Admit Cards
            </Link>
            <Link href="/results/" className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors">
              Results
            </Link>
            <Link href="/answer-key/" className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors">
              Answer Key
            </Link>
            <Link href="/syllabus/" className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors">
              Syllabus
            </Link>
          </nav>

          {/* Social Links & Live Status Badge */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Social Media Icons */}
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <a
                href="https://www.facebook.com/SarkariJobAlertsCom/"
                target="_blank"
                rel="noopener noreferrer"
                title="Follow Facebook Page"
                aria-label="Facebook Page"
                className="p-2 rounded-xl bg-blue-600/15 border border-blue-500/30 text-blue-400 hover:text-white hover:bg-blue-600 hover:border-blue-500 hover:scale-110 transition-all shadow-sm flex items-center justify-center"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a
                href="https://www.facebook.com/groups/sarkarijobalertscom"
                target="_blank"
                rel="noopener noreferrer"
                title="Join Facebook Group"
                aria-label="Facebook Group"
                className="p-2 rounded-xl bg-indigo-600/15 border border-indigo-500/30 text-indigo-400 hover:text-white hover:bg-indigo-600 hover:border-indigo-500 hover:scale-110 transition-all shadow-sm flex items-center justify-center"
              >
                <FacebookGroupIcon className="w-4 h-4" />
              </a>
              <a
                href="https://t.me/sarkarijobalerts_live"
                target="_blank"
                rel="noopener noreferrer"
                title="Join Telegram Channel"
                aria-label="Telegram Channel"
                className="p-2 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-400 hover:text-white hover:bg-sky-500 hover:border-sky-400 hover:scale-110 transition-all shadow-sm flex items-center justify-center"
              >
                <TelegramIcon className="w-4 h-4" />
              </a>
            </div>

            {/* Live Updates Pill */}
            <div className="hidden sm:flex items-center space-x-2 bg-slate-900/90 border border-slate-800 px-3.5 py-1.5 rounded-full text-xs text-slate-200 shadow-inner">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="font-semibold text-emerald-400">Live Updates 24/7</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
