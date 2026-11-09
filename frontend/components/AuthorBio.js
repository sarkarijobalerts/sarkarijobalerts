import Link from 'next/link';
import { UserCheck, ShieldCheck, Award, ExternalLink } from 'lucide-react';

export default function AuthorBio({ postTitle }) {
  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/60 border-2 border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xl space-y-4 my-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 font-black text-xl flex-shrink-0">
            RS
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-extrabold text-white">Rohit Sharma</h3>
              <span className="inline-flex items-center space-x-1 bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                <ShieldCheck className="w-3 h-3" />
                <span>Verified Recruitment Analyst</span>
              </span>
            </div>
            <p className="text-xs text-cyan-400 font-medium">Chief Editor &amp; Career Counselor • 15+ Years Digital Experience</p>
          </div>
        </div>

        <Link
          href="/about/"
          className="inline-flex items-center space-x-1.5 text-xs text-slate-300 hover:text-cyan-400 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 px-3.5 py-1.5 rounded-xl font-semibold transition-colors w-fit"
        >
          <span>Editorial Standards</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-2">
        <p>
          <strong>Author &amp; Editorial Take:</strong> With over <strong>15+ years of digital experience</strong> analyzing Central and State Government recruitment notifications, Rohit Sharma leads the factual verification desk at SarkariJobAlerts.com. Every recruitment update—including eligibility criteria, age relaxation norms, application fee structures, and syllabus breakdowns—is cross-referenced directly with official gazettes (UPSC, SSC, RRB, IBPS, and State PSCs).
        </p>
        <p className="text-slate-400 text-xs">
          <em>Editorial Integrity Guarantee:</em> SarkariJobAlerts.com is an independent educational portal. We do not charge candidates fees and never copy unchecked content. Learn more on our <Link href="/about/" className="text-cyan-400 underline hover:text-cyan-300">About Page</Link> and read our official <Link href="/disclaimer/" className="text-amber-400 underline hover:text-amber-300">Disclaimer</Link>.
        </p>
      </div>
    </div>
  );
}

