import Link from 'next/link';
import { ShieldCheck, Mail, Globe, ExternalLink, Award, Sparkles } from 'lucide-react';
import { FacebookIcon, FacebookGroupIcon, TelegramIcon } from './SocialLinks';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 py-12 mt-16 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-slate-900">
          
          {/* Column 1: Brand & Tagline & Social Links */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-3 group">
              <img
                src="/favicon.ico"
                alt="SarkariJobAlerts Logo"
                className="w-10 h-10 rounded-xl shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform object-cover"
              />
              <div>
                <span className="text-xl sarkari-gradient-text font-black">SarkariJobAlerts</span>
                <span className="text-[10px] block text-cyan-400 font-bold tracking-widest uppercase">
                  AUTOMATED GOVT ALERTS
                </span>
              </div>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              India's fastest automated job notification portal. Real-time updates for Government Jobs, Admit Cards, Exam Results, Answer Keys, and Recruitment Guidelines.
            </p>

            <div className="pt-2 space-y-2.5">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Official Channels:
              </h4>
              <div className="flex flex-wrap gap-2">
                <a
                  href="https://www.facebook.com/SarkariJobAlertsCom/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-slate-900 border border-slate-800 hover:border-blue-500/60 hover:bg-blue-950/40 text-slate-300 hover:text-blue-400 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all group"
                >
                  <FacebookIcon className="w-3.5 h-3.5 text-blue-500 group-hover:scale-110 transition-transform" />
                  <span>FB Page</span>
                </a>
                <a
                  href="https://www.facebook.com/groups/sarkarijobalertscom"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-slate-900 border border-slate-800 hover:border-indigo-500/60 hover:bg-indigo-950/40 text-slate-300 hover:text-indigo-400 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all group"
                >
                  <FacebookGroupIcon className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
                  <span>FB Group</span>
                </a>
                <a
                  href="https://t.me/sarkarijobalerts_live"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-slate-900 border border-slate-800 hover:border-sky-500/60 hover:bg-sky-950/40 text-slate-300 hover:text-sky-400 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all group"
                >
                  <TelegramIcon className="w-3.5 h-3.5 text-sky-400 group-hover:scale-110 transition-transform" />
                  <span>Telegram</span>
                </a>
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-1 text-xs text-cyan-400 font-semibold">
              <span className="inline-flex items-center space-x-1 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% Free Service</span>
              </span>
            </div>
          </div>

          {/* Column 2: Quick Portals */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-cyan-500 pl-2.5">
              Quick Portals
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/latest-jobs/" className="hover:text-cyan-400 transition-colors flex items-center space-x-1.5">
                  <span>› Latest Govt Jobs 2026</span>
                </Link>
              </li>
              <li>
                <Link href="/admit-cards/" className="hover:text-cyan-400 transition-colors flex items-center space-x-1.5">
                  <span>› Exam Admit Cards</span>
                </Link>
              </li>
              <li>
                <Link href="/results/" className="hover:text-cyan-400 transition-colors flex items-center space-x-1.5">
                  <span>› Sarkari Exam Results</span>
                </Link>
              </li>
              <li>
                <Link href="/answer-key/" className="hover:text-cyan-400 transition-colors flex items-center space-x-1.5">
                  <span>› Official Answer Keys</span>
                </Link>
              </li>
              <li>
                <Link href="/syllabus/" className="hover:text-cyan-400 transition-colors flex items-center space-x-1.5">
                  <span>› Exam Syllabus & Patterns</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Top Categories */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-indigo-500 pl-2.5">
              Top Categories
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/latest-jobs/" className="hover:text-indigo-400 transition-colors flex items-center space-x-1.5">
                  <span>› SSC Recruitments (CGL / CHSL / GD)</span>
                </Link>
              </li>
              <li>
                <Link href="/latest-jobs/" className="hover:text-indigo-400 transition-colors flex items-center space-x-1.5">
                  <span>› Railway Vacancies (RRB / RRC)</span>
                </Link>
              </li>
              <li>
                <Link href="/latest-jobs/" className="hover:text-indigo-400 transition-colors flex items-center space-x-1.5">
                  <span>› Bank Jobs (IBPS / SBI / RBI)</span>
                </Link>
              </li>
              <li>
                <Link href="/latest-jobs/" className="hover:text-indigo-400 transition-colors flex items-center space-x-1.5">
                  <span>› Police Bharti (UP / Bihar / MP)</span>
                </Link>
              </li>
              <li>
                <Link href="/latest-jobs/" className="hover:text-indigo-400 transition-colors flex items-center space-x-1.5">
                  <span>› UPSC & Civil Services Exams</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Important / Legal Pages (Google AdSense Mandatory) */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-emerald-500 pl-2.5">
              Legal & Support
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/about/" className="hover:text-emerald-400 transition-colors flex items-center space-x-1.5 font-medium">
                  <span>› About Us</span>
                </Link>
              </li>
              <li>
                <Link href="/contact/" className="hover:text-emerald-400 transition-colors flex items-center space-x-1.5 font-medium">
                  <span>› Contact Us</span>
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy/" className="hover:text-emerald-400 transition-colors flex items-center space-x-1.5 font-medium">
                  <span>› Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link href="/terms-and-conditions/" className="hover:text-emerald-400 transition-colors flex items-center space-x-1.5 font-medium">
                  <span>› Terms & Conditions</span>
                </Link>
              </li>
              <li>
                <Link href="/disclaimer/" className="hover:text-emerald-400 transition-colors flex items-center space-x-1.5 font-medium">
                  <span>› Non-Govt Disclaimer</span>
                </Link>
              </li>
              <li>
                <a href="/llms.txt" className="hover:text-cyan-400 transition-colors flex items-center space-x-1.5 font-medium">
                  <span>› llms.txt (AI Crawler Index)</span>
                </a>
              </li>
              <li>
                <a href="/rss.xml" className="hover:text-amber-400 transition-colors flex items-center space-x-1.5 font-medium">
                  <span>› RSS Feed 2.0</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-8 text-center space-y-3">
          <p className="text-[11px] text-slate-500 max-w-4xl mx-auto leading-relaxed">
            <strong>Non-Government Affiliation Disclaimer:</strong> SarkariJobAlerts.com is a private news, informational, and educational portal. We are NOT associated, affiliated, or authorized by the Government of India, any State Government, or any official recruitment board. All official notifications, dates, and links provided here are compiled from public domains for informational purposes only. Candidates are requested to double check details on official government websites.
          </p>
          <div className="text-xs text-slate-400 pt-2 font-medium">
            © 2026 <span className="text-slate-200">SarkariJobAlerts.com</span>. All Rights Reserved. Website Designed & Developed by{' '}
            <a
              href="https://zestrank.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 font-bold hover:underline"
            >
              ZestRank
            </a>.
          </div>
        </div>

      </div>
    </footer>
  );
}
