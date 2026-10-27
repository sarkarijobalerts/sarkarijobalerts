import Link from 'next/link';
import seedPosts from '../../lib/seedPosts.json';
import CollectionPageSchema from '../../components/CollectionPageSchema';
import { Trophy, ArrowRight, Building2, Calendar, ArrowLeft } from 'lucide-react';

export const dynamic = 'force-static';

export const metadata = {
  title: 'Sarkari Results 2026 – Cutoff & Merit List',
  description: 'Check official government exam results, zone-wise cutoff lists, merit PDFs, and scorecards for RRB NTPC, UP Police, SSC, UGC NET, and Board Exams.',
  openGraph: {
    title: 'Sarkari Results 2026 – Cutoff & Merit List',
    description: 'Check official government exam results, zone-wise cutoff lists, merit PDFs, and scorecards for RRB NTPC, UP Police, SSC, UGC NET, and Board Exams.',
    url: 'https://sarkarijobalerts.com/results/',
    siteName: 'SarkariJobAlerts',
    images: [
      {
        url: 'https://sarkarijobalerts.com/og-banner.png',
        width: 1200,
        height: 630,
        alt: 'Sarkari Exam Results 2026 – SarkariJobAlerts.com',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@SarkariJobAlert',
    creator: '@SarkariJobAlert',
    title: 'Sarkari Results 2026 – Cutoff & Merit List',
    description: 'Check official government exam results, zone-wise cutoff lists, merit PDFs, and scorecards for RRB NTPC, UP Police, SSC, UGC NET, and Board Exams.',
    images: ['https://sarkarijobalerts.com/og-banner.png'],
  },
  alternates: {
    canonical: 'https://sarkarijobalerts.com/results/',
  },
};

export default function ResultsPage() {
  const results = seedPosts.filter((p) => p.category === 'Results');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <CollectionPageSchema
        title="Sarkari Results 2026 – Cutoff & Merit List"
        description="Check official government exam results, zone-wise cutoff lists, merit PDFs, and scorecards for RRB NTPC, UP Police, SSC, UGC NET, and Board Exams."
        url="https://sarkarijobalerts.com/results/"
        items={results}
      />

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
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400">
            <Trophy className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Sarkari Exam Results 2026</h1>
            <p className="text-sm text-emerald-400 font-semibold mt-1">
              Official Merit Lists, Zone-Wise Cutoff Marks & Candidate Scorecards
            </p>
          </div>
        </div>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Access official examination results, PDF selection lists, and normalized mark scorecards declared for RRB NTPC CBT 1, UP Police Constable, SSC Stenographer, NTA UGC NET, and CBSE Board Exams.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((item, index) => (
          <div
            key={item._id || item.slug || index}
            className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between group shadow-lg"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="bg-emerald-950/80 text-emerald-400 border border-emerald-700/40 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase">
                  {item.category}
                </span>
                {item.postDate && (
                  <span className="text-[11px] text-slate-400 font-medium flex items-center">
                    <Calendar className="w-3 h-3 mr-1 text-slate-400" />
                    {item.postDate}
                  </span>
                )}
              </div>

              <h2 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors leading-snug">
                {item.rewrittenTitle || item.title}
              </h2>

              {(item.organizationName || item.organization) && (
                <p className="text-xs text-slate-400 flex items-center font-medium">
                  <Building2 className="w-3.5 h-3.5 mr-1.5 text-emerald-400 flex-shrink-0" />
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
              <span className="text-xs font-extrabold text-cyan-400">
                Result: Declared
              </span>

              <Link
                href={`/job/${item.slug}/`}
                className="inline-flex items-center space-x-1.5 bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow-md group-hover:shadow-emerald-500/20"
              >
                <span>Check Result PDF</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
