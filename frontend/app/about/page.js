import Link from 'next/link';
import { ShieldCheck, Target, Zap, Award, ArrowLeft, UserCheck, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'About Us & Editorial Standards',
  description: 'Learn about SarkariJobAlerts.com, our editorial team led by Rohit Sharma, and our verified real-time government job alert notification process.',
  openGraph: {
    title: 'About Us & Editorial Standards',
    description: 'Learn about SarkariJobAlerts.com, our editorial team led by Rohit Sharma, and our verified real-time government job alert notification process.',
    url: 'https://sarkarijobalerts.com/about/',
    siteName: 'SarkariJobAlerts',
    images: [
      {
        url: 'https://sarkarijobalerts.com/og-banner.png',
        width: 1200,
        height: 630,
        alt: 'About SarkariJobAlerts.com Editorial Team',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@SarkariJobAlert',
    creator: '@SarkariJobAlert',
    title: 'About Us & Editorial Standards',
    description: 'Learn about SarkariJobAlerts.com, our editorial team led by Rohit Sharma, and our verified real-time government job alert notification process.',
    images: ['https://sarkarijobalerts.com/og-banner.png'],
  },
  alternates: {
    canonical: 'https://sarkarijobalerts.com/about/',
  },
};

export default function AboutPage() {
  const aboutSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About SarkariJobAlerts.com and Editorial Team',
    url: 'https://sarkarijobalerts.com/about/',
    dateModified: '2026-10-15T12:00:00+05:30',
    publisher: {
      '@type': 'Organization',
      name: 'SarkariJobAlerts',
      url: 'https://sarkarijobalerts.com',
      logo: 'https://sarkarijobalerts.com/icon.png',
    },
    mainEntity: {
      '@type': 'Person',
      name: 'Rohit Sharma',
      jobTitle: 'Senior Government Recruitment Analyst & Chief Editor',
      description: 'Senior Government Recruitment Analyst with 7+ years of experience analyzing UPSC, SSC, RRB, Banking, and State PSC notifications.',
      worksFor: {
        '@type': 'Organization',
        name: 'SarkariJobAlerts',
      },
      sameAs: [
        'https://sarkarijobalerts.com/about/',
        'https://www.linkedin.com/company/sarkarijobalerts',
      ],
    },
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10 text-slate-300">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />

      <Link
        href="/"
        className="inline-flex items-center space-x-2 text-xs font-semibold text-cyan-400 hover:text-cyan-300 mb-6 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      <div className="glass-card rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <h1 className="text-3xl font-extrabold text-white">About SarkariJobAlerts.com</h1>
          <p className="text-sm text-cyan-400 font-semibold mt-1">
            Empowering Job Seekers Across India with Automated, Real-Time Government Job Updates
          </p>
          <div className="flex items-center space-x-2 text-xs text-slate-400 mt-2">
            <span>Last Updated &amp; Reviewed:</span>
            <time dateTime="2026-10-15" className="text-emerald-400 font-semibold">October 15, 2026</time>
          </div>
        </div>

        <p className="text-sm sm:text-base leading-relaxed">
          <strong>SarkariJobAlerts.com</strong> is a dedicated independent news and educational portal designed to streamline the government job search process for millions of aspirants in India. Our mission is to make official recruitment notifications, examination admit cards, and result announcements accessible to everyone instantly, clearly, and without confusion.
        </p>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
          <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 w-fit">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Real-Time Automation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Our automated system scans central and state government recruitment portals every 30 minutes to capture official notifications the moment they are released.
            </p>
          </div>

          <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 w-fit">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Factual Accuracy First</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              We maintain strict standards for dates, application fee structures, age limits, vacancy tables, and official links to eliminate copy-paste errors.
            </p>
          </div>
        </div>

        {/* Editorial Team & E-E-A-T Author Signal */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Editorial Board &amp; Fact-Checking Standards</h2>
              <p className="text-xs text-cyan-400">Commitment to Provenance, Accuracy, and Candidate Trust</p>
            </div>
          </div>
          
          <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <p>
              Every notification published on SarkariJobAlerts.com is curated, summarized, and verified by our editorial desk led by <strong>Rohit Sharma</strong> (Senior Government Recruitment Analyst &amp; Chief Editor). With over seven years of specialized experience analyzing public sector vacancy gazettes, our team cross-verifies:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Primary government portal gazette confirmation</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Exact application open and closing timestamps</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Category-wise fee and age reservation norms</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Secure HTTPS destination links only</span>
              </li>
            </ul>
          </div>
        </div>

        <h2 className="text-xl font-bold text-white pt-4">What We Offer</h2>
        <ul className="list-disc pl-5 space-y-2 text-sm text-slate-300">
          <li><strong>Latest Govt Jobs:</strong> Detailed notifications for SSC, UPSC, Railways, Banking, Police, Defense, and Teaching sectors.</li>
          <li><strong>Admit Cards:</strong> Direct hall ticket download links and exam city intimation slip notifications.</li>
          <li><strong>Exam Results:</strong> Instant access to merit lists, cutoff marks PDFs, and candidate scorecards.</li>
          <li><strong>Google Jobs Rich Snippets:</strong> Dynamic <code>JobPosting</code> schema integration to help candidates discover notifications directly via Google Search.</li>
          <li><strong>AI Search Optimization:</strong> Compliant with <code>llms.txt</code> standards for structured machine consumption by AI models.</li>
        </ul>

        <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 mt-6 text-xs text-slate-400 leading-relaxed">
          <strong className="text-slate-200">Note:</strong> SarkariJobAlerts.com is an informational web portal and is not associated with any government organization. For complete legal guidelines, please visit our <Link href="/disclaimer/" className="text-cyan-400 underline">Disclaimer</Link> page.
        </div>
      </div>
    </article>
  );
}
