import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy & Data Security',
  description: 'Read the Privacy Policy of SarkariJobAlerts.com covering data protection, cookies, analytics, and Google AdSense compliance.',
  openGraph: {
    title: 'Privacy Policy & Data Security',
    description: 'Read the Privacy Policy of SarkariJobAlerts.com covering data protection, cookies, analytics, and Google AdSense compliance.',
    url: 'https://sarkarijobalerts.com/privacy-policy/',
    siteName: 'SarkariJobAlerts',
    images: [
      {
        url: 'https://sarkarijobalerts.com/og-banner.png',
        width: 1200,
        height: 630,
        alt: 'SarkariJobAlerts.com Privacy Policy',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@SarkariJobAlert',
    creator: '@SarkariJobAlert',
    title: 'Privacy Policy & Data Security',
    description: 'Read the Privacy Policy of SarkariJobAlerts.com covering data protection, cookies, and compliance.',
    images: ['https://sarkarijobalerts.com/og-banner.png'],
  },
  alternates: {
    canonical: 'https://sarkarijobalerts.com/privacy-policy/',
  },
};

export default function PrivacyPolicyPage() {
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
          <h1 className="text-3xl font-extrabold text-white">Privacy Policy</h1>
          <p className="text-xs text-slate-400 mt-1">Last Updated: July 31, 2026</p>
        </div>

        <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed space-y-4">
          <p>
            At <strong>SarkariJobAlerts.com</strong>, accessible from <code>https://sarkarijobalerts.com</code>, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by SarkariJobAlerts.com and how we use it.
          </p>

          <h2 className="text-lg font-bold text-white mt-6">1. Log Files</h2>
          <p>
            SarkariJobAlerts.com follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable.
          </p>

          <h2 className="text-lg font-bold text-white mt-6">2. Cookies and Web Beacons</h2>
          <p>
            Like any other website, SarkariJobAlerts.com uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
          </p>

          <h2 className="text-lg font-bold text-white mt-6">3. Google DoubleClick DART Cookie (Google AdSense)</h2>
          <p>
            Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to www.website.com and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL – <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline">https://policies.google.com/technologies/ads</a>.
          </p>

          <h2 className="text-lg font-bold text-white mt-6">4. Third Party Privacy Policies</h2>
          <p>
            SarkariJobAlerts.com's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.
          </p>

          <h2 className="text-lg font-bold text-white mt-6">5. CCPA Privacy Rights (Do Not Sell My Personal Information)</h2>
          <p>
            Under the CCPA, among other rights, California consumers have the right to request that a business that collects a consumer's personal data disclose the categories and specific pieces of personal data that a business has collected about consumers.
          </p>

          <h2 className="text-lg font-bold text-white mt-6">6. GDPR Data Protection Rights</h2>
          <p>
            We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following: The right to access, the right to rectification, the right to erasure, and the right to object to processing.
          </p>

          <h2 className="text-lg font-bold text-white mt-6">7. Contact Information</h2>
          <p>
            If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us through email at <strong>support@sarkarijobalerts.com</strong>.
          </p>
        </div>
      </div>
    </article>
  );
}
