import Link from 'next/link';
import seedPosts from '../../lib/seedPosts.json';
import { Briefcase, ArrowRight, Building2, Calendar, Tag, ArrowLeft } from 'lucide-react';

export const dynamic = 'force-static';

export const metadata = {
  title: 'Exam Syllabus 2026 – Pattern & Scheme',
  description: 'Explore all latest exam syllabus for government job exams 2026 across SSC, Railway, Banking, Defense, Police Bharti, and State PSC recruitments.',
  openGraph: {
    title: 'Exam Syllabus 2026 – Pattern & Scheme',
    description: 'Explore all latest exam syllabus for government job exams 2026 across SSC, Railway, Banking, Defense, Police Bharti, and State PSC recruitments.',
    url: 'https://sarkarijobalerts.com/syllabus/',
    siteName: 'SarkariJobAlerts',
    images: [
      {
        url: 'https://sarkarijobalerts.com/og-banner.png',
        width: 1200,
        height: 630,
        alt: 'Latest Exam Syllabus 2026 – SarkariJobAlerts.com',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@SarkariJobAlert',
    creator: '@SarkariJobAlert',
    title: 'Exam Syllabus 2026 – Pattern & Scheme',
    description: 'Explore all latest exam syllabus for government job exams 2026 across SSC, Railway, Banking, Defense, Police Bharti, and State PSC recruitments.',
    images: ['https://sarkarijobalerts.com/og-banner.png'],
  },
  alternates: {
    canonical: 'https://sarkarijobalerts.com/syllabus/',
  },
};

export default function SyllabusPage() {
  const jobs = seedPosts.filter((p) => p.category === 'Syllabus');

  return (
    <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back Button */}
      <Link
        href="/"
        className="inline-flex items-center space-x-2 text-xs font-semibold text-cyan-400 hover:text-cyan-300 mb-6 bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl transition-colors shadow-md"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      {/* Header */}
      <div className="glass-card rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400">
            <Briefcase className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Latest Syllabus 2026</h1>
            <p className="text-sm text-cyan-400 font-semibold mt-1">
              Explore All Active Central & State Government Exam Syllabus
            </p>
          </div>
        </div>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Find verified exam syllabus updated in real-time. Check detailed syllabus for SSC CGL/CHSL/GD, Railway RRB, IBPS, Police Bharti, UPSC, and State PSC exams.
        </p>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((item, index) => (
          <div
            key={item._id || item.slug || index}
            className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-cyan-500/50 transition-all duration-300 flex flex-col justify-between group shadow-lg"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="bg-cyan-950/80 text-cyan-400 border border-cyan-700/40 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase">
                  {item.category}
                </span>
                {item.postDate && (
                  <span className="text-[11px] text-slate-400 font-medium flex items-center">
                    <Calendar className="w-3 h-3 mr-1 text-slate-400" />
                    {item.postDate}
                  </span>
                )}
              </div>

              <h2 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors leading-snug">
                {item.rewrittenTitle || item.title}
              </h2>

              {(item.organizationName || item.organization) && (
                <p className="text-xs text-slate-400 flex items-center font-medium">
                  <Building2 className="w-3.5 h-3.5 mr-1.5 text-cyan-400 flex-shrink-0" />
                  <span>{item.organizationName || item.organization}</span>
                </p>
              )}

              {item.shortInfo && (
                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                  {item.shortInfo}
                </p>
              )}
            </div>

            <div className="pt-4 border-t border-slate-800/80 mt-4 flex items-center justify-between">
              <span className="text-xs font-extrabold text-emerald-400">
                Vacancies: {item.totalVacancies || 'Various'}
              </span>

              <Link
                href={`/job/${item.slug}/`}
                className="inline-flex items-center space-x-1.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow-md group-hover:shadow-cyan-500/20"
              >
                <span>View Details & Apply</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
