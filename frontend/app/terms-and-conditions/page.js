import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Terms & Conditions of Service',
  description: 'Terms and conditions governing access, use, and informational policies of SarkariJobAlerts.com government job alerts portal.',
  openGraph: {
    title: 'Terms & Conditions of Service',
    description: 'Terms and conditions governing access, use, and informational policies of SarkariJobAlerts.com government job alerts portal.',
    url: 'https://sarkarijobalerts.com/terms-and-conditions/',
    siteName: 'SarkariJobAlerts',
    images: [
      {
        url: 'https://sarkarijobalerts.com/og-banner.png',
        width: 1200,
        height: 630,
        alt: 'SarkariJobAlerts.com Terms and Conditions',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@SarkariJobAlert',
    creator: '@SarkariJobAlert',
    title: 'Terms & Conditions of Service',
    description: 'Terms and conditions governing access, use, and informational policies of SarkariJobAlerts.com government job alerts portal.',
    images: ['https://sarkarijobalerts.com/og-banner.png'],
  },
  alternates: {
    canonical: 'https://sarkarijobalerts.com/terms-and-conditions/',
  },
};

export default function TermsPage() {
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
        <div className="border-b border-slate-800 pb-4">
          <h1 className="text-3xl font-extrabold text-white">Terms and Conditions</h1>
          <p className="text-xs text-slate-400 mt-1">Last Updated: July 31, 2026</p>
        </div>

        <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed space-y-4">
          <p>
            Welcome to <strong>SarkariJobAlerts.com</strong>! These terms and conditions outline the rules and regulations for the use of SarkariJobAlerts.com's Website, located at <code>https://sarkarijobalerts.com</code>.
          </p>

          <h2 className="text-lg font-bold text-white mt-6">1. Acceptance of Terms</h2>
          <p>
            By accessing this website we assume you accept these terms and conditions. Do not continue to use SarkariJobAlerts.com if you do not agree to take all of the terms and conditions stated on this page.
          </p>

          <h2 className="text-lg font-bold text-white mt-6">2. Intellectual Property Rights</h2>
          <p>
            Unless otherwise stated, SarkariJobAlerts.com and/or its licensors own the intellectual property rights for all material on SarkariJobAlerts.com. All intellectual property rights are reserved. You may access this from SarkariJobAlerts.com for your own personal use subjected to restrictions set in these terms and conditions.
          </p>

          <h2 className="text-lg font-bold text-white mt-6">3. Content Accuracy & User Responsibility</h2>
          <p>
            SarkariJobAlerts.com provides information regarding government job recruitment, exam dates, admit cards, and results. While we strive to ensure that all information published on this website is accurate and up-to-date, candidates are required to verify details directly with official government notification PDFs.
          </p>

          <h2 className="text-lg font-bold text-white mt-6">4. Hyperlinking to our Content</h2>
          <p>
            Government agencies, search engines, news organizations, and online directory distributors may link to our Website without prior written approval.
          </p>

          <h2 className="text-lg font-bold text-white mt-6">5. Limitation of Liability</h2>
          <p>
            In no event shall SarkariJobAlerts.com, nor any of its officers, directors, and employees, be held liable for anything arising out of or in any way connected with your use of this Website.
          </p>
        </div>
      </div>
    </article>
  );
}
