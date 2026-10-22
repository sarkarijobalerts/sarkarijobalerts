import Link from 'next/link';
import seedPosts from '../../lib/seedPosts.json';
import { CreditCard, ArrowRight, Building2, Calendar, ArrowLeft } from 'lucide-react';

export const dynamic = 'force-static';

export const metadata = {
  title: 'Admit Cards 2026 – Download Hall Ticket',
  description: 'Download e-Admit Cards, exam hall tickets, and city intimation slips for UPSC, SSC, Railway RRB, IBPS, and State PSC competitive examinations.',
  openGraph: {
    title: 'Admit Cards 2026 – Download Hall Ticket',
    description: 'Download e-Admit Cards, exam hall tickets, and city intimation slips for UPSC, SSC, Railway RRB, IBPS, and State PSC competitive examinations.',
    url: 'https://sarkarijobalerts.com/admit-cards/',
    siteName: 'SarkariJobAlerts',
    images: [
      {
        url: 'https://sarkarijobalerts.com/og-banner.png',
        width: 1200,
        height: 630,
        alt: 'Sarkari Exam Admit Cards 2026 – SarkariJobAlerts.com',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@SarkariJobAlert',
    creator: '@SarkariJobAlert',
    title: 'Admit Cards 2026 – Download Hall Ticket',
    description: 'Download e-Admit Cards, exam hall tickets, and city intimation slips for UPSC, SSC, Railway RRB, IBPS, and State PSC competitive examinations.',
    images: ['https://sarkarijobalerts.com/og-banner.png'],
  },
  alternates: {
    canonical: 'https://sarkarijobalerts.com/admit-cards/',
  },
};

export default function AdmitCardsPage() {
  const cards = seedPosts.filter((p) => p.category === 'Admit Cards');

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
          <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400">
            <CreditCard className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Sarkari Exam Admit Cards 2026</h1>
            <p className="text-sm text-indigo-400 font-semibold mt-1">
              Direct Links for Hall Tickets, Roll Numbers & Exam City Intimation Slips
            </p>
          </div>
        </div>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Download your official e-Admit Cards and Hall Tickets for UPSC Mains, SSC CHSL/CGL, Railway RRB CBT, IBPS PO/Clerk, NEET UG, CTET, and State Police competitive exams.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((item, index) => (
          <div
            key={item._id || item.slug || index}
            className="glass-card rounded-2xl p-6 border border-slate-800 hover:border-indigo-500/50 transition-all duration-300 flex flex-col justify-between group shadow-lg"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="bg-indigo-950/80 text-indigo-400 border border-indigo-700/40 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase">
                  {item.category}
                </span>
                {item.postDate && (
                  <span className="text-[11px] text-slate-400 font-medium flex items-center">
                    <Calendar className="w-3 h-3 mr-1 text-slate-400" />
                    {item.postDate}
                  </span>
                )}
              </div>

              <h2 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors leading-snug">
                {item.rewrittenTitle || item.title}
              </h2>

              {(item.organizationName || item.organization) && (
                <p className="text-xs text-slate-400 flex items-center font-medium">
                  <Building2 className="w-3.5 h-3.5 mr-1.5 text-indigo-400 flex-shrink-0" />
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
                Status: Released
              </span>

              <Link
                href={`/job/${item.slug}/`}
                className="inline-flex items-center space-x-1.5 bg-gradient-to-r from-indigo-500 to-cyan-600 hover:from-indigo-400 hover:to-cyan-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow-md group-hover:shadow-indigo-500/20"
              >
                <span>Download Admit Card</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
