import Link from 'next/link';
import { Mail, MapPin, Send, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Contact Us & Support Desk',
  description: 'Get in touch with SarkariJobAlerts.com editorial and support team for feedback, correction requests, or general inquiries.',
  openGraph: {
    title: 'Contact Us & Support Desk',
    description: 'Get in touch with SarkariJobAlerts.com editorial and support team for feedback, correction requests, or general inquiries.',
    url: 'https://sarkarijobalerts.com/contact/',
    siteName: 'SarkariJobAlerts',
    images: [
      {
        url: 'https://sarkarijobalerts.com/og-banner.png',
        width: 1200,
        height: 630,
        alt: 'Contact SarkariJobAlerts.com Editorial Desk',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@SarkariJobAlert',
    creator: '@SarkariJobAlert',
    title: 'Contact Us & Support Desk',
    description: 'Get in touch with SarkariJobAlerts.com editorial and support team for feedback or inquiries.',
    images: ['https://sarkarijobalerts.com/og-banner.png'],
  },
  alternates: {
    canonical: 'https://sarkarijobalerts.com/contact/',
  },
};

export default function ContactPage() {
  const contactSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact SarkariJobAlerts.com',
    url: 'https://sarkarijobalerts.com/contact/',
    mainEntity: {
      '@type': 'Organization',
      name: 'SarkariJobAlerts',
      url: 'https://sarkarijobalerts.com',
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+91-83683-98283',
        contactType: 'Customer Support',
        email: 'support@sarkarijobalerts.com',
        areaServed: 'IN',
        availableLanguage: ['en', 'hi'],
      },
    },
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10 text-slate-300">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
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
          <h1 className="text-3xl font-extrabold text-white">Contact Us</h1>
          <p className="text-sm text-cyan-400 font-semibold mt-1">
            Have questions, feedback, or need help? Reach out to our team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
          <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-2">
            <Mail className="w-6 h-6 text-cyan-400" />
            <h3 className="font-bold text-white text-sm">Official Email</h3>
            <p className="text-xs text-slate-400">support@sarkarijobalerts.com</p>
          </div>

          <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-2">
            <MapPin className="w-6 h-6 text-indigo-400" />
            <h3 className="font-bold text-white text-sm">Headquarters</h3>
            <p className="text-xs text-slate-400">ZestRank, Sector 4, Noida, India - 201301</p>
          </div>

          <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            <h3 className="font-bold text-white text-sm">Phone Support</h3>
            <p className="text-xs text-slate-400 font-semibold text-emerald-400">+91 83683 98283</p>
          </div>
        </div>

        {/* Contact Form UI */}
        <form className="space-y-4 pt-4 border-t border-slate-800">
          <h2 className="text-xl font-bold text-white mb-2">Send Us a Message</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Your Full Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Your Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Subject</label>
            <input
              type="text"
              placeholder="Inquiry / Feedback / Correction"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Message</label>
            <textarea
              rows={4}
              placeholder="Write your message here..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
            ></textarea>
          </div>

          <button
            type="button"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-lg shadow-cyan-500/20 hover:opacity-90 transition-opacity"
          >
            <Send className="w-4 h-4" />
            <span>Send Message</span>
          </button>
        </form>
      </div>
    </article>
  );
}
