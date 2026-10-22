import Link from 'next/link';
import { Award, FileText, Briefcase, ChevronRight, Sparkles, Send, Key, BookOpen } from 'lucide-react';
import { FacebookIcon, FacebookGroupIcon, TelegramIcon } from './SocialLinks';

// Check if a post is "new" (within last 48 hours based on postDate)
function isRecentPost(postDate) {
  if (!postDate) return false;
  try {
    // Try parsing DD/MM/YYYY format
    if (typeof postDate === 'string' && postDate.includes('/')) {
      const parts = postDate.split('/');
      if (parts.length === 3) {
        const [day, month, year] = parts;
        const parsed = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
        if (!isNaN(parsed.getTime())) {
          return Date.now() - parsed.getTime() < 48 * 60 * 60 * 1000;
        }
      }
    }
    const parsed = new Date(postDate);
    if (!isNaN(parsed.getTime())) {
      return Date.now() - parsed.getTime() < 48 * 60 * 60 * 1000;
    }
  } catch {}
  return false;
}

export default function ThreeColumnLayout({
  results = [],
  admitCards = [],
  latestJobs = [],
  answerKeys = [],
  syllabus = [],
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Banner */}
      <div className="mb-8 text-center space-y-3">
        <div className="inline-flex items-center space-x-2 bg-indigo-950/80 border border-indigo-700/50 px-4 py-1.5 rounded-full text-xs font-semibold text-indigo-300 shadow-sm">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Real-time Scraped & AI Optimized Job Alerts</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
          <span className="sarkari-gradient-text">Sarkari Result & Sarkari Naukri</span> 2026 – Latest Govt Jobs & Apply Online Govt Jobs
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
          Free instant updates on the Latest Govt Jobs 2026, Sarkari Naukri Notifications, Entrance Exam Admit Cards, and Official Sarkari Result Declarations across India.
        </p>
      </div>

      {/* Social Media Join Banner */}
      <div className="mb-10 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3 text-center sm:text-left">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex-shrink-0 hidden sm:block">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm sm:text-base font-bold text-white">Join Our Official Channels for Real-Time Alerts</p>
            <p className="text-xs text-slate-400">Get instant updates on Facebook &amp; Telegram before anywhere else.</p>
          </div>
        </div>
        <div className="flex items-center space-x-2.5 w-full md:w-auto justify-center flex-wrap sm:flex-nowrap">
          <a
            href="https://www.facebook.com/SarkariJobAlertsCom/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/40 px-3.5 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105"
          >
            <FacebookIcon className="w-4 h-4" />
            <span>FB Page</span>
          </a>
          <a
            href="https://www.facebook.com/groups/sarkarijobalertscom"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 border border-indigo-500/40 px-3.5 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105"
          >
            <FacebookGroupIcon className="w-4 h-4" />
            <span>FB Group</span>
          </a>
          <a
            href="https://t.me/sarkarijobalerts_live"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 border border-sky-500/40 px-3.5 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105"
          >
            <TelegramIcon className="w-4 h-4" />
            <span>Telegram Channel</span>
          </a>
        </div>
      </div>

      {/* 3-Column Sarkari Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Column 1: Results */}
        <div id="results" className="glass-card rounded-2xl border border-emerald-500/20 overflow-hidden shadow-xl hover:border-emerald-500/40 transition-all duration-300">
          <div className="bg-gradient-to-r from-emerald-950 to-slate-900 border-b border-emerald-500/30 px-5 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                <Award className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-emerald-400 tracking-wide">SARKARI RESULT 2026</h2>
            </div>
            <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-1 rounded-full font-bold">
              {results.length} New
            </span>
          </div>

          <ul className="divide-y divide-slate-800/80 p-2">
            {results.length === 0 ? (
              <li className="p-4 text-center text-slate-500 text-sm">No results available right now.</li>
            ) : (
              results.map((item, index) => {
                const targetHref = item.slug ? `/job/${item.slug}/` : '#';
                const isNew = isRecentPost(item.postDate || item.publishedDate);
                return (
                  <li key={item._id || item.slug || index} className="group">
                    <Link
                      href={targetHref}
                      className="block p-3.5 min-h-[48px] rounded-xl hover:bg-emerald-950/40 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <h3 className="text-sm font-bold text-slate-200 group-hover:text-emerald-300 line-clamp-2 leading-snug">
                          {isNew && <span className="text-[10px] bg-rose-500 text-white px-1.5 py-0.5 rounded mr-1.5 font-extrabold align-middle">🔥 NEW</span>}
                          {item.rewrittenTitle || item.title}
                        </h3>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-transform flex-shrink-0 ml-2 mt-0.5" />
                      </div>
                      {item.postDate && (
                        <span className="text-[11px] text-emerald-400/80 mt-1.5 inline-block font-medium">
                          Updated: {item.postDate}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })
            )}
          </ul>

          {/* View All Link */}
          <div className="px-5 py-3 border-t border-slate-800/80 bg-slate-900/40">
            <Link
              href="/results/"
              className="flex items-center justify-center space-x-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors min-h-[44px]"
            >
              <span>View All Results</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Column 2: Admit Cards */}
        <div id="admit-cards" className="glass-card rounded-2xl border border-amber-500/20 overflow-hidden shadow-xl hover:border-amber-500/40 transition-all duration-300">
          <div className="bg-gradient-to-r from-amber-950 to-slate-900 border-b border-amber-500/30 px-5 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                <FileText className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-amber-400 tracking-wide">ADMIT CARD DOWNLOAD</h2>
            </div>
            <span className="bg-amber-500/20 text-amber-300 text-xs px-2.5 py-1 rounded-full font-bold">
              {admitCards.length} Active
            </span>
          </div>

          <ul className="divide-y divide-slate-800/80 p-2">
            {admitCards.length === 0 ? (
              <li className="p-4 text-center text-slate-500 text-sm">No admit cards available right now.</li>
            ) : (
              admitCards.map((item, index) => {
                const targetHref = item.slug ? `/job/${item.slug}/` : '#';
                const isNew = isRecentPost(item.postDate || item.publishedDate);
                return (
                  <li key={item._id || item.slug || index} className="group">
                    <Link
                      href={targetHref}
                      className="block p-3.5 min-h-[48px] rounded-xl hover:bg-amber-950/40 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <h3 className="text-sm font-bold text-slate-200 group-hover:text-amber-300 line-clamp-2 leading-snug">
                          {isNew && <span className="text-[10px] bg-rose-500 text-white px-1.5 py-0.5 rounded mr-1.5 font-extrabold align-middle">🔥 NEW</span>}
                          {item.rewrittenTitle || item.title}
                        </h3>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-transform flex-shrink-0 ml-2 mt-0.5" />
                      </div>
                      {item.postDate && (
                        <span className="text-[11px] text-amber-400/80 mt-1.5 inline-block font-medium">
                          Posted: {item.postDate}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })
            )}
          </ul>

          {/* View All Link */}
          <div className="px-5 py-3 border-t border-slate-800/80 bg-slate-900/40">
            <Link
              href="/admit-cards/"
              className="flex items-center justify-center space-x-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors min-h-[44px]"
            >
              <span>View All Admit Cards</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Column 3: Latest Jobs */}
        <div id="latest-jobs" className="glass-card rounded-2xl border border-cyan-500/20 overflow-hidden shadow-xl hover:border-cyan-500/40 transition-all duration-300">
          <div className="bg-gradient-to-r from-cyan-950 to-slate-900 border-b border-cyan-500/30 px-5 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
                <Briefcase className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-cyan-400 tracking-wide">LATEST GOVT JOBS 2026</h2>
            </div>
            <span className="bg-cyan-500/20 text-cyan-300 text-xs px-2.5 py-1 rounded-full font-bold">
              {latestJobs.length} Live
            </span>
          </div>

          <ul className="divide-y divide-slate-800/80 p-2">
            {latestJobs.length === 0 ? (
              <li className="p-4 text-center text-slate-500 text-sm">No job posts available right now.</li>
            ) : (
              latestJobs.map((item, index) => {
                const targetHref = item.slug ? `/job/${item.slug}/` : '#';
                const isNew = isRecentPost(item.postDate || item.publishedDate);
                return (
                  <li key={item._id || item.slug || index} className="group">
                    <Link
                      href={targetHref}
                      className="block p-3.5 min-h-[48px] rounded-xl hover:bg-cyan-950/40 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <h3 className="text-sm font-bold text-slate-200 group-hover:text-cyan-300 line-clamp-2 leading-snug">
                          {isNew && <span className="text-[10px] bg-rose-500 text-white px-1.5 py-0.5 rounded mr-1.5 font-extrabold align-middle">🔥 NEW</span>}
                          {item.rewrittenTitle || item.title}
                        </h3>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-transform flex-shrink-0 ml-2 mt-0.5" />
                      </div>
                      {item.postDate && (
                        <span className="text-[11px] text-cyan-400/80 mt-1.5 inline-block font-medium">
                          Deadline / Date: {item.postDate}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })
            )}
          </ul>

          {/* View All Link */}
          <div className="px-5 py-3 border-t border-slate-800/80 bg-slate-900/40">
            <Link
              href="/latest-jobs/"
              className="flex items-center justify-center space-x-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors min-h-[44px]"
            >
              <span>View All Latest Jobs</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>

      {/* 2-Column Section: Answer Keys & Syllabus */}
      {(answerKeys.length > 0 || syllabus.length > 0) && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Answer Keys */}
          {answerKeys.length > 0 && (
            <div id="answer-key" className="glass-card rounded-2xl border border-purple-500/20 overflow-hidden shadow-xl hover:border-purple-500/40 transition-all duration-300">
              <div className="bg-gradient-to-r from-purple-950 to-slate-900 border-b border-purple-500/30 px-5 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                    <Key className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-bold text-purple-400 tracking-wide">ANSWER KEY & SOLUTIONS</h2>
                </div>
                <span className="bg-purple-500/20 text-purple-300 text-xs px-2.5 py-1 rounded-full font-bold">
                  {answerKeys.length} Live
                </span>
              </div>

              <ul className="divide-y divide-slate-800/80 p-2">
                {answerKeys.map((item, index) => {
                  const targetHref = item.slug ? `/job/${item.slug}/` : '#';
                  const isNew = isRecentPost(item.postDate || item.publishedDate);
                  return (
                    <li key={item._id || item.slug || index} className="group">
                      <Link
                        href={targetHref}
                        className="block p-3.5 min-h-[48px] rounded-xl hover:bg-purple-950/40 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <h3 className="text-sm font-bold text-slate-200 group-hover:text-purple-300 line-clamp-2 leading-snug">
                            {isNew && <span className="text-[10px] bg-rose-500 text-white px-1.5 py-0.5 rounded mr-1.5 font-extrabold align-middle">🔥 NEW</span>}
                            {item.rewrittenTitle || item.title}
                          </h3>
                          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-transform flex-shrink-0 ml-2 mt-0.5" />
                        </div>
                        {item.postDate && (
                          <span className="text-[11px] text-purple-400/80 mt-1.5 inline-block font-medium">
                            Released: {item.postDate}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="px-5 py-3 border-t border-slate-800/80 bg-slate-900/40">
                <Link
                  href="/answer-key/"
                  className="flex items-center justify-center space-x-1.5 text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors min-h-[44px]"
                >
                  <span>View All Answer Keys</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}

          {/* Syllabus */}
          {syllabus.length > 0 && (
            <div id="syllabus" className="glass-card rounded-2xl border border-sky-500/20 overflow-hidden shadow-xl hover:border-sky-500/40 transition-all duration-300">
              <div className="bg-gradient-to-r from-sky-950 to-slate-900 border-b border-sky-500/30 px-5 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-bold text-sky-400 tracking-wide">EXAM SYLLABUS & PATTERNS</h2>
                </div>
                <span className="bg-sky-500/20 text-sky-300 text-xs px-2.5 py-1 rounded-full font-bold">
                  {syllabus.length} Guides
                </span>
              </div>

              <ul className="divide-y divide-slate-800/80 p-2">
                {syllabus.map((item, index) => {
                  const targetHref = item.slug ? `/job/${item.slug}/` : '#';
                  const isNew = isRecentPost(item.postDate || item.publishedDate);
                  return (
                    <li key={item._id || item.slug || index} className="group">
                      <Link
                        href={targetHref}
                        className="block p-3.5 min-h-[48px] rounded-xl hover:bg-sky-950/40 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <h3 className="text-sm font-bold text-slate-200 group-hover:text-sky-300 line-clamp-2 leading-snug">
                            {isNew && <span className="text-[10px] bg-rose-500 text-white px-1.5 py-0.5 rounded mr-1.5 font-extrabold align-middle">🔥 NEW</span>}
                            {item.rewrittenTitle || item.title}
                          </h3>
                          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-sky-400 group-hover:translate-x-1 transition-transform flex-shrink-0 ml-2 mt-0.5" />
                        </div>
                        {item.postDate && (
                          <span className="text-[11px] text-sky-400/80 mt-1.5 inline-block font-medium">
                            Updated: {item.postDate}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="px-5 py-3 border-t border-slate-800/80 bg-slate-900/40">
                <Link
                  href="/syllabus/"
                  className="flex items-center justify-center space-x-1.5 text-xs font-bold text-sky-400 hover:text-sky-300 transition-colors min-h-[44px]"
                >
                  <span>View All Syllabus Guides</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
