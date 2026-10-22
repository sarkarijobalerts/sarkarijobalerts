import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Non-Govt Affiliation Disclaimer',
  description: 'Official non-government affiliation disclaimer and editorial terms of use for SarkariJobAlerts.com news and job notification portal.',
  openGraph: {
    title: 'Non-Govt Affiliation Disclaimer',
    description: 'Official non-government affiliation disclaimer and editorial terms of use for SarkariJobAlerts.com news and job notification portal.',
    url: 'https://sarkarijobalerts.com/disclaimer/',
    siteName: 'SarkariJobAlerts',
    images: [
      {
        url: 'https://sarkarijobalerts.com/og-banner.png',
        width: 1200,
        height: 630,
        alt: 'SarkariJobAlerts.com Disclaimer',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@SarkariJobAlert',
    creator: '@SarkariJobAlert',
    title: 'Non-Govt Affiliation Disclaimer',
    description: 'Official non-government affiliation disclaimer and editorial terms of use for SarkariJobAlerts.com news and job notification portal.',
    images: ['https://sarkarijobalerts.com/og-banner.png'],
  },
  alternates: {
    canonical: 'https://sarkarijobalerts.com/disclaimer/',
  },
};

export default function DisclaimerPage() {
  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10 text-slate-300">
      <Link
        href="/"
        className="inline-flex items-center space-x-2 text-xs font-semibold text-cyan-400 hover:text-cyan-300 mb-6 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      <div className="glass-card rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl space-y-6">
        <div className="border-b border-slate-800 pb-4 flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white">Disclaimer</h1>
            <p className="text-xs text-amber-400 font-semibold mt-0.5">IMPORTANT: Non-Government Entity Notice</p>
          </div>
        </div>

        <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed space-y-4">
          <div className="bg-amber-950/40 border-l-4 border-amber-500 p-4 rounded-r-xl text-amber-200 text-sm leading-relaxed">
            <strong>CRITICAL STATEMENT:</strong> SarkariJobAlerts.com is a private news, informational, and educational blog. We are NOT associated, affiliated, endorsed by, or in any way officially connected with the Government of India, any State Government, or any official recruitment agency (such as SSC, UPSC, RRB, IBPS, NTA, or State PSCs).
          </div>

          <h2 className="text-lg font-bold text-white mt-6">1. Source of Information</h2>
          <p>
            All information, exam schedules, eligibility criteria, application fee details, and direct links published on SarkariJobAlerts.com are gathered from public domain sources, official government press releases, and official recruitment portals (such as <code>ssc.gov.in</code>, <code>upsc.gov.in</code>, <code>indianrailways.gov.in</code>, and <code>ibps.in</code>).
          </p>

          <h2 className="text-lg font-bold text-white mt-6">2. Verification Requirement</h2>
          <p>
            While every effort is made to ensure that the information presented on this website is accurate and reliable, SarkariJobAlerts.com does not guarantee the completeness or accuracy of any content. Candidates are strongly advised to verify all recruitment details directly from official government notification PDFs and official websites before filling out any online application form.
          </p>

          <h2 className="text-lg font-bold text-white mt-6">3. No Financial Transactions</h2>
          <p>
            SarkariJobAlerts.com NEVER asks for any fee, payment, or personal financial details from candidates. Application fees for government jobs must always be paid directly on the official government website.
          </p>

          <h2 className="text-lg font-bold text-white mt-6">4. External Links Disclaimer</h2>
          <p>
            Our website contains links to external websites that are not provided or maintained by or in any way affiliated with SarkariJobAlerts.com. Please note that we do not guarantee the accuracy, relevance, timeliness, or completeness of any information on these external websites.
          </p>
        </div>
      </div>
    </article>
  );
}
